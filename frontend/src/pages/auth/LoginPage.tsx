import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleLoginSuccess = () => {
    // ログイン前にアクセスしようとしていたページ、またはホームページに遷移
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900">
            推しの誕生日プロジェクト
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            あなたの推しへの想いを、カタチに。
          </p>
        </div>
        
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}; 