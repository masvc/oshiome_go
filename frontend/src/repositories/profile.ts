import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  nickname: string;
  email: string;
  bio: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
};

// アバタースタイルの定義
export const AVATAR_STYLES = {
  // Modern & Minimal
  MICAH: 'micah',
  NOTIONISTS: 'notionists',
  LORELEI: 'lorelei',
  // Casual & Fun
  AVATAAARS: 'avataaars',
  OPEN_PEEPS: 'open-peeps',
  FUN_EMOJI: 'fun-emoji',
  // Fantasy & Game
  ADVENTURER: 'adventurer',
  PIXEL_ART: 'pixel-art',
  BOTTTS: 'bottts',
  SHAPES: 'shapes'
} as const;

// アバタースタイルの表示名
export const AVATAR_STYLE_INFO = {
  // Modern & Minimal
  [AVATAR_STYLES.MICAH]: {
    label: 'Minimalist',
    category: 'Modern & Minimal'
  },
  [AVATAR_STYLES.NOTIONISTS]: {
    label: 'Professional',
    category: 'Modern & Minimal'
  },
  [AVATAR_STYLES.LORELEI]: {
    label: 'Stylish',
    category: 'Modern & Minimal'
  },
  // Casual & Fun
  [AVATAR_STYLES.AVATAAARS]: {
    label: 'Casual',
    category: 'Casual & Fun'
  },
  [AVATAR_STYLES.OPEN_PEEPS]: {
    label: 'Artistic',
    category: 'Casual & Fun'
  },
  [AVATAR_STYLES.FUN_EMOJI]: {
    label: 'Emoji',
    category: 'Casual & Fun'
  },
  // Fantasy & Game
  [AVATAR_STYLES.ADVENTURER]: {
    label: 'Adventurer',
    category: 'Fantasy & Game'
  },
  [AVATAR_STYLES.PIXEL_ART]: {
    label: 'Pixel Art',
    category: 'Fantasy & Game'
  },
  [AVATAR_STYLES.BOTTTS]: {
    label: 'Robot',
    category: 'Fantasy & Game'
  },
  [AVATAR_STYLES.SHAPES]: {
    label: 'Abstract',
    category: 'Fantasy & Game'
  }
} as const;

export type AvatarStyle = typeof AVATAR_STYLES[keyof typeof AVATAR_STYLES];

export const profileRepository = {
  // デフォルトアバターURLの生成
  getDefaultAvatarUrl(seed: string, style: AvatarStyle = AVATAR_STYLES.ADVENTURER): string {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  },

  // プロフィール取得
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // データが見つからない場合は null を返す
        return null;
      }
      throw error;
    }
    
    // プロフィール画像がない場合はデフォルトアバターを使用
    if (data && !data.profile_image_url) {
      data.profile_image_url = this.getDefaultAvatarUrl(userId);
    }
    
    return data;
  },

  // プロフィール更新
  async updateProfile(userId: string, profile: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  },

  // メールアドレス更新
  async updateEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      email: email,
    });

    if (error) throw error;
  },

  // パスワード更新
  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;
  },

  // プロフィール画像のアップロード
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    // プロフィールのimage_urlを更新
    await this.updateProfile(userId, {
      profile_image_url: publicUrl,
    });

    return publicUrl;
  },
}; 