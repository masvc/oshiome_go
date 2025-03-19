import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';

export const profileRepository = {
  // プロフィール全件取得
  async findAll(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ユーザー名であいまい検索
  async searchByName(name: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('name', `%${name}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ロールで条件検索
  async findByRole(role: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // ロールの更新
  async updateRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
  },

  // プロフィールの削除
  async deleteProfile(userId: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) throw error;
  },
};

export const getProfile = async (userId: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return user;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

export const updateProfileImage = async (userId: string, url: string) => {
  const { error } = await supabase
    .from('users')
    .update({ profile_image_url: url })
    .eq('id', userId);

  if (error) throw error;
};

export const deleteProfile = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};

export default profileRepository;
