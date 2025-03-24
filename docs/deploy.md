# RenderでのDockerデプロイ方法

## 概要
このプロジェクトは以下の構成でDockerを使用してローカル開発環境を構築しています：
- バックエンド: Go + Air（ホットリロード）
- フロントエンド: Node.js + Vite
- データベース: PostgreSQL
- Adminer: データベース管理用

Renderでも同様にDockerを使用してデプロイすることができます。以下では、具体的な手順と注意点について説明します。

## デプロイ前の準備

### 1. 必要なアカウントの準備
1. GitHubアカウント
   - [GitHub](https://github.com)でアカウントを作成（まだの場合）
   - リポジトリへのアクセス権限があることを確認

2. Renderアカウント
   - [Render](https://render.com)でアカウントを作成
   - GitHubアカウントと連携
   - クレジットカード情報の登録（無料プランでも必要）

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
   go run cmd/api/main.go migrate
   ```

### 3. GitHubへのプッシュ
1. 変更をコミット
   ```bash
   git add .
   git commit -m "デプロイ用の準備"
   ```

2. GitHubにプッシュ
   ```bash
   git push origin main
   ```

## デプロイ手順

### 1. データベースのデプロイ
1. Renderダッシュボードにログイン
2. 「New +」をクリックし、「PostgreSQL」を選択
3. 以下の設定を行う：
   - Name: `oshiome-db`（任意の名前）
   - Database: `oshiome`
   - User: `oshiome_user`
   - Region: `Singapore (Southeast Asia)`（既存のサービスと同じリージョン）
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
     - Internal Database URL: （表示されたURL）

7. アクセス制御の設定
   - デフォルトで`0.0.0.0/0`（すべてのIPからのアクセスを許可）が設定されている
   - 本番環境では必要に応じて制限を検討

### 2. バックエンドのデプロイ
1. Renderダッシュボードで「New +」をクリックし、「Web Service」を選択
2. GitHubリポジトリ（masvc/oshiome_go）を選択
3. 以下の設定を行う：
   - Name: `oshiome-backend`
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: `backend`
   - Instance Type: Free
   - Region: `Singapore (Southeast Asia)`（データベースと同じリージョン）
   - Dockerfile Path: `Dockerfile.prod`（本番環境用）

4. 環境変数を設定（「Environment」タブ）：
   ```
   DB_HOST=dpg-cvgimhaqgecs739fi530-a
   DB_PORT=5432
   DB_USER=oshiome_user
   DB_PASSWORD=（データベースのパスワード）
   DB_NAME=oshiome
   SERVER_PORT=8000
   JWT_SECRET=jwt-secret-key-2024-03-24
   ```

5. 「Create Web Service」をクリック

### 3. フロントエンドのデプロイ
1. Renderダッシュボードで「New +」をクリックし、「Web Service」を選択
2. GitHubリポジトリ（masvc/oshiome_go）を選択
3. 以下の設定を行う：
   - Name: `oshiome`（メインのフロントエンドサービス）
   - Environment: `Docker`
   - Branch: `main`
   - Root Directory: `frontend`
   - Instance Type: Free
   - Region: `Singapore (Southeast Asia)`（他のサービスと同じリージョン）
   - Dockerfile Path: `frontend/Dockerfile.prod`
   - Docker Build Context Directory: `frontend`

4. 環境変数を設定：
   ```
   VITE_API_URL=https://oshiome-backend.onrender.com
   ```

5. その他の設定：
   - Health Check Path: 設定不要
   - Pre-Deploy Command: 設定不要
   - Auto-Deploy: Yes

6. 「Create Web Service」をクリック

## デプロイ後の確認

### 1. 各サービスの状態確認
1. Renderダッシュボードで各サービスの状態を確認
   - データベース: 「ready」状態であることを確認
   - バックエンド: 緑色の「Deploy successful」が表示されるまで待つ
   - フロントエンド: 緑色の「Deploy successful」が表示されるまで待つ
   - エラーが発生した場合は、ログを確認

2. 各サービスのURLをメモ：
   - バックエンド: `https://oshiome-backend.onrender.com`
   - フロントエンド: `https://oshiome.onrender.com`

### 2. アプリケーションの動作確認
1. フロントエンドのURLにアクセス
2. 以下の機能を確認：
   - ログイン/新規登録
   - データの表示
   - データの作成/編集/削除

### 3. エラーが発生した場合の対処
1. ログの確認方法：
   - Renderダッシュボードで該当サービスを選択
   - 「Logs」タブをクリック
   - エラーメッセージを確認

2. よくある問題と解決方法：
   - データベース接続エラー
     - 環境変数の設定を確認
     - データベースの接続情報を確認
     - パスワードが正しく設定されているか確認
     - データベースのステータスが「available」であることを確認
   - ビルドエラー
     - Dockerfileの内容を確認
     - 依存関係が正しく設定されているか確認
     - 本番環境では`Dockerfile.prod`を使用することを確認
   - アプリケーション起動エラー
     - ポート番号の設定を確認
     - 環境変数が正しく設定されているか確認
     - アプリケーションが正しいポートでリッスンしているか確認

## 本番環境での注意点

### 1. セキュリティ
- 本番環境のパスワードは強力なものを使用
- 環境変数は必ずRenderの管理画面で設定
- `.env`ファイルはGitHubにコミットしない
- データベースのパスワードは定期的に変更することを推奨
- 本番環境では`JWT_SECRET`は十分に長いランダムな文字列を使用
- データベースのアクセス制御を適切に設定（必要に応じてIP制限を検討）
- `JWT_SECRET`と`DB_PASSWORD`は異なる値を使用することを推奨
- パスワードやシークレットキーは定期的に更新することを推奨

### 2. パフォーマンス
- 無料プランではスリープ状態になる可能性がある
- 初回アクセス時に起動に時間がかかる
- データベースの接続数に制限がある
- 無料プランのデータベースは1GBのストレージ制限がある
- 無料プランでは256MBのRAMと0.1 CPUの制限がある
- データベースは2025年4月23日に期限切れになる（無料プランの場合）

### 3. メンテナンス
- 定期的にログを確認
- バックアップの設定を検討
- モニタリングの設定を検討
- データベースのストレージ使用量を定期的に確認
- 本番環境では有料プランへのアップグレードを検討

## 参考リンク
- [Render公式ドキュメント](https://render.com/docs)
- [Docker公式ドキュメント](https://docs.docker.com/)
- [Go公式ドキュメント](https://golang.org/doc/)
- [Node.js公式ドキュメント](https://nodejs.org/docs/)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)
