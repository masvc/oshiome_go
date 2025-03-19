-- データベースのスキーマ定義
-- テーブル、関数、トリガー、権限の設定

-- 必要な拡張機能の追加
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- テキスト検索用
CREATE EXTENSION IF NOT EXISTS pgjwt;    -- JWT処理用
CREATE EXTENSION IF NOT EXISTS "pg_cron"; -- スケジューラ用

--------------------------------------------------
-- テーブル定義
--------------------------------------------------

-- ユーザーテーブル（最初に作成）
CREATE TABLE users (
    id UUID PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトテーブル
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    target_amount INTEGER NOT NULL CHECK (target_amount >= 10000),
    current_amount INTEGER NOT NULL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(id),
    idol_name VARCHAR(255) NOT NULL,
    office_status VARCHAR(20) NOT NULL CHECK (office_status IN ('approved', 'pending')) DEFAULT 'pending',
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'active', 'ended', 'cancelled')) DEFAULT 'draft',
    project_hashtag VARCHAR(255),
    support_hashtag VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (end_date > start_date)
);

-- ユーザーのSNSリンクテーブル
CREATE TABLE user_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    platform VARCHAR(20) NOT NULL CHECK (platform = 'twitter'),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトいいねテーブル
CREATE TABLE project_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);

-- プロジェクト支援テーブル
CREATE TABLE project_supports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    project_id UUID NOT NULL REFERENCES projects(id),
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクト画像テーブル
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) NOT NULL CHECK (image_type IN ('thumbnail', 'gallery')),
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, display_order)
);

-- プロジェクトカテゴリーテーブル
CREATE TABLE project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトとカテゴリーの中間テーブル
CREATE TABLE project_category_relations (
    project_id UUID NOT NULL REFERENCES projects(id),
    category_id UUID NOT NULL REFERENCES project_categories(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, category_id)
);

-- プロジェクトスケジュールテーブル
CREATE TABLE project_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクト更新情報テーブル
CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    update_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- インデックスの作成
--------------------------------------------------
CREATE INDEX idx_projects_creator_id ON projects(creator_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_supports_user_id ON project_supports(user_id);
CREATE INDEX idx_project_supports_project_id ON project_supports(project_id);
CREATE INDEX idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_category_relations_project_id ON project_category_relations(project_id);
CREATE INDEX idx_project_category_relations_category_id ON project_category_relations(category_id);

--------------------------------------------------
-- ストレージ設定
--------------------------------------------------
-- ストレージバケットの作成
INSERT INTO storage.buckets (id, name)
VALUES ('project-images', 'project-images')
ON CONFLICT (id) DO NOTHING;

-- 既存のストレージポリシーを削除
DROP POLICY IF EXISTS "プロジェクト画像の表示を全員に許可" ON storage.objects;
DROP POLICY IF EXISTS "認証済みユーザーのプロジェクト画像アップロードを許可" ON storage.objects;
DROP POLICY IF EXISTS "プロジェクト作成者の画像削除を許可" ON storage.objects;

-- ストレージのポリシー
CREATE POLICY "プロジェクト画像の表示を全員に許可" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'project-images');

CREATE POLICY "認証済みユーザーのプロジェクト画像アップロードを許可" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'project-images'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "プロジェクト作成者の画像削除を許可" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'project-images'
        AND auth.role() = 'authenticated'
    );

--------------------------------------------------
-- 認証・ユーザー同期
--------------------------------------------------
-- ユーザー同期トリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, nickname, email, profile_image_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザー登録トリガーの作成
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

--------------------------------------------------
-- RLSの設定
--------------------------------------------------
-- RLSの有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_supports ENABLE ROW LEVEL SECURITY;

-- ユーザーテーブルのポリシー
CREATE POLICY "ユーザーは自分のデータのみアクセス可能" ON public.users
    FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "新規ユーザー登録を許可" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- プロジェクトテーブルのポリシー
CREATE POLICY "プロジェクトの表示を全員に許可" ON public.projects
    FOR SELECT
    USING (true);

CREATE POLICY "認証済みユーザーのプロジェクト作成を許可" ON public.projects
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "作成者のプロジェクト編集を許可" ON public.projects
    FOR UPDATE
    USING (auth.uid() = creator_id);

--------------------------------------------------
-- 権限の設定
--------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ストレージの権限設定
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO authenticated; 