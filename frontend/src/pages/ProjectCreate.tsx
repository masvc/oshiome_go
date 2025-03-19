import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ProjectForm } from '../components/features/ProjectForm';
import { projectRepository } from '../repositories/project';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // プロジェクトの作成
      const project = await projectRepository.create({
        ...formData,
        creator_id: user?.id,
        status: 'pending', // 審査待ち状態
      });

      // 作成成功後、プロジェクト詳細ページに遷移
      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error('プロジェクト作成エラー:', err);
      setError('プロジェクトの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          企画を作成するにはログインが必要です。
        </div>
      </div>
    );
  }

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