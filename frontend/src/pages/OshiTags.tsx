import { useState } from 'react';

// モックデータ
const mockTags = [
  {
    id: '1',
    name: '乃木坂46',
    following: true,
    category: 'アイドル',
    newsCount: 12
  },
  {
    id: '2',
    name: 'Ado',
    following: true,
    category: 'アーティスト',
    newsCount: 8
  },
  {
    id: '3',
    name: 'ホロライブ',
    following: true,
    category: 'VTuber',
    newsCount: 15
  }
];

const mockNews = [
  {
    id: '1',
    title: '乃木坂46、新シングル発売決定！',
    date: '2024-03-20',
    tag: '乃木坂46',
    source: 'Music News',
    url: '#'
  },
  {
    id: '2',
    title: 'Ado、世界ツアー開催発表',
    date: '2024-03-19',
    tag: 'Ado',
    source: 'Entertainment Weekly',
    url: '#'
  },
  {
    id: '3',
    title: 'ホロライブ、新人VTuber募集開始',
    date: '2024-03-18',
    tag: 'ホロライブ',
    source: 'VTuber News',
    url: '#'
  }
];

export const OshiTags = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState(mockTags);
  const [news, setNews] = useState(mockNews);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredNews = selectedTag
    ? news.filter((item) => item.tag === selectedTag)
    : news;

  const handleTagToggle = async (tagId: string) => {
    try {
      setLoading(true);
      // モック: タグのフォロー状態を切り替え
      await new Promise(resolve => setTimeout(resolve, 500));
      setTags(tags.map(tag =>
        tag.id === tagId ? { ...tag, following: !tag.following } : tag
      ));
    } catch (error) {
      setError('タグの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          推しタグ情報
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          フォローしている推しのニュースをチェックできます
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* タグ一覧 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">フォロー中のタグ</h2>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedTag(null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedTag === null
                    ? 'bg-oshi-purple-50 text-oshi-purple-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                すべて
              </button>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <button
                    onClick={() => setSelectedTag(tag.name)}
                    className={`flex-1 text-left ${
                      selectedTag === tag.name
                        ? 'text-oshi-purple-600'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{tag.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({tag.newsCount})
                    </span>
                  </button>
                  <button
                    onClick={() => handleTagToggle(tag.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      tag.following
                        ? 'text-oshi-pink-500 hover:text-oshi-pink-600'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={tag.following ? 'currentColor' : 'none'}
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
              ))}
            </div>
          </div>
        </div>

        {/* ニュース一覧 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                最新ニュース
                {selectedTag && <span className="ml-2 text-gray-500">- {selectedTag}</span>}
              </h2>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">ニュースがありません</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.source} - {new Date(item.date).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oshi-purple-100 text-oshi-purple-800">
                        {item.tag}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 