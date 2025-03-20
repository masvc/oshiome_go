import { useState } from 'react';
import { ProjectCard } from '../components/features/ProjectCard';
import { useFavorites } from '../hooks/useFavorites';

// モックデータ
const mockFavoriteProjects = [
  {
    id: '1',
    title: '推しの誕生日を渋谷の街頭ビジョンでお祝い！',
    description: '大好きな推しの誕生日を、渋谷の大型ビジョンでみんなでお祝いしましょう！',
    imageUrl: 'https://picsum.photos/seed/project1/800/600',
    targetAmount: 300000,
    currentAmount: 280000,
    supporterCount: 42,
    deadline: '2024-04-30',
    is_favorite: true
  },
  {
    id: '2',
    title: '推しへの感謝の気持ちを池袋の広告で伝えたい！',
    description: '日頃の感謝を込めて、池袋の駅広告でメッセージを届けます。',
    imageUrl: 'https://picsum.photos/seed/project2/800/600',
    targetAmount: 500000,
    currentAmount: 320000,
    supporterCount: 64,
    deadline: '2024-05-15',
    is_favorite: true
  }
];

export const Favorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const handleRemoveFavorite = async (projectId: string) => {
    try {
      setLoading(true);
      // ローカルストレージの更新はuseFavoritesフックで行われる
      await new Promise(resolve => setTimeout(resolve, 500));
      toggleFavorite({ id: projectId } as any); // 型エラーを回避するための一時的な対応
    } catch (error: any) {
      setError('お気に入りの解除に失敗しました');
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
          {favorites.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onFavoriteToggle={() => handleRemoveFavorite(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 