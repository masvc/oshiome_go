import { Link } from 'react-router-dom';

export interface Agency {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url: string;
  categories: string[];
  guidelineUrl?: string;
}

// モックデータ
const agencies: Agency[] = [
  {
    id: '1',
    name: 'ホリプロ',
    description: '1960年設立。タレント・ミュージシャン・俳優など、多岐にわたる芸能プロダクション。',
    website: 'https://www.horipro.co.jp/',
    logo_url: '/images/agencies/horipro.png',
    categories: ['芸能事務所', '音楽事務所'],
    guidelineUrl: 'https://www.horipro.co.jp/guidelines/'
  },
  {
    id: '2',
    name: 'アミューズ',
    description: '1978年設立。アーティストマネジメント、音楽制作、映像制作など幅広く展開。',
    website: 'https://www.amuse.co.jp/',
    logo_url: '/images/agencies/amuse.png',
    categories: ['芸能事務所', '音楽事務所'],
    guidelineUrl: 'https://www.amuse.co.jp/guidelines/'
  },
  {
    id: '3',
    name: 'ジャニーズ事務所',
    description: '1962年設立。男性アイドルグループの育成・マネジメントを中心に展開。',
    website: 'https://www.johnnys.co.jp/',
    logo_url: '/images/agencies/johnnys.png',
    categories: ['芸能事務所'],
    guidelineUrl: 'https://www.johnnys.co.jp/guidelines/'
  }
];

export const Agencies = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="text-center relative py-16 bg-gradient-to-br from-oshi-purple-50 to-oshi-pink-50 rounded-3xl border border-oshi-pink-100/30">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-grid-oshi-purple/[0.03] bg-[size:20px_20px]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          対応事務所一覧
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          応援広告・生誕広告を容認している事務所の
          <br className="hidden sm:block" />
          ガイドラインをまとめています
        </p>
      </section>

      {/* フィルターセクション */}
      <section>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="bg-gradient-to-r from-oshi-purple-500 to-oshi-pink-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm hover:from-oshi-purple-600 hover:to-oshi-pink-600 transition-all shadow-md hover:shadow-lg">
              全て
            </button>
            <button className="bg-white text-gray-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md">
              芸能事務所
            </button>
            <button className="bg-white text-gray-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md">
              VTuber事務所
            </button>
            <button className="bg-white text-gray-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md">
              音楽事務所
            </button>
          </div>

          {/* 事務所一覧 */}
          <div className="grid gap-6">
            {agencies.map((agency: Agency) => (
              <div
                key={agency.name}
                className="bg-gradient-to-br from-oshi-purple-50/50 to-oshi-pink-50/50 rounded-xl p-6 border border-oshi-pink-100/30 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {agency.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {agency.categories.map((category: string) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oshi-purple-100 text-oshi-purple-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">{agency.description}</p>
                  </div>
                  {agency.guidelineUrl && (
                    <div className="flex-shrink-0">
                      <a
                        href={agency.guidelineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-oshi-purple-500 hover:text-oshi-pink-500 transition-colors border border-oshi-purple-200 hover:bg-oshi-purple-50 shadow-sm hover:shadow-md group"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>ガイドラインを確認</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            応援広告を始めてみませんか？
          </h2>
          <p className="text-lg text-white/90 mb-8">
            推しへの想いを形にする。その一歩を、私たちがサポートします。
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
              to="/contact"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              無料相談をする
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agencies;
