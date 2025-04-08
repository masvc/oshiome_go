# Render での Docker デプロイ方法

## 概要

このプロジェクトは以下の構成で Docker を使用してローカル開発環境を構築しています：

- バックエンド: Go + Air（ホットリロード）
- フロントエンド: Node.js + Vite + React
- データベース: PostgreSQL
- Adminer: データベース管理用

Render でも同様に Docker を使用してデプロイすることができます。以下では、具体的な手順と注意点について説明します。

## デプロイ前の準備

### 1. 必要なアカウントの準備

1. GitHub アカウント

   - [GitHub](https://github.com)でアカウントを作成（まだの場合）
   - リポジトリへのアクセス権限があることを確認

2. Render アカウント

   - [Render](https://render.com)でアカウントを作成
   - GitHub アカウントと連携
   - クレジットカード情報の登録（無料プランでも必要）

3. Stripe アカウント（決済機能を使用する場合）
   - [Stripe](https://stripe.com)でアカウントを作成
   - テストモードで開発・テスト
   - 本番環境への移行時に本番モードに切り替え

### 2. ローカル環境の確認

1. アプリケーションが正常に動作することを確認

   ```bash
   # ローカル環境でアプリケーションを起動
   docker compose up -d

   # 各サービスが正常に起動していることを確認
   docker compose ps
   ```

2. データベースのマイグレーションが正常に実行できることを確認

   ```bash
   # バックエンドコンテナに入る
   docker compose exec backend sh

   # マイグレーションを実行
   go run cmd/main.go -migrate
   ```

### 3. GitHub へのプッシュ

1. 変更をコミット

   ```bash
   git add .
   git commit -m "デプロイ用の準備"
   ```

2. GitHub にプッシュ
   ```bash
   git push origin main
   ```

## デプロイ手順

### 1. データベースのデプロイ

1. Render ダッシュボードにログイン
2. 「New +」をクリックし、「PostgreSQL」を選択
3. 以下の設定を行う：

   - Name: `oshiome-db`（任意の名前）
   - Database: `oshiome`
   - User: `oshiome_user`
   - Region: `Singapore (Southeast Asia)`
   - PostgreSQL Version: `16`
   - Instance Type: `Free`
   - Storage: `1 GB`
   - High Availability: `Disabled`（無料プランでは利用不可）

4. 「Create Database」をクリック
5. データベースの作成完了を待つ

   - ステータスが「creating」から「ready」になるまで待機
   - 完了後、接続情報が表示される

6. データベースの接続情報を確認

   - `oshiome-db`の「Connect」タブをクリック
   - 以下の情報をメモ：
     - Hostname: `dpg-cvgimhaqgecs739fi530-a`
     - Port: `5432`
     - Database: `oshiome`
     - Username: `oshiome_user`
     - Password: （表示されたパスワード）
     - Internal Database URL: （表示された URL）

7. アクセス制御の設定
   - デフォルトで`0.0.0.0/0`（すべての IP からのアクセスを許可）が設定されている
   - 本番環境では必要に応じて制限を検討

### 2. Stripe Webhook の設定（決済機能を使用する場合）

1. Stripe ダッシュボードにログイン
2. 「開発者」 > 「Webhooks」に移動
3. 「エンドポイントを追加」をクリック
4. 以下の設定を行う：

   - エンドポイント URL: `https://oshiome-backend.onrender.com/api/webhook`
   - 監視するイベント:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.succeeded`
     - `charge.failed`
     - `charge.refunded`
   - バージョン: `2025-02-24`または最新

5. 「エンドポイントを追加」をクリック
6. Signing Secret（署名シークレット）をメモ
   - これをバックエンドの環境変数に設定する必要がある

### 3. バックエンドのデプロイ

1. Render ダッシュボードで「New +」をクリックし、「Web Service」を選択
2. GitHub リポジトリを選択
3. 以下の設定を行う：

   - Name: `oshiome-backend`
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: `backend`
   - Instance Type: Free
   - Region: `Singapore (Southeast Asia)`
   - Dockerfile Path: `Dockerfile.prod`

4. 環境変数を設定（「Environment」タブ）：

   ```
   DB_HOST=dpg-cvgimhaqgecs739fi530-a
   DB_PORT=5432
   DB_USER=oshiome_user
   DB_PASSWORD=（データベースのパスワード）
   DB_NAME=oshiome
   SERVER_PORT=8000
   JWT_SECRET=jwt-secret-key-2024-03-24

   # Stripe環境変数（決済機能を使用する場合）
   STRIPE_PUBLISHABLE_KEY=pk_test_...  # テストモード用
   STRIPE_SECRET_KEY=sk_test_...       # テストモード用
   STRIPE_WEBHOOK_SECRET=whsec_...     # Webhookのシークレット
   STRIPE_API_VERSION=2025-02-24       # APIバージョン
   ```

5. 「Create Web Service」をクリック

### 4. フロントエンドのデプロイ

1. Render ダッシュボードで「New +」をクリックし、「Web Service」を選択
2. GitHub リポジトリを選択
3. 以下の設定を行う：

   - Name: `oshiome`
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: `frontend`
   - Instance Type: Free
   - Region: `Singapore (Southeast Asia)`
   - Dockerfile Path: `Dockerfile.prod`
   - Docker Build Context Directory: `frontend`

4. 環境変数を設定：

   ```
   VITE_API_URL=https://oshiome-backend.onrender.com
   # Stripeの公開キー（フロントエンドで使用）
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

5. 「Create Web Service」をクリック

### 5. CORS 設定

1. バックエンド（`backend/internal/middleware/cors.go`）

   ```go
   config := cors.Config{
       AllowOrigins:     strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ","),
       AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
       AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
       AllowCredentials: true,
       MaxAge:           12 * time.Hour,
   }
   ```

2. フロントエンド（`frontend/nginx.conf`）

   ```nginx
   location /api/ {
       proxy_pass https://oshiome-backend.onrender.com/api/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;

       if ($request_method = 'OPTIONS') {
           add_header 'Access-Control-Allow-Origin' $http_origin;
           add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
           add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
           add_header 'Access-Control-Max-Age' 43200;
           add_header 'Content-Type' 'text/plain charset=UTF-8';
           add_header 'Content-Length' 0;
           return 204;
       }

       add_header 'Access-Control-Allow-Origin' $http_origin;
       add_header 'Access-Control-Allow-Credentials' 'true';
   }
   ```

## デプロイ後の確認

### 1. 各サービスの状態確認

1. Render ダッシュボードで各サービスの状態を確認

   - データベース: 「ready」状態であることを確認
   - バックエンド: 緑色の「Deploy successful」が表示されるまで待つ
   - フロントエンド: 緑色の「Deploy successful」が表示されるまで待つ

2. 各サービスの URL をメモ：
   - バックエンド: `https://oshiome-backend.onrender.com`
   - フロントエンド: `https://oshiome.onrender.com`

### 2. Stripe Webhook 接続の確認

1. Stripe ダッシュボードの「開発者」 > 「Webhooks」へ移動
2. デプロイした Webhook エンドポイントを選択
3. 「イベントを送信」でテストイベントを送信
4. バックエンドのログで Webhook イベントが正常に処理されていることを確認

### 3. アプリケーションの動作確認

1. フロントエンドの URL にアクセス
2. 以下の機能を確認：
   - ユーザー登録・ログイン
   - プロジェクト一覧表示
   - プロジェクト詳細表示
   - お気に入り機能
   - プロジェクト作成（ログイン後）
   - 支援フォームと決済処理（テストカードで確認）

### 4. エラーが発生した場合の対処

1. ログの確認：

   - Render ダッシュボードで該当サービスを選択
   - 「Logs」タブをクリック
   - エラーメッセージを確認

2. よくある問題と解決方法：
   - データベース接続エラー
     - 環境変数の設定を確認
     - データベースの接続情報を確認
   - Stripe 関連のエラー
     - API キーが正しく設定されているか確認
     - Webhook のエンドポイントが正しいか確認
     - イベントが正しく設定されているか確認

## 本番環境への移行時の注意点

### 1. Stripe 本番モードへの切り替え

1. Stripe の本番 API キーを取得

   - Stripe ダッシュボードの「開発者」 > 「API キー」から取得
   - 本番用の公開キー（`pk_live_...`）と秘密キー（`sk_live_...`）をメモ

2. 本番用 Webhook の設定

   - 本番モードで新しい Webhook エンドポイントを作成
   - 同じイベントを監視するように設定
   - 新しい Signing Secret を取得

3. 環境変数の更新
   - バックエンドとフロントエンドの環境変数を本番用に更新
   - `STRIPE_PUBLISHABLE_KEY`と`STRIPE_SECRET_KEY`を本番用に更新
   - `STRIPE_WEBHOOK_SECRET`を本番用に更新

### 2. セキュリティ対策

1. 本番環境での API 秘密キーの保護

   - 秘密キーは常に安全に保管
   - バージョン管理システムにコミットしない
   - アクセス制限の設定

2. PCI DSS コンプライアンスの考慮
   - カード情報をサーバーに保存しない
   - Stripe の推奨セキュリティプラクティスに従う

## 参考リンク

- [Render 公式ドキュメント](https://render.com/docs)
- [Docker 公式ドキュメント](https://docs.docker.com/)
- [PostgreSQL 公式ドキュメント](https://www.postgresql.org/docs/)
- [Gin Framework](https://gin-gonic.com/docs/)
- [React 公式ドキュメント](https://reactjs.org/docs/getting-started.html)
- [Vite 公式ドキュメント](https://vitejs.dev/guide/)
- [Stripe 公式ドキュメント](https://stripe.com/docs)
- [Stripe Webhook 設定ガイド](https://stripe.com/docs/webhooks)
- [Stripe API リファレンス](https://stripe.com/docs/api)
