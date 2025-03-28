import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Footer = () => {
  const [showTeamIcon, setShowTeamIcon] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const footerLinks = [
    {
      title: 'サービスについて',
      links: [
        { text: '応援広告ガイド', to: '/guide' },
        { text: 'プロジェクト一覧', to: '/projects' },
      ],
    },
    {
      title: '法的情報',
      links: [
        { text: '利用規約', to: '/terms' },
        { text: 'プライバシーポリシー', to: '/privacy' },
        { text: '特定商取引法に基づく表記', to: '/legal' },
      ],
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <footer className="bg-white border-t mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* メインフッターコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* ロゴセクション */}
          <div className="col-span-1 md:col-span-5">
            <Link to="/" className="inline-block group">
              <div className="flex items-end mb-4">
                <img
                  src="/favicon.png"
                  alt="推しおめロゴ"
                  className="h-8 w-8 mr-2 group-hover:opacity-80 transition-opacity"
                />
                <div className="bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 bg-clip-text text-transparent flex items-end">
                  <span className="text-xl font-display font-bold leading-none">
                    推し
                  </span>
                  <span className="text-xs text-gray-400 mx-0.5 mb-1">に</span>
                  <span className="text-xl font-display font-bold leading-none">
                    おめ
                  </span>
                  <span className="text-xs text-gray-400 ml-0.5 mb-1">
                    でとうを
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-gray-500 font-body">
              推しの誕生日を、みんなで祝おう。
            </p>
          </div>

          {/* デスクトップ用リンクセクション */}
          <div className="hidden md:grid col-span-1 md:col-span-7 grid-cols-2 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-display font-bold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-500 hover:text-oshi-pink-500 transition-all duration-200 font-body group flex items-center"
                      >
                        {link.text}
                        <svg
                          className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* モバイル用アコーディオン */}
        <div className="md:hidden">
          {footerLinks.map((section, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-4 flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openAccordion === index}
              >
                <h3 className="font-display font-bold text-gray-900">
                  {section.title}
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openAccordion === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openAccordion === index ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <ul className="py-2 space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.to}
                        className="block px-4 py-2 text-sm text-gray-500 hover:text-oshi-pink-500 transition-colors font-body"
                        onClick={() => setOpenAccordion(null)}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* コピーライトと管理リンク */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              <a href="https://peaky.co.jp/" className="hover:text-oshi-pink-500 transition-colors">&copy; peaky inc.</a>
            </p>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <button
                onClick={() => setShowTeamIcon(true)}
                className="text-xs text-gray-400 hover:text-oshi-pink-500 transition-colors font-body py-2 px-2 -mx-2"
              >
                運営者
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* チームアイコンモーダル */}
      {showTeamIcon && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTeamIcon(false)}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTeamIcon(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col items-center">
              <img
                src="/teamicon.png"
                alt="チームアイコン"
                className="w-64 h-64 object-contain mb-4"
              />
              <p className="text-center text-gray-700 font-medium">
                ラッコラーメン
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
