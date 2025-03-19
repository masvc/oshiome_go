export interface Project {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  image_url?: string;
  supporters_count?: number;
  status: 'active' | 'ended';
  office_status: 'approved' | 'pending';
  project_hashtag?: string;
  support_hashtag?: string;
} 