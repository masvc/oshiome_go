# バックエンド実装状況チェックリスト

## 🎯 プロジェクトの目的
推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## 💻 技術スタック
- **言語**: Go (Golang) 1.21
- **フレームワーク**: Gin
- **データベース**: MySQL 8.0
- **ORM**: GORM v2
- **認証**: JWT
- **決済システム**: Stripe
- **開発ツール**: Air（ホットリロード）
- **コンテナ化**: Docker & Docker Compose
- **ログ管理**: Zap
- **バリデーション**: validator/v10

## 📁 プロジェクト構成

```
backend/
├── cmd/
│   ├── main.go          # メインエントリーポイント
│   └── migrate.go       # マイグレーションコマンド
├── internal/
│   ├── db/
│   │   ├── connection.go  # DB接続管理
│   │   └── migrations/    # データベースマイグレーション
│   ├── handlers/          # APIハンドラー
│   │   ├── auth_handler.go     # 認証関連
│   │   ├── user_handler.go     # ユーザー関連
│   │   ├── project_handler.go  # プロジェクト関連
│   │   └── support_handler.go  # 支援関連
│   ├── middleware/        # ミドルウェア
│   │   ├── auth.go       # 認証ミドルウェア
│   │   ├── cors.go       # CORS設定
│   │   └── logger.go     # ロギング
│   ├── models/           # データモデル
│   │   ├── user.go      # ユーザーモデル
│   │   ├── project.go   # プロジェクトモデル
│   │   └── support.go   # 支援モデル
│   └── utils/           # ユーティリティ関数
│       ├── auth.go      # 認証ユーティリティ
│       ├── response.go  # レスポンスヘルパー
│       ├── validator.go # バリデーションヘルパー
│       └── errors.go    # エラー定義
├── vendor/              # 依存パッケージ
├── .env                 # 環境変数
├── .air.toml           # ホットリロード設定
├── Dockerfile          # 開発環境用Dockerfile
├── Dockerfile.prod     # 本番環境用Dockerfile
├── docker-compose.yml  # Docker Compose設定
├── go.mod             # Go モジュール定義
└── go.sum             # 依存関係のチェックサム
```

## ✅ 実装済み機能

### 🔐 認証・認可
- [x] JWTベースの認証システム
  - [x] トークンの生成と検証
  - [x] リフレッシュトークンの実装
  - [x] トークンの有効期限管理
  - [x] トークンのブラックリスト管理
- [x] ミドルウェアによる認証チェック
- [x] 保護されたルートの実装
- [x] パスワードのハッシュ化と検証（bcrypt）
- [x] ユーザー登録・ログイン機能
- [x] OAuth2認証（Google）の実装

### 🎯 コアビジネスロジック
- [x] プロジェクト管理（CRUD操作）
  - [x] プロジェクトの作成
  - [x] プロジェクトの更新
  - [x] プロジェクトの削除
  - [x] プロジェクト一覧の取得（ページネーション対応）
  - [x] プロジェクト詳細の取得
  - [x] プロジェクトの検索・フィルタリング
- [x] サポート（支援）機能
  - [x] 支援情報の登録
  - [x] 支援履歴の取得
  - [x] 支援統計の集計
- [x] タグ管理機能
  - [x] タグの作成・更新・削除
  - [x] タグによるプロジェクトのフィルタリング

### 🛠 技術基盤
- [x] データベースマイグレーション
  - [x] マイグレーションファイルの整理
  - [x] マイグレーションコマンドの実装
  - [x] ロールバック機能
- [x] GORM統合
  - [x] モデル定義
  - [x] リレーションの設定
  - [x] カスタムバリデーション
- [x] エラーハンドリング
  - [x] 統一されたエラーレスポンス形式
  - [x] パニックリカバリー
  - [x] カスタムエラータイプ
  - [x] バリデーションエラーの整形
- [x] CORS設定
- [x] Docker対応
  - [x] 開発環境の整備
  - [x] 本番環境用の設定
  - [x] マルチステージビルド
- [x] 環境変数管理
- [x] ホットリロード（Air）
- [x] ロギング
  - [x] 構造化ログ（Zap）
  - [x] リクエスト/レスポンスのログ
  - [x] エラーログの収集

## 🔄 進行中の機能

### 💳 決済機能（優先度：高）
- [ ] Stripe APIの統合
  - [ ] 決済インテント作成
  - [ ] 支払い方法の保存
  - [ ] サブスクリプション管理
- [ ] 決済フローの実装
  - [ ] 支援金額の検証
  - [ ] 決済状態の管理
  - [ ] 失敗時のリトライ
- [ ] Webhookハンドラーの実装
  - [ ] イベント処理
  - [ ] エラーハンドリング
- [ ] 支援金額の管理機能
  - [ ] 集計機能
  - [ ] レポート生成

### 🔒 セキュリティ強化（優先度：高）
- [ ] レート制限の実装
  - [ ] IPベースの制限
  - [ ] ユーザーベースの制限
- [ ] セキュリティヘッダーの設定
  - [ ] HSTS
  - [ ] CSP
  - [ ] X-Frame-Options
- [ ] 入力値の検証強化
  - [ ] カスタムバリデーション
  - [ ] サニタイズ処理
