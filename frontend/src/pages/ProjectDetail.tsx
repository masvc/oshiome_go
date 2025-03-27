import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { SupportForm } from '../components/features/SupportForm';
import { GlitterEffect } from '../components/common/GlitterEffect';
import { Project } from '../types/project';
import { Support } from '../types/support';
import { projectService } from '../api/services/projectService';
import { supportService } from '../api/services/supportService';
import { useAuthStore } from '../stores/authStore';
import { PaginatedResponse } from '../types';

// 支援プラン
interface SupportPlan {
  amount: number;
  benefits: string[];
}

// Stripe対応待ちモーダル
const StripeComingSoonModal = ({ onClose }: { onClose: () => void }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const currentPath = window.location.pathname;
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isAuthenticated ? "支援機能は現在準備中です" : "ログインが必要です"}
        </h2>

        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <p className="text-gray-600">
                現在、Stripeによる支払い機能を実装中です。
                しばらくお待ちください。
              </p>
              <div className="bg-oshi-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-oshi-purple-800 mb-2">
                  実装予定の機能
                </h3>
                <ul className="space-y-2 text-sm text-oshi-purple-700">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-oshi-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    クレジットカード決済
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-oshi-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    セキュアな支払い処理
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                プロジェクトを支援するにはログインが必要です。
                アカウントをお持ちでない場合、無料登録をお願いします。
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-oshi-purple-500 text-white py-2.5 px-4 rounded-lg hover:bg-oshi-purple-600 transition-colors text-[15px]"
                >
                  ログイン
                </button>
                <Link
                  to={`/register?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="w-full bg-white border border-oshi-purple-500 text-oshi-purple-500 py-2.5 px-4 rounded-lg hover:bg-oshi-purple-50 transition-colors text-center text-[15px]"
                >
                  新規登録
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [supports, setSupports] = useState<Support[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [projectResponse, supportsResponse] = await Promise.all([
          projectService.getProject(parseInt(id)),
          supportService.getProjectSupports(parseInt(id))
        ]);

        if (projectResponse.data) {
          setProject(projectResponse.data);
          if (supportsResponse && 'data' in supportsResponse) {
            setSupports(Array.isArray(supportsResponse.data) ? supportsResponse.data : []);
          } else {
            console.error('支援メッセージのフォーマットが不正です:', supportsResponse);
            setSupports([]);
          }
        }
        setError(null);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSupportClick = () => {
    setShowStripeModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          {error || 'プロジェクトが見つかりませんでした。'}
        </div>
      </div>
    );
  }

  // 進捗率を計算
  const currentAmount = project.current_amount || 0;
  const progress = (currentAmount / project.target_amount) * 100;

  return (
    <>
      <GlitterEffect enabled={true} />
      <div className="min-h-screen bg-gray-50 pb-8 sm:pb-12">
        {/* メインビジュアル */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* 左側：画像 */}
            <div className="relative bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden group">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-h-10">
                <img
                  src={project.thumbnail_url || 'https://picsum.photos/800/450'}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* オーバーレイ情報 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-white">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">
                      支援者数: {project.supporters_count || 0}人
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：プロジェクト情報 */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] sm:text-sm font-medium whitespace-nowrap ${
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
                      <span className={`text-[10px] sm:text-sm font-medium whitespace-nowrap ${
                        project.office_approved === false ? 'text-green-600' :
                        'text-yellow-600'
                      }`}>
                        {project.office_approved === false ? '事務所承認済' : '事務所確認中'}
                      </span>
                    </div>
                    {/* 企画者情報 */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-start">
                        <p className="text-[8px] sm:text-[10px] text-gray-500 tracking-wider whitespace-nowrap">企画者</p>
                        <p className="text-[10px] sm:text-sm font-bold text-gray-900 whitespace-nowrap">{project.user?.name}</p>
                      </div>
                      <img
                        src={project.user?.profile_image_url || 'https://picsum.photos/100/100'}
                        alt={project.user?.name || '企画者'}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-oshi-purple-100"
                      />
                    </div>
                  </div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        開始：
                        {new Date(project.created_at).toLocaleDateString()}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        終了：{new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* 進捗バーとボタン */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>目標金額: ¥{project.target_amount.toLocaleString()}</span>
                      <span>現在: ¥{currentAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-oshi-purple-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">
                      {progress.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* 左側：企画詳細 */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* プロジェクトのハッシュタグ */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-[12px] sm:text-lg font-bold flex items-center gap-2 whitespace-nowrap">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-oshi-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    プロジェクトのハッシュタグ
                  </h2>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`【${project?.title}】\n\n推しおめで支援したよ！\n\n気になる人はぜひチェックしてみて！\n\n#推し誕生日 #誕生日応援`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                    }}
                    className="inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Xでシェア
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oshi-purple-100 text-oshi-purple-800">
                    #推し誕生日
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oshi-purple-100 text-oshi-purple-800">
                    #誕生日応援
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-oshi-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  企画詳細
                </h2>
                <div className="prose prose-sm sm:prose max-w-none text-gray-600">
                  <div className="whitespace-pre-line">
                    {project.description}
                  </div>
                </div>
              </div>

              {/* 応援メッセージ */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 mt-4">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-oshi-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  応援メッセージ
                </h2>
                <div className="space-y-4">
                  {supports.map((support) => (
                    <div key={support.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={support.user?.profile_image_url || 'https://via.placeholder.com/40x40'}
                          alt={support.user?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{support.user?.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(support.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-gray-600 mt-1 whitespace-pre-line">{support.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {supports.length === 0 && (
                    <p className="text-gray-500 text-center py-4">まだ応援メッセージはありません</p>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：支援情報 */}
            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-4">
              {/* 支援プラン */}
              <div className="bg-gradient-to-br from-oshi-purple-50 to-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-oshi-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  支援プラン
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleSupportClick}
                    className="w-full bg-white border-2 border-oshi-purple-200 rounded-lg p-4 hover:border-oshi-purple-500 hover:bg-oshi-purple-50/50 transition-all duration-300 text-left relative group shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">基本プラン</h3>
                      </div>
                      <span className="text-lg font-bold text-oshi-purple-500">
                        ¥3,000
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-oshi-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        支援者として名前を表示
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-oshi-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        プロジェクトの進捗報告を受け取る
                      </li>
                    </ul>
                    <div className="mt-6 flex justify-end">
                      <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-base font-bold bg-oshi-purple-500 text-white group-hover:bg-oshi-purple-600 transition-colors">
                        <svg
                          className="w-5 h-5"
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
                        支援する
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 支援フォームモーダル */}
      {showSupportForm && (
        <SupportForm
          projectId={id || '0'}
          onClose={() => setShowSupportForm(false)}
        />
      )}

      {/* Stripe対応待ちモーダル */}
      {showStripeModal && (
        <StripeComingSoonModal onClose={() => setShowStripeModal(false)} />
      )}
    </>
  );
};

export default ProjectDetail;
