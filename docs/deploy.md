# RenderでのDockerデプロイ方法

## 概要
このプロジェクトは以下の構成でDockerを使用してローカル開発環境を構築しています：
- バックエンド: Go + Air（ホットリロード）
- フロントエンド: Node.js + Vite
- データベース: MySQL
- Adminer: データベース管理用

Renderでも同様にDockerを使用してデプロイすることができます。以下では、具体的な手順と注意点について説明します。

## デプロイ手順

### 1. リモートリポジトリの準備
1. GitHubにリポジトリを作成します（まだの場合）
2. ローカルリポジトリをGitHubにプッシュします：
   ```bash
   # 既存のリモートリポジトリを確認
   git remote -v
   
   # もし設定されていない場合は追加
   git remote add origin git@github.com:masvc/oshiome_go.git
   
   # メインブランチをプッシュ
   git push -u origin main
   ```

### 2. Renderアカウントの準備
1. [Render](https://render.com)にアカウントを作成します
2. GitHubアカウントと連携します
3. リポジトリ（masvc/oshiome_go）へのアクセス権限を付与します

### 3. バックエンドのデプロイ
1. Renderダッシュボードで「New +」をクリックし、「Web Service」を選択
2. GitHubリポジトリ（masvc/oshiome_go）を選択
3. 以下の設定を行います：
   - Name: oshiome-backend
   - Environment: Docker
   - Branch: main
   - Root Directory: backend
   - Instance Type: Free（開発環境の場合）

### 4. フロントエンドのデプロイ
1. 同様に「New +」から「Web Service」を選択
2. 同じGitHubリポジトリを選択
3. 以下の設定を行います：
   - Name: oshiome-frontend
   - Environment: Docker
   - Branch: main
   - Root Directory: frontend
   - Instance Type: Free（開発環境の場合）

### 5. 環境変数の設定
Renderダッシュボードの「Environment」タブで以下の環境変数を設定します：

#### バックエンド用
```
DB_HOST=your-mysql-host.onrender.com
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=oshiome
SERVER_PORT=8000
JWT_SECRET=your-secret-key
```

#### フロントエンド用
```
VITE_API_URL=https://oshiome-backend.onrender.com
```

### 6. データベースの設定
1. Renderダッシュボードで「New +」をクリックし、「MySQL」を選択
2. 以下の設定を行います：
   - Name: oshiome-db
   - Database: oshiome
   - User: your-mysql-user
   - Password: your-mysql-password
3. 作成されたデータベースの接続情報をバックエンドの環境変数に設定

## 注意点とよくある問題

### 1. バックエンドの設定
- `backend/Dockerfile`は開発環境用の設定になっています
- 本番環境用に以下の変更が必要です：
  ```dockerfile
  FROM golang:1.21-alpine

  WORKDIR /app

  COPY go.mod go.sum ./
  RUN go mod download

  COPY . .

  RUN go build -o main ./cmd/api/main.go

  EXPOSE 8000

  CMD ["./main"]
  ```

### 2. フロントエンドの設定
- `frontend/Dockerfile`は開発環境用の設定になっています
- 本番環境用に`Dockerfile.prod`を使用します：
  ```dockerfile
  FROM node:18-alpine as build

  WORKDIR /app

  COPY package*.json ./
  RUN npm install

  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=build /app/dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

### 3. ポート番号について
- Renderは自動的に`PORT`環境変数を設定します
- バックエンドは`8000`ポートでリッスンするように設定されています
- フロントエンドは`80`ポートでリッスンするように設定されています
- ローカル開発環境では以下のポートが使用されています：
  - バックエンド: 8000
  - フロントエンド: 5173
  - MySQL: 3306
  - Adminer: 8080

### 4. データベース接続
- RenderのMySQLは外部からの接続を許可する必要があります
- データベースの接続URLは`mysql://user:password@host:3306/dbname`の形式で設定します
- 接続情報はRenderダッシュボードの「MySQL」セクションで確認できます
- ローカル開発環境では以下の接続情報が使用されています：
  ```
  DB_HOST=mysql
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=rootpassword
  DB_NAME=oshiome
  ```

### 5. ビルド時間の制限
- Renderの無料プランではビルド時間に制限があります
- 必要に応じて有料プランへのアップグレードを検討してください

### 6. 環境変数の管理
- 機密情報は必ずRenderの環境変数として設定します
- `.env`ファイルはGitHubにコミットしないように注意してください
- 本番環境用の`.env`ファイルは別途管理してください

## トラブルシューティング

### 1. ビルドが失敗する場合
- Dockerfileの内容を確認
- 必要な依存関係がすべて含まれているか確認
- ビルドログを確認して具体的なエラーメッセージを確認
- 特に注意が必要な点：
  - Goのバージョンが1.21であることを確認
  - Node.jsのバージョンが18であることを確認
  - 必要なビルドツールがすべて含まれていることを確認
  - `docker-compose.yml`の`version`属性は無視されるため、削除することを推奨

### 2. アプリケーションが起動しない場合
- ログを確認して具体的なエラーメッセージを確認
- ポート番号の設定が正しいか確認
- データベース接続が正常か確認
- 特に注意が必要な点：
  - バックエンドの`main.go`が正しくビルドされているか
  - フロントエンドのビルドが成功しているか
  - 環境変数が正しく設定されているか
  - コンテナの健康状態を確認（`docker compose ps`で確認可能）

### 3. データベース接続エラー
- データベースの接続情報が正しいか確認
- データベースが起動しているか確認
- ファイアウォールの設定を確認
- 特に注意が必要な点：
  - MySQLのバージョンが8.0であることを確認
  - データベースのユーザー権限が適切に設定されているか
  - 接続文字列が正しい形式になっているか
  - ローカル開発環境では`mysql`というホスト名を使用していることを確認

## 参考リンク
- [Render公式ドキュメント](https://render.com/docs)
- [Docker公式ドキュメント](https://docs.docker.com/)
- [Go公式ドキュメント](https://golang.org/doc/)
- [Node.js公式ドキュメント](https://nodejs.org/docs/)
- [MySQL公式ドキュメント](https://dev.mysql.com/doc/)
