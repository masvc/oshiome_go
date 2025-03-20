import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { User, LoginCredentials, RegisterCredentials } from '../../types/auth';
import { APIResponse } from '../../types/api';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // ログイン
  login: (credentials: LoginCredentials) => {
    return client.post<APIResponse<AuthResponse>>('/auth/login', credentials);
  },

  // 新規登録
  register: (credentials: RegisterCredentials) => {
    return client.post<APIResponse<AuthResponse>>('/auth/register', credentials);
  },

  // ログアウト
  logout: () => {
    return client.post<APIResponse<void>>('/auth/logout', {});
  },

  // 現在のユーザー情報を取得
  getCurrentUser: () => {
    return client.get<APIResponse<User>>('/auth/me');
  },

  // パスワードリセット要求
  requestPasswordReset: (email: string) => {
    return client.post<APIResponse<void>>('/auth/password-reset', { email });
  },

  // パスワードリセット
  resetPassword: (token: string, password: string) => {
    return client.post<APIResponse<void>>('/auth/password-reset/confirm', {
      token,
      password,
    });
  },
}; 