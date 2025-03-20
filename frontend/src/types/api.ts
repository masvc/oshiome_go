// プロジェクト関連の型定義
export interface Project {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'draft' | 'active' | 'complete' | 'cancelled';
  supporters_count: number;
  createdAt: string;
  updatedAt: string;
}

// ビジョン関連の型定義
export interface Vision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  requiredAmount: number;
  createdAt: string;
  updatedAt: string;
}

// 支援関連の型定義
export interface Support {
  id: string;
  projectId: string;
  userId: string;
  amount: number;
  message?: string;
  createdAt: string;
}

// APIレスポンスの共通型
export interface APIResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
} 