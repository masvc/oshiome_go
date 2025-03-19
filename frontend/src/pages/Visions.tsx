import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Vision } from '../types/vision';

// 仮のビジョンデータ
const mockVisions: Vision[] = [
  {
    id: '1',
    name: '渋谷スクランブルビジョン',
    location: '東京都渋谷区渋谷2-23-1',
    size: '横8.0m × 縦4.5m',
    period: '15秒 × 18回/日',
    description: '渋谷スクランブル交差点に面した大型ビジョン。1日の通行人数は約50万人で、抜群の視認性を誇ります。',
    image_url: 'https://picsum.photos/seed/shibuya/800/450',
  },
  {
    id: '2',
    name: '新宿アルタビジョン',
    location: '東京都新宿区新宿3-24-3',
    size: '横6.0m × 縦3.4m',
    period: '15秒 × 15回/日',
    description: '新宿駅東口に位置する老舗の大型ビジョン。若者の往来が多く、ファン層へのアプローチに最適です。',
    image_url: 'https://picsum.photos/seed/shinjuku/800/450',
  },
  {
    id: '3',
    name: '池袋サンシャインビジョン',
    location: '東京都豊島区東池袋3-1',
    size: '横5.5m × 縦3.1m',
    period: '15秒 × 12回/日',
    description: '池袋サンシャインシティ前の大型ビジョン。アニメファンや若者の集まるスポットで高い注目度があります。',
    image_url: 'https://picsum.photos/seed/ikebukuro/800/450',
  },
];

export const Visions = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisions = async () => {
      try {
        setLoading(true);
        // 遅延を追加して非同期処理をシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVisions(mockVisions);
        setError(null);
      } catch (err) {
        console.error('ビジョン取得エラー:', err);
        setError('ビジョンの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchVisions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="text-center relative py-16 bg-gradient-to-br from-oshi-purple-50 to-oshi-pink-50 rounded-3xl border border-oshi-pink-100/30">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-grid-oshi-purple/[0.03] bg-[size:20px_20px]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          推しおめ連携ビジョン
          <br />
          掲載事例
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          全国の主要な街頭ビジョンと連携し、
          <br className="hidden sm:block" />
          スムーズな応援メッセージの放映をサポートします。
        </p>
      </section>

      {/* ビジョン一覧 */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oshi-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              再読み込みする
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:gap-12">
            {visions.map((vision: Vision) => (
              <div
                key={vision.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 transform hover:scale-[1.01]"
              >
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="aspect-video relative group">
                    <img
                      src={vision.image_url}
                      alt={vision.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {vision.name}
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base">
                        {vision.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          ビジョン情報
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-oshi-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{vision.location}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-oshi-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                            <span>サイズ：{vision.size}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-oshi-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>期間：{vision.period}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-oshi-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>名称：{vision.name}</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          特徴
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {vision.description}
                        </p>
                      </div>
                      <div className="pt-4">
                        <Link
                          to="/contact"
                          className="w-full bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white px-6 py-3 rounded-xl hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          このビジョンについて相談する
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTAセクション */}
      <section className="bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            連携ビジョン以外での
            <br />
            掲載もご相談ください
          </h2>
          <p className="text-lg text-white/90 mb-8">
            掲出場所やスケジュールなど
            <br />
            お気軽にご相談ください。
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-oshi-purple-500 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            無料相談をする
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Visions;
