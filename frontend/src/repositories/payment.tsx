import { supabase } from '../lib/supabase';

export type Payment = {
  id: string;
  contribution_id: string;
  payment_method: string;
  payment_gateway_id: string;
  status: string;
  created_at: string;
};

export const paymentRepository = {
  /**
   * 新しい支払い情報を作成する
   * @param payment 支払い情報（id、created_at以外の項目）
   * @returns 作成された支払い情報
   */
  async create(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Payment;
  },
};
