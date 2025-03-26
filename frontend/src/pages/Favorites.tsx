import { useState } from 'react';
import { ProjectCard } from '../components/features/ProjectCard';
import { useFavorites } from '../hooks/useFavorites';
import { APIErrorResponse } from '../types/error';
import { formatProjectForCard } from '../utils/projectUtils';
import { Project } from '../types/project';

export const Favorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const handleRemoveFavorite = async (projectId: string) => {
    if (!projectId) {
      setError('プロジェクトIDが見つかりません。');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      await toggleFavorite({ id: projectId } as any);
    } catch (error) {
      if (error instanceof APIErrorResponse) {
        if (error.message.includes('not found')) {
          setError('プロジェクトが見つかりませんでした。');
        } else if (error.message.includes('unauthorized')) {
          setError('お気に入りの解除には再度ログインが必要です。');
        } else {
          setError(`お気に入りの解除に失敗しました: ${error.message}`);
        }
      } else {
        setError('予期せぬエラーが発生しました。時間をおいて再度お試しください。');
      }
      console.error('お気に入り解除エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          お気に入りプロジェクト
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          お気に入り登録したプロジェクト一覧です
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && favorites.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">お気に入りがありません</h3>
          <p className="mt-1 text-sm text-gray-500">
            プロジェクトをお気に入り登録すると、ここに表示されます。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const project: Project = {
              id: parseInt(favorite.id),
              title: favorite.title,
              description: favorite.description,
              target_amount: favorite.targetAmount,
              current_amount: favorite.currentAmount,
              deadline: favorite.deadline,
              status: 'active',
              thumbnail_url: favorite.thumbnail_url,
              image_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: 0,
              user: favorite.creator ? {
                id: 0,
                name: favorite.creator.name,
                email: '',
                profile_image_url: favorite.creator.avatarUrl,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } : undefined,
              supporters_count: favorite.supporters_count,
              office_approved: favorite.office_approved
            };
            return (
              <ProjectCard
                key={project.id}
                {...formatProjectForCard(project)}
                is_favorite={true}
                onFavoriteToggle={() => handleRemoveFavorite(favorite.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}; 