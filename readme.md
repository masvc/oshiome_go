# 推しおめプロジェクト
推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## プロジェクト構成
```
oshiome_go/
├── backend/
│   ├── cmd/                    # アプリケーションのエントリーポイント
│   │   └── main.go
│   ├── internal/              # プロジェクト内部パッケージ
│   │   ├── db/               # データベース関連
│   │   │   ├── migrations/   # マイグレーションファイル
│   │   │   │   └── migrate.go
│   │   │   └── db.go
│   │   ├── handlers/         # HTTPハンドラー
│   │   │   ├── project_handler.go
│   │   │   ├── response.go
│   │   │   ├── support_handler.go
│   │   │   └── user_handler.go
│   │   ├── middleware/       # ミドルウェア
│   │   │   └── auth.go
│   │   ├── models/          # データモデル
│   │   │   ├── project.go
│   │   │   ├── support.go
│   │   │   └── user.go
│   │   └── utils/           # ユーティリティ関数
│   │       ├── auth.go
│   │       ├── errors.go
│   │       └── response.go
│   ├── .air.toml            # Air（ホットリロード）の設定
│   ├── Dockerfile           # バックエンドのDockerfile
│   ├── go.mod              # Goの依存関係管理
│   └── go.sum              # 依存関係のチェックサム
├── frontend/               # フロントエンド関連ファイル
├── docker-compose.yml     # Docker Compose設定ファイル
└── README.md             # プロジェクトのドキュメント
```

#### 主な機能
- クラウドファンディング機能
  - 企画の作成・管理
  - 支援の受付・管理
  - 進捗状況の表示
- 決済機能
  - クレジットカード決済（Stripe）

## 技術スタック
- **バックエンド**: Go (Golang)
- **データベース**: MySQL
- **APIフレームワーク**: Gin
- **データベース管理**: phpMyAdmin
- **フロントエンド**: Vite + React
- **UIライブラリ**: Tailwind CSS
- **決済システム**: Stripe
- **デプロイ**: さくらサーバー

## 機能要件

### 1. 商品管理システム
- 商品の登録、一覧表示、詳細表示、更新、削除
- 商品カテゴリによる分類
- 在庫管理

## データベース設計

### テーブル構造
1. **products**
   - id (PK)
   - name
   - description
   - price
   - stock
   - category_id (FK)
   - created_at
   - updated_at

2. **categories**
   - id (PK)
   - name
   - description

## API エンドポイント

- `GET /api/products` - 商品一覧取得
- `GET /api/products/:id` - 商品詳細取得
- `POST /api/products` - 商品登録
- `PUT /api/products/:id` - 商品更新
- `DELETE /api/products/:id` - 商品削除
- `GET /api/categories` - カテゴリ一覧取得

## 開発環境のセットアップ

### 前提条件
- Go 1.16以上
- Docker と Docker Compose
- Air（ホットリロード用）

### 開発環境の構築
1. Airのインストール
   ```bash
   go install github.com/cosmtrek/air@latest
   ```

2. プロジェクトの初期化
   ```bash
   # Goモジュールの初期化
   go mod init go_mysql

   # 必要なパッケージのインストール
   go get -u github.com/gin-gonic/gin
   go get -u gorm.io/gorm
   go get -u gorm.io/driver/mysql
   ```

3. Airの設定ファイル作成
   ```bash
   # Airの設定ファイルを生成
   air init
   ```

   生成された`.air.toml`を以下のように編集：
   ```toml
   root = "."
   testdata_dir = "testdata"
   tmp_dir = "tmp"

   [build]
   args_bin = []
   bin = "./tmp/main"
   cmd = "go build -o ./tmp/main ./cmd/main.go"
   delay = 1000
   exclude_dir = ["assets", "tmp", "vendor", "testdata"]
   exclude_file = []
   exclude_regex = ["_test.go"]
   exclude_unchanged = false
   follow_symlink = false
   full_bin = ""
   include_ext = ["go", "tpl", "tmpl", "html"]
   kill_delay = "0s"
   log = "build-errors.log"
   send_interrupt = false
   stop_on_error = true

   [color]
   app = ""
   build = "yellow"
   main = "magenta"
   runner = "green"
   watcher = "cyan"

   [log]
   time = false

   [misc]
   clean_on_exit = false

   [screen]
   clear_on_rebuild = false
   ```

4. Docker Compose設定
   `docker-compose.yml`を作成：
   ```yaml
   version: '3.8'

   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.dev
       volumes:
         - .:/app
       ports:
         - "8000:8000"
       environment:
         - DB_HOST=mysql
         - DB_PORT=3306
         - DB_USER=root
         - DB_PASSWORD=rootpassword
         - DB_NAME=product_db
         - SERVER_PORT=8000
       depends_on:
         - mysql
       command: air

     mysql:
       image: mysql:8.0
       ports:
         - "3306:3306"
       environment:
         - MYSQL_ROOT_PASSWORD=rootpassword
         - MYSQL_DATABASE=product_db
       volumes:
         - mysql_data:/var/lib/mysql

     phpmyadmin:
       image: phpmyadmin/phpmyadmin
       ports:
         - "8080:80"
       environment:
         - PMA_HOST=mysql
         - MYSQL_ROOT_PASSWORD=rootpassword
       depends_on:
         - mysql

   volumes:
     mysql_data:
   ```

