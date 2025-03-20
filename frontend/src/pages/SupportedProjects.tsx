import { useState } from 'react';
import { ProjectCard } from '../components/features/ProjectCard';

// モックデータ
const mockSupportedProjects = [
  {
    id: '1',
    title: '渋谷の大型ビジョンでお誕生日をお祝い！',
    description: '渋谷の大型ビジョンで推しのお誕生日をお祝いします！',
    imageUrl: 'https://picsum.photos/seed/project1/800/600',
    targetAmount: 500000,
    currentAmount: 450000,
    supporterCount: 89,
    deadline: '2024-05-15',
    status: '支援完了',
    supportedAt: '2024-03-15'
  },
  {
    id: '2',
    title: '池袋駅構内の広告でデビュー記念をお祝い！',
    description: '池袋駅構内の広告スペースでデビュー1周年をお祝いします！',
    imageUrl: 'https://picsum.photos/seed/project2/800/600',
    targetAmount: 300000,
    currentAmount: 300000,
    supporterCount: 42,
    deadline: '2024-04-01',
    status: '実施完了',
    supportedAt: '2024-02-20'
  }
];

export const SupportedProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState(mockSupportedProjects);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          参加プロジェクト
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          あなたが参加した推し応援プロジェクトの一覧です
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
        </div>
      ) : projects.length === 0 ? (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">参加プロジェクトがありません</h3>
          <p className="mt-1 text-sm text-gray-500">
            プロジェクトに参加して推しを応援しましょう！
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <ProjectCard {...project} />
                </div>
                <div className="sm:w-2/3 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oshi-purple-100 text-oshi-purple-800">
                        {project.status}
                      </span>
                      <p className="mt-2 text-sm text-gray-500">
                        参加日: {new Date(project.supportedAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <button className="text-sm text-oshi-pink-500 hover:text-oshi-pink-600 transition-colors">
                      詳細を見る
                    </button>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-medium text-gray-900">支援金額</h3>
                    <p className="mt-1 text-2xl font-bold text-oshi-purple-500">
                      ¥{(project.targetAmount / project.supporterCount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 