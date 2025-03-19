FROM golang:1.21-alpine

WORKDIR /app

# 必要なパッケージのインストール
RUN apk add --no-cache git

# Air（ホットリロード用）のインストール
RUN go install github.com/cosmtrek/air@v1.49.0

# 依存関係のコピー
COPY go.mod go.sum ./
RUN go mod download

# ソースコードのコピー
COPY . .

# Airの設定ファイル
COPY .air.toml .

# 開発サーバーの起動
CMD ["air"] 