5. 開発用Dockerfile作成
   `Dockerfile.dev`を作成：
   ```dockerfile
   FROM golang:1.21

   WORKDIR /app

   # Airのインストール
   RUN go install github.com/cosmtrek/air@latest

   # 依存関係のコピー
   COPY go.mod go.sum ./
   RUN go mod download

   # ソースコードのコピー
   COPY . .

   # Airの設定ファイル
   COPY .air.toml .

   # 開発サーバーの起動
   CMD ["air"]
   ```

### 開発サーバーの起動
```bash
# 開発環境の起動
docker-compose up

# バックグラウンドで起動する場合
docker-compose up -d
```

### 開発の流れ
1. コードを編集すると、Airが自動的に検知して再ビルド
2. ブラウザで http://localhost:8000 にアクセスして動作確認
3. phpMyAdminで http://localhost:8080 からデータベース管理
4. エラーが発生した場合は、ターミナルでログを確認

### 便利なコマンド
```bash
# コンテナのログを確認
docker-compose logs -f app

# コンテナを再起動
docker-compose restart app

# データベースのマイグレーション
docker-compose exec app go run cmd/migrate/main.go

# テストの実行
docker-compose exec app go test ./...
```

## 学習目標
- Golangの基本的な文法とWeb開発
- MySQLの基本操作とテーブル設計
- phpMyAdminを使ったデータベース管理
- DockerとDocker Composeによる開発環境構築
- RESTful APIの設計と実装の基礎

## さくらサーバーへのデプロイ手順

### 前提条件
- さくらサーバーのアカウント
- SSHアクセス権限
- ドメイン（オプション）

### サーバーセットアップ
1. ローカルからデプロイサーバへのログイン
   ```bash
   # さくらサーバーにSSHでログイン
   ssh アカウント名@アカウント名.sakura.ne.jp
   ```

2. シェルの変更（オプション）
   ```bash
   # 方法1: 初期設定の変更
   chsh -s /usr/local/bin/bash

   # 方法2: 一時的な変更
   /usr/local/bin/bash
   ```

3. GitHubとのSSH通信設定
   ```bash
   # SSHキーの生成
   cd ~/.ssh
   ssh-keygen

   # 公開鍵の表示
   cat ~/.ssh/id_rsa.pub
   ```

4. GitHubにSSHキーを登録
   - GitHubのウェブサイトにログイン
   - Settings → SSH and GPG keys → New SSH key
   - 先ほどコピーした公開鍵を貼り付け

5. SSH接続の確認
   ```bash
   ssh -T git@github.com
   ```

### アプリケーションのデプロイ
1. デプロイ用ディレクトリの作成
   ```bash
   cd ~
   mkdir -p ~/apps/product-app
   cd ~/apps/product-app
   ```

2. Goのインストール
   ```bash
   # 作業ディレクトリの作成
   mkdir -p ~/go
   cd ~/go

   # Goのダウンロードとインストール
   wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
   tar -C ~/go -xzf go1.21.6.linux-amd64.tar.gz

   # 環境変数の設定
   echo 'export GOROOT=$HOME/go/go' >> ~/.bash_profile
   echo 'export GOPATH=$HOME/go' >> ~/.bash_profile
   echo 'export PATH=$PATH:$GOROOT/bin:$GOPATH/bin' >> ~/.bash_profile
   source ~/.bash_profile
   ```

3. プロジェクトのクローン
   ```bash
   cd ~/apps/product-app
   git clone <YOUR_REPOSITORY_URL> .
   ```

4. 依存関係のインストール
   ```bash
   go mod download
   ```

5. アプリケーションのビルド
   ```bash
   go build -o product-app cmd/main.go
   ```

6. 環境変数の設定
   ```bash
   # .envファイルの作成
   cp .env.example .env
   vi .env
   ```
   以下の内容を設定：
   ```
   DB_HOST=mysql57.アカウント名.sakura.ne.jp
   DB_PORT=3306
   DB_USER=データベースユーザー名
   DB_PASSWORD=データベースパスワード
   DB_NAME=データベース名
   SERVER_PORT=8000
   ```

7. アプリケーションの起動
   ```bash
   # バックグラウンドで実行
   nohup ./product-app > app.log 2>&1 &
   ```

8. シンボリックリンクの作成
   ```bash
   cd ~/www
   ln -s ~/apps/product-app/public/ product-app
   ```

### メンテナンス
- ログの確認
  ```bash
  # アプリケーションログ
  tail -f ~/apps/product-app/app.log

  # エラーログ
  tail -f ~/apps/product-app/error.log
  ```

