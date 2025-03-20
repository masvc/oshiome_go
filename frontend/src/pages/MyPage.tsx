import { useState } from 'react';

// モックデータ用の型定義
type AvatarStyle = 'ADVENTURER' | 'PIXEL_ART' | 'IDENTICON';

const AVATAR_STYLES = {
  ADVENTURER: 'ADVENTURER',
  PIXEL_ART: 'PIXEL_ART',
  IDENTICON: 'IDENTICON'
} as const;

const AVATAR_STYLE_INFO = {
  ADVENTURER: {
    label: 'アドベンチャー',
    category: 'イラスト'
  },
  PIXEL_ART: {
    label: 'ピクセルアート',
    category: 'イラスト'
  },
  IDENTICON: {
    label: 'アイデンティコン',
    category: 'パターン'
  }
};

export const MyPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    nickname: 'ユーザー1',
    email: 'user1@example.com',
    bio: 'よろしくお願いします！',
    profile_image_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=user1'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>('ADVENTURER');

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // モック: プロフィール更新の成功をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error: any) {
      setError('プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setError(null);

      // モック: パスワード更新の成功をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewPassword('');
      setShowPasswordChange(false);
    } catch (error: any) {
      setError('パスワードの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarStyleChange = (style: AvatarStyle) => {
    setSelectedAvatarStyle(style);
    // モック: 新しいアバターURLを生成
    const newAvatarUrl = `https://api.dicebear.com/7.x/${style.toLowerCase()}/svg?seed=user1`;
    setEditedProfile({ ...editedProfile, profile_image_url: newAvatarUrl });
  };

  const avatarStyles = Object.entries(AVATAR_STYLE_INFO).map(([value, info]) => ({
    value: value as AvatarStyle,
    ...info
  }));

  // カテゴリーごとにアバターをグループ化
  const groupedAvatarStyles = avatarStyles.reduce((acc, style) => {
    const category = style.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(style);
    return acc;
  }, {} as Record<string, typeof avatarStyles>);

  if (loading && !profile) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">マイページ</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="text-center space-y-4">
            <img
              src={editedProfile?.profile_image_url || profile?.profile_image_url}
              alt="プロフィール画像"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-oshi-pink-200"
            />
            {isEditing && (
              <div className="max-w-sm mx-auto space-y-2">
                <select
                  value={selectedAvatarStyle}
                  onChange={(e) => handleAvatarStyleChange(e.target.value as AvatarStyle)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  {Object.entries(groupedAvatarStyles).map(([category, styles]) => (
                    <optgroup key={category} label={category}>
                      {styles.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">ニックネーム</h2>
              <p className="mt-1">{profile?.nickname}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">メールアドレス</h2>
              <p className="mt-1">{profile?.email}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">自己紹介</h2>
              <p className="mt-1">{profile?.bio || '未設定'}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
              >
                プロフィールを編集
              </button>
              <button
                onClick={() => setShowPasswordChange(true)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                パスワードを変更
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ニックネーム
              </label>
              <input
                type="text"
                value={editedProfile.nickname || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                value={editedProfile.email || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                value={editedProfile.bio || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                {loading ? '更新中...' : '更新する'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        {showPasswordChange && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">パスワード変更</h2>
            <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {loading ? '更新中...' : 'パスワードを更新'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setNewPassword('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}; 