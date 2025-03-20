package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
	"github.com/masvc/oshiome_go/backend/internal/utils"
	"gorm.io/gorm"
)

type UserHandler struct {
	db *gorm.DB
}

func NewUserHandler() *UserHandler {
	return &UserHandler{db: db.GetDB()}
}

type CreateUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// CreateUser 新規ユーザー登録
func (h *UserHandler) CreateUser(c *gin.Context) {
	var input CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(utils.ErrInvalidInput.WithDetail(err.Error()))
		return
	}

	// パスワードのハッシュ化
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.Error(utils.ErrInternalServer.WithDetail("パスワードのハッシュ化に失敗しました"))
		return
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
	}

	if err := h.db.Create(&user).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			c.Error(utils.ErrDuplicateEmail)
			return
		}
		c.Error(utils.ErrInternalServer.WithDetail("ユーザーの作成に失敗しました"))
		return
	}

	// JWTトークンの生成
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.Error(utils.ErrInternalServer.WithDetail("トークンの生成に失敗しました"))
		return
	}

	c.JSON(http.StatusCreated, Response{
		Status: "success",
		Data: gin.H{
			"user":  user,
			"token": token,
		},
	})
}

// Login ユーザーログイン
func (h *UserHandler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(utils.ErrInvalidInput.WithDetail(err.Error()))
		return
	}

	var user models.User
	if err := h.db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.Error(utils.ErrInvalidCredentials)
		return
	}

	// パスワードの検証
	if !utils.CheckPasswordHash(input.Password, user.Password) {
		c.Error(utils.ErrInvalidCredentials)
		return
	}

	// JWTトークンの生成
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.Error(utils.ErrInternalServer.WithDetail("トークンの生成に失敗しました"))
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data: gin.H{
			"user":  user,
			"token": token,
		},
	})
}

// GetUser ユーザー情報取得
func (h *UserHandler) GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := h.db.First(&user, id).Error; err != nil {
		c.Error(utils.ErrNotFound.WithDetail("指定されたユーザーが見つかりません"))
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   user,
	})
}

// GetCurrentUser 現在のログインユーザーの情報を取得
func (h *UserHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.Error(utils.ErrUnauthorized.WithDetail("認証情報が見つかりません"))
		return
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.Error(utils.ErrNotFound.WithDetail("ユーザーが見つかりません"))
		return
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   user,
	})
}
