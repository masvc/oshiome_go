# Oshiome Backend

Go言語で実装されたOshiomeのバックエンドサービス

## 技術スタック

- Go 1.21
- PostgreSQL
- Docker

## 開発環境のセットアップ

```bash
# 開発サーバーの起動
docker compose up -d

# マイグレーションの実行
go run cmd/main.go migrate
```

## 本番環境

- デプロイ先: Render
- URL: https://oshiome-backend.onrender.com
- 自動デプロイ: 有効（`backend/**`の変更時）

## APIエンドポイント

- `GET /healthz`: ヘルスチェック
- `POST /api/v1/users`: ユーザー登録
- `POST /api/v1/login`: ログイン
- その他のエンドポイントは開発中...

## 環境変数

- `DB_HOST`: データベースホスト
- `DB_PORT`: データベースポート
- `DB_USER`: データベースユーザー
- `DB_PASSWORD`: データベースパスワード
- `DB_NAME`: データベース名
- `SERVER_PORT`: サーバーポート
- `JWT_SECRET`: JWTシークレットキー 