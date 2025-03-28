import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Vision } from '../types/vision';

// モックデータ
const mockVisions: Vision[] = [
  {
    id: '1',
    name: 'リア・エイド 渋谷センター街ビジョン',
    location: '渋谷区宇田川町29-2 　Lighting BOX',
    size: '縦 2,500ｍｍ×横 4,250ｍｍ（4.8ｍｍピッチ）',
    period: '9：00～26：00（17時間／日）',
    description: '渋谷センタ－街の中心部の目線の低い宣伝効果の高い媒体',
    image_url: '/images/visions/shibuya-center.png',
  },
  {
    id: '2',
    name: 'リア・エイド 渋谷宇田川町ビジョン',
    location: '渋谷区宇田川町11-6　宇田川KKビル',
    size: '縦 3ｍ×横 4m（3.9ピッチ）',
    period: '9：00～24：00（15時間／日）',
    description: '渋谷東急ハンズ前、Abemaタワ－付近の目線の低い媒体',
    image_url: 'https://picsum.photos/seed/shibuya-udagawa/800/450',
  },
  {
    id: '3',
    name: '渋谷道玄坂ビジョン',
    location: '渋谷区道玄坂2-11-4　　ストーク道玄坂',
    size: '縦 2,880ｍｍ×横 5,280ｍｍ（4.8ｍｍピッチ）',
    period: '9：00～24：00（15時間／日）',
    description: '音声ありのビジョンの全くない道玄坂地区の初ビジョン',
    image_url: '/images/visions/shibuya-dougenzaka.png',
  },
  {
    id: '4',
    name: 'リア・エイド 三軒茶屋ビジョン',
    location: '世田谷区太子堂4-23-2 ブンカビル',
    size: '縦 3ｍ×横 5ｍ（3.9ピッチ）',
    period: '8：00～23：00（15時間／日）',
    description: '国道246号線と世田谷通りの交差する三軒茶屋で一番賑わう場所',
    image_url: 'https://picsum.photos/seed/sangenjaya/800/450',
  },
  {
    id: '5',
    name: 'リア・エイド 新宿ビジョン',
    location: '新宿区新宿3-21-7　東新ビル',
    size: '縦 4ｍ×横 4ｍ（3.9ｍｍピッチ）',
    period: '9：00～25：00（16時間／日）',
    description: '歩行者・車両の多い新宿モア一番街と靖国通りの交差点媒体',
    image_url: 'https://picsum.photos/seed/shinjuku/800/450',
  },
  {
    id: '6',
    name: 'リア・エイド 歌舞伎町ビジョン【２面】',
    location: '新宿区歌舞伎町1-21-12   カド－ビル',
    size: '大型＝縦 2.5ｍ×横 2.5ｍ／小型＝縦 2ｍ×横 3ｍ（3.9ピッチ）',
    period: '9：00～26：00（17時間／日）',
    description: '歌舞伎町東宝タワ－前の広場に位置する歩行者で賑わう場所',
    image_url: 'https://picsum.photos/seed/kabukicho/800/450',
  },
  {
    id: '7',
    name: 'リア・エイド 高田馬場ビジョン',
    location: '新宿区高田馬場4-7-3　グランド東京ビル',
    size: '縦 2ｍ×横 3.5ｍ（3.9ｍｍピッチ）',
    period: '7：00～24：00（17時間／日）',
    description: '山手線「高田馬場」駅ホーム階段前の一番乗降客が溜まる場所',
    image_url: 'https://picsum.photos/seed/takadanobaba/800/450',
  },
  {
    id: '8',
    name: 'リア・エイド 新大久保ビジョン',
    location: '新宿区百人町1-10-11 　フレスカビル',
    size: '縦 2ｍ×横 2.5ｍ（3.9ピッチ）',
    period: '7：00～23：00（16時間／日）',
    description: '若者で賑わう山手線「新大久保」駅ホ－ム中心部に位置',
    image_url: 'https://picsum.photos/seed/shinokubo/800/450',
  },
  {
    id: '9',
    name: 'リア・エイド 池袋ビジョン',
    location: '豊島区東池袋1-8-6 　藤久ビル',
    size: '縦 3ｍ×横 4ｍ（3.9ピッチ）',
    period: '8：00～24：00（16時間／日）',
    description: '池袋駅東口の明治通り沿いの大型商業施設の多い場所',
    image_url: 'https://picsum.photos/seed/ikebukuro/800/450',
  },
  {
    id: '10',
    name: 'アメ横　Ｙｓ ビジョン',
    location: '台東区4-7-8 アメ横センタービル',
    size: '縦 3ｍ×横 5ｍ（3.9ピッチ）',
    period: '7：00～22：00（15時間／日）',
    description: '歩行者で賑わうアメ横の中心部の分岐地点の正面に可視出来る媒体',
    image_url: 'https://picsum.photos/seed/ameyoko/800/450',
  },
  {
    id: '11',
    name: 'リア・エイド 立川ビジョン',
    location: '立川市柴崎町3-4-18 ＴＲＮ立川ビル',
    size: '縦 3ｍ×横 5ｍ（3.9ピッチ）',
    period: '8：00～23：00（15時間／日）',
    description: '終日賑わう立川駅南口の歓楽街に位置する媒体',
    image_url: 'https://picsum.photos/seed/tachikawa/800/450',
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
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
          推しおめ連携ビジョン掲載事例
        </h1>
        <p className="text-gray-600 max-w-2xl">
          全国の主要な街頭ビジョンと連携し、スムーズな応援メッセージの放映をサポートします。
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
                      className="w-full h-full object-contain bg-gray-50 transition-transform group-hover:scale-105"
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/guide"
              className="inline-flex items-center justify-center gap-2 bg-white text-oshi-purple-500 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              応援広告ガイドを見る
            </Link>
            <Link
              to="/agencies"
              className="inline-flex items-center justify-center gap-2 bg-oshi-purple-600 text-white px-8 py-4 rounded-xl hover:bg-oshi-purple-700 transition-all border border-white/20 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              対応事務所一覧を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visions;
