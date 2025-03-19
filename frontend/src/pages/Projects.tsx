import { useEffect, useState } from 'react';
import { Project } from '../types/project';
import { ProjectCard } from '../components/features/ProjectCard';
import { GlitterEffect } from '../components/common/GlitterEffect';

const ITEMS_PER_PAGE = 6;

// 仮のプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: '1',
    title: '渋谷ビジョンで推しの誕生日を祝おう！',
    description: '渋谷の大型ビジョンで、みんなで一緒に推しの誕生日をお祝いしましょう。',
    target_amount: 500000,
    current_amount: 300000,
    end_date: '2024-05-01',
    image_url: 'https://picsum.photos/seed/1/800/450',
    supporters_count: 30,
  },
  {
    id: '2',
    title: '池袋サンシャインでバースデー広告',
    description: '池袋サンシャインシティの大型ビジョンで誕生日広告を実施します。',
    target_amount: 400000,
    current_amount: 200000,
    end_date: '2024-06-15',
    image_url: 'https://picsum.photos/seed/2/800/450',
    supporters_count: 20,
  },
  {
    id: '3',
    title: '新宿アルタで誕生日をお祝い',
    description: '新宿アルタのビジョンで、推しの誕生日を華やかにお祝いしましょう。',
    target_amount: 300000,
    current_amount: 150000,
    end_date: '2024-07-30',
    image_url: 'https://picsum.photos/seed/3/800/450',
    supporters_count: 15,
  },
  {
    id: '4',
    title: '原宿竹下通りでお誕生日イベント',
    description: '原宿竹下通りの大型ビジョンで誕生日メッセージを放映します。',
    target_amount: 350000,
    current_amount: 100000,
    end_date: '2024-08-20',
    image_url: 'https://picsum.photos/seed/4/800/450',
    supporters_count: 10,
  },
  {
    id: '5',
    title: '秋葉原でバースデーセレブレーション',
    description: '秋葉原の大型ビジョンで誕生日をお祝いします。',
    target_amount: 450000,
    current_amount: 250000,
    end_date: '2024-09-10',
    image_url: 'https://picsum.photos/seed/5/800/450',
    supporters_count: 25,
  },
  {
    id: '6',
    title: '表参道ヒルズでバースデー広告',
    description: '表参道ヒルズの大型ビジョンで誕生日メッセージを放映します。',
    target_amount: 600000,
    current_amount: 400000,
    end_date: '2024-10-05',
    image_url: 'https://picsum.photos/seed/6/800/450',
    supporters_count: 35,
  },
];

type ProjectFilter = 'all' | 'active' | 'ended';

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // 遅延を追加して非同期処理をシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // フィルタリング
        const filteredProjects = mockProjects.filter(project => {
          if (activeFilter === 'all') return true;
          const endDate = new Date(project.end_date);
          const now = new Date();
          return activeFilter === 'active' ? endDate > now : endDate <= now;
        });
        
        setProjects(filteredProjects);
        setError(null);
      } catch (err) {
        console.error('プロジェクト取得エラー:', err);
        setError('プロジェクトの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeFilter]);

  // フィルターが変更されたら1ページ目に戻る
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // プロジェクトデータをProjectCardコンポーネントの形式に変換
  const formatProjectForCard = (project: Project) => {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      targetAmount: project.target_amount,
      currentAmount: project.current_amount,
      deadline: project.end_date,
      imageUrl: project.image_url || 'https://picsum.photos/seed/default/800/450',
      supporterCount: project.supporters_count || 0,
    };
  };

  // ページネーション用の計算
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <>
      <GlitterEffect enabled={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            プロジェクト一覧
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            推しの誕生日を祝うためのプロジェクトを探してみましょう。
            あなたの想いを届けるプロジェクトが見つかるかもしれません。
          </p>
        </div>

        {/* フィルター */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === 'all'
                ? 'bg-oshi-purple-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === 'active'
                ? 'bg-oshi-purple-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            進行中
          </button>
          <button
            onClick={() => setActiveFilter('ended')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === 'ended'
                ? 'bg-oshi-purple-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            終了
          </button>
        </div>

        {/* ローディング状態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
          </div>
        )}

        {/* エラー状態 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* プロジェクト一覧 */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <ProjectCard key={project.id} {...formatProjectForCard(project)} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                プロジェクトがありません。
              </div>
            )}
          </div>
        )}

        {/* ページネーション */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                前へ
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-oshi-purple-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                次へ
              </button>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
