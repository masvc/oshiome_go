import { client } from '../api/client';
import { APIResponse, Project } from '../types/api';

export const projectRepository = {
  // プロジェクト一覧を取得
  getProjects: () => {
    return client.get<APIResponse<Project[]>>('/projects');
  },

  // プロジェクトの詳細を取得
  getProject: (id: string) => {
    return client.get<APIResponse<Project>>(`/projects/${id}`);
  },

  // プロジェクトを作成
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    return client.post<APIResponse<Project>>('/projects', data);
  },

  // プロジェクトを更新
  updateProject: (id: string, data: Partial<Project>) => {
    return client.patch<APIResponse<Project>>(`/projects/${id}`, data);
  },

  // プロジェクトを削除
  deleteProject: (id: string) => {
    return client.delete<APIResponse<void>>(`/projects/${id}`);
  },

  // プロジェクトのステータスを変更
  updateProjectStatus: (id: string, status: 'draft' | 'active' | 'ended' | 'cancelled') => {
    return client.patch<APIResponse<Project>>(`/projects/${id}/status`, { status });
  },

  // 進捗情報を含むプロジェクト一覧を取得
  getAllWithProgress: () => {
    return client.get<APIResponse<Project[]>>('/projects/progress');
  },
}; 