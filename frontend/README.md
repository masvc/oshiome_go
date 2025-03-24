# Oshiome Frontend

Reactで実装されたOshiomeのフロントエンドサービス

## 技術スタック

- React
- TypeScript
- Vite
- Docker

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 本番環境

- デプロイ先: Render
- URL: https://oshiome.onrender.com
- 自動デプロイ: 有効（`frontend/**`の変更時）

## 機能

- ユーザー認証（ログイン/新規登録）
- プロジェクト管理
- サポート機能
- その他の機能は開発中...

## 環境変数

- `VITE_API_URL`: バックエンドAPIのURL（例: https://oshiome-backend.onrender.com）

## ビルド

```bash
# 本番用ビルド
npm run build
``` 