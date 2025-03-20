import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Footer = () => {
  const [showTeamIcon, setShowTeamIcon] = useState(false);

  const footerLinks = [
    {
      title: 'サービスについて',
      links: [
        { text: '応援広告ガイド', to: '/guide' },
        { text: 'プロジェクト一覧', to: '/projects' },
        { text: '企画を始める', to: '/contact' },
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

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* メインフッターコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* ロゴセクション */}
          <div className="col-span-1">
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

          {/* リンクセクション */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1">
              <h3 className="font-display font-bold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-oshi-pink-500 transition-colors font-body"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* お問い合わせセクション */}
          <div className="col-span-1">
            <h3 className="font-display font-bold text-gray-900 mb-4">
              お問い合わせ
            </h3>
            <Link
              to="/contact"
              className="inline-block px-6 py-2 text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-colors font-body text-sm shadow-sm hover:shadow-md"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </div>

        {/* コピーライトと管理リンク */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 font-body">
              &copy; 2024 推しおめ All Rights Reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <button
                onClick={() => setShowTeamIcon(true)}
                className="text-xs text-gray-400 hover:text-oshi-pink-500 transition-colors font-body py-2 px-2 -mx-2"
              >
                運営元
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
