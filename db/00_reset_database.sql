-- データベースのリセットと再構築
-- 注意: auth.usersテーブルは残します

-- 既存のポリシーを削除
DROP POLICY IF EXISTS users_policy ON users;
DROP POLICY IF EXISTS projects_policy ON projects;
DROP POLICY IF EXISTS project_likes_policy ON project_likes;
DROP POLICY IF EXISTS project_supports_policy ON project_supports;
DROP POLICY IF EXISTS project_images_policy ON project_images;
DROP POLICY IF EXISTS user_social_links_policy ON user_social_links;

-- 既存のトリガーを削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 既存のテーブルを削除（依存関係の順序を考慮）
DROP TABLE IF EXISTS project_category_relations;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS project_updates;
DROP TABLE IF EXISTS project_schedules;
DROP TABLE IF EXISTS project_images;
DROP TABLE IF EXISTS project_supports;
DROP TABLE IF EXISTS project_likes;
DROP TABLE IF EXISTS project_stats_cache;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_social_links;
DROP TABLE IF EXISTS users;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.check_project_dates();

-- ストレージバケットを削除
DROP POLICY IF EXISTS project_images_policy ON storage.objects;
DROP POLICY IF EXISTS authenticated_only ON storage.objects;
DROP POLICY IF EXISTS project_images_select ON storage.objects;

-- 拡張機能のリセット（必要な場合）
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pg_trgm";
DROP EXTENSION IF EXISTS "pgjwt";
DROP EXTENSION IF EXISTS "pg_cron";

-- ビューを削除
DROP VIEW IF EXISTS public.project_details CASCADE;
DROP VIEW IF EXISTS public.user_details CASCADE;

-- 関数を削除
DROP FUNCTION IF EXISTS public.update_project_status() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_project_stats() CASCADE;
DROP FUNCTION IF EXISTS public.update_project_stats_cache() CASCADE;
DROP FUNCTION IF EXISTS public.update_project_thumbnail(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.search_projects(text) CASCADE;
DROP FUNCTION IF EXISTS public.search_projects(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.search_projects(text, text, uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_projects(text, integer, integer) CASCADE;

-- シーケンスのリセット
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS projects_id_seq RESTART WITH 1;
