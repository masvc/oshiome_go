import { supabase } from '../lib/supabase';

export type Project = {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  creator_id: string;
  start_date: string;
  end_date: string;
  status: string;
  image_url: string | null;
  project_hashtag: string | null;
  support_hashtag: string | null;
  vision_id: string;
  is_office_approved: boolean;
  created_at: string;
  updated_at: string;
  current_amount?: number;
  supporters_count?: number;
  progress?: number;
};

export const projectRepository = {
  async getAll() {
    const { data, error } = await supabase.from('projects').select('*');

    if (error) throw new Error(error.message);
    return data as Project[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Project;
  },

  async getActiveOnly() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active');

    if (error) throw new Error(error.message);
    return data as Project[];
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Project;
  },

  async getWithProgress(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(
        `
        *,
        contributions!inner(
          amount,
          payment_status,
          supporter_id
        )
      `
      )
      .eq('id', id)
      .eq('contributions.payment_status', 'succeeded')
      .single();

    if (error) throw new Error(error.message);

    const currentAmount = data.contributions.reduce(
      (sum: number, contribution: { amount: number }) =>
        sum + contribution.amount,
      0
    );

    const uniqueSupporters = new Set(
      data.contributions.map((c: { supporter_id: string }) => c.supporter_id)
    );

    const progress = Math.floor((currentAmount / data.goal_amount) * 100);

    return {
      ...data,
      current_amount: currentAmount,
      progress: progress,
      supporters_count: uniqueSupporters.size,
    } as Project & {
      current_amount: number;
      progress: number;
      supporters_count: number;
    };
  },

  async getAllWithProgress() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        contributions:contributions(
          amount,
          payment_status,
          supporter_id
        )
      `);

    if (error) throw new Error(error.message);

    return data.map((project) => {
      const validContributions = (project.contributions || []).filter(
        (c: { payment_status: string }) => c.payment_status === 'succeeded'
      );

      const currentAmount = validContributions.reduce(
        (sum: number, contribution: { amount: number }) =>
          sum + contribution.amount,
        0
      );

      const uniqueSupporters = new Set(
        validContributions.map((c: { supporter_id: string }) => c.supporter_id)
      );

      const progress = Math.floor((currentAmount / project.goal_amount) * 100);

      return {
        ...project,
        current_amount: currentAmount,
        progress: progress,
        supporters_count: uniqueSupporters.size,
      };
    }) as (Project & {
      current_amount: number;
      progress: number;
      supporters_count: number;
    })[];
  },

  async update(
    id: string,
    project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
  ) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Project;
  },

  async delete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw new Error(error.message);
  },
};
