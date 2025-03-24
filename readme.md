# 推しおめプロジェクト
推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

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
- **言語**: Go (Golang) 1.21
- **フレームワーク**: Gin
- **データベース**: PostgreSQL 15
- **ORM**: GORM v2
- **認証**: JWT
- **決済システム**: Stripe
- **開発ツール**: Air（ホットリロード）
- **コンテナ化**: Docker & Docker Compose
- **ログ管理**: Zap
- **バリデーション**: validator/v10

### フロントエンド
- **フレームワーク**: Vite + React
- **言語**: TypeScript
- **UIライブラリ**: Tailwind CSS
- **UIコンポーネント**: Headless UI
- **アイコン**: Heroicons
- **HTTPクライアント**: fetch API
- **フォーム**: React Hook Form
- **状態管理**: Zustand
- **ルーティング**: React Router v6
- **アバター生成**: DiceBear Avatars
- **画像最適化**: Sharp

## ✅ 実装済み機能

### 認証・認可
- ユーザー登録・ログイン機能
- JWTベースの認証システム
- OAuth2認証（Google）
- 保護されたルートの実装
- カスタマイズ可能なユーザーアバター

### プロジェクト管理
- プロジェクトの作成・編集・削除
- プロジェクト一覧表示（ページネーション対応）
- プロジェクトの検索・フィルタリング
- タグによるプロジェクト管理

### 支援機能
- 支援情報の登録
- 支援履歴の表示
- 支援統計の集計

### UI/UX
- レスポンシブデザイン
- モダンなUIコンポーネント
- フォームバリデーション
- エラーハンドリング
- ローディング表示
- アバターカスタマイズインターフェース
- アバター生成の最適化

## 🔄 開発中の機能

### 決済システム
- Stripe APIの統合
- 決済フローの実装
- 支援金額の管理
- 決済履歴の表示

### セキュリティ強化
- レート制限の実装
- セキュリティヘッダーの設定
- 入力値の検証強化
- CSRF対策

### パフォーマンス最適化
- キャッシュ戦略（Redis）
- N+1問題の対処
- クエリの最適化
- Code Splitting

### 監視・分析
- APM（New Relic/Datadog）
- Prometheus/Grafana
- Google Analytics 4
- エラー監視（Sentry）

## 開発環境のセットアップ

### 前提条件
- Go 1.21以上
- Node.js 18以上
- Docker と Docker Compose
- Air（ホットリロード用）

### バックエンドのセットアップ
```bash
# リポジトリのクローン
git clone [repository-url]
cd oshiome_go

# 依存パッケージのインストール
cd backend
go mod download

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# データベースの起動とマイグレーション
docker-compose up -d postgres
go run cmd/main.go -migrate

# 開発サーバーの起動
air
```

### フロントエンドのセットアップ
```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

### Docker Composeによる起動
```bash
# 全サービスの起動
docker-compose up -d

# ログの確認
docker-compose logs -f
```

## 本番環境へのデプロイ

### バックエンドのデプロイ
```bash
# バイナリのビルド
GOOS=linux GOARCH=amd64 go build -o app cmd/main.go

# ファイルの転送
scp app アカウント名@アカウント名.sakura.ne.jp:~/app/
scp .env アカウント名@アカウント名.sakura.ne.jp:~/app/
```

### フロントエンドのデプロイ
```bash
# 本番用ビルド
docker build -f Dockerfile.prod -t oshiome-frontend-prod .
docker create --name temp-container oshiome-frontend-prod
docker cp temp-container:/usr/share/nginx/html ./dist
docker rm temp-container

# ビルドファイルの転送
scp -r dist/* アカウント名@アカウント名.sakura.ne.jp:~/public_html/
```

## 環境変数
必要な環境変数の一覧は以下の通りです：

### バックエンド
- `SERVER_PORT`: サーバーポート
- `DB_HOST`: データベースホスト
- `DB_PORT`: データベースポート
- `DB_NAME`: データベース名
- `DB_USER`: データベースユーザー
- `DB_PASSWORD`: データベースパスワード
- `JWT_SECRET`: JWT署名キー
- `STRIPE_SECRET_KEY`: Stripeシークレットキー
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhookシークレット

### フロントエンド
- `VITE_API_URL`: バックエンドAPIのURL
- `VITE_STRIPE_PUBLIC_KEY`: Stripe公開キー

## 詳細なドキュメント
- バックエンドの詳細: [backend-checklist.md](./docs/backend-checklist.md)
- フロントエンドの詳細: [frontend-checklist.md](./docs/frontend-checklist.md)


