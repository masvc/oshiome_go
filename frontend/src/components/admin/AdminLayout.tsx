import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'ダッシュボード', href: '/admin' },
    { name: 'プロジェクト管理', href: '/admin/projects' },
    { name: 'プロジェクト登録', href: '/admin/projects/register' },
    { name: 'ユーザー管理', href: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* サイドナビゲーション */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
        <div className="px-6 py-8">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <img src="/favicon.png" alt="推しおめロゴ" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">推しおめ管理</span>
          </Link>

          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="pl-64">
        <header className="bg-white shadow">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find((item) => item.href === location.pathname)?.name || '管理画面'}
            </h1>
          </div>
        </header>

        <main className="px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 