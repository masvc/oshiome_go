package handlers

import (
	"gorm.io/gorm"
)

// Handler はすべてのハンドラーで共有される依存関係を保持します
type Handler struct {
	DB *gorm.DB
}

// NewHandler は新しいHandlerインスタンスを作成します
func NewHandler(db *gorm.DB) *Handler {
	return &Handler{
		DB: db,
	}
}
