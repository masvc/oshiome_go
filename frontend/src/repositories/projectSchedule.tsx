import { supabase } from '../lib/supabase';

export type ProjectSchedule = {
  id: string;
  project_id: string;
  schedule_date: string;
  content: string;
  created_at: string;
};

export const projectScheduleRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from('project_schedules')
      .select('*');

    if (error) throw new Error(error.message);
    return data as ProjectSchedule[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('project_schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectSchedule;
  },

  async create(schedule: Omit<ProjectSchedule, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_schedules')
      .insert([schedule])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectSchedule;
  },

  async update(
    id: string,
    schedule: Partial<Omit<ProjectSchedule, 'id' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('project_schedules')
      .update(schedule)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as ProjectSchedule;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('project_schedules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
