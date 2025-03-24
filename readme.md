# 推しおめ

## プロジェクト概要

推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## プロジェクト構成

```
oshiome_go/
├── backend/          # バックエンド（Go + Gin）
├── frontend/         # フロントエンド（React + TypeScript）
├── docs/            # ドキュメント
└── docker-compose.yml
```

## 技術スタック

### バックエンド
詳細は[backend-checklist.md](./docs/backend-checklist.md)を参照
- **言語**: Go (Golang) 1.21
- **フレームワーク**: Gin
- **データベース**: PostgreSQL 16
- **認証**: JWT

### フロントエンド
詳細は[frontend-checklist.md](./docs/frontend-checklist.md)を参照
- **言語**: TypeScript
- **フレームワーク**: React
- **ビルドツール**: Vite
- **スタイリング**: TailwindCSS

## 実装済み機能

### 認証機能
- ユーザー登録
- ログイン/ログアウト
- パスワードリセット

### プロジェクト機能
- プロジェクト一覧表示
- プロジェクト詳細表示
- プロジェクト検索
- プロジェクトフィルター
- プロジェクトページネーション

### 支援機能
- 支援フォーム
- Stripe決済処理
- 支援完了通知

### マイページ機能
- 支援履歴
- お気に入りプロジェクト
- プロフィール編集

## 開発環境のセットアップ

### 前提条件
- Docker
- Docker Compose
- Git

### 1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd oshiome_go
```

### 2. 環境変数の設定
```bash
# .envファイルの作成
cp .env.example .env

# 必要な環境変数を設定
VITE_API_URL=http://localhost:8000
```

### 3. 開発環境の起動
```bash
# Dockerコンテナの起動
docker compose up -d

# フロントエンドのログを確認
docker compose logs -f frontend
```

### 4. 開発の開始
- フロントエンドは http://localhost:5173 でアクセス可能
- バックエンドは http://localhost:8000 でアクセス可能
- ホットリロードが有効なため、コードの変更は自動的に反映されます

### 5. 開発環境の停止
```bash
# コンテナの停止
docker compose down
```

## 環境変数

### バックエンド
```
SERVER_PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oshiome
DB_USER=oshiome_user
DB_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://oshiome.onrender.com
```

### フロントエンド
```
VITE_API_URL=http://localhost:8000
```

## デプロイ
デプロイ手順の詳細は[deploy.md](./docs/deploy.md)を参照してください。

## ライセンス
MIT


