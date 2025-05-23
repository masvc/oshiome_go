package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/db/migrations"
	"github.com/masvc/oshiome_go/backend/internal/handlers"
	"github.com/masvc/oshiome_go/backend/internal/middleware"
	"github.com/masvc/oshiome_go/backend/internal/utils"
)

func main() {
	// .envファイルの読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// コマンドライン引数の解析
	migrate := flag.Bool("migrate", false, "データベースのマイグレーションを実行")
	flag.Parse()

	// マイグレーションフラグが指定された場合
	if *migrate {
		if err := migrations.RunMigrations(); err != nil {
			log.Fatal("マイグレーションに失敗しました:", err)
		}
		return
	}

	// データベース接続の初期化
	dbInstance, err := db.InitDB()
	if err != nil {
		log.Fatal("データベース接続に失敗しました:", err)
	}

	// Stripeの初期化
	utils.InitStripe()

	r := gin.Default()

	// CORSの設定
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:5173",
		"https://oshiome.onrender.com",
	}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{
		"Origin",
		"Content-Type",
		"Authorization",
		"Stripe-Signature",
		"Accept",
		"X-Requested-With",
	}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length"}
	config.MaxAge = 86400 // プリフライトリクエストのキャッシュ時間（24時間）
	r.Use(cors.New(config))

	// ミドルウェアの設定
	r.Use(middleware.ErrorHandler())

	// ハンドラーのインスタンス化
	userHandler := handlers.NewUserHandler()
	projectHandler := handlers.NewProjectHandler()
	supportHandler := handlers.NewSupportHandler()
	healthHandler := handlers.NewHealthHandler()
	h := handlers.NewHandler(dbInstance)

	// パブリックルート
	public := r.Group("/api")
	{
		// ヘルスチェック
		public.GET("/health", healthHandler.HealthCheck)

		// ユーザー関連
		public.POST("/register", userHandler.CreateUser)
		public.POST("/login", userHandler.Login)

		// プロジェクト一覧と詳細は認証不要
		public.GET("/projects", projectHandler.ListProjects)
		public.GET("/projects/:id", projectHandler.GetProject)
		public.GET("/projects/:id/supports", supportHandler.GetProjectSupports)

		// Webhook（Stripe-Signatureヘッダーを許可）
		public.POST("/webhook", h.HandleStripeWebhook)

		// 支払い検証（セッションIDから支援情報を取得）
		public.GET("/payments/verify", supportHandler.VerifyPaymentBySession)
	}

	// 認証が必要なルート
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// ユーザー関連
		protected.GET("/auth/me", userHandler.GetCurrentUser)
		protected.GET("/users/:id", userHandler.GetUser)
		protected.PUT("/users/:id", userHandler.UpdateUser)

		// プロジェクト関連（作成・更新・削除は認証必要）
		protected.POST("/projects", projectHandler.CreateProject)
		// マイプロジェクトと支援プロジェクト（:idパラメータを使用するルートより先に定義）
		protected.GET("/projects/my", projectHandler.ListMyProjects)
		protected.GET("/projects/supported", projectHandler.ListSupportedProjects)
		// IDパラメータを使用するルート
		protected.PUT("/projects/:id", projectHandler.UpdateProject)
		protected.DELETE("/projects/:id", projectHandler.DeleteProject)

		// サポート関連
		protected.POST("/projects/:id/supports", supportHandler.CreateSupport)
		protected.GET("/supports/:id", supportHandler.GetSupportStatus)
	}

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8000"
	}

	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatal("サーバーの起動に失敗しました:", err)
	}
}
