import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import { Project, APIResponse, PaginatedResponse } from '../../types/api';

export interface CreateProjectDTO {
  title: string;
  description: string;
  targetAmount: number;
  deadline: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  targetAmount?: number;
  deadline?: string;
}

export const projectService = {
  // プロジェクト一覧を取得
  getProjects: (page = 1, perPage = 10) => {
    return client.get<PaginatedResponse<Project>>(
      `${API_ENDPOINTS.projects}?page=${page}&perPage=${perPage}`
    );
  },

  // プロジェクト詳細を取得
  getProject: (id: string) => {
    return client.get<APIResponse<Project>>(API_ENDPOINTS.project(id));
  },

  // プロジェクトを作成
  createProject: (data: CreateProjectDTO) => {
    return client.post<APIResponse<Project>>(API_ENDPOINTS.projects, data);
  },

  // プロジェクトを更新
  updateProject: (id: string, data: UpdateProjectDTO) => {
    return client.put<APIResponse<Project>>(API_ENDPOINTS.project(id), data);
  },

  // プロジェクトを削除
  deleteProject: (id: string) => {
    return client.delete<APIResponse<void>>(API_ENDPOINTS.project(id));
  },
}; 