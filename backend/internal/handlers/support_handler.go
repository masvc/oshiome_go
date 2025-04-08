package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
	"github.com/masvc/oshiome_go/backend/internal/utils"
)

type SupportHandler struct{}

// NewSupportHandler creates a new instance of SupportHandler
func NewSupportHandler() *SupportHandler {
	return &SupportHandler{}
}

type CreateSupportInput struct {
	Amount  int64  `json:"amount" binding:"required,min=100"`
	Message string `json:"message"`
}

// CreateSupport 支援作成とStripe Checkout Sessionの生成
func (h *SupportHandler) CreateSupport(c *gin.Context) {
	var input CreateSupportInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, Response{
			Status: "error",
			Error:  "認証が必要です",
		})
		return
	}

	projectID := c.Param("id")
	// プロジェクトの存在確認
	var project models.Project
	if err := db.GetDB().First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Status: "error",
			Error:  "プロジェクトが見つかりません",
		})
		return
	}

	// プロジェクトのステータスチェック
	if project.Status != models.ProjectStatusActive {
		c.JSON(http.StatusBadRequest, Response{
			Status: "error",
			Error:  "アクティブなプロジェクトのみ支援可能です",
		})
		return
	}

	// 仮の支援情報を作成
	support := models.Support{
		UserID:    userID.(uint),
		ProjectID: project.ID,
		Amount:    input.Amount,
		Message:   input.Message,
		Status:    models.SupportStatusPending,
	}

	// トランザクション開始
	tx := db.GetDB().Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "トランザクションの開始に失敗しました",
		})
		return
	}

	// トランザクションのロールバックを保証
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 支援の作成
	if err := tx.Create(&support).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "支援の作成に失敗しました",
		})
		return
	}

	// トランザクションのコミット
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "トランザクションのコミットに失敗しました",
		})
		return
	}

	// フロントエンドのURLを構築
	baseURL := "http://localhost:5173" // 開発環境用
	if c.GetHeader("Origin") != "" {
		baseURL = c.GetHeader("Origin") // 本番環境用
	}
	successURL := fmt.Sprintf("%s/payments/success?session_id={CHECKOUT_SESSION_ID}", baseURL)
	cancelURL := fmt.Sprintf("%s/payments/cancel?project_id=%d", baseURL, project.ID)

	// Stripe Checkout Sessionの作成
	session, err := utils.CreateCheckoutSession(
		project.ID,
		project.Title,
		input.Amount,
		support.ID,
		userID.(uint),
		successURL,
		cancelURL,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "決済セッションの作成に失敗しました: " + err.Error(),
		})
		return
	}

	// 支援情報にCheckoutSessionIDを更新
	if err := db.GetDB().
		Model(&support).
		Update("checkout_session_id", session.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "支援情報の更新に失敗しました",
		})
		return
	}

	c.JSON(http.StatusCreated, Response{
		Status:  "success",
		Message: "決済セッションが作成されました",
		Data: gin.H{
			"checkout_session_id": session.ID,
			"checkout_url":        session.URL,
			"support_id":          support.ID,
		},
	})
}

// GetProjectSupports プロジェクトの支援一覧取得
func (h *SupportHandler) GetProjectSupports(c *gin.Context) {
	projectID := c.Param("id")
	var supports []models.Support

	if err := db.GetDB().
		Where("project_id = ?", projectID).
		Preload("User").
		Preload("Project").
		Preload("Project.User").
		Find(&supports).Error; err != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "支援情報の取得に失敗しました",
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   supports,
	})
}

// GetSupportStatus 支援状態確認
func (h *SupportHandler) GetSupportStatus(c *gin.Context) {
	supportID := c.Param("id")
	var support models.Support

	if err := db.GetDB().
		Preload("User").
		Preload("Project").
		First(&support, supportID).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Status: "error",
			Error:  "支援情報が見つかりません",
		})
		return
	}

	// リクエスト元ユーザーが支援者本人またはプロジェクトオーナーであることを確認
	userID, exists := c.Get("user_id")
	if !exists || (userID.(uint) != support.UserID && userID.(uint) != support.Project.UserID) {
		c.JSON(http.StatusForbidden, Response{
			Status: "error",
			Error:  "この情報にアクセスする権限がありません",
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   support,
	})
}

// VerifyPaymentBySession セッションIDから支援情報を取得
func (h *SupportHandler) VerifyPaymentBySession(c *gin.Context) {
	sessionID := c.Query("session_id")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, Response{
			Status: "error",
			Error:  "セッションIDが必要です",
		})
		return
	}

	var support models.Support
	// セッションIDに一致する支援を検索
	if err := db.GetDB().
		Where("checkout_session_id = ?", sessionID).
		Preload("User").
		Preload("Project").
		First(&support).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Status: "error",
			Error:  "セッションIDに対応する支援情報が見つかりません",
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   support,
	})
}
