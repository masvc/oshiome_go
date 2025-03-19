# 推しおめプロジェクト
推し（Vtuber、アイドル等）の誕生日を祝うためのクラウドファンディングプラットフォーム。
ファンが連携して駅広告やデジタルサイネージなどにお誕生日広告を出すことのできるサービス。

## プロジェクト構成
```
oshiome_go/
├── backend/          # Goによるバックエンド実装
├── frontend/         # フロントエンド関連ファイル
├── docker-compose.yml
└── README.md
```

## 技術スタック
- **バックエンド**: Go (Golang) + Gin
  - 詳細は [backend-checklist.md](./docs/backend-checklist.md) を参照
- **フロントエンド**: Vite + React
- **UIライブラリ**: Tailwind CSS
- **データベース**: MySQL
- **決済システム**: Stripe
- **デプロイ**: さくらサーバー

## 機能要件

### 1. プロジェクト管理
- プロジェクトの作成・編集・削除
- 進捗状況の管理
- 支援者の管理

### 2. 支援機能
- クレジットカード決済
- 支援履歴の管理
- 支援金額の集計

### 3. ユーザー管理
- ユーザー登録・ログイン
- プロフィール管理
- 支援履歴の確認

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


