export interface Project {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  creator_id: string;
  idol_name: string;
  office_status: 'approved' | 'pending';
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  created_at: string;
  updated_at: string;
  image_url?: string;
  project_hashtag?: string;
  support_hashtag?: string;
  supporters_count?: number;
} 