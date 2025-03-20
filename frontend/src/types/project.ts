import { User } from './auth';

export type ProjectStatus = 'draft' | 'active' | 'ended' | 'cancelled';

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