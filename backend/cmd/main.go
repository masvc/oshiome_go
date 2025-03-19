package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/handlers"
	"github.com/masvc/oshiome_go/backend/internal/middleware"
)

func main() {
	// データベース接続の初期化
	_, err := db.InitDB()
	if err != nil {
		log.Fatal("データベース接続に失敗しました:", err)
	}

	r := gin.Default()

	// CORSの設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// ミドルウェアの設定
	r.Use(middleware.ErrorHandler())

	// ハンドラーのインスタンス化
	userHandler := &handlers.UserHandler{}
	projectHandler := &handlers.ProjectHandler{}

	// パブリックルート
	public := r.Group("/api")
	{
		// ユーザー関連
		public.POST("/register", userHandler.CreateUser)
		public.POST("/login", userHandler.Login)

		// プロジェクト一覧と詳細は認証不要
		public.GET("/projects", projectHandler.ListProjects)
		public.GET("/projects/:id", projectHandler.GetProject)
	}

	// 認証が必要なルート
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// ユーザー関連
		protected.GET("/users/:id", userHandler.GetUser)

		// プロジェクト関連（作成・更新・削除は認証必要）
		protected.POST("/projects", projectHandler.CreateProject)
		protected.PUT("/projects/:id", projectHandler.UpdateProject)
		protected.DELETE("/projects/:id", projectHandler.DeleteProject)
	}

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8000"
	}

	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatal("サーバーの起動に失敗しました:", err)
	}
}
