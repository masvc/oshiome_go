// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// 基本型のエクスポート
export * from './auth';
export * from './project';
export * from './support';
export * from './error';

// 支払い状態の型
export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

// プロジェクト関連の追加型
export interface ProjectContribution {
  project_id: number;
  supporter_id: number;
  amount: number;
  payment_status: PaymentStatus;
  created_at?: string;
}

export interface ProjectContent {
  project_id: number;
  title?: string;
  content: string;
  date: string;
}

// Stripe関連の型定義
export interface StripeCheckoutSessionResponse {
  id: string;
  url?: string;
  checkout_url?: string;
  checkout_session_id?: string;
  support_id?: number;
}

// 広告関連の型定義
export interface Vision {
  id: number;
  name: string;
  location: string;
  period: string;
  size: string;
  price: string;
  image_url: string;
  pdf_url: string;
  description: string;
}

// レスポンスの成功判定用のヘルパー関数
export const isSuccessResponse = <T>(response: ApiResponse<T>): boolean => {
  return response.status === 'success';
};
