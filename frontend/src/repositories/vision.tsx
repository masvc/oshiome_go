import { supabase } from '../lib/supabase';

export type Vision = {
  id: string; // ビジョン識別子（例：shibuya-hit）
  name: string; // ビジョン名
  location: string; // 設置場所
  period: string; // 放映期間・回数
  size: string; // ビジョンサイズ
  price: string; // 広告料金
  image_url: string; // ビジョン画像URL
  pdf_url: string; // 詳細資料PDF URL
  description: string; // ビジョンの説明
  created_at: string; // 作成日時
};

export const visionRepository = {
  /**
   * visionsテーブルの全件を取得する
   * @returns Vision[]
   */
  async getAllVisions(): Promise<Vision[]> {
    const { data, error } = await supabase
      .from('visions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error != null) throw new Error(error.message);
    return data;
  },
};
