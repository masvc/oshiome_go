import { supabase } from '../lib/supabase';

export type ProjectUpdate = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  update_date: string;
  created_at: string;
};

export const projectUpdateRepository = {
  async getAll() {
    const { data, error } = await supabase.from('project_updates').select('*');

    if (error) throw new Error(error.message);
    return data as ProjectUpdate[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('project_updates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectUpdate;
  },

  async create(update: Omit<ProjectUpdate, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_updates')
      .insert([update])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectUpdate;
  },

  async update(
    id: string,
    update: Partial<Omit<ProjectUpdate, 'id' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('project_updates')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectUpdate;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('project_updates')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
