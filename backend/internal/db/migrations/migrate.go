package migrations

import (
	"log"

	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
)

// RunMigrations データベースのマイグレーションを実行します
func RunMigrations() error {
	// データベース接続
	database, err := db.InitDB()
	if err != nil {
		return err
	}
	defer db.CloseDB()

	// マイグレーションの実行
	if err := database.AutoMigrate(&models.User{}); err != nil {
		return err
	}
	if err := database.AutoMigrate(&models.Project{}); err != nil {
		return err
	}
	if err := database.AutoMigrate(&models.Support{}); err != nil {
		return err
	}

	log.Println("マイグレーションが正常に完了しました")
	return nil
}
