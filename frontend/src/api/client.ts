import { API_BASE_URL } from './config';
import { APIErrorResponse, APIError } from '../types/error';

// 認証トークンの保存・取得
const AUTH_TOKEN_KEY = 'auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// エラーレスポンスをパース
const parseErrorResponse = async (response: Response): Promise<APIError> => {
  try {
    const error = await response.json();
    return error;
  } catch {
    return {
      code: 'UNKNOWN_ERROR',
      message: '予期せぬエラーが発生しました',
      status: 'error',
    };
  }
};

export const client = {
  async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = getStoredToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // 認証エラーの場合、トークンを削除
      if (response.status === 401) {
        removeStoredToken();
      }
      const error = await parseErrorResponse(response);
      throw new APIErrorResponse(error.code, error.message, error.detail);
    }

    return response.json();
  },

  get<T>(path: string, options?: RequestInit) {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body: unknown, options?: RequestInit) {
    return this.fetch<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(path: string, body: unknown, options?: RequestInit) {
    return this.fetch<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch<T>(path: string, body: unknown, options?: RequestInit) {
    return this.fetch<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete<T>(path: string, options?: RequestInit) {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  },
}; 