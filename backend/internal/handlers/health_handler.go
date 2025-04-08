package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthHandler はヘルスチェックを担当するハンドラー
type HealthHandler struct{}

// NewHealthHandler はHealthHandlerの新しいインスタンスを作成します
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// HealthCheck はシステムのヘルスステータスを返します
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "oshiome-backend",
	})
}
