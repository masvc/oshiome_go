import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

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
              className="flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-oshi-pink-500 transition-colors font-body"
            >
              <svg
                className="w-4 h-4 text-oshi-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              応援広告ガイド
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm text-gray-600 hover:text-oshi-pink-500 transition-colors font-body"
            >
              <svg
                className="w-4 h-4 text-oshi-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              プロジェクト一覧
            </Link>

            {/* 認証状態に応じた表示 */}
            {user ? (
              // ログイン済みの場合
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-oshi-purple-50/50 border border-oshi-purple-100 hover:bg-oshi-purple-100/70 hover:border-oshi-purple-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.profile_image_url}
                      alt="ユーザーアイコン"
                      className="w-8 h-8 rounded-full border-2 border-oshi-pink-300 group-hover:border-oshi-purple-400 transition-colors"
                    />
                    <span className="text-sm font-medium text-oshi-purple-700 group-hover:text-oshi-purple-800 transition-colors">
                      {user.name}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-oshi-purple-400 group-hover:text-oshi-purple-500 transition-all ${
                      isUserMenuOpen ? 'rotate-180' : ''
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

                {/* ドロップダウンメニュー */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-oshi-purple-100 py-2 transform transition-all duration-200 ease-out scale-100 opacity-100">
                    <Link
                      to="/mypage"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
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
                      マイページ
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
                        fill="none"
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
                      お気に入り
                    </Link>
                    <Link
                      to="/my-projects"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      マイプロジェクト
                    </Link>
                    <Link
                      to="/oshi-tags"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      推しタグ情報
                    </Link>
                    <Link
                      to="/projects/create"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      企画を作成
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors w-full"
                    >
                      <svg
                        className="w-4 h-4 text-oshi-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 未ログインの場合
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-oshi-purple-600 hover:text-oshi-purple-700 font-medium transition-colors border border-oshi-purple-200 rounded-full hover:border-oshi-purple-300 hover:bg-oshi-purple-50"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 rounded-full transition-all shadow-sm hover:shadow"
                >
                  新規登録
                </Link>
              </div>
            )}
          </nav>

          {/* モバイル用メニューボタン */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-oshi-purple-50 transition-colors border border-transparent hover:border-oshi-purple-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <div
                className={`w-5 h-0.5 bg-oshi-purple-600 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-oshi-purple-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <div
                className={`w-5 h-0.5 bg-oshi-purple-600 transition-all duration-300 ${
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
          <div className="py-3 space-y-1">
            <Link
              to="/guide"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-4 h-4 text-oshi-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              応援広告ガイド
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-4 h-4 text-oshi-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              プロジェクト一覧
            </Link>
            {user ? (
              <>
                <div className="px-4 py-2 flex items-center gap-3 mb-2">
                  <img
                    src={user.profile_image_url}
                    alt="ユーザーアイコン"
                    className="w-10 h-10 rounded-full border-2 border-oshi-pink-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <Link
                    to="/mypage"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
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
                    マイページ
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
                      fill="none"
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
                    お気に入り
                  </Link>
                  <Link
                    to="/my-projects"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    マイプロジェクト
                  </Link>
                  <Link
                    to="/oshi-tags"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    推しタグ情報
                  </Link>
                  <Link
                    to="/projects/create"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    企画を作成
                  </Link>
                </div>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-oshi-pink-50 hover:text-oshi-pink-600 transition-colors rounded-lg w-full"
                  >
                    <svg
                      className="w-4 h-4 text-oshi-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2.5 text-sm text-center text-gray-700 hover:text-oshi-pink-600 font-medium transition-colors border border-gray-200 rounded-full hover:border-oshi-pink-200 hover:bg-oshi-pink-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-2.5 text-sm text-center text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 hover:from-oshi-pink-600 hover:to-oshi-purple-600 rounded-full transition-all shadow-sm hover:shadow"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    新規登録
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
