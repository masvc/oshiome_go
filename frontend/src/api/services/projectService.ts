import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { Project, CreateProjectInput, UpdateProjectInput, ApiResponse, PaginatedResponse } from '../../types';

export const projectService = {
  // プロジェクト一覧を取得
  getProjects: (filter?: 'all' | 'active' | 'complete') => {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') {
      params.append('status', filter);
    }
    return client.get<ApiResponse<Project[]>>(`${API_ENDPOINTS.projects}?${params.toString()}`);
  },

  // プロジェクト詳細を取得
  getProject: (id: number) => {
    return client.get<ApiResponse<Project>>(API_ENDPOINTS.project(id));
  },

  // プロジェクトを作成
  createProject: (data: CreateProjectInput) => {
    return client.post<ApiResponse<Project>>(API_ENDPOINTS.projects, data);
  },

  // プロジェクトを更新
  updateProject: (id: number, data: UpdateProjectInput) => {
    return client.put<ApiResponse<Project>>(API_ENDPOINTS.project(id), data);
  },

  // プロジェクトを削除
  deleteProject: (id: number) => {
    return client.delete<ApiResponse<void>>(API_ENDPOINTS.project(id));
  },
}; 