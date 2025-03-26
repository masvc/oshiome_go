import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { userService } from '../api/services/userService';
import { User } from '../types';
import { APIErrorResponse } from '../types/error';

// モックデータ用の型定義
type AvatarStyle = 'ADVENTURER' | 'THUMBS' | 'MINIAVS' | 'LORELEI' | 'MICAH' | 'INITIALS' | 'RINGS' | 'PIXEL_ART';

const AVATAR_STYLES = {
  ADVENTURER: 'ADVENTURER',
  THUMBS: 'THUMBS',
  MINIAVS: 'MINIAVS',
  LORELEI: 'LORELEI',
  MICAH: 'MICAH',
  INITIALS: 'INITIALS',
  RINGS: 'RINGS',
  PIXEL_ART: 'PIXEL_ART'
} as const;

const AVATAR_STYLE_INFO = {
  ADVENTURER: {
    label: 'アドベンチャー'
  },
  THUMBS: {
    label: 'サムネイル'
  },
  MINIAVS: {
    label: 'ミニアバター'
  },
  LORELEI: {
    label: 'ロレライ'
  },
  MICAH: {
    label: 'ミカ'
  },
  INITIALS: {
    label: 'イニシャル'
  },
  RINGS: {
    label: 'リング'
  },
  PIXEL_ART: {
    label: 'ピクセル'
  }
};

export const MyPage = () => {
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>('ADVENTURER');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await userService.getUser(currentUser.id);
        if (response.data) {
          setProfile(response.data);
          setEditedProfile(response.data);
        }
      } catch (error) {
        if (error instanceof APIErrorResponse) {
          setError('プロフィール情報の取得に失敗しました: ' + error.message);
        } else {
          setError('プロフィール情報の取得に失敗しました');
        }
        console.error('プロフィール取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser?.id]);

  const handleProfileUpdate = async () => {
    if (!currentUser?.id || !editedProfile) {
      setError('ユーザー情報が見つかりません。再度ログインしてください。');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (!editedProfile.name?.trim()) {
        setError('ニックネームを入力してください。');
        return;
      }

      const response = await userService.updateUser(currentUser.id, {
        name: editedProfile.name.trim(),
        bio: editedProfile.bio?.trim() || '',
        profile_image_url: editedProfile.profile_image_url,
      });

      if (response.data) {
        setProfile(response.data);
        setIsEditing(false);
      } else {
        setError('プロフィールの更新に失敗しました。データが正しく返されませんでした。');
      }
    } catch (error) {
      if (error instanceof APIErrorResponse) {
        setError(`プロフィールの更新に失敗しました: ${error.message}`);
      } else {
        setError('予期せぬエラーが発生しました。時間をおいて再度お試しください。');
      }
      console.error('プロフィール更新エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser?.id) {
      setError('ユーザー情報が見つかりません。再度ログインしてください。');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!currentPassword || !newPassword) {
        setError('現在のパスワードと新しいパスワードを入力してください。');
        return;
      }

      if (newPassword.length < 8) {
        setError('新しいパスワードは8文字以上で入力してください。');
        return;
      }

      await userService.updatePassword(currentUser.id, currentPassword, newPassword);
      setNewPassword('');
      setCurrentPassword('');
      setShowPasswordChange(false);
    } catch (error) {
      if (error instanceof APIErrorResponse) {
        if (error.message.includes('current password')) {
          setError('現在のパスワードが正しくありません。');
        } else {
          setError(`パスワードの更新に失敗しました: ${error.message}`);
        }
      } else {
        setError('予期せぬエラーが発生しました。時間をおいて再度お試しください。');
      }
      console.error('パスワード更新エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarStyleChange = (style: AvatarStyle) => {
    setSelectedAvatarStyle(style);
    if (editedProfile) {
      // スタイル名をDicebearのAPI用に変換
      const styleMap: Record<AvatarStyle, string> = {
        ADVENTURER: 'adventurer',
        THUMBS: 'thumbs',
        MINIAVS: 'miniavs',
        LORELEI: 'lorelei',
        MICAH: 'micah',
        INITIALS: 'initials',
        RINGS: 'rings',
        PIXEL_ART: 'pixel-art'
      };
      const newAvatarUrl = `https://api.dicebear.com/7.x/${styleMap[style]}/svg?seed=${currentUser?.email}`;
      setEditedProfile({ ...editedProfile, profile_image_url: newAvatarUrl });
    }
  };

  const avatarStyles = Object.entries(AVATAR_STYLE_INFO).map(([value, info]) => ({
    value: value as AvatarStyle,
    ...info
  }));

  if (loading && !profile) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  if (!profile) {
    return <div className="text-center p-4">プロフィールが見つかりません</div>;
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
                  {avatarStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
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
              <p className="mt-1">{profile?.name}</p>
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
                value={editedProfile?.name || ''}
                onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                value={editedProfile?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                value={editedProfile?.bio || ''}
                onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, bio: e.target.value })}
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
                  現在のパスワード
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
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
                  disabled={loading || !currentPassword || !newPassword}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  {loading ? '更新中...' : 'パスワードを更新'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword('');
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