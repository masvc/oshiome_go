import React, { useEffect, useState } from 'react';
import { Project } from '../types/project';
import { ProjectCard } from '../components/features/ProjectCard';
import { GlitterEffect } from '../components/common/GlitterEffect';
import { projectService } from '../api/services/projectService';

type ProjectFilter = 'all' | 'active' | 'complete';

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects();
        
        if (!response?.data) {
          throw new Error('プロジェクトデータが取得できませんでした');
        }

        // フロントエンドでフィルタリング
        const filteredProjects = response.data.filter((project: Project) => {
          switch (activeFilter) {
            case 'active':
              return project.status === 'active';
            case 'complete':
              return project.status === 'complete';
            case 'all':
            default:
              return project.status === 'active' || project.status === 'complete';
          }
        });
        
        setProjects(filteredProjects);
        setError(null);
      } catch (err) {
        console.error('プロジェクト取得エラー:', err);
        setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeFilter]);

  // プロジェクトデータをProjectCardコンポーネントの形式に変換
  const formatProjectForCard = (project: Project) => {
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description,
      targetAmount: project.target_amount,
      currentAmount: project.current_amount,
      deadline: project.deadline,
      imageUrl: project.image_url || 'https://picsum.photos/seed/default/800/450',
      supporterCount: project.supporters_count || 0,
      creator: project.user ? {
        name: project.user.name,
        avatarUrl: project.user.profile_image_url || 'https://picsum.photos/seed/default/100/100'
      } : undefined
    };
  };

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
            onClick={() => setActiveFilter('complete')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === 'complete'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id.toString()}
                title={project.title}
                description={project.description}
                imageUrl={project.thumbnail_url || 'https://via.placeholder.com/400x200'}
                targetAmount={project.target_amount}
                currentAmount={project.current_amount}
                supporterCount={project.supporters_count || 0}
                deadline={project.deadline}
                creator={project.creator}
                office_approved={project.office_approved}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