- アプリケーションの更新
  ```bash
  # 最新のコードを取得
  cd ~/apps/product-app
  git pull

  # アプリケーションの再ビルド
  go build -o product-app cmd/main.go

  # 既存のプロセスを停止
  pkill product-app

  # 新しいプロセスを起動
  nohup ./product-app > app.log 2>&1 &
  ```

- データベースのバックアップ
  ```bash
  # バックアップディレクトリの作成
  mkdir -p ~/backups

  # バックアップスクリプトの作成
  cat > ~/backup-db.sh << EOL
  #!/bin/bash
  mysqldump -h mysql57.アカウント名.sakura.ne.jp -u データベースユーザー名 -p データベース名 > ~/backups/product_db_$(date +\%Y\%m\%d).sql
  EOL

  chmod +x ~/backup-db.sh

  # cronにバックアップタスクを追加
  (crontab -l 2>/dev/null; echo "0 0 * * * ~/backup-db.sh") | crontab -
  ```

### さくらサーバー特有の注意点
- メモリ制限に注意
- ディスク容量の監視
- バックアップの定期実行
- セキュリティアップデートの実施
- さくらサーバーの利用規約に従う

### トラブルシューティング
1. メモリ不足の場合
   ```bash
   # プロセスの確認
   ps aux | grep product-app

   # 不要なプロセスの終了
   pkill product-app
   ```

2. ディスク容量の確認
   ```bash
   df -h
   du -sh ~/apps/product-app
   ```

3. ログの確認
   ```bash
   # アプリケーションログ
   tail -f ~/apps/product-app/app.log

   # エラーログ
   tail -f ~/apps/product-app/error.log
   ```

## フロントエンド開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- TypeScript 5.0以上

### フロントエンドの初期化
1. Vite + React + TypeScriptプロジェクトの作成
   ```bash
   # プロジェクトディレクトリの作成
   mkdir frontend
   cd frontend

   # Viteプロジェクトの作成（TypeScript + React）
   npm create vite@latest . -- --template react-ts
   ```

2. 必要なパッケージのインストール
   ```bash
   npm install
   npm install @tanstack/react-query axios tailwindcss postcss autoprefixer
   npm install -D @types/node @types/react @types/react-dom typescript
   ```

3. TypeScript設定
   `tsconfig.json`の設定：
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

4. Tailwind CSSの設定
   ```bash
   # Tailwind CSSの初期化
   npx tailwindcss init -p
   ```

   `tailwind.config.js`の設定：
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

   `src/index.css`に以下を追加：
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. 開発用のDocker Compose設定を更新
   `docker-compose.yml`に以下を追加：
   ```yaml
   services:
     # ... 既存のサービス ...

     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile.dev
       volumes:
         - ./frontend:/app
         - /app/node_modules
       ports:
         - "5173:5173"
       environment:
         - VITE_API_URL=http://localhost:8000
       command: npm run dev -- --host
   ```

6. フロントエンド用のDockerfile.dev作成
   `frontend/Dockerfile.dev`を作成：
   ```dockerfile
   FROM node:18

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   CMD ["npm", "run", "dev", "--", "--host"]
   ```

### フロントエンドの開発
1. 開発サーバーの起動
   ```bash
   # バックエンドとフロントエンドを同時に起動
   docker-compose up

   # フロントエンドのみ起動
   cd frontend
   npm run dev
   ```

2. ブラウザで確認
   - フロントエンド: http://localhost:5173
   - バックエンドAPI: http://localhost:8000
   - phpMyAdmin: http://localhost:8080

### APIクライアントの設定
`frontend/src/lib/api.ts`を作成：
```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const productApi = {
  getAll: (): Promise<ApiResponse<Product[]>> => 
    api.get<Product[]>('/api/products'),
  getById: (id: number): Promise<ApiResponse<Product>> => 
    api.get<Product>(`/api/products/${id}`),
  create: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> => 
    api.post<Product>('/api/products', data),
  update: (id: number, data: Partial<Product>): Promise<ApiResponse<Product>> => 
    api.put<Product>(`/api/products/${id}`, data),
  delete: (id: number): Promise<ApiResponse<void>> => 
    api.delete(`/api/products/${id}`),
};

export const categoryApi = {
  getAll: (): Promise<ApiResponse<Category[]>> => 
    api.get<Category[]>('/api/categories'),
};
```

### コンポーネントの例
`frontend/src/components/ProductList.tsx`：
```typescript
import { useQuery } from '@tanstack/react-query';
import { productApi, Product, ApiResponse } from '../lib/api';

export const ProductList: React.FC = () => {
  const { data, isLoading, error } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-semibold">¥{product.price}</p>
          <p className="text-sm text-gray-500">在庫: {product.stock}</p>
        </div>
      ))}
    </div>
  );
};
```

### 本番環境用のビルド
```bash
# フロントエンドのビルド
cd frontend
npm run build

# ビルドされたファイルは frontend/dist に生成されます
```


