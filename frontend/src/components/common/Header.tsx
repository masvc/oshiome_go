import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* ロゴ */}
          <h1 className="text-xl sm:text-2xl font-display font-bold">
            <Link to="/" className="inline-block group">
              <div className="flex items-end">
                <img
                  src="/favicon.png"
                  alt="推しおめロゴ"
                  className="h-8 w-8 sm:h-10 sm:w-10 mr-2 group-hover:opacity-80 transition-opacity"
                />
                <div className="bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 bg-clip-text text-transparent flex items-end">
                  <span className="text-xl sm:text-2xl font-display font-bold leading-none">
                    推し
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 mx-0.5 mb-1">
                    に
                  </span>
                  <span className="text-xl sm:text-2xl font-display font-bold leading-none">
                    おめ
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 ml-0.5 mb-1">
                    でとうを
                  </span>
                </div>
              </div>
            </Link>
          </h1>

          {/* PC用ナビゲーション */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/guide"
              className="px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-oshi-pink-500 transition-colors font-body"
            >
              応援広告ガイド
            </Link>
            <Link
              to="/projects"
              className="px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-oshi-pink-500 transition-colors font-body"
            >
              プロジェクト一覧
            </Link>
            <Link
              to="/projects/create"
              className="px-4 lg:px-6 py-2 text-sm text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-colors font-body shadow-sm hover:shadow-md"
            >
              企画を作成
            </Link>
          </nav>

          {/* モバイル用メニューボタン */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <div
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* モバイル用メニュー */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="py-4 space-y-4">
            <Link
              to="/guide"
              className="block px-4 py-2 text-base text-gray-600 hover:text-oshi-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              応援広告ガイド
            </Link>
            <Link
              to="/projects"
              className="block px-4 py-2 text-base text-gray-600 hover:text-oshi-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              プロジェクト一覧
            </Link>
            <Link
              to="/projects/create"
              className="block px-4 py-2 text-base text-gray-600 hover:text-oshi-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              企画を作成
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
