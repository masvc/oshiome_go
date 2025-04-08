// API設定
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// APIの設定
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// APIエンドポイントの定義
export const API_ENDPOINTS = {
  // 認証関連
  auth: {
    login: '/api/login',
    register: '/api/register',
    me: '/api/auth/me',
    passwordReset: '/api/auth/password-reset',
    passwordResetConfirm: '/api/auth/password-reset/confirm',
  },
  // プロジェクト関連
  projects: '/api/projects',
  project: (id: number) => `/api/projects/${id}`,
  myProjects: '/api/projects/my',
  supportedProjects: '/api/projects/supported',
  // 支援関連
  supports: '/api/supports',
  support: (id: number) => `/api/supports/${id}`,
  projectSupports: (projectId: number) => `/api/projects/${projectId}/supports`,
  userSupports: (userId: number) => `/api/users/${userId}/supports`,
  // ユーザー関連
  user: (id: number) => `/api/users/${id}`,
  // Stripe関連
  stripeCheckout: '/api/payments/checkout',
  stripeVerify: '/api/payments/verify',
  stripeSuccess: '/payments/success',
  stripeCancel: '/payments/cancel',
};

// 共通のfetchラッパー
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const headers = {
    ...API_CONFIG.headers,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // CORSリクエストでクッキーを送信
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
} 