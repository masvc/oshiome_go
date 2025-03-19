package middleware

import (
	"log"
	"net/http"
	"runtime/debug"
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

// ErrorHandler エラーハンドリングミドルウェア
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// パニックが発生した場合のログ出力
				log.Printf("Panic recovered: %v\nStack trace:\n%s", err, debug.Stack())

				// クライアントへの応答
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"code":    "INTERNAL_SERVER_ERROR",
					"message": "予期せぬエラーが発生しました",
				})
				c.Abort()
			}
		}()

		c.Next()

		// エラーが設定されている場合の処理
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err
			switch e := err.(type) {
			case *utils.AppError:
				c.JSON(e.StatusCode, gin.H{
					"status":  "error",
					"code":    e.Code,
					"message": e.Message,
					"detail":  e.Detail,
				})
			default:
				// 未知のエラーの場合
				log.Printf("Unexpected error: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"code":    "INTERNAL_SERVER_ERROR",
					"message": "予期せぬエラーが発生しました",
				})
			}
		}
	}
}
