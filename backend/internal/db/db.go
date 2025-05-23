package db

import (
	"fmt"
	"log"
	"os"

	"github.com/masvc/oshiome_go/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB データベース接続を初期化し、必要なマイグレーションを実行します
func InitDB() (*gorm.DB, error) {
	// 環境変数から接続情報を取得
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}
	dbPass := os.Getenv("DB_PASSWORD")
	if dbPass == "" {
		dbPass = "postgres"
	}
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "oshiome"
	}

	// DSN（Data Source Name）の構築
	// 本番環境（Render）ではSSL/TLS接続を有効に
	sslMode := "require"
	if os.Getenv("ENV") == "development" {
		sslMode = "disable"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Tokyo",
		dbHost, dbUser, dbPass, dbName, dbPort, sslMode)

	// データベース接続
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("データベース接続エラー: %v", err)
		return nil, err
	}

	// マイグレーションの実行
	if err := runMigrations(db); err != nil {
		log.Printf("マイグレーションに失敗しました:%v", err)
		return nil, err
	}

	log.Println("データベースの初期化が完了しました")
	return db, nil
}

// GetDB 初期化済みのデータベース接続を返します
func GetDB() *gorm.DB {
	return db
}

// CloseDB データベース接続を閉じます
func CloseDB() {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			log.Printf("データベース接続のクローズエラー: %v", err)
			return
		}
		if err := sqlDB.Close(); err != nil {
			log.Printf("データベース接続のクローズエラー: %v", err)
		}
	}
}

// runMigrations 必要なマイグレーションを実行します
func runMigrations(db *gorm.DB) error {
	if err := db.AutoMigrate(&models.User{}, &models.Project{}); err != nil {
		return fmt.Errorf("マイグレーションエラー: %v", err)
	}
	return nil
}
