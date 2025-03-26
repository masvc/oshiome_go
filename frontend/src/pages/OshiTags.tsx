import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { oshiTagService, OshiTag } from '../api/services/oshiTagService';
import { useDebounce } from '@/hooks/useDebounce';

export const OshiTags = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTags, setPopularTags] = useState<OshiTag[]>([]);
  const [followingTags, setFollowingTags] = useState<OshiTag[]>([]);
  const [searchResults, setSearchResults] = useState<OshiTag[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popularData, followingData] = await Promise.all([
          oshiTagService.getPopularTags(),
          oshiTagService.getFollowingTags()
        ]);
        setPopularTags(popularData);
        setFollowingTags(followingData);
      } catch (error) {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const searchTags = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const results = await oshiTagService.searchTags(debouncedSearchQuery);
        setSearchResults(results);
      } catch (error) {
        setError('検索に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    searchTags();
  }, [debouncedSearchQuery]);

  const handleTagClick = (tagId: string) => {
    navigate(`/oshi-tags/${tagId}`);
  };

  const handleFollowToggle = async (tagId: string, isFollowing: boolean) => {
    try {
      setLoading(true);
      if (isFollowing) {
        await oshiTagService.unfollowTag(tagId);
      } else {
        await oshiTagService.followTag(tagId);
      }
      
      // 状態を更新
      setPopularTags(tags => 
        tags.map(tag => 
          tag.id === tagId ? { ...tag, isFollowing: !isFollowing } : tag
        )
      );
      setFollowingTags(tags => 
        isFollowing 
          ? tags.filter(tag => tag.id !== tagId)
          : [...tags, popularTags.find(tag => tag.id === tagId)!]
      );
    } catch (error) {
      setError('フォロー状態の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const renderSimpleTagCard = (tag: OshiTag) => (
    <button
      key={tag.id}
      onClick={() => handleFollowToggle(tag.id, tag.isFollowing)}
      className={`group inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
        tag.isFollowing
          ? 'bg-gradient-to-r from-[#FF66B2] to-[#B266FF] text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      <svg
        className={`w-3 h-3 ${tag.isFollowing ? 'text-white' : 'text-gray-500'} stroke-[2.5]`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={tag.isFollowing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
        />
      </svg>
      <span className="font-medium text-[11px]">{tag.name}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
        {tag.followerCount.toLocaleString()}
      </span>
    </button>
  );

  const renderTagCard = (tag: OshiTag) => (
    <div
      key={tag.id}
      className="group relative"
    >
      {/* メインコンテンツ */}
      <div className="bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg relative overflow-hidden">
        {/* 栞のストライプパターン */}
        <div className="absolute left-0 top-0 bottom-0 w-2">
          <div className="h-full w-full bg-gradient-to-b from-[#FF66B2] via-[#B266FF] to-[#6666FF]"></div>
          <div className="absolute inset-0">
            <div className="h-full w-full" style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)`
            }}></div>
          </div>
        </div>
        
        {/* コンテンツ */}
        <div className="pl-4 pr-5 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">{tag.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{tag.category}</p>
              <div className="mt-2 flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#FF66B2] to-[#B266FF]"></div>
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF66B2] to-[#B266FF]">
                  {tag.followerCount.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  人が推しタグ中！
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button
                onClick={() => handleFollowToggle(tag.id, tag.isFollowing)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  tag.isFollowing
                    ? 'text-white bg-gradient-to-r from-[#FF66B2] to-[#B266FF] hover:from-[#FF4DA6] hover:to-[#A64DFF] shadow-md'
                    : 'text-gray-400 hover:text-[#B266FF] hover:bg-purple-50'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={tag.isFollowing ? 'currentColor' : 'none'}
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
              </button>
              <button
                onClick={() => handleTagClick(tag.id)}
                className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#B266FF] to-[#6666FF] hover:from-[#A64DFF] hover:to-[#4D4DFF]"
              >
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          推しタグ情報
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          アイドルやアーティストの情報をフォローして、最新のニュースやプロジェクトをチェックできます
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 検索セクション */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="アイドルやアーティストを検索..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 検索結果 */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">検索結果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map(renderTagCard)}
          </div>
        </div>
      )}

      {/* 人気の推しタグ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">人気の推しタグ</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(renderSimpleTagCard)}
        </div>
      </div>

      {/* フォロー中の推しタグ */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">フォロー中の推しタグ</h2>
        {followingTags.length === 0 ? (
          <p className="text-gray-500">まだフォローしている推しタグがありません</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followingTags.map(renderTagCard)}
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
          </div>
        </div>
      )}
    </div>
  );
}; 