import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { projectRepository, Project } from '../../repositories/project';

export const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchProjects();
  }, []);

  // プロジェクトデータの取得
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectRepository.getAllWithProgress();
      setProjects(data);
    } catch (error) {
      console.error('プロジェクトデータの取得に失敗しました', error);
      setError('プロジェクトデータの取得に失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 検索とフィルタリング
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortOrder === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'progress') {
        const progressA = calculateProgress(
          a.current_amount || 0,
          a.goal_amount
        );
        const progressB = calculateProgress(
          b.current_amount || 0,
          b.goal_amount
        );
        return sortOrder === 'desc'
          ? progressB - progressA
          : progressA - progressB;
      } else if (sortBy === 'supporters') {
        const supportersA = a.supporters_count || 0;
        const supportersB = b.supporters_count || 0;
        return sortOrder === 'desc'
          ? supportersB - supportersA
          : supportersA - supportersB;
      }
      return 0;
    });

  // ステータスに応じたバッジの色
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            審査中
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            進行中
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            完了
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
            中止
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            不明
          </span>
        );
    }
  };

  // 金額のフォーマット
  const formatAmount = (amount: number = 0) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // 進捗率の計算
  const calculateProgress = (current: number, target: number) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // プロジェクトの削除
  const handleDelete = async (id: string) => {
    if (window.confirm('このプロジェクトを削除してもよろしいですか？')) {
      try {
        await projectRepository.delete(id);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (error) {
        console.error('プロジェクトの削除に失敗しました', error);
      }
    }
  };

  // プロジェクトの承認
  const handleApprove = async (id: string) => {
    try {
      await projectRepository.update(id, { is_office_approved: true });
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, is_office_approved: true } : project
        )
      );
    } catch (error) {
      console.error('プロジェクトの承認に失敗しました', error);
    }
  };

  // ソートの切り替え
  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              プロジェクト管理
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              全{projects.length}件のプロジェクトを管理できます
            </p>
          </div>
          <Link
            to="/admin/projectregister"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oshi-purple-500"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            新規プロジェクト作成
          </Link>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="プロジェクト名で検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">すべてのステータス</option>
                <option value="pending">審査中</option>
                <option value="active">進行中</option>
                <option value="completed">完了</option>
                <option value="cancelled">中止</option>
              </select>
            </div>
          </div>
        </div>

        {/* プロジェクト一覧 */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-oshi-purple-200 opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-oshi-purple-500 animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p>{error}</p>
            <button
              onClick={() => fetchProjects()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              再読み込み
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 sm:pl-6"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('created_at')}
                      >
                        プロジェクト名
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'created_at'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'created_at' && sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      ステータス
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('supporters')}
                      >
                        支援者数
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'supporters'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'supporters' && sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('progress')}
                      >
                        進捗
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'progress'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'progress' && sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      金額
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">アクション</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={
                                project.image_url ||
                                'https://picsum.photos/seed/default/200'
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {project.title}
                            </div>
                            <div className="text-gray-500">
                              {new Date(
                                project.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {project.supporters_count || 0}人
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                calculateProgress(
                                  project.current_amount || 0,
                                  project.goal_amount
                                ) >= 100
                                  ? 'bg-oshi-purple-500'
                                  : 'bg-oshi-pink-500'
                              }`}
                              style={{
                                width: `${calculateProgress(
                                  project.current_amount || 0,
                                  project.goal_amount
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span>
                            {calculateProgress(
                              project.current_amount || 0,
                              project.goal_amount
                            )}
                            %
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {formatAmount(project.current_amount || 0)}
                          </span>
                          <span className="text-xs text-gray-500">
                            目標: {formatAmount(project.goal_amount)}
                          </span>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center gap-2 justify-end">
                          {!project.is_office_approved && (
                            <button
                              onClick={() => handleApprove(project.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              承認
                            </button>
                          )}
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="text-oshi-purple-600 hover:text-oshi-purple-900"
                          >
                            詳細
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                プロジェクトが見つかりません。
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectManagement;
