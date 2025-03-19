import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { projectRepository, Project } from '../../repositories/project';

// 支援データの型定義
interface Contribution {
  id: string;
  amount: number;
  project_id: string;
  supporter_id: string;
  payment_status: string;
}

// 統計情報の型定義
interface Stats {
  totalProjects: number;
  activeProjects: number;
  pendingProjects: number;
  completedProjects: number;
  totalSupporters: number;
  totalAmount: number;
}

export const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    pendingProjects: 0,
    completedProjects: 0,
    totalSupporters: 0,
    totalAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // プロジェクトデータの取得（支援情報を含む）
        const projectsData = await projectRepository.getAllWithProgress();

        // プロジェクトデータの設定
        setProjects(projectsData);

        // 統計情報の計算
        const totalProjects = projectsData.length;
        const activeProjects = projectsData.filter(
          (p) => p.status === 'active'
        ).length;
        const pendingProjects = projectsData.filter(
          (p) => p.status === 'pending'
        ).length;
        const completedProjects = projectsData.filter(
          (p) => p.status === 'completed'
        ).length;

        // 支援者数と支援総額の計算
        const totalSupporters = projectsData.reduce(
          (sum, p) => sum + (p.supporters_count || 0),
          0
        );
        const totalAmount = projectsData.reduce(
          (sum, p) => sum + (p.current_amount || 0),
          0
        );

        setStats({
          totalProjects,
          activeProjects,
          pendingProjects,
          completedProjects,
          totalSupporters,
          totalAmount,
        });
      } catch (err) {
        console.error('データの取得に失敗しました', err);
        setError('データの取得に失敗しました。再度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 進捗率の計算
  const calculateProgress = (current: number, target: number) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // 金額のフォーマット
  const formatAmount = (amount: number = 0) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // プロジェクトの進捗率を計算
  const getProjectProgress = (project: Project) => {
    const current = project.current_amount || 0;
    const target = project.goal_amount || 0;
    return calculateProgress(current, target);
  };

  // プロジェクトの現在の金額を取得
  const getProjectCurrentAmount = (project: Project) => {
    return project.current_amount || 0;
  };

  // プロジェクトの目標金額を取得
  const getProjectGoalAmount = (project: Project) => {
    return project.goal_amount || 0;
  };

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

  return (
    <AdminLayout>
      <div className="space-y-8">
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
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              再読み込み
            </button>
          </div>
        ) : (
          <>
            {/* 統計情報 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* 総プロジェクト数 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          総プロジェクト数
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.totalProjects}
                          </div>
                          <div className="ml-2">
                            <span className="text-sm text-gray-500">
                              （進行中: {stats.activeProjects}）
                            </span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* 総支援者数 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          総支援者数
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats.totalSupporters}
                          </div>
                          <div className="ml-2">
                            <span className="text-sm text-gray-500">人</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* 総支援金額 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          総支援金額
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatAmount(stats.totalAmount)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                to="/admin/projectcreate"
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
              <Link
                to="/admin/projects"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oshi-purple-500"
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                すべてのプロジェクト
              </Link>
            </div>

            {/* プロジェクトリスト */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  最新のプロジェクト
                </h3>
                <Link
                  to="/admin/projects"
                  className="text-sm text-oshi-purple-600 hover:text-oshi-purple-500"
                >
                  すべて見る
                </Link>
              </div>
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/admin/projects/${project.id}`}
                          className="text-sm font-medium text-oshi-purple-600 hover:text-oshi-purple-500 truncate"
                        >
                          {project.title}
                        </Link>
                        <div className="mt-2 flex items-center text-sm text-gray-500 gap-4">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>
                              {formatAmount(getProjectCurrentAmount(project))} /{' '}
                              {formatAmount(getProjectGoalAmount(project))}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            <span>{project.supporters_count || 0}人が支援</span>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                getProjectProgress(project) >= 100
                                  ? 'bg-oshi-purple-500'
                                  : 'bg-oshi-pink-500'
                              }`}
                              style={{
                                width: `${getProjectProgress(project)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {getProjectProgress(project)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
