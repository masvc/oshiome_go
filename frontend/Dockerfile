FROM node:18-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# TypeScriptのビルドディレクトリを作成し、パーミッションを設定
RUN mkdir -p dist && chown -R node:node /app

# ホットリロード用の設定
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# 非rootユーザーに切り替え
USER node

# 開発サーバーの起動
# ソースコードは docker-compose.yml でボリュームマウントするため、ここではコピーしない
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 