- [ ] CSRF対策の実装
- [ ] 監査ログの実装

### 🧪 テスト（優先度：高）
- [ ] ユニットテスト
  - [ ] ハンドラーのテスト
  - [ ] ミドルウェアのテスト
  - [ ] ユーティリティ関数のテスト
- [ ] 統合テスト
  - [ ] APIエンドポイントのテスト
  - [ ] データベース操作のテスト
- [ ] モックの作成
  - [ ] データベースモック
  - [ ] 外部APIモック（Stripe等）
- [ ] パフォーマンステスト
  - [ ] 負荷テスト
  - [ ] ストレステスト

### 🚀 パフォーマンス最適化（優先度：中）
- [ ] キャッシュ戦略
  - [ ] Redisの導入
  - [ ] キャッシュポリシーの設定
- [ ] N+1問題の対処
  - [ ] Eager Loading
  - [ ] クエリの最適化
- [ ] インデックス最適化
- [ ] クエリパフォーマンスの改善

### 📊 監視・ロギング（優先度：中）
- [ ] APM導入
  - [ ] New Relic
  - [ ] Datadog
- [ ] メトリクス収集
  - [ ] Prometheusの導入
  - [ ] Grafanaでの可視化
- [ ] アラート設定
  - [ ] エラー率
  - [ ] レスポンスタイム
  - [ ] リソース使用率

## 📝 API仕様

### 認証関連
```
POST /api/register    # ユーザー登録
POST /api/login      # ログイン
```

### プロジェクト関連
```
GET    /api/projects      # 一覧取得（公開）
GET    /api/projects/:id  # 詳細取得（公開）
POST   /api/projects      # 作成（要認証）
PUT    /api/projects/:id  # 更新（要認証）
DELETE /api/projects/:id  # 削除（要認証）
```

### ユーザー関連
```
GET /api/users/:id  # プロフィール取得（要認証）
```

### 決済関連
```
POST /api/webhook  # Stripe Webhook
```

## 🔧 環境変数
必要な環境変数：
- `SERVER_PORT`: サーバーポート
- `DB_HOST`: データベースホスト
- `DB_PORT`: データベースポート
- `DB_NAME`: データベース名
- `DB_USER`: データベースユーザー
- `DB_PASSWORD`: データベースパスワード
- `JWT_SECRET`: JWT署名キー
- `STRIPE_SECRET_KEY`: Stripeシークレットキー
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhookシークレット

## 🚀 開発環境のセットアップ

### 前提条件
- Go 1.16以上
- Docker と Docker Compose
- Air（ホットリロード用）

### 1. 開発ツールのインストール
```bash
# Airのインストール
go install github.com/cosmtrek/air@latest

# 必要なパッケージのインストール
go mod download
```

### 2. データベースの準備
```bash
# Docker Composeでデータベースを起動
docker-compose up -d mysql

# マイグレーションの実行
go run cmd/main.go -migrate
```

### 3. 開発サーバーの起動
```bash
# ホットリロードで起動
air

# または通常起動
go run cmd/main.go
```

### 4. 動作確認
```bash
# ヘルスチェック
curl http://localhost:8000/health

# ユーザー登録
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🚀 本番環境へのデプロイ

### さくらサーバーへのデプロイ手順

1. ビルド
```bash
GOOS=linux GOARCH=amd64 go build -o app cmd/main.go
```

2. ファイル転送
```bash
scp app アカウント名@アカウント名.sakura.ne.jp:~/app/
scp .env アカウント名@アカウント名.sakura.ne.jp:~/app/
```

3. サービスの起動
```bash
ssh アカウント名@アカウント名.sakura.ne.jp
cd ~/app
./app
```

### サーバーメンテナンス

#### ログの確認
```bash
# アプリケーションログ
tail -f ~/app/app.log

# エラーログ
tail -f ~/app/error.log
```

#### バックアップ
```bash
# データベースバックアップ
mysqldump -u [ユーザー名] -p [データベース名] > backup_$(date +%Y%m%d).sql
```

## 📋 次のステップ（優先順位順）

1. 🔒 セキュリティ強化
   - レート制限の実装
   - セキュリティヘッダーの設定
   - 各種セキュリティ対策の確認

2. 🧪 テストの実装
   - ユニットテストの作成
   - 統合テストの作成
   - CIでのテスト自動化

3. 📊 監視・ロギングの導入
   - 構造化ログの実装
   - メトリクス収集の設定
   - エラー監視の導入

4. 🚀 パフォーマンス最適化
   - キャッシュの導入
   - クエリの最適化
   - N+1問題の解決 

## 🔍 トラブルシューティング

### よくある問題と解決方法

1. データベース接続エラー
```bash
# 接続確認
mysql -h $DB_HOST -u $DB_USER -p $DB_NAME

# ファイアウォール設定確認
sudo ufw status
```

2. マイグレーションエラー
```bash
# マイグレーション状態確認
go run cmd/main.go -migrate status

# マイグレーションのロールバック
go run cmd/main.go -migrate down
```

3. APIエラー
```bash
# ログの確認
tail -f app.log

# サーバー状態確認
ps aux | grep app
``` 