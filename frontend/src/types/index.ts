// User related types
export interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  updated_at: string;
}

// Project related types
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  creator_id: string;
  idol_name: string;
  office_status: 'approved' | 'pending';
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  project_hashtag: string | null;
  support_hashtag: string | null;
  created_at: string;
  updated_at: string;
}

// Project creation type (送信時に使用する型)
export type CreateProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

// Vision related types
export interface Vision {
  id: string;
  name: string;
  location: string;
  period: string;
  size: string;
  price: string;
  image_url: string;
  pdf_url: string;
  description: string;
}

// Contribution related types
export interface Contribution {
  project_id: string;
  supporter_id: string;
  amount: number;
  payment_status: 'pending' | 'succeeded' | 'failed';
  created_at?: string;
}

// Project Schedule related types
export interface ProjectSchedule {
  project_id: string;
  schedule_date: string;
  content: string;
}

// Project Update related types
export interface ProjectUpdate {
  project_id: string;
  title: string;
  content: string;
  update_date: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
