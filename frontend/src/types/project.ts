import { User } from './auth';

export type ProjectStatus = 'active' | 'complete' | 'draft' | 'cancelled';

export interface Project {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: ProjectStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  image_url?: string;
  supporters_count?: number;
  creator?: {
    name: string;
    avatar_url: string;
  };
}

export interface CreateProjectInput {
  title: string;
  description: string;
  target_amount: number;
  deadline: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  target_amount?: number;
  deadline?: string;
  status?: ProjectStatus;
} 