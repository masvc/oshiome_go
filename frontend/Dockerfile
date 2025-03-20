FROM node:18-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ホットリロード用の設定
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# 開発サーバーの起動
# ソースコードは docker-compose.yml でボリュームマウントするため、ここではコピーしない
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 