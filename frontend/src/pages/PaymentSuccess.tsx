import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supportService } from '../api/services/supportService';
import { Support } from '../types';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [support, setSupport] = useState<Support | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        const response = await supportService.verifyPayment(sessionId);
        if (response.status === 'success' && response.data) {
          setSupport(response.data);
        } else {
          setError('支払い情報の検証に失敗しました。');
        }
      } catch (err) {
        console.error('支払い検証エラー:', err);
        setError('支払い情報の検証中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-oshi-purple-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">支援が完了しました！</h1>
          <p className="text-gray-600 max-w-md">
            プロジェクトへの支援ありがとうございます。あなたの支援が成功しました。
          </p>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            <p>{error}</p>
          </div>
        ) : support ? (
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">支援詳細</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>プロジェクト</span>
                <span className="font-medium">{support.project?.title || '不明なプロジェクト'}</span>
              </div>
              <div className="flex justify-between">
                <span>支援金額</span>
                <span className="font-medium">¥{support.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>状態</span>
                <span className="font-medium text-green-600">支払い完了</span>
              </div>
              {support.message && (
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-1">応援メッセージ</p>
                  <p className="whitespace-pre-line">{support.message}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-oshi-purple-500 hover:bg-oshi-purple-600 transition-colors"
          >
            ホームに戻る
          </Link>
          {support && support.project && (
            <Link
              to={`/projects/${support.project_id}`}
              className="inline-flex justify-center items-center px-6 py-3 border border-oshi-purple-500 rounded-lg text-base font-medium text-oshi-purple-500 bg-white hover:bg-oshi-purple-50 transition-colors"
            >
              プロジェクトに戻る
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 