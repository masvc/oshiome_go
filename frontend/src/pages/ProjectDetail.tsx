import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SupportForm } from '../components/features/SupportForm';
import { GlitterEffect } from '../components/common/GlitterEffect';
import { Project } from '../types/project';

// 支援プラン
interface SupportPlan {
  amount: number;
  benefits: string[];
}

const SUPPORT_PLAN: SupportPlan = {
  amount: 3000,
  benefits: ['広告にニックネームを掲載'],
};

// 仮のプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: '1',
    title: '渋谷ビジョンで推しの誕生日を祝おう！',
    description: '渋谷の大型ビジョンで、みんなで一緒に推しの誕生日をお祝いしましょう。',
    target_amount: 500000,
    current_amount: 300000,
    start_date: '2024-04-01',
    end_date: '2024-05-01',
    image_url: 'https://picsum.photos/seed/1/800/450',
    supporters_count: 30,
    status: 'active',
    office_status: 'approved',
    project_hashtag: '#推し誕生日',
  },
  {
    id: '2',
    title: '池袋サンシャインでバースデー広告',
    description: '池袋サンシャインシティの大型ビジョンで誕生日広告を実施します。',
    target_amount: 400000,
    current_amount: 200000,
    start_date: '2024-05-15',
    end_date: '2024-06-15',
    image_url: 'https://picsum.photos/seed/2/800/450',
    supporters_count: 20,
    status: 'active',
    office_status: 'approved',
    project_hashtag: '#推し誕生日',
  },
];

export const ProjectDetail = () => {
  const { id } = useParams();
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // 遅延を追加して非同期処理をシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 仮のデータから該当するプロジェクトを検索
        const foundProject = mockProjects.find(p => p.id === id);
        if (foundProject) {
          setProject(foundProject);
          setError(null);
        } else {
          setError('プロジェクトが見つかりませんでした。');
        }
      } catch (err) {
        console.error('プロジェクト取得エラー:', err);
        setError('プロジェクトの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

  // 残り日数の計算
  const daysLeft = () => {
    const end = new Date(project.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // シェア用のテキストを生成
  const shareText = `${project.title}\n\n目標金額：¥${project.target_amount.toLocaleString()}\n現在：¥${currentAmount.toLocaleString()} (${Math.floor(progress)}%達成)\n残り${daysLeft()}日\n\n${project.project_hashtag || ''}`;

  // シェアURLを生成
  const shareUrl = `https://oshiome.jp/projects/${id}`;

  // Xでシェアする
  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

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
                  src={
                    project.image_url ||
                    'https://picsum.photos/seed/default/800/450'
                  }
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* オーバーレイ情報 */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5 shadow-sm">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    残り{daysLeft()}日
                  </span>
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5 shadow-sm">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {project.supporters_count || 0}人が支援
                  </span>
                </div>
              </div>
            </div>

            {/* 右側：プロジェクト情報 */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {project.office_status === 'approved' && (
                      <span className="bg-oshi-purple-100 text-oshi-purple-600 px-2 py-1 rounded-md text-sm font-medium">
                        事務所承認済み
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm font-medium">
                      {project.status === 'active' ? '実施中' : '終了'}
                    </span>
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
                        {new Date(project.start_date).toLocaleDateString()}
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
                        終了：{new Date(project.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* 進捗バーとボタン */}
                <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="relative">
                      <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="absolute -top-1 right-0 bg-oshi-purple-500 text-white text-xs px-2 py-0.5 rounded transform translate-y-[-100%]">
                        {Math.floor(progress)}%
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        ¥{currentAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        目標 ¥{project.target_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* ボタン */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowSupportForm(true)}
                      className="flex-1 bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white px-4 py-3 sm:py-3.5 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-all duration-200 font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
                    >
                      このプロジェクトを支援する
                    </button>
                    <button
                      onClick={handleShareX}
                      className="bg-white text-oshi-purple-500 px-4 py-3 sm:py-3.5 rounded-full border-2 border-oshi-purple-500 hover:bg-oshi-purple-50 transition-colors duration-200 font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      シェア
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* 左側：企画詳細 */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* プロジェクトのハッシュタグ */}
              {(project.project_hashtag || project.support_hashtag) && (
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
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    プロジェクトのハッシュタグ
                  </h2>
                  <div className="space-y-3">
                    {project.project_hashtag && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500">
                          プロジェクト専用ハッシュタグ
                        </span>
                        <span className="text-oshi-purple-500 font-medium text-sm sm:text-base">
                          {project.project_hashtag}
                        </span>
                      </div>
                    )}
                    {project.support_hashtag && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500">
                          支援完了報告専用ハッシュタグ
                        </span>
                        <span className="text-oshi-purple-500 font-medium text-sm sm:text-base">
                          {project.support_hashtag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 企画詳細 */}
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
            </div>

            {/* 右側：支援情報 */}
            <div className="space-y-4 sm:space-y-6">
              {/* 支援プラン */}
              <div className="sticky top-[5.5rem]">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    支援プラン
                  </h2>
                  <div className="bg-gradient-to-br from-oshi-purple-50 to-oshi-pink-50 rounded-lg p-4 border border-oshi-pink-100/30">
                    <div className="text-lg font-bold text-oshi-purple-600 mb-2">
                      ¥{SUPPORT_PLAN.amount.toLocaleString()}
                    </div>
                    <div className="space-y-2">
                      {SUPPORT_PLAN.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <svg
                            className="w-4 h-4 text-oshi-pink-500 mt-0.5 flex-shrink-0"
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
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowSupportForm(true)}
                      className="w-full mt-4 bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white px-4 py-2 rounded-lg hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                    >
                      このプランで支援する
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 支援フォームモーダル */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  プロジェクトを支援する
                </h3>
                <button
                  onClick={() => setShowSupportForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SupportForm
                projectId={project.id}
                projectTitle={project.title}
                amount={SUPPORT_PLAN.amount}
                onClose={() => setShowSupportForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
