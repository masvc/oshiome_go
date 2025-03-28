import { Link } from 'react-router-dom';

export interface Agency {
  id: string;
  name: string;
  description: string;
  website: string;
  categories: string[];
  guidelineUrl?: string;
}

// モックデータ
const agencies: Agency[] = [
  {
    id: '4',
    name: 'ANYCOLOR株式会社（にじさんじ）',
    description: 'VTuberグループ「にじさんじ」を運営する企業。',
    website: 'https://www.anycolor.co.jp/',
    categories: ['VTuber事務所'],
    guidelineUrl: 'https://www.anycolor.co.jp/terms-of-cheering-ad'
  },
  {
    id: '3',
    name: '株式会社BMSG',
    description: 'BE:FIRST、MAZZEL、SKY-HIなどのアーティストを擁する事務所。',
    website: 'https://bmsg.jp/',
    categories: ['音楽事務所'],
    guidelineUrl: 'https://befirst.tokyo/news/20230714-announcement/'
  },
  {
    id: '8',
    name: '株式会社Brave group（ぶいすぽっ！）',
    description: 'VTuberグループ「ぶいすぽっ！」を運営する企業。',
    website: 'https://vspo.jp/',
    categories: ['VTuber事務所'],
    guidelineUrl: 'https://vspo.jp/guide'
  },
  {
    id: '7',
    name: '株式会社VOISING',
    description: 'いれいす、すたぽら、シクフォニなどのタレントを擁する事務所。',
    website: 'https://voising-official.com/',
    categories: ['タレント事務所'],
    guidelineUrl: 'https://voising-official.com/cheering'
  },
  {
    id: '5',
    name: 'カバー株式会社（ホロライブ）',
    description: 'VTuberグループ「ホロライブ」を運営する企業。',
    website: 'https://cover-corp.com/',
    categories: ['VTuber事務所'],
    guidelineUrl: 'https://hololivepro.com/terms/'
  },
  {
    id: '2',
    name: 'LAPONE ENTERTAINMENT',
    description: 'JO1、INI、DXTEENなどの人気アイドルグループを擁する事務所。',
    website: 'https://lapone.jp/',
    categories: ['アイドル事務所'],
    guidelineUrl: 'https://jo1.jp/news/detail/2217'
  },
  {
    id: '1',
    name: 'PRODUCE 101 JAPAN',
    description: '韓国の人気オーディション番組の日本版。アイドルグループのメンバーを選出。',
    website: 'https://produce101.jp/',
    categories: ['アイドル事務所'],
    guidelineUrl: 'https://produce101.jp/news/detail/46'
  },
  {
    id: '6',
    name: 'UUUM株式会社',
    description: 'HIKAKIN、はじめしゃちょーなどの人気YouTuberを擁する事務所。',
    website: 'https://www.uuum.jp/',
    categories: ['YouTuber事務所'],
    guidelineUrl: 'https://www.uuum.jp/secondary_creation'
  }
];

export const Agencies = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
          対応事務所一覧
        </h1>
        <p className="text-gray-600 max-w-2xl">
          応援広告・生誕広告を容認している事務所のガイドラインをまとめています
        </p>
      </section>

      {/* 事務所一覧 */}
      <section>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
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
              to="/visions"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              連携ビジョンを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agencies;
