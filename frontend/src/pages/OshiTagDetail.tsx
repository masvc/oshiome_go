import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { oshiTagService, OshiTagDetailData } from '../api/services/oshiTagService';

export const OshiTagDetail = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const [tagDetail, setTagDetail] = useState<OshiTagDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);

  useEffect(() => {
    const fetchTagDetail = async () => {
      try {
        if (!tagId) return;
        const data = await oshiTagService.getTagDetail(tagId);
        setTagDetail(data);
        setIsFollowing(data.isFollowing);
      } catch (err) {
        setError('タグの詳細情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchTagDetail();
  }, [tagId]);

  const handleFollowToggle = async () => {
    if (!tagId || !tagDetail) return;

    try {
      if (isFollowing) {
        await oshiTagService.unfollowTag(tagId);
      } else {
        await oshiTagService.followTag(tagId);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      setError('フォロー状態の更新に失敗しました');
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
      </div>
    );
  }

  if (error || !tagDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'タグが見つかりませんでした'}
        </div>
      </div>
    );
  }

  const displayedProjects = showAllProjects ? tagDetail.projects : tagDetail.projects.slice(0, 3);
  const displayedNews = showAllNews ? tagDetail.news : tagDetail.news.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダーセクション */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#FF66B2] to-[#B266FF]"></div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF66B2] to-[#B266FF]">
              {tagDetail.followerCount.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-base text-gray-500 whitespace-nowrap">
              人が推しタグ中！
            </span>
          </div>
          <button
            onClick={handleFollowToggle}
            className={`inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all whitespace-nowrap ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-[#FF66B2] to-[#B266FF] text-white hover:from-[#FF4D99] hover:to-[#9933FF]'
            }`}
          >
            <svg
              className={`w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 ${isFollowing ? 'text-gray-600' : 'text-white'}`}
              fill={isFollowing ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {isFollowing ? '推しタグ中' : '推しタグする'}
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tagDetail.name}</h1>
        <p className="text-sm text-gray-500 mb-4">{tagDetail.category}</p>
        <p className="text-gray-600">{tagDetail.description}</p>
      </div>

      {/* プロジェクトセクション */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">推しおめプロジェクト一覧</h2>
          {tagDetail.projects.length > 3 && (
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="text-oshi-purple-500 hover:text-oshi-pink-500 transition-colors text-sm font-medium"
            >
              {showAllProjects ? '閉じる' : 'もっと見る →'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={project.thumbnail_url || `https://picsum.photos/seed/${project.id}/400/300`}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-oshi-purple-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-oshi-purple-500">
                      {formatAmount(project.targetAmount)}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <svg
                        className="w-3 h-3"
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
                      <span>{project.daysLeft}日</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg
                      className="w-3 h-3"
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
                    <span>{project.supporters_count}人</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ニュースセクション */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">最新ニュース</h2>
          {tagDetail.news.length > 5 && (
            <button
              onClick={() => setShowAllNews(!showAllNews)}
              className="text-oshi-purple-500 hover:text-oshi-pink-500 transition-colors text-sm font-medium"
            >
              {showAllNews ? '閉じる' : 'もっと見る →'}
            </button>
          )}
        </div>
        <div className="space-y-4">
          {displayedNews.map((news) => (
            <a
              key={news.id}
              href={news.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="flex items-start p-4 gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={news.thumbnail_url || `https://picsum.photos/seed/${news.id}/200/200`}
                    alt={news.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-oshi-purple-500 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {news.content}
                  </p>
                  <time className="text-xs text-gray-500">
                    {new Date(news.date).toLocaleDateString('ja-JP')}
                  </time>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-oshi-purple-500 transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}; 