package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/utils"
)

// AuthMiddleware 認証ミドルウェア
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Error(utils.ErrUnauthorized.WithDetail("認証ヘッダーが見つかりません"))
			c.Abort()
			return
		}

		// Bearer トークンの取得
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Error(utils.ErrUnauthorized.WithDetail("不正な認証ヘッダーです"))
			c.Abort()
			return
		}

		// トークンの検証
		userID, err := utils.ValidateToken(parts[1])
		if err != nil {
			c.Error(utils.ErrUnauthorized.WithDetail("無効なトークンです"))
			c.Abort()
			return
		}

		// ユーザーIDをコンテキストに設定
		c.Set("user_id", userID)
		c.Next()
	}
}
