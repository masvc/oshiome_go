# Stripe統合メモ

## テストモード用カード番号

### 1. 正常な支払い用
```
カード番号: 4242 4242 4242 4242
有効期限: 任意の未来の日付
CVC: 任意の3桁
郵便番号: 任意の数字
```

### 2. 認証が必要な支払い用（3Dセキュア）
```
カード番号: 4000 0027 6000 3184
有効期限: 任意の未来の日付
CVC: 任意の3桁
郵便番号: 任意の数字
```

### 3. 支払い失敗用
```
カード番号: 4000 0000 0000 0002
有効期限: 任意の未来の日付
CVC: 任意の3桁
郵便番号: 任意の数字
```

## 環境変数設定

`.env`ファイルに以下の環境変数を設定：

```env
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_...  # フロントエンド用
STRIPE_SECRET_KEY=sk_test_...       # バックエンド用
STRIPE_WEBHOOK_SECRET=whsec_...     # Webhook用（stripe listenコマンドで取得可能）
```

## Webhook設定

### ローカル開発環境での設定
```bash
# Webhookをリッスン
stripe listen --forward-to localhost:8000/api/webhook

# Webhook Signing Secretが表示されます
# これを.envファイルのSTRIPE_WEBHOOK_SECRETに設定
```

### 監視すべき主要なイベント
- `payment_intent.succeeded`（支払い成功）
- `payment_intent.payment_failed`（支払い失敗）
- `payment_intent.processing`（支払い処理中）
- `charge.succeeded`（課金成功）
- `charge.failed`（課金失敗）
- `charge.refunded`（返金処理）

## 実装オプション

### 1. シンプルな決済フォーム
- 単発の支払い
- カード情報の保存なし
- 基本的な決済機能のみ

### 2. カスタム決済フォーム
- カード情報の保存機能
- 定期支払い対応
- 複数通貨対応
- UIの完全カスタマイズ可能

### 3. Stripeチェックアウト
- 最も簡単な実装
- Stripeがホストする決済ページ
- セキュリティ対策済み
- カスタマイズ性は限定的

## 注意事項
- テストモードと本番モードでは異なるAPIキーを使用
- 本番環境では実際のカード情報を使用
- Webhookのエンドポイントは公開されている必要あり
- APIキーは必ず環境変数として管理 