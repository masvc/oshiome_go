import { supabase } from '../lib/supabase';

export type Contribution = {
  id: string;
  campaign_id: string;
  supporter_id: string;
  amount: number;
  payment_status: string;
  created_at: string;
};

export const contributionRepository = {
  /**
   * 指定されたIDの支援情報を取得する
   * @param id 支援ID
   * @returns 支援情報
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Contribution;
  },

  /**
   * 新しい支援情報を作成する
   * @param contribution 支援情報（id、created_at以外の項目）
   * @returns 作成された支援情報
   */
  async create(contribution: Omit<Contribution, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('contributions')
      .insert([contribution])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Contribution;
  },
};
