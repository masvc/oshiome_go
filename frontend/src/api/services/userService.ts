import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { User, ApiResponse } from '../../types';

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  profile_image_url?: string;
}

export const userService = {
  // ユーザー情報を取得
  getUser: (id: number) => {
    return client.get<ApiResponse<User>>(API_ENDPOINTS.user(id));
  },

  // ユーザー情報を更新
  updateUser: (id: number, data: UpdateUserInput) => {
    return client.put<ApiResponse<User>>(API_ENDPOINTS.user(id), data);
  },

  // パスワードを更新
  updatePassword: (id: number, currentPassword: string, newPassword: string) => {
    return client.put<ApiResponse<void>>(`${API_ENDPOINTS.user(id)}/password`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
}; 