import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { User, LoginCredentials, RegisterCredentials } from '../../types/auth';
import { ApiResponse } from '../../types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // ログイン
  login: (credentials: LoginCredentials) => {
    return client.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.login, credentials);
  },

  // 新規登録
  register: (credentials: RegisterCredentials) => {
    return client.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.auth.register, credentials);
  },

  // ログアウト
  logout: () => {
    return Promise.resolve();  // トークンの削除は authStore で行うため、空のPromiseを返す
  },

  // 現在のユーザー情報を取得
  getCurrentUser: () => {
    return client.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
  },

  // パスワードリセット要求
  requestPasswordReset: (email: string) => {
    return client.post<ApiResponse<void>>(API_ENDPOINTS.auth.passwordReset, { email });
  },

  // パスワードリセット
  resetPassword: (token: string, password: string) => {
    return client.post<ApiResponse<void>>(API_ENDPOINTS.auth.passwordResetConfirm, {
      token,
      password,
    });
  },
}; 