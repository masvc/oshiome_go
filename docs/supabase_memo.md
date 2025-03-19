# Supabase セットアップガイド

## 1. Supabase初期設定

### オーガニゼーション作成

1. **New organization**を選択
   - Name: 任意名
   - Type of organization: Personal
   - Plan: Free（無料プラン）

### プロジェクト作成

- Project name: 任意名
- Database Password: *別途共有*
- Region: Tokyo

### Authentication設定

1. DashboardのAuthenticationメニューを選択
2. Sign In/Upメニューから設定
3. Auth Providerの「Email」をEnabled設定
   > **Note**: 現在の設定
   > - Confirm email: OFF
   > - サインアップ後すぐに認証完了（auth.usersにレコード追加）
   > - 現状はEmail/password認証のみ（後でGoogle認証等も追加設定も可能）

### テーブル作成

```sql
-- filepath: /supabase/migrations/01_create_tables.sql
-- テーブル作成SQLを実行
```

### トリガー作成

- 目的：auth.usersレコード追加時にprofilesレコードを自動作成

```sql
-- filepath: /supabase/migrations/20240101000000_create_profile_trigger.sql
-- トリガー作成SQL
```

> **重要**: auth.usersは認証用テーブル。業務ロジック用のユーザー情報は
> publicスキーマ（profiles）で管理推奨

## 2. プロジェクト設定

### Supabaseクライアントのインストール

```bash
npm install @supabase/supabase-js
```

### 環境変数の設定

`.env`ファイルにSupabase URLとAPIキーを設定

```env
VITE_SUPABASE_URL="your-url"
VITE_SUPABASE_ANON_KEY="your-key"
```

### Supabaseクライアント設定

```typescript
// filepath: /frontend/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
// ...クライアント設定
```

## 3. アプリケーション実装

### リポジトリ層の実装

- 場所: `frontend/src/repositories/`
- 目的: テーブルごとのCRUD操作を管理

### セッション管理

```typescript
// filepath: /frontend/src/SessionProvider.tsx
// ログイン情報をuseContextで管理
```

#### 認証制御例

```typescript
// filepath: /frontend/src/pages/Signin.tsx
// ログイン済みの場合はHomeへリダイレクト
// 現状は動作確認のためにコメントアウトにしてると思います。
const [currentUser, setCurrentUser] = useContext(SessionContext);

if (currentUser != null) return <Navigate replace to={"/"} />;
```
