import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '../components/features/ProjectForm';
import { projectService } from '../api/services/projectService';
import { CreateProjectInput } from '../types/project';
import { useAuthStore } from '../stores/authStore';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CreateProjectInput) => {
    if (!isAuthenticated) {
      setError('プロジェクトを作成するにはログインが必要です。');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await projectService.createProject({
        ...formData,
        status: 'draft', // 常にドラフトで作成
      });

      if (response) {
        // 作成成功後、マイプロジェクトページに遷移
        navigate('/my-projects');
      } else {
        setError('プロジェクトの作成に失敗しました。');
      }
    } catch (err) {
      console.error('プロジェクト作成エラー:', err);
      setError('プロジェクトの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
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