import { supabase } from '../lib/supabase';

export interface Vision {
  id: string;
  name: string;
  location: string;
  period: string;
  size: string;
  price: string;
  image_url: string;
  pdf_url: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export const visionRepository = {
  /**
   * すべてのビジョンを取得する
   */
  async getAll(): Promise<Vision[]> {
    const { data, error } = await supabase
      .from('visions')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('ビジョン取得エラー:', error);
      throw new Error(`ビジョンの取得に失敗しました: ${error.message}`);
    }

    return data || [];
  },

  /**
   * 特定のビジョンを取得する
   * @param id ビジョンID
   */
  async getById(id: string): Promise<Vision | null> {
    const { data, error } = await supabase
      .from('visions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('ビジョン取得エラー:', error);
      throw new Error(`ビジョンの取得に失敗しました: ${error.message}`);
    }

    return data;
  },

  /**
   * ビジョンを作成する
   * @param vision ビジョン情報
   */
  async create(vision: Omit<Vision, 'id'>): Promise<Vision> {
    const { data, error } = await supabase
      .from('visions')
      .insert([vision])
      .select()
      .single();

    if (error) {
      console.error('ビジョン作成エラー:', error);
      throw new Error(`ビジョンの作成に失敗しました: ${error.message}`);
    }

    return data;
  },

  /**
   * ビジョンを更新する
   * @param id ビジョンID
   * @param vision 更新するビジョン情報
   */
  async update(id: string, vision: Partial<Vision>): Promise<Vision> {
    const { data, error } = await supabase
      .from('visions')
      .update(vision)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('ビジョン更新エラー:', error);
      throw new Error(`ビジョンの更新に失敗しました: ${error.message}`);
    }

    return data;
  },

  /**
   * ビジョンを削除する
   * @param id ビジョンID
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('visions').delete().eq('id', id);

    if (error) {
      console.error('ビジョン削除エラー:', error);
      throw new Error(`ビジョンの削除に失敗しました: ${error.message}`);
    }
  },
};
