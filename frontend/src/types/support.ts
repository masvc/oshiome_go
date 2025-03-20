import { Project } from './project';
import { User } from './auth';

export interface Support {
  id: number;
  amount: number;
  message?: string;
  project_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  user?: User;
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