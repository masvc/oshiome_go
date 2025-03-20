import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    // 登録成功後、ホームページに遷移
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900">
            推しの誕生日プロジェクト
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントを作成して、プロジェクトを始めましょう
          </p>
        </div>
        
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
}; 