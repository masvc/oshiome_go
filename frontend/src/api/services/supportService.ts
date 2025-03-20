import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { Support, CreateSupportInput, UpdateSupportInput, ApiResponse, PaginatedResponse } from '../../types';

export const supportService = {
  // プロジェクトの支援一覧を取得
  getProjectSupports: (projectId: number, page = 1, perPage = 10) => {
    return client.get<PaginatedResponse<Support>>(
      `${API_ENDPOINTS.projectSupports(projectId)}?page=${page}&perPage=${perPage}`
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
    return client.get<PaginatedResponse<Support>>(
      `${API_ENDPOINTS.userSupports(userId)}?page=${page}&perPage=${perPage}`
    );
  },
}; 