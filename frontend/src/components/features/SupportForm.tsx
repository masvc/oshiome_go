import { useState } from 'react';
import { supportService } from '../../api/services/supportService';

interface SupportFormProps {
  projectId: string;
  projectName?: string;
  defaultAmount?: number;
  onClose: () => void;
}

export const SupportForm = ({ 
  projectId, 
  projectName = "プロジェクト", 
  defaultAmount = 3000, 
  onClose 
}: SupportFormProps) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await supportService.createCheckoutSession(
        parseInt(projectId), 
        amount, 
        message
      );
      
      console.log('支援レスポンス:', response);
      
      if (response.status === 'success' && response.data) {
        // バックエンドから返されるフィールド名はcheckout_url
        const checkoutUrl = response.data.checkout_url || response.data.url;
        if (checkoutUrl) {
          // Stripe Checkoutにリダイレクト
          window.location.href = checkoutUrl;
        } else {
          setError('決済URLが見つかりません。管理者にお問い合わせください。');
          setIsSubmitting(false);
        }
      } else {
        setError(response.message || '決済処理の開始に失敗しました。');
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      console.error('決済処理エラー:', error);
      setError('決済処理の開始に失敗しました。時間をおいて再度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{projectName}を支援する</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              支援金額
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ¥
              </span>
              <input
                type="number"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="100"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">最低支援額は100円です</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              応援メッセージ（任意）
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oshi-purple-500 focus:border-oshi-purple-500"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="応援メッセージを入力してください"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-oshi-purple-500 text-white rounded-lg hover:bg-oshi-purple-600 transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? '処理中...' : '決済ページへ進む'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
