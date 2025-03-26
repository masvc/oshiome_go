import { useState } from 'react';

interface SupportFormProps {
  projectId: string;
  onClose: () => void;
}

export const SupportForm = ({ projectId, onClose }: SupportFormProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: バックエンドAPIとの連携を実装
      // 支援データを送信
      await new Promise(resolve => setTimeout(resolve, 1000)); // モック用の遅延
      onClose();
    } catch (error: unknown) {
      // エラー通知の表示などのエラーハンドリングを実装予定
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">応援メッセージを送る</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              応援メッセージ
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-oshi-purple-500 text-white py-2 px-4 rounded hover:bg-oshi-purple-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
