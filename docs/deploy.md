# さくらサーバーへのデプロイ手順

## 目次
1. [前提条件](#前提条件)
2. [サーバーへの接続設定](#サーバーへの接続設定)
3. [バックエンドのデプロイ](#バックエンドのデプロイ)
4. [フロントエンドのデプロイ](#フロントエンドのデプロイ)
5. [動作確認](#動作確認)
6. [トラブルシューティング](#トラブルシューティング)

## 前提条件

### 必要な情報
- さくらサーバーのアカウント情報
  - FTPサーバー名：`masv.sakura.ne.jp`
  - FTPアカウント：`masv`
  - サーバーパスワード：`U2V_HZ7JeVB/`
  - ドメイン：`masv.sakura.ne.jp`
  - サーバーコントロールパネルURL：`https://secure.sakura.ad.jp/rs/cp/`

### 必要なソフトウェア
- Go 1.21以上
- Node.js 18以上
- Git
- SSHクライアント

## サーバーへの接続設定

### 1. SSH接続の設定

```bash
# サーバーへのSSH接続
$ ssh masv@masv.sakura.ne.jp

# 初回接続時は以下のような警告が表示されます
The authenticity of host 'masv.sakura.ne.jp (219.94.128.145)' can't be established.
ED25519 key fingerprint is SHA256:Nflqf4iuo1vFdf/J0Kd1JzZrsXxfJdgWhYJ2L71snY8.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? 

# "yes" と入力してEnterを押します
yes

# パスワードを入力（表示されません）
masv@masv.sakura.ne.jp's password: 

# ログイン成功すると以下のように表示されます
Last login: Tue Feb 25 23:05:55 2025 from 125-14-139-187.rev.home.ne.jp
FreeBSD 13.0-RELEASE-p14 (GENERIC) #2: Mon Dec  9 13:54:55 JST 2024

Welcome to FreeBSD!
```

### 2. シェルの変更

```bash
# bashに変更（%プロンプトが表示されている状態で）
% /usr/local/bin/bash

# プロンプトが変更されます
[masv@www905 ~]$
```

### 3. GitHubとのSSH接続設定

```bash
# SSHディレクトリに移動
[masv@www905 ~]$ cd ~/.ssh

# SSHキーの生成（既存のキーがある場合は上書きしない）
[masv@www905 ~/.ssh]$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/masv/.ssh/id_rsa): 
/home/masv/.ssh/id_rsa already exists.
Overwrite (y/n)? n

# 公開鍵の表示
[masv@www905 ~/.ssh]$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAA... [キーの内容] ...9R masv@www905.sakura.ne.jp

# GitHubとの接続テスト
[masv@www905 ~/.ssh]$ ssh -T git@github.com
Enter passphrase for key '/home/masv/.ssh/id_rsa': 
Hi masvc! You've successfully authenticated, but GitHub does not provide shell access.
```

## バックエンドのデプロイ

### 1. アプリケーションディレクトリの作成と移動

```bash
# ホームディレクトリに移動してディレクトリを作成
[masv@www905 ~]$ cd ~
[masv@www905 ~]$ mkdir oshiome
[masv@www905 ~]$ cd oshiome
```

### 2. ソースコードの取得

```bash
# GitHubからクローン
[masv@www905 ~/oshiome]$ git clone git@github.com:masvc/oshiome_go.git .
Cloning into '.'...
Enter passphrase for key '/home/masv/.ssh/id_rsa': 
remote: Enumerating objects: 2377, done.
remote: Counting objects: 100% (2377/2377), done.
remote: Compressing objects: 100% (1848/1848), done.
remote: Total 2377 (delta 586), reused 2220 (delta 429), pack-reused 0 (from 0)
Receiving objects: 100% (2377/2377), 20.42 MiB | 7.48 MiB/s, done.
Resolving deltas: 100% (586/586), done.
```

### 3. Goの環境設定

```bash
# Goのバージョン確認
[masv@www905 ~/oshiome]$ go version
go version go1.17.6 freebsd/amd64

# Goモジュールの初期化
[masv@www905 ~/oshiome]$ go mod init github.com/masvc/oshiome_go
go: creating new go.mod: module github.com/masvc/oshiome_go

# 依存関係の解決（警告は無視して大丈夫です）
[masv@www905 ~/oshiome]$ go mod tidy
go: warning: "all" matched no packages
```

### 4. 環境変数の設定

```bash
# アプリケーションディレクトリの作成
[masv@www905 ~]$ mkdir -p oshiome/backend oshiome/frontend
[masv@www905 ~]$ cd oshiome

# バックエンド用の環境変数ファイルを作成
[masv@www905 ~/oshiome]$ cp backend/.env.example backend/.env
[masv@www905 ~/oshiome]$ vi backend/.env

# フロントエンド用の環境変数ファイルを作成
[masv@www905 ~/oshiome]$ echo "VITE_API_URL=https://masv.sakura.ne.jp/api" > frontend/.env.production
```

バックエンド用の環境変数（`backend/.env`）の内容：
```env
SERVER_PORT=8080
DB_HOST=mysql80.masv.sakura.ne.jp
DB_PORT=3306
DB_NAME=masv_oshiome
DB_USER=masv_oshiome
DB_PASSWORD=U2V_HZ7JeVB/
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

フロントエンド用の環境変数（`frontend/.env.production`）の内容：
```env
VITE_API_URL=https://masv.sakura.ne.jp/api
```

注意点：
- 環境変数ファイルは各アプリケーションのディレクトリに配置
- `JWT_SECRET`は必ず安全なランダム文字列に変更
- データベースのパスワードは安全なものを使用
- Stripe関連の環境変数は、実際のキーに置き換える必要があります

### 5. データベースの作成

サーバーコントロールパネルでデータベースを作成します：

1. https://secure.sakura.ad.jp/rs/cp/ にアクセス
2. 左メニューから「Webサイト/データ」→「データベース」を選択
3. 「データベースを作成する」ボタンをクリック
4. 以下の情報を入力：
   - データベースバージョン：`8.0`を選択
   - データベース名：`oshiome`（`masv_`は自動的に付与されます）
   - データベースユーザー名：データベース名と同じになります
   - データベースパスワード：`oshiome1234`（または別の安全なパスワード）
   - データベース文字コード：`UTF-8 (utf8mb4)`を選択
5. 注意事項を確認し、「同意する」にチェックを入れる
6. 「作成する」ボタンをクリック

作成完了後、以下の情報が表示されます：
- データベースサーバー：`mysql80.masv.sakura.ne.jp`
- データベース名：`masv_oshiome`
- ユーザー名：`masv_oshiome`
- パスワード：設定したもの（`oshiome1234`）

これらの情報を`.env`ファイルに反映します：
```env
DB_HOST=mysql80.masv.sakura.ne.jp
DB_PORT=3306
DB_NAME=masv_oshiome
DB_USER=masv_oshiome
DB_PASSWORD=oshiome1234
```

注意点：
- データベース名とユーザー名には自動的に`masv_`というプレフィックスが付与されます
- パスワードは英数字と記号の組み合わせで、8文字以上32文字以内である必要があります
- 文字コードはUTF-8を選択することで、日本語の保存も適切に行えます

### 6. アプリケーションのビルドと実行

#### 6.1 現在の状況と次のステップ

### 現在の状況
1. バックエンド
   - アプリケーションが正常に起動
   - データベース接続が成功
   - 本番環境モードで動作中
   - すべてのAPIルートが正しく登録済み

2. 環境設定
   - データベース接続情報が正しく設定
   - 環境変数が適切に読み込まれている
   - アプリケーションが8080ポートでリッスン中

### 次のステップ
1. フロントエンドのデプロイ
   - ビルドファイルの生成
   - サーバーへのアップロード
   - 静的ファイルの配置

2. リバースプロキシの設定
   - Apache/Nginxの設定
   - SSL証明書の設定
   - セキュリティ設定

#### 6.2 ローカルでのクロスコンパイル

ローカル環境（Mac）でバックエンドをクロスコンパイルします：

```bash
# 1. Dockerコンテナを停止（ローカル環境）
docker compose down

# 2. バックエンドディレクトリに移動
cd backend

# 3. FreeBSD用のバイナリをビルド（さくらサーバーはFreeBSD）
GOOS=freebsd GOARCH=amd64 go build -ldflags="-s -w" -o app cmd/main.go

# 4. ビルドしたバイナリをサーバーにアップロード
scp app masv@masv.sakura.ne.jp:~/oshiome/backend/
```

コマンドの説明：
- `GOOS=freebsd`: FreeBSD用のバイナリをビルド（さくらサーバーはFreeBSDを使用）
- `GOARCH=amd64`: 64ビットアーキテクチャ用にビルド
- `-ldflags="-s -w"`: デバッグ情報を削除してバイナリサイズを小さくする
- `scp`: ローカルからサーバーにファイルをコピー

注意点：
- さくらサーバーはFreeBSDを使用しているため、`GOOS=freebsd`でビルドする必要があります
- Linux用（`GOOS=linux`）のバイナリはFreeBSDでは実行できません
- クロスコンパイル時は、ローカル環境のOSと異なるバイナリを生成できます

#### 6.3 サーバー上でのアプリケーション実行

サーバーにSSH接続して、アプリケーションを実行します：

```bash
# 1. サーバーに接続
ssh masv@masv.sakura.ne.jp

# 2. アプリケーションディレクトリに移動
cd ~/oshiome/backend

# 3. 実行権限を付与
chmod +x app

# 4. アプリケーションをバックグラウンドで実行（FreeBSD zsh用の構文）
./app |& tee app.log &

# 5. ログを確認
tail -f app.log
```

コマンドの説明：
- `chmod +x`: ファイルに実行権限を付与
- `|& tee app.log`: 標準出力とエラー出力をログファイルに出力しつつ、画面にも表示
- `&`: バックグラウンドで実行
- `tail -f`: ログファイルをリアルタイムで表示

注意点：
- FreeBSDのzshでは`2>&1`の構文が異なるため、`|&`を使用
- アプリケーションの実行前に必ず`chmod +x`で実行権限を付与
- ログファイルは`app.log`に出力される

#### 6.4 本番環境の設定

アプリケーションを本番環境用に設定します：

1. 環境変数の設定
```bash
# 本番環境用の環境変数を設定
export GIN_MODE=release
export SERVER_PORT=8080
```

2. アプリケーションの再起動
```bash
# 既存のプロセスを停止
pkill app

# 本番環境用に再起動
cd ~/oshiome/backend
./app |& tee app.log &
```

3. 動作確認
```bash
# ログの確認
tail -f app.log

# プロセスの確認
ps aux | grep app
```

## フロントエンドのデプロイ

### 1. フロントエンドのビルド

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存パッケージのインストール
npm install

# 本番用ビルド
npm run build
```

### 2. ビルドファイルのアップロード

```bash
# ビルドファイルをサーバーにアップロード
scp -r dist/* masv@masv.sakura.ne.jp:~/www/public_html/
```

### 3. サーバーでの設定

```bash
# サーバーに接続
ssh masv@masv.sakura.ne.jp

# 既存のファイルをバックアップ
cd ~/www
mv public_html public_html_backup

# 新しいディレクトリを作成
mkdir public_html

# アップロードしたファイルを移動
mv ~/dist/* public_html/
```

### 4. 動作確認

ブラウザで以下のURLにアクセスして確認：
```
http://masv.sakura.ne.jp
```

注意点：
- ビルド前に`.env.production`ファイルが正しく設定されていることを確認
- アップロード前に既存のファイルをバックアップ
- ファイルのパーミッションが適切に設定されていることを確認

## 動作確認

### 1. バックエンドの確認

```bash
# ログの確認
tail -f ~/oshiome/backend/app.log

# アプリケーションの状態確認
ps aux | grep app
```

### 2. フロントエンドの確認

ブラウザで以下のURLにアクセス：
```
http://masv.sakura.ne.jp
```

## トラブルシューティング

### よくある問題と解決方法

1. バイナリの実行エラー
```bash
# エラーメッセージ: "ELF binary type "0" not known. ./app: Exec format error."
# 原因: 異なるOS用のバイナリを実行しようとしている
# 解決方法: 正しいOS用のバイナリをビルド
GOOS=freebsd GOARCH=amd64 go build -ldflags="-s -w" -o app cmd/main.go
```

2. 出力リダイレクトエラー
```bash
# エラーメッセージ: "Ambiguous output redirect."
# 原因: FreeBSDのzshでの出力リダイレクト構文が異なる
# 解決方法: 以下の構文を使用
./app |& tee app.log &
```

3. アプリケーションが起動しない
```bash
# ログの確認
tail -f ~/oshiome/backend/app.log

# プロセスの確認と再起動
ps aux | grep app
kill [プロセスID]
cd ~/oshiome/backend
./app |& tee app.log &
```

4. データベース接続エラー
```bash
# エラーメッセージ: "failed to initialize database, got error dial tcp [::1]:3306: connect: connection refused"
# 原因: データベースの接続情報が正しくない
# 解決方法: 
# 1. .envファイルのDB_HOSTを確認（mysql80.masv.sakura.ne.jp）
# 2. データベースのパスワードが正しいか確認
# 3. MySQLへの接続テスト
mysql -u masv_oshiome -h mysql80.masv.sakura.ne.jp -P 3306 -p
```

### ログの確認方法

```bash
# バックエンドログ
tail -f ~/oshiome/backend/app.log

# エラーログ
tail -f ~/www/logs/error.log

# アクセスログ
tail -f ~/www/logs/access.log
```

### サーバーコントロールパネルでの設定

1. データベースの作成
   - サーバーコントロールパネル（https://secure.sakura.ad.jp/rs/cp/）にログイン
   - 「データベース」→「データベースの作成」
   - データベース名、ユーザー名、パスワードを設定

2. SSL証明書の設定
   - 「SSL」→「SSL証明書の設定」
   - 無料SSL証明書を有効化

3. ドメイン設定
   - 「ドメイン」→「ドメイン設定」
   - 必要に応じてサブドメインの追加 

## リバースプロキシとSSLの設定

### 1. 現在の設定状況

#### Apache設定（oshiome.conf）
```apache
# 場所: ~/.apache2/conf.d/oshiome.conf
<VirtualHost *:80>
    ServerName masv.sakura.ne.jp
    DocumentRoot /home/masv/www/public_html

    # バックエンドAPIへのプロキシ設定
    ProxyPass /api http://localhost:8080/api
    ProxyPassReverse /api http://localhost:8080/api

    # エラーログの設定
    ErrorLog /home/masv/www/logs/error.log
    CustomLog /home/masv/www/logs/access.log combined

    <Directory /home/masv/www/public_html>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### .htaccess設定
```apache
# 場所: ~/www/public_html/.htaccess
# HTTPSへのリダイレクト
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# セキュリティヘッダー
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000"
</IfModule>
```

### 2. 設定の確認方法

1. リバースプロキシの動作確認
```bash
# バックエンドのヘルスチェック
curl -I http://masv.sakura.ne.jp/api/health
```

2. SSL/HTTPSリダイレクトの確認
```bash
# HTTPからHTTPSへのリダイレクト確認
curl -I http://masv.sakura.ne.jp

# HTTPSでの直接アクセス確認
curl -I https://masv.sakura.ne.jp
```

3. セキュリティヘッダーの確認
```bash
# HSTSヘッダーの確認
curl -I https://masv.sakura.ne.jp | grep -i strict
```

### 3. トラブルシューティング

1. 設定ファイルの確認
```bash
# Apache設定の確認
cat ~/.apache2/conf.d/oshiome.conf

# .htaccess設定の確認
cat ~/www/public_html/.htaccess
```

2. ログの確認
```bash
# エラーログ
tail -f ~/www/logs/error.log

# アクセスログ
tail -f ~/www/logs/access.log
```

3. よくある問題と解決方法

- 500エラーが発生する場合
  - エラーログを確認
  - 設定ファイルの構文を確認
  - ファイルのパーミッションを確認（.htaccessは644）

- リダイレクトループが発生する場合
  - .htaccessの設定を一時的に無効化（ファイル名を変更）
  - Apache設定とhtaccessの設定の重複を確認
  - SSL設定の競合がないか確認

- SSLエラーが発生する場合
  - サーバーコントロールパネルでSSLが有効になっているか確認
  - 証明書の発行状態を確認
  - DNSの設定を確認

### 4. 次のステップ

1. フロントエンドの動作確認
   - ブラウザでhttps://masv.sakura.ne.jpにアクセス
   - HTTPSリダイレクトの確認
   - APIとの通信確認

2. バックエンドの動作確認
   - APIエンドポイントの疎通確認
   - ログの監視
   - エラーの有無の確認

## SSL証明書の設定

### 1. 無料SSLの有効化

1. サーバーコントロールパネルにアクセス
   - https://secure.sakura.ad.jp/rs/cp/ にログイン
   - 「SSL」→「無料SSLの設定」を選択
   - 「無料SSL証明書を有効にする」をクリック

2. 設定の反映を待つ
   - 証明書の発行には5〜10分程度かかります
   - 発行完了後、メールで通知されます

### 2. .htaccessの更新

既存の`.htaccess`ファイルに以下の設定を追加します：

```apache
# HTTPSへのリダイレクト
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# HTTPSヘッダーの設定
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000"
</IfModule>
```

注意点：
- 既存の設定は残したまま、上記の設定を追加してください
- リダイレクトの設定は、必ず他の設定の前に追加してください
- ファイルの文字コードはUTF-8を使用してください

### 3. 動作確認

1. HTTPSでのアクセス確認
```
https://masv.sakura.ne.jp
```

2. HTTPからのリダイレクト確認
```
http://masv.sakura.ne.jp
```

3. SSL証明書の確認
   - ブラウザで鍵マークをクリック
   - 証明書の詳細を確認

### トラブルシューティング

1. SSLが機能しない場合
   - サーバーコントロールパネルでSSLが有効になっているか確認
   - .htaccessの構文が正しいか確認
   - エラーログを確認

2. リダイレクトループが発生する場合
   - .htaccessの設定を一時的に無効化（ファイル名を変更）
   - 他のリダイレクト設定との競合がないか確認

3. 証明書エラーが発生する場合
   - 証明書の発行が完了しているか確認
   - DNSの設定が正しいか確認
   - 反映まで十分な時間が経過しているか確認 