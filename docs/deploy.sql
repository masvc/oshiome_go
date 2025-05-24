-- まずテーブルをクリア
TRUNCATE TABLE supports CASCADE;
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE users CASCADE;

-- シーケンスをリセット
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE supports_id_seq RESTART WITH 1;

-- 1. まずユーザーを登録
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

INSERT INTO users (id, email, password, name, bio, profile_image_url, created_at, updated_at) VALUES
-- かなみちゃんのファン
(nextval('users_id_seq'), 'sato.taro@example.com', '$2a$10$XFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '佐藤 太郎', '音楽が趣味で、かなみさんの歌声に癒されています。', 'https://api.dicebear.com/7.x/adventurer/svg?seed=kanami1', NOW(), NOW()),
(nextval('users_id_seq'), 'suzuki.hiroshi@example.com', '$2a$10$XFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '鈴木 寛', '地元でカフェを経営しています。かなみさんの明るい笑顔が大好きです。', 'https://api.dicebear.com/7.x/thumbs/svg?seed=kanami2', NOW(), NOW()),
(nextval('users_id_seq'), 'tanaka.yumi@example.com', '$2a$10$XFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '田中 由美', '大学で音楽を専攻しています。かなみさんの歌声に憧れています。', 'https://api.dicebear.com/7.x/miniavs/svg?seed=kanami3', NOW(), NOW()),

-- はるかちゃんのファン
(nextval('users_id_seq'), 'yamamoto.akira@example.com', '$2a$10$YFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '山本 晃', 'IT企業で働く会社員です。はるかさんの歌声に元気をもらっています。', 'https://api.dicebear.com/7.x/lorelei/svg?seed=haruka1', NOW(), NOW()),
(nextval('users_id_seq'), 'watanabe.ayaka@example.com', '$2a$10$YFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '渡辺 彩香', '看護師をしています。はるかさんの優しい歌声に癒されています。', 'https://api.dicebear.com/7.x/micah/svg?seed=haruka2', NOW(), NOW()),
(nextval('users_id_seq'), 'ito.takashi@example.com', '$2a$10$YFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '伊藤 隆', '高校の音楽教師です。はるかさんの音楽性に共感しています。', 'https://api.dicebear.com/7.x/initials/svg?seed=haruka3', NOW(), NOW()),

-- ひよりちゃんのファン
(nextval('users_id_seq'), 'nakamura.rika@example.com', '$2a$10$ZFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '中村 里香', 'ダンススクールのインストラクターです。ひよりさんのダンスに刺激を受けています。', 'https://api.dicebear.com/7.x/rings/svg?seed=hiyori1', NOW(), NOW()),
(nextval('users_id_seq'), 'kobayashi.yuuki@example.com', '$2a$10$ZFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '小林 悠希', '大学生です。ひよりさんの明るいキャラクターが大好きです。', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=hiyori2', NOW(), NOW()),
(nextval('users_id_seq'), 'yoshida.megumi@example.com', '$2a$10$ZFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '吉田 恵', 'ファッションデザイナーをしています。ひよりさんのスタイルがお手本です。', 'https://api.dicebear.com/7.x/adventurer/svg?seed=hiyori3', NOW(), NOW()),

-- あきちゃんのファン
(nextval('users_id_seq'), 'takahashi.naoto@example.com', '$2a$10$AFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '高橋 直人', '会社員です。あきさんのパフォーマンスに感動しました。', 'https://api.dicebear.com/7.x/thumbs/svg?seed=aki1', NOW(), NOW()),
(nextval('users_id_seq'), 'suzuki.maiko@example.com', '$2a$10$AFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '鈴木 舞子', 'ダンサーを目指しています。あきさんが目標です。', 'https://api.dicebear.com/7.x/miniavs/svg?seed=aki2', NOW(), NOW()),
(nextval('users_id_seq'), 'sato.haruka@example.com', '$2a$10$AFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '佐藤 はるか', '音楽大学の学生です。あきさんの歌声に憧れています。', 'https://api.dicebear.com/7.x/lorelei/svg?seed=aki3', NOW(), NOW()),

-- ひとかちゃんのファン
(nextval('users_id_seq'), 'watanabe.ryo@example.com', '$2a$10$BFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '渡辺 涼', '会社員です。ひとかさんの明るいキャラクターが大好きです。', 'https://api.dicebear.com/7.x/micah/svg?seed=hitoka1', NOW(), NOW()),
(nextval('users_id_seq'), 'ito.misaki@example.com', '$2a$10$BFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '伊藤 美咲', '高校生です。ひとかさんのファッションセンスがお手本です。', 'https://api.dicebear.com/7.x/initials/svg?seed=hitoka2', NOW(), NOW()),
(nextval('users_id_seq'), 'yamada.yuuta@example.com', '$2a$10$BFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '山田 悠太', '大学生です。ひとかさんのダンスに感動しました。', 'https://api.dicebear.com/7.x/rings/svg?seed=hitoka3', NOW(), NOW()),

-- じゅりあちゃんのファン
(nextval('users_id_seq'), 'tanaka.akira@example.com', '$2a$10$CFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '田中 晶', '会社員です。じゅりあさんの5年間の活躍に感動しています。', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=juria1', NOW(), NOW()),
(nextval('users_id_seq'), 'suzuki.yui@example.com', '$2a$10$CFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '鈴木 結衣', '大学生です。じゅりあさんの歌声が大好きです。', 'https://api.dicebear.com/7.x/adventurer/svg?seed=juria2', NOW(), NOW()),
(nextval('users_id_seq'), 'yamamoto.haruto@example.com', '$2a$10$CFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '山本 陽翔', '高校生です。じゅりあさんのダンスに憧れています。', 'https://api.dicebear.com/7.x/thumbs/svg?seed=juria3', NOW(), NOW()),

-- その他のファン（複数プロジェクトをサポートするユーザー）
(nextval('users_id_seq'), 'sato.yuuki@example.com', '$2a$10$DFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '佐藤 優希', '音楽ライターをしています。新しい才能を応援するのが趣味です。', 'https://api.dicebear.com/7.x/miniavs/svg?seed=otaku1', NOW(), NOW()),
(nextval('users_id_seq'), 'suzuki.rika@example.com', '$2a$10$EFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '鈴木 里佳', 'カフェのオーナーです。地元のアーティストを応援しています。', 'https://api.dicebear.com/7.x/lorelei/svg?seed=idol1', NOW(), NOW()),
(nextval('users_id_seq'), 'takahashi.hiroshi@example.com', '$2a$10$GFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '高橋 宏', '会社員です。休日は音楽ライブに行くのが楽しみです。', 'https://api.dicebear.com/7.x/micah/svg?seed=king1', NOW(), NOW()),
(nextval('users_id_seq'), 'tanaka.misaki@example.com', '$2a$10$HFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '田中 美咲', '大学生です。新しいアーティストの発掘が趣味です。', 'https://api.dicebear.com/7.x/initials/svg?seed=otaku2', NOW(), NOW()),
(nextval('users_id_seq'), 'watanabe.takashi@example.com', '$2a$10$IFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '渡辺 貴志', '音楽プロデューサーを目指しています。才能あるアーティストを応援しています。', 'https://api.dicebear.com/7.x/rings/svg?seed=otaku3', NOW(), NOW()),
(nextval('users_id_seq'), 'suzuki.yuuki@example.com', '$2a$10$JFD9Z2UdkFvG1Bp5J5qV0e8V8JLWZ7X9XcX8JZ8YwZvLk9rJ8XKzK', '鈴木 悠希', 'デザイン会社で働いています。クリエイティブな活動を応援しています。', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=otaku4', NOW(), NOW());

-- 2. プロジェクト登録
CREATE SEQUENCE IF NOT EXISTS projects_id_seq;

INSERT INTO projects (id, title, description, target_amount, current_amount, deadline, user_id, status, thumbnail_url, office_approved, created_at, updated_at, deleted_at) VALUES 
(nextval('projects_id_seq'), '【祝】佐藤かなみ 22nd Birthday Project', '佐藤かなみさんの22歳の誕生日をお祝いするプロジェクトです！駅中広告とサプライズプレゼントを贈ります！', 110000, 0, '2025-07-10 23:59:59', (SELECT id FROM users WHERE email = 'sato.taro@example.com'), 'active', 'https://picsum.photos/seed/kanami/800/600', true, NOW(), NOW(), NULL),
(nextval('projects_id_seq'), '【生誕祭】高橋はるか 24th Anniversary', '高橋はるかさんの24歳の誕生日を盛大にお祝いするプロジェクトです！', 120000, 0, '2025-08-15 23:59:59', (SELECT id FROM users WHERE email = 'yamamoto.akira@example.com'), 'active', 'https://picsum.photos/seed/haruka/800/600', true, NOW(), NOW(), NULL),
(nextval('projects_id_seq'), '田中ひより バースデーサプライズ2025', '田中ひよりさんの23歳の誕生日を盛大にお祝いします！', 100000, 0, '2025-09-05 23:59:59', (SELECT id FROM users WHERE email = 'nakamura.rika@example.com'), 'active', 'https://picsum.photos/seed/hiyori/800/600', true, NOW(), NOW(), NULL),
(nextval('projects_id_seq'), '【祝】山本あき 25th Birthday Project', '山本あきさんの25歳の誕生日をお祝いするプロジェクトです！', 130000, 0, '2025-10-20 23:59:59', (SELECT id FROM users WHERE email = 'takahashi.naoto@example.com'), 'active', 'https://picsum.photos/seed/aki/800/600', true, NOW(), NOW(), NULL),
(nextval('projects_id_seq'), '中村ひとか 生誕祭2025 応援広告', '中村ひとかさんの22歳の誕生日をお祝いする応援広告を出稿します！', 110000, 0, '2025-11-15 23:59:59', (SELECT id FROM users WHERE email = 'watanabe.ryo@example.com'), 'active', 'https://picsum.photos/seed/hitoka/800/600', true, NOW(), NOW(), NULL),
(nextval('projects_id_seq'), '【祝デビュー5周年】鈴木じゅりあ 生誕祭2025', '鈴木じゅりあさんの24歳の誕生日＆デビュー5周年を記念した特別プロジェクト！', 150000, 0, '2025-12-10 23:59:59', (SELECT id FROM users WHERE email = 'tanaka.akira@example.com'), 'active', 'https://picsum.photos/seed/juria/800/600', true, NOW(), NOW(), NULL);


-- 3. サポート登録
CREATE SEQUENCE IF NOT EXISTS supports_id_seq;

INSERT INTO supports (id, user_id, project_id, amount, message, status, payment_intent_id, checkout_session_id, created_at, updated_at) VALUES 
-- かなみちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.hiroshi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 10000, '佐藤さん、22歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'yoshida.megumi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 15000, 'これからも素敵な歌声を楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.takashi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 20000, '22歳の1年が素晴らしいものになりますように。', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 12000, '地元から応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.misaki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 3000, '誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.ryo@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 20000, 'これからも応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%佐藤かなみ%'),
 41000, '素敵な1年になりますように！', 'completed', NULL, NULL, NOW(), NOW()),

-- はるかちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.yumi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 15000, '高橋さん、24歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.ayaka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 18000, '素敵な1年になりますように。', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.rika@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 20000, 'これからも素晴らしい歌声を楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.haruka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 12000, '応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'takahashi.hiroshi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 25000, '24歳も元気いっぱいで！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.takashi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%高橋はるか%'),
 90000, '今後のご活躍を心から応援しています！', 'completed', NULL, NULL, NOW(), NOW()),

-- ひよりちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.yumi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%田中ひより%'),
 10000, '田中さん、23歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'kobayashi.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%田中ひより%'),
 12000, '素敵な1年になりますように。', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.yui@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%田中ひより%'),
 15000, 'これからも楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.haruka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%田中ひより%'),
 8000, '応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.misaki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%田中ひより%'),
 45000, '23歳の1年が素晴らしいものになりますように！', 'completed', NULL, NULL, NOW(), NOW()),

-- あきちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.maiko@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 20000, '山本さん、25歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'kobayashi.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 18000, '素敵な1年になりますように。', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.rika@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 15000, 'これからも素晴らしいパフォーマンスを楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 12000, '応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'takahashi.hiroshi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 16000, '25歳の1年が素晴らしいものになりますように！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.takashi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 40000, 'これからも応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%山本あき%'),
 30000, '素晴らしい1年になりますように！', 'completed', NULL, NULL, NOW(), NOW()),

-- ひとかちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.ayaka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 15000, '中村さん、22歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'kobayashi.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 18000, '素敵な1年になりますように。', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.haruka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 20000, 'これからも素晴らしい活躍を楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 15000, '応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.misaki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 30000, '22歳の1年が素晴らしいものになりますように！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.takashi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%中村ひとか%'),
 100000, '今後のご活躍を心から応援しています！', 'completed', NULL, NULL, NOW(), NOW()),

-- じゅりあちゃんのプロジェクト
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.yui@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 25000, '鈴木さん、24歳の誕生日おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.rika@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 20000, 'デビュー5周年、おめでとうございます！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'watanabe.takashi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 15000, 'これからも素晴らしい活躍を楽しみにしています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'sato.haruka@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 10000, '応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'takahashi.hiroshi@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 30000, '5年間のご活躍、素晴らしかったです！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'tanaka.misaki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 40000, 'これからも応援しています！', 'completed', NULL, NULL, NOW(), NOW()),
(nextval('supports_id_seq'), 
 (SELECT id FROM users WHERE email = 'suzuki.yuuki@example.com'),
 (SELECT id FROM projects WHERE title LIKE '%鈴木じゅりあ%'),
 30000, '24歳の1年が素晴らしいものになりますように！', 'completed', NULL, NULL, NOW(), NOW());

-- 4. 現在金額の更新
UPDATE projects p
SET current_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM supports s
    WHERE s.project_id = p.id
);