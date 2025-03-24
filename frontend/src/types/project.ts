import { User } from './auth';

export type ProjectStatus = 'draft' | 'active' | 'complete';

export interface Project {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: ProjectStatus;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  user?: User;
  supporters_count: number;
  office_approved: boolean;  // true: 確認中, false: 承認済み
}

export interface CreateProjectInput {
  title: string;
  description: string;
  target_amount: number;
  deadline: string;
  status?: ProjectStatus;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {} 