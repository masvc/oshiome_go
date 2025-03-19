-- テストデータの投入

-- テストユーザーの作成（必要な場合）
INSERT INTO users (id, nickname, email, bio, profile_image_url)
VALUES (
    'a8479b65-b2fe-41bb-a5d6-2c60b81bb4fb',
    'テストユーザー',
    'test@example.com',
    'これはテストユーザーのプロフィールです。',
    'https://example.com/avatar.jpg'
)
ON CONFLICT (id) DO NOTHING;

-- ダミープロジェクトの作成
INSERT INTO projects (
    title,
    description,
    thumbnail_url,
    target_amount,
    current_amount,
    start_date,
    end_date,
    creator_id,
    idol_name,
    office_status,
    status,
    project_hashtag,
    support_hashtag
) VALUES (
    'テスト生誕祭プロジェクト',
    'これはテストの誕生日を祝う広告企画です。詳細な説明文がここに入ります。',
    'https://example.com/project-thumb.jpg',
    100000,
    0,
    CURRENT_TIMESTAMP + interval '1 month',
    CURRENT_TIMESTAMP + interval '2 months',
    'a8479b65-b2fe-41bb-a5d6-2c60b81bb4fb',
    'テストアイドル',
    'pending',
    'draft',
    'テスト生誕祭',
    'テストを応援'
);

-- プロジェクトIDを取得するための変数設定
DO $$
DECLARE
    project_id UUID;
BEGIN
    SELECT id INTO project_id FROM projects WHERE title = 'テスト生誕祭プロジェクト' LIMIT 1;

    -- プロジェクトスケジュールの追加
    INSERT INTO project_schedules (project_id, schedule_date, content)
    VALUES
        (project_id, CURRENT_TIMESTAMP + interval '1 month', '企画開始'),
        (project_id, CURRENT_TIMESTAMP + interval '1 month 15 days', '中間報告'),
        (project_id, CURRENT_TIMESTAMP + interval '2 months', '企画終了');

    -- プロジェクト更新情報の追加
    INSERT INTO project_updates (project_id, title, content, update_date)
    VALUES
        (project_id, '企画開始のお知らせ', '本日より企画を開始いたします。', CURRENT_TIMESTAMP + interval '1 month'),
        (project_id, '中間報告', '現在の進捗状況についてご報告いたします。', CURRENT_TIMESTAMP + interval '1 month 15 days');

    -- プロジェクトカテゴリーの追加
    INSERT INTO project_categories (id, name)
    VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '生誕祭')
    ON CONFLICT (name) DO NOTHING;

    -- プロジェクトとカテゴリーの紐付け
    INSERT INTO project_category_relations (project_id, category_id)
    VALUES (project_id, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
END $$; 