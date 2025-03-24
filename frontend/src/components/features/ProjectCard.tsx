import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  targetAmount: number;
  currentAmount: number;
  supporters_count: number;
  deadline: string;
  is_favorite?: boolean;
  onFavoriteToggle?: (projectId: string) => void;
  creator?: {
    name: string;
    avatarUrl: string;
  };
  office_approved: boolean;  // true: 確認中, false: 承認済み
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  thumbnail_url,
  targetAmount,
  currentAmount,
  supporters_count,
  deadline,
  is_favorite: propIsFavorite,
  onFavoriteToggle,
  creator,
  office_approved
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavoriteState = propIsFavorite ?? isFavorite(id);

  // 金額のフォーマット
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 残り日数の計算
  const calculateRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 進捗率の計算
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const progress = calculateProgress(currentAmount, targetAmount);
  const remainingDays = calculateRemainingDays(deadline);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // リンクのナビゲーションを防ぐ
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    } else {
      toggleFavorite({
        id,
        title,
        description,
        thumbnail_url,
        targetAmount,
        currentAmount,
        supporters_count,
        deadline,
        creator
      });
    }
  };

  return (
    <Link
      to={`/projects/${id}`}
      className="group block bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9]">
        <img
          src={thumbnail_url || 'https://via.placeholder.com/400x200'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white line-clamp-2 group-hover:text-oshi-pink-200 transition-colors flex-1 mr-4">
                {title}
              </h3>
            </div>
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors shrink-0"
            >
              <svg
                className={`w-5 h-5 ${
                  isFavoriteState ? 'text-oshi-pink-400' : 'text-white'
                }`}
                fill={isFavoriteState ? 'currentColor' : 'none'}
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
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-2 flex items-center gap-2">
          {creator && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-oshi-purple-500/90 to-oshi-pink-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-5 h-5 rounded-full border border-white/30"
              />
              <span className="text-xs font-bold text-white">{creator.name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <div className="space-y-0.5">
              <div className="font-display font-bold text-lg sm:text-xl text-oshi-purple-500">
                {formatAmount(currentAmount)}
              </div>
              <div className="text-xs text-gray-500 font-body">
                目標: {formatAmount(targetAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-base text-oshi-pink-500">
                {progress}%
              </div>
              <div className="text-xs text-gray-500 font-body">達成</div>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-600 font-body">
              <svg
                className="w-3.5 h-3.5"
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
              <span>{supporters_count}人が支援</span>
            </div>
            <span className={`text-xs ${
              !office_approved ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {!office_approved ? '事務所承認済' : '事務所確認中'}
            </span>
            <div className="flex items-center gap-1.5 text-gray-600 font-body">
              <svg
                className="w-3.5 h-3.5"
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
              <span>残り{remainingDays}日</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
