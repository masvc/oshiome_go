# バックエンド実装状況チェックリスト

## 🎯 プロジェクトの目的
推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## 💻 技術スタック
- **言語**: Go (Golang)
- **フレームワーク**: Gin
- **データベース**: MySQL
- **ORM**: GORM
- **決済システム**: Stripe
- **開発ツール**: Air（ホットリロード）
- **コンテナ化**: Docker

## 📁 プロジェクト構成

```
backend/
├── cmd/
│   ├── main.go          # メインエントリーポイント
│   └── migrate/         # マイグレーションコマンド
├── internal/
│   ├── db/
│   │   └── migrations/  # データベースマイグレーション
│   ├── handlers/        # APIハンドラー
│   ├── middleware/      # ミドルウェア
│   ├── models/          # データモデル
│   └── utils/          # ユーティリティ関数
├── vendor/             # 依存パッケージ
├── .env                # 環境変数
├── .air.toml          # ホットリロード設定
├── Dockerfile         # コンテナ化設定
├── go.mod            # Go モジュール定義
└── go.sum            # 依存関係のチェックサム
```

## ✅ 実装済み機能

### 🔐 認証・認可
- [x] JWTベースの認証システム
- [x] ミドルウェアによる認証チェック
- [x] 保護されたルートの実装
- [x] パスワードのハッシュ化

### 🎯 コアビジネスロジック
- [x] プロジェクト管理（CRUD操作）
  - プロジェクトの作成
  - プロジェクトの更新
  - プロジェクトの削除
  - プロジェクト一覧の取得
  - プロジェクト詳細の取得
- [x] サポート（支援）機能
- [x] 決済システム（Stripe連携）

### 🛠 技術基盤
- [x] データベースマイグレーション
- [x] GORM統合
- [x] エラーハンドリング
  - 統一されたエラーレスポンス形式
  - パニックリカバリー
  - カスタムエラータイプ
- [x] CORS設定
- [x] Docker対応
- [x] 環境変数管理
- [x] ホットリロード（Air）

## ❌ 未実装機能

### 🧪 テスト（優先度：高）
- [ ] ユニットテスト
  - ハンドラーのテスト
  - ミドルウェアのテスト
  - ユーティリティ関数のテスト
- [ ] 統合テスト
  - APIエンドポイントのテスト
  - データベース操作のテスト
- [ ] モックの作成
  - データベースモック
  - 外部APIモック（Stripe等）

### 🚀 パフォーマンス最適化（優先度：中）
- [ ] キャッシュ戦略
  - プロジェクト一覧のキャッシュ
  - ユーザー情報のキャッシュ
- [ ] N+1問題の対処
- [ ] クエリの最適化
- [ ] ページネーション実装

### 📊 監視・ロギング（優先度：中）
- [ ] 構造化ログ
- [ ] メトリクス収集
  - APIレスポンスタイム
  - データベースクエリ時間
  - メモリ使用量
- [ ] エラー監視
- [ ] パフォーマンスモニタリング

### 🔒 セキュリティ強化（優先度：高）
- [ ] レート制限
- [ ] SQLインジェクション対策の確認
- [ ] XSS対策の確認
- [ ] CSRF対策
- [ ] セキュリティヘッダーの設定

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