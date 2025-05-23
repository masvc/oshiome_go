import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { Support, CreateSupportInput, UpdateSupportInput, ApiResponse, StripeCheckoutSessionResponse } from '../../types';

export const supportService = {
  // プロジェクトの支援一覧を取得（認証不要）
  getProjectSupports: (projectId: number, page = 1, perPage = 10) => {
    return client.fetch<ApiResponse<Support[]>>(
      `${API_ENDPOINTS.projectSupports(projectId)}?page=${page}&perPage=${perPage}`,
      {
        credentials: 'omit', // 認証情報を送信しない
      }
    );
  },

  // 支援を作成
  createSupport: (data: CreateSupportInput) => {
    return client.post<ApiResponse<Support>>(API_ENDPOINTS.supports, data);
  },

  // 支援を更新
  updateSupport: (id: number, data: UpdateSupportInput) => {
    return client.put<ApiResponse<Support>>(API_ENDPOINTS.support(id), data);
  },

  // 支援を削除
  deleteSupport: (id: number) => {
    return client.delete<ApiResponse<void>>(API_ENDPOINTS.support(id));
  },

  // ユーザーの支援履歴を取得
  getUserSupports: (userId: number, page = 1, perPage = 10) => {
    return client.get<ApiResponse<Support[]>>(
      `${API_ENDPOINTS.userSupports(userId)}?page=${page}&perPage=${perPage}`
    );
  },
  
  // Stripe Checkoutセッションを作成
  createCheckoutSession: (projectId: number, amount: number, message: string = '') => {
    return client.post<ApiResponse<StripeCheckoutSessionResponse>>(
      `${API_ENDPOINTS.projectSupports(projectId)}`, 
      { amount, message }
    );
  },
  
  // 支援状態を確認
  verifyPayment: (sessionId: string) => {
    return client.get<ApiResponse<Support>>(
      `${API_ENDPOINTS.stripeVerify}?session_id=${sessionId}`
    );
  }
}; 