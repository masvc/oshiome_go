import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

export const AuthForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setShowEmailVerification(false);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nickname: nickname
            }
          }
        });
        if (authError) throw authError;

        // メール認証が必要な場合（ほとんどの場合これに該当）
        if (!authData.session) {
          setShowEmailVerification(true);
          setIsSignIn(true);
          setEmail('');
          setPassword('');
          setNickname('');
          return;
        }

        // 即座に認証が完了した場合（まれ）
        setIsSignIn(true);
        setEmail('');
        setPassword('');
        setNickname('');
        return;
      }
      navigate('/');
    } catch (error: any) {
      if (error.message === 'email rate limit exceeded') {
        setError('認証メールの送信回数が制限を超えました。しばらく時間をおいてから再度お試しください。');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        {showEmailVerification && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-blue-800 font-medium mb-2">メール認証のお願い</h3>
            <p className="text-blue-700 text-sm">
              ご登録いただいたメールアドレスに認証メールを送信しました。<br />
              メール内のリンクをクリックして認証を完了してください。<br />
              認証完了後、こちらの画面からログインできます。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              >
                ニックネーム
              </label>
              <input
                id="nickname"
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-pink-500 py-2 px-4 text-white font-semibold shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading
              ? isSignIn
                ? 'ログイン中...'
                : '登録中...'
              : isSignIn
              ? 'ログイン'
              : '新規登録'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            {isSignIn ? '新規登録はこちら' : 'ログインはこちら'}
          </button>
        </form>
      </div>
    </div>
  );
}; 