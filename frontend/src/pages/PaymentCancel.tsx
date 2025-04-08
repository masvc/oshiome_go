import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">支援がキャンセルされました</h1>
          <p className="text-gray-600 max-w-md">
            支援処理がキャンセルされました。問題がある場合は、再度お試しいただくか、お問い合わせください。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ホームに戻る
          </Link>
          {projectId && (
            <Link
              to={`/projects/${projectId}`}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-oshi-purple-500 hover:bg-oshi-purple-600 transition-colors"
            >
              プロジェクトに戻る
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 