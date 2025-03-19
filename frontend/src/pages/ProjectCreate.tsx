import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '../components/features/ProjectForm';

// 仮のユーザーデータ
const mockUser = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
};

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 仮のプロジェクト作成処理
      console.log('プロジェクト作成データ:', {
        ...formData,
        creator_id: mockUser.id,
        status: 'pending',
      });

      // 遅延を追加して非同期処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 作成成功後、プロジェクト一覧ページに遷移
      navigate('/projects');
    } catch (err) {
      console.error('プロジェクト作成エラー:', err);
      setError('プロジェクトの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          企画を作成
        </h1>
        <p className="text-gray-600">
          推しの誕生日を祝うための企画を作成しましょう。
          企画内容を入力して、審査に提出してください。
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProjectForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}; 