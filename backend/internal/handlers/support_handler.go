package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
)

type SupportHandler struct{}

type CreateSupportInput struct {
	ProjectID uint   `json:"project_id" binding:"required"`
	Amount    int64  `json:"amount" binding:"required,min=100"`
	Message   string `json:"message"`
}

// CreateSupport 支援作成
func (h *SupportHandler) CreateSupport(c *gin.Context) {
	var input CreateSupportInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status: "error",
			Error:  err.Error(),
		})
		return
	}

	// TODO: 認証済みユーザーのIDを取得する処理を追加
	userID := uint(1) // 仮の実装

	// プロジェクトの存在確認
	var project models.Project
	if err := db.GetDB().First(&project, input.ProjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, Response{
			Status: "error",
			Error:  "プロジェクトが見つかりません",
		})
		return
	}

	support := models.Support{
		UserID:    userID,
		ProjectID: input.ProjectID,
		Amount:    input.Amount,
		Message:   input.Message,
		Status:    "pending",
	}

	// トランザクション開始
	tx := db.GetDB().Begin()

	if err := tx.Create(&support).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "支援の作成に失敗しました",
		})
		return
	}

	// プロジェクトの現在の支援額を更新
	project.CurrentAmount += input.Amount
	if err := tx.Save(&project).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, Response{
			Status: "error",
			Error:  "プロジェクトの更新に失敗しました",
		})
		return
	}

	tx.Commit()

	c.JSON(http.StatusCreated, Response{
		Status:  "success",
		Message: "支援が完了しました",
		Data:    support,
	})
}

// GetProjectSupports プロジェクトの支援一覧取得
func (h *SupportHandler) GetProjectSupports(c *gin.Context) {
	projectID := c.Param("projectId")
	var supports []models.Support

	if err := db.GetDB().Where("project_id = ?", projectID).Preload("User").Find(&supports).Error; err != nil {
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
