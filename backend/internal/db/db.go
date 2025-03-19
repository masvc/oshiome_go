package db

import (
	"fmt"
	"log"
	"os"

	"github.com/masvc/oshiome_go/backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB データベース接続を初期化し、必要なマイグレーションを実行します
func InitDB() (*gorm.DB, error) {
	// 環境変数から接続情報を取得
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASSWORD")
	if dbPass == "" {
		dbPass = "rootpassword"
	}
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "oshiome"
	}

	// DSN（Data Source Name）の構築
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	// データベース接続
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("データベース接続エラー: %v", err)
		return nil, err
	}

	// マイグレーションの実行
	if err := runMigrations(db); err != nil {
		log.Printf("マイグレーションエラー: %v", err)
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
