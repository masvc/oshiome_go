# 推しおめプロジェクト

推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## 🌐 デプロイ URL

- https://oshiome.onrender.com
- ( バックエンド: https://oshiome-backend.onrender.com )
  ※render の無料プランを活用しているため 2025/6 以降は DB 接続が切れている可能性があります。

## プロジェクト構成

```
oshiome_go/
├── backend/          # Goによるバックエンド実装
├── frontend/         # フロントエンド関連ファイル
├── docs/            # プロジェクトドキュメント
├── docker-compose.yml
└── README.md
```

## 技術スタック

### バックエンド

詳細は[backend-checklist.md](./docs/backend-checklist.md)を参照

- **言語**: Go (Golang) 1.21
- **フレームワーク**: Gin
- **データベース**: PostgreSQL 16
- **認証**: JWT
- **決済**: Stripe API（テストモード）
- **開発ツール**: Air（ホットリロード）

### フロントエンド

詳細は[frontend-checklist.md](./docs/frontend-checklist.md)を参照

- **フレームワーク**: Vite + React
- **言語**: TypeScript
- **UI ライブラリ**: Tailwind CSS
- **状態管理**: Zustand

## ✅ 実装済み機能

### 認証・認可

- ユーザー登録・ログイン機能
- JWT ベースの認証システム
- 保護されたルートの実装

### プロジェクト管理

- プロジェクトの作成・編集・削除
- プロジェクト一覧表示（ページネーション対応）
- プロジェクトの検索・フィルタリング
- お気に入りプロジェクト機能

### 支援機能

- 支援情報の登録
- 支援履歴の表示
- 支援統計の集計
- Stripe 決済システム（テストモード）による支払い処理

詳細な機能一覧は[backend-checklist.md](./docs/backend-checklist.md)と[frontend-checklist.md](./docs/frontend-checklist.md)を参照してください。

## 🔄 開発中の機能

### 優先度：高

- セキュリティ強化
- テスト実装

### 優先度：高

- 推しタグ機能
  - 推しタグを作成
  - タグによるプロジェクトの通知やタグごとの情報ページの作成など

詳細な開発状況は各チェックリストを参照してください。

## 開発環境のセットアップ

### 前提条件

- Docker と Docker Compose
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

# ログの確認
docker compose logs -f
```

### 4. 開発の開始

- バックエンドは http://localhost:8000 でアクセス可能
- フロントエンドは http://localhost:5173 でアクセス可能
- ホットリロードが有効なため、コードの変更は自動的に反映されます

### 5. 開発コマンド

```bash
# バックエンド
docker compose exec backend go run cmd/main.go -migrate  # マイグレーション実行
docker compose exec backend go test ./...               # テスト実行

# フロントエンド
docker compose exec frontend npm install               # パッケージインストール
docker compose exec frontend npm run type-check       # 型チェック
docker compose exec frontend npm run lint            # リントチェック
docker compose exec frontend npm run test            # テスト実行
docker compose exec frontend npm run build           # ビルド
```

詳細な開発手順は以下を参照してください：

- バックエンド開発: [backend-checklist.md](./docs/backend-checklist.md#開発環境のセットアップ)
- フロントエンド開発: [frontend-checklist.md](./docs/frontend-checklist.md#開発環境のセットアップ)

## 本番環境へのデプロイ

デプロイ手順の詳細は[deploy.md](./docs/deploy.md)を参照してください。

## 環境変数

必要な環境変数の一覧：

### バックエンド

```
SERVER_PORT=8000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=oshiome
DB_USER=oshiome_user
DB_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://oshiome.onrender.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### フロントエンド

```
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 詳細なドキュメント

- [バックエンドの詳細](./docs/backend-checklist.md)
- [フロントエンドの詳細](./docs/frontend-checklist.md)
- [デプロイ手順](./docs/deploy.md)
