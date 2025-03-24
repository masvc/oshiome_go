import { Project } from './project';
import { User } from './auth';

export interface Support {
  id: number;
  user_id: number;
  project_id: number;
  amount: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  project?: Project;
}

export interface CreateSupportInput {
  amount: number;
  message?: string;
  project_id: number;
}

export interface UpdateSupportInput {
  amount?: number;
  message?: string;
} 