package main

import (
	"log"

	"github.com/masvc/oshiome_go/backend/internal/db/migrations"
)

func main() {
	if err := migrations.RunMigrations(); err != nil {
		log.Fatalf("マイグレーションに失敗しました: %v", err)
	}
}
