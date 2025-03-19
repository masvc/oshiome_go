import { supabase } from '../supabaseClient';
import { Project } from '../types/project';

export type ProjectFilter = 'all' | 'active' | 'ended';

export const projectRepository = {
  // プロジェクト一覧を取得（フィルター付き）
  async getAll(filter: ProjectFilter = 'all'): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // フィルター条件を適用
    switch (filter) {
      case 'active':
        query = query.eq('status', 'active');
        break;
      case 'ended':
        query = query.eq('status', 'ended');
        break;
      // allの場合は全件取得（draft, cancelledは除外）
      default:
        query = query.in('status', ['active', 'ended']);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      throw error;
    }

    return data || [];
  },

  // 進捗情報付きでプロジェクト一覧を取得（フィルター付き）
  async getAllWithProgress(filter: ProjectFilter = 'all'): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // フィルター条件を適用
    switch (filter) {
      case 'active':
        query = query.eq('status', 'active');
        break;
      case 'ended':
        query = query.eq('status', 'ended');
        break;
      // allの場合は全件取得（draft, cancelledは除外）
      default:
        query = query.in('status', ['active', 'ended']);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      throw error;
    }

    // 支援者数を計算して追加
    const projectsWithCounts = await Promise.all(
      (data || []).map(async (project) => {
        const supportCount = await this.getSupportersCount(project.id);
        return {
          ...project,
          supporters_count: supportCount
        };
      })
    );

    return projectsWithCounts;
  },

  // プロジェクトの詳細を取得
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      throw error;
    }

    return data;
  },

  // プロジェクトを作成
  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('プロジェクト作成エラー:', error);
      throw error;
    }

    return data;
  },

  // プロジェクトを更新
  async update(id: string, project: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('プロジェクト更新エラー:', error);
      throw error;
    }

    return data;
  },

  // プロジェクトを削除
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('プロジェクト削除エラー:', error);
      throw error;
    }
  },

  // プロジェクトの支援者数を取得
  async getSupportersCount(projectId: string): Promise<number> {
    const { count, error } = await supabase
      .from('project_supports')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (error) {
      console.error('支援者数取得エラー:', error);
      throw error;
    }

    return count || 0;
  },

  // プロジェクトの詳細と支援者数を取得
  async getWithProgress(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('プロジェクト取得エラー:', error);
      throw error;
    }

    // 支援者数を取得して追加
    const supportCount = await this.getSupportersCount(id);
    return {
      ...data,
      supporters_count: supportCount
    } as Project;
  }
}; 