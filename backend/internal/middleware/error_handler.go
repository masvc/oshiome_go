package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/utils"
)

// ErrorHandler はエラーとパニックを適切なレスポンス形式に変換するミドルウェア
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// パニックハンドリング
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v\nStack trace:\n%s", err, debug.Stack())
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"code":    "INTERNAL_SERVER_ERROR",
					"message": "予期せぬエラーが発生しました",
				})
				c.Abort()
				return
			}
		}()

		c.Next()

		// エラーがない場合は何もしない
		if len(c.Errors) == 0 {
			return
		}

		// 最後のエラーを取得
		err := c.Errors.Last()

		// APIErrorへの型変換を試みる
		var apiErr *utils.APIError
		if e, ok := err.Err.(*utils.APIError); ok {
			apiErr = e
		} else {
			// 未知のエラーの場合は内部サーバーエラーとして処理
			apiErr = utils.ErrInternalServer.WithDetail(err.Error())
		}

		// HTTPステータスコードの決定
		status := http.StatusInternalServerError
		switch apiErr.Code {
		case "INVALID_INPUT":
			status = http.StatusBadRequest
		case "UNAUTHORIZED":
			status = http.StatusUnauthorized
		case "NOT_FOUND":
			status = http.StatusNotFound
		case "DUPLICATE_EMAIL":
			status = http.StatusConflict
		}

		c.JSON(status, apiErr)
		c.Abort()
	}
}
