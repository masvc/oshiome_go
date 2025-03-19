package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
	"github.com/masvc/oshiome_go/backend/internal/utils"
	"gorm.io/gorm"
)

type ProjectHandler struct {
	db *gorm.DB
}

func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{db: db.GetDB()}
}

type ProjectInput struct {
	Title        string    `json:"title" binding:"required"`
	Description  string    `json:"description" binding:"required"`
	TargetAmount int64     `json:"target_amount" binding:"required,min=1000"`
	Deadline     time.Time `json:"deadline" binding:"required,gtfield=time.Now"`
}

// withTx トランザクションを使用して処理を実行
func (h *ProjectHandler) withTx(c *gin.Context, fn func(*gorm.DB) error) {
	tx := h.db.Begin()
	if err := fn(tx); err != nil {
		tx.Rollback()
		c.Error(err)
		return
	}
	tx.Commit()
}

// getProject プロジェクトの取得と権限チェック
func (h *ProjectHandler) getProject(c *gin.Context, checkOwner bool) (*models.Project, error) {
	var project models.Project
	if err := h.db.Preload("User").First(&project, c.Param("id")).Error; err != nil {
		return nil, utils.ErrNotFound.WithDetail(utils.ErrMsgProjectNotFound)
	}

	if checkOwner {
		if userID, exists := c.Get("user_id"); !exists || project.UserID != userID.(uint) {
			return nil, utils.ErrUnauthorized.WithDetail(utils.ErrMsgUnauthorizedAccess)
		}
	}
	return &project, nil
}

// respond レスポンスを返す
func respond(c *gin.Context, status int, data interface{}) {
	c.JSON(status, utils.NewSuccessResponse(data))
}

// ListProjects プロジェクト一覧を取得
func (h *ProjectHandler) ListProjects(c *gin.Context) {
	var projects []models.Project
	query := h.db.Preload("User")

	if c.Query("status") == "" {
		query = query.Where("status = ?", models.ProjectStatusActive)
	}

	if err := query.Find(&projects).Error; err != nil {
		c.Error(utils.ErrInternalServer.WithDetail(utils.ErrMsgProjectListFail))
		return
	}

	respond(c, http.StatusOK, projects)
}

// GetProject プロジェクト詳細を取得
func (h *ProjectHandler) GetProject(c *gin.Context) {
	project, err := h.getProject(c, false)
	if err != nil {
		c.Error(err)
		return
	}
	respond(c, http.StatusOK, project)
}

// CreateProject プロジェクトを作成
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var input ProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(utils.ErrInvalidInput.WithDetail(err.Error()))
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(utils.ErrUnauthorized)
		return
	}

	project := &models.Project{
		Title:        input.Title,
		Description:  input.Description,
		TargetAmount: input.TargetAmount,
		Deadline:     input.Deadline,
		UserID:       userID.(uint),
		Status:       models.ProjectStatusDraft,
	}

	h.withTx(c, func(tx *gorm.DB) error {
		if err := tx.Create(project).Error; err != nil {
			return utils.ErrInternalServer.WithDetail(utils.ErrMsgProjectCreateFail)
		}
		return nil
	})

	if !c.IsAborted() {
		respond(c, http.StatusCreated, project)
	}
}

// UpdateProject プロジェクトを更新
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	project, err := h.getProject(c, true)
	if err != nil {
		c.Error(err)
		return
	}

	var input ProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(utils.ErrInvalidInput.WithDetail(err.Error()))
		return
	}

	h.withTx(c, func(tx *gorm.DB) error {
		if err := tx.Model(project).Updates(models.Project{
			Title:        input.Title,
			Description:  input.Description,
			TargetAmount: input.TargetAmount,
			Deadline:     input.Deadline,
		}).Error; err != nil {
			return utils.ErrInternalServer.WithDetail(utils.ErrMsgProjectUpdateFail)
		}
		return nil
	})

	if !c.IsAborted() {
		respond(c, http.StatusOK, project)
	}
}

// DeleteProject プロジェクトを削除
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	project, err := h.getProject(c, true)
	if err != nil {
		c.Error(err)
		return
	}

	h.withTx(c, func(tx *gorm.DB) error {
		if err := tx.Delete(project).Error; err != nil {
			return utils.ErrInternalServer.WithDetail(utils.ErrMsgProjectDeleteFail)
		}
		return nil
	})

	if !c.IsAborted() {
		respond(c, http.StatusOK, gin.H{"message": "プロジェクトを削除しました"})
	}
}
