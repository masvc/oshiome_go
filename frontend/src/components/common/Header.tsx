import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { profileRepository } from '../../repositories/profile';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const data = await profileRepository.getProfile(user.id);
          setProfile(data);
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
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
            {user ? (
              <Link
                to="/projects/create"
                className="px-4 lg:px-6 py-2 text-sm text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-colors font-body shadow-sm hover:shadow-md"
              >
                企画を作成
              </Link>
            ) : (
              <Link
                to="/contact"
                className="px-4 lg:px-6 py-2 text-sm text-white bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-colors font-body shadow-sm hover:shadow-md"
              >
                企画を始める
              </Link>
            )}

            {/* ユーザーメニュー */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                  user
                    ? 'bg-gradient-to-r from-oshi-pink-100 to-oshi-purple-100 hover:from-oshi-pink-200 hover:to-oshi-purple-200'
                    : 'border border-oshi-pink-200 hover:bg-oshi-pink-50'
                }`}
              >
                {user ? (
                  <>
                    <div className="w-7 h-7 rounded-full border-2 border-oshi-pink-300 overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={profile?.profile_image_url}
                        alt={`${profile?.nickname || 'ユーザー'}のアバター`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.nickname || 'ユーザー'}
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      ログイン
                    </span>
                  </>
                )}
              </button>

              {/* ドロップダウンメニュー */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 transition-all duration-200 ease-in-out ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={profile?.profile_image_url}
                          alt={`${profile?.nickname || 'ユーザー'}のアバター`}
                          className="w-8 h-8 rounded-full border border-oshi-pink-200"
                        />
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.nickname || 'ユーザー'}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                      </div>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ログイン / 新規登録
                    </Link>
                  </>
                )}
              </div>
            </div>
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
              ></div>
              <div
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></div>
              <div
                className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></div>
            </div>
          </button>

          {/* モバイル用メニュー */}
          <div
            className={`md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                </div>
                <nav className="space-y-1">
                  <Link
                    to="/guide"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    応援広告ガイド
                  </Link>
                  <Link
                    to="/projects"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    プロジェクト一覧
                  </Link>
                  {user ? (
                    <Link
                      to="/projects/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      企画を作成
                    </Link>
                  ) : (
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      企画を始める
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link
                        to="/mypage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        マイページ
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                      >
                        ログアウト
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン / 新規登録
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
