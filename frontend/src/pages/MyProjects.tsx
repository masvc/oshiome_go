import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { projectService } from '../api/services/projectService';
import { Project } from '../types/project';
import { Link } from 'react-router-dom';

type TabType = 'hosting' | 'supporting';

export const MyProjects = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hosting');
  const [hostingProjects, setHostingProjects] = useState<Project[]>([]);
  const [supportingProjects, setSupportingProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // 主催プロジェクトと参加プロジェクトを並行で取得
        const [hostingResponse, supportingResponse] = await Promise.all([
          projectService.getMyProjects(),
          projectService.getSupportedProjects()
        ]);

        if (hostingResponse) {
          setHostingProjects(hostingResponse);
        }
        if (supportingResponse) {
          setSupportingProjects(supportingResponse);
        }
      } catch (error) {
        console.error('プロジェクトの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const renderProjectCard = (project: Project) => (
    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={project.thumbnail_url || `https://picsum.photos/seed/${project.id}/400/200`}
          alt={project.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-md text-sm font-medium ${
            project.status === 'draft' ? 'bg-gray-100 text-gray-600' :
            project.status === 'active' ? 'bg-green-100 text-green-600' :
            project.status === 'complete' ? 'bg-blue-100 text-blue-600' :
            'bg-red-100 text-red-600'
          }`}>
            {project.status === 'draft' ? '審査中' :
             project.status === 'active' ? '実施中' :
             project.status === 'complete' ? '完了' :
             'キャンセル'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              ¥{project.current_amount.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              / ¥{project.target_amount.toLocaleString()}
            </span>
          </div>
          <Link
            to={`/projects/${project.id}`}
            className="text-sm font-medium text-oshi-purple-600 hover:text-oshi-purple-700"
          >
            詳細を見る →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
          マイプロジェクト
        </h1>
        <Link
          to="/projects/create"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 rounded-full transition-all shadow-sm hover:shadow"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          新規企画を作成
        </Link>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hosting')}
            className={`${
              activeTab === 'hosting'
                ? 'border-oshi-purple-500 text-oshi-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center`}
          >
            <svg
              className={`w-5 h-5 mr-2 ${
                activeTab === 'hosting' ? 'text-oshi-purple-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            主催中の企画
            {hostingProjects.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-oshi-purple-100 text-oshi-purple-600 rounded-full">
                {hostingProjects.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('supporting')}
            className={`${
              activeTab === 'supporting'
                ? 'border-oshi-purple-500 text-oshi-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center`}
          >
            <svg
              className={`w-5 h-5 mr-2 ${
                activeTab === 'supporting' ? 'text-oshi-purple-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            支援中の企画
            {supportingProjects.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-oshi-purple-100 text-oshi-purple-600 rounded-full">
                {supportingProjects.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* プロジェクト一覧 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oshi-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'hosting' ? (
            hostingProjects.length > 0 ? (
              hostingProjects.map(project => renderProjectCard(project))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">主催中の企画はありません</h3>
                <p className="mt-1 text-sm text-gray-500">新しい企画を作成して始めましょう！</p>
                <div className="mt-6">
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 rounded-full transition-all shadow-sm hover:shadow"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    企画を作成する
                  </Link>
                </div>
              </div>
            )
          ) : supportingProjects.length > 0 ? (
            supportingProjects.map(project => renderProjectCard(project))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">支援中の企画はありません</h3>
              <p className="mt-1 text-sm text-gray-500">気になる企画を見つけて支援してみましょう！</p>
              <div className="mt-6">
                <Link
                  to="/projects"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 rounded-full transition-all shadow-sm hover:shadow"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  企画を探す
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 