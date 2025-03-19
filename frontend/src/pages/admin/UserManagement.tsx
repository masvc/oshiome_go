import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../supabaseClient';

// ユーザーデータの型定義
interface User {
  id: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  created_at: string;
  last_sign_in_at: string;
  contribution_count: number;
  total_amount: number;
  nickname?: string;
  name: string;
  avatar_url?: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザーデータの取得
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (users) {
        // 各ユーザーの支援情報を取得
        const usersWithContributions = await Promise.all(
          users.map(async (user) => {
            const { data: contributions } = await supabase
              .from('contributions')
              .select('amount')
              .eq('supporter_id', user.id);

            const total_amount =
              contributions?.reduce(
                (sum, contribution) => sum + (contribution.amount || 0),
                0
              ) || 0;

            return {
              ...user,
              contribution_count: contributions?.length || 0,
              total_amount,
            };
          })
        );

        setUsers(usersWithContributions);
      }
    } catch (error) {
      console.error('ユーザーデータの取得に失敗しました', error);
      setError('ユーザーデータの取得に失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 検索とフィルタリング
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nickname || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortOrder === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'contributions') {
        const contributionsA = a.contribution_count || 0;
        const contributionsB = b.contribution_count || 0;
        return sortOrder === 'desc'
          ? contributionsB - contributionsA
          : contributionsA - contributionsB;
      } else if (sortBy === 'total_amount') {
        const amountA = a.total_amount || 0;
        const amountB = b.total_amount || 0;
        return sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
      }
      return 0;
    });

  // ロールに応じたバッジの色
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
            管理者
          </span>
        );
      case 'organizer':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            企画者
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            一般ユーザー
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            不明
          </span>
        );
    }
  };

  // 金額のフォーマット
  const formatAmount = (amount: number = 0) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // ユーザーの削除
  const handleDelete = async (id: string) => {
    if (window.confirm('このユーザーを削除してもよろしいですか？')) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);

        if (error) {
          throw error;
        }

        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error('ユーザーの削除に失敗しました', error);
      }
    }
  };

  // ユーザーの権限変更
  const handleRoleChange = async (
    id: string,
    newRole: 'user' | 'organizer' | 'admin'
  ) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('ユーザーの権限変更に失敗しました', error);
    }
  };

  // ソートの切り替え
  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              全{users.length}件のユーザーを管理できます
            </p>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="名前またはメールアドレスで検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">すべての権限</option>
                <option value="user">一般ユーザー</option>
                <option value="organizer">企画者</option>
                <option value="admin">管理者</option>
              </select>
            </div>
          </div>
        </div>

        {/* ユーザー一覧 */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-oshi-purple-200 opacity-25"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-oshi-purple-500 animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p>{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              再読み込み
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 sm:pl-6"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('created_at')}
                      >
                        ユーザー
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'created_at'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'created_at' && sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      権限
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('contributions')}
                      >
                        支援回数
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'contributions'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'contributions' &&
                          sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      <button
                        className="group inline-flex items-center"
                        onClick={() => toggleSort('total_amount')}
                      >
                        支援総額
                        <svg
                          className={`ml-2 h-4 w-4 ${
                            sortBy === 'total_amount'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {sortBy === 'total_amount' && sortOrder === 'desc' ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          )}
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-gray-500"
                    >
                      最終ログイン
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">アクション</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                user.avatar_url ||
                                'https://picsum.photos/seed/default/200'
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.name || '名前未設定'}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                            {user.nickname && (
                              <div className="text-xs text-gray-400">
                                @{user.nickname}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.contribution_count || 0}回
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatAmount(user.total_amount || 0)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString(
                              'ja-JP'
                            )
                          : '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center gap-2 justify-end">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value as 'user' | 'organizer' | 'admin'
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                          >
                            <option value="user">一般ユーザー</option>
                            <option value="organizer">企画者</option>
                            <option value="admin">管理者</option>
                          </select>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                ユーザーが見つかりません。
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
