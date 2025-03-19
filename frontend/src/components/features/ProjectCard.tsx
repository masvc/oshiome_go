import { Link } from 'react-router-dom';

export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    imageUrl: string;
    supporterCount: number;
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // 進捗率を計算
  const progress = Math.min(
    Math.round((project.currentAmount / project.targetAmount) * 100),
    100
  );

  // 金額のフォーマット
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 残り日数の計算
  const daysLeft = () => {
    const end = new Date(project.deadline);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9]">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="font-display font-bold text-sm sm:text-base text-white mb-1 sm:mb-2 line-clamp-2 group-hover:text-oshi-pink-200 transition-colors">
            {project.title}
          </h3>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <div className="space-y-0.5">
              <div className="font-display font-bold text-lg sm:text-xl text-oshi-purple-500">
                {formatAmount(project.currentAmount)}
              </div>
              <div className="text-xs text-gray-500 font-body">
                目標: {formatAmount(project.targetAmount)}
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
            <span>{project.supporterCount}人が支援</span>
          </div>
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
            <span>残り{daysLeft()}日</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
