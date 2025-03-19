import { useEffect, useState } from 'react';
import { Project } from '../types/project';
import { projectRepository, ProjectFilter } from '../repositories/project';
import { ProjectCard } from '../components/features/ProjectCard';
import { GlitterEffect } from '../components/common/GlitterEffect';

const ITEMS_PER_PAGE = 6;

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
        const data = await projectRepository.getAllWithProgress(activeFilter);
        setProjects(data);
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
                <ProjectCard
                  key={project.id}
                  project={formatProjectForCard(project)}
                />
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
