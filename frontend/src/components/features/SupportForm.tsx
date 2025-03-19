import { useState } from 'react';

interface SupportFormProps {
  projectId: string;
  projectTitle: string;
  amount: number;
  onClose: () => void;
}

type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

// 仮のユーザーデータ
const mockUser = {
  name: 'テストユーザー',
  email: 'test@example.com',
};

export const SupportForm = ({
  projectId,
  projectTitle,
  amount,
  onClose,
}: SupportFormProps) => {
  const [step, setStep] = useState<'confirm' | 'payment' | 'complete'>(
    'confirm'
  );
  const [formData, setFormData] = useState({
    nickname: mockUser.name,
    email: mockUser.email,
    paymentMethod: '' as PaymentMethod,
    isAnonymous: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (step === 'confirm') {
      setStep('payment');
      setIsLoading(false);
      return;
    }

    // 仮の支援処理
    console.log('Support data:', {
      projectId,
      amount,
      ...formData,
    });

    // 処理完了後にモーダルを閉じる
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // モックの決済処理：3秒後に完了
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setStep('complete');
    } catch (error) {
      console.error('決済処理でエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold">支援内容の確認</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* プロジェクト情報 */}
            <div>
              <div className="text-sm text-gray-600 mb-1">支援先</div>
              <div className="font-medium">{projectTitle}</div>
            </div>

            {/* 支援金額 */}
            <div>
              <div className="text-sm text-gray-600 mb-1">支援金額</div>
              <div className="text-2xl font-bold text-oshi-purple">
                ¥{amount.toLocaleString()}
              </div>
            </div>

            {step === 'confirm' ? (
              <>
                {/* 支援者情報 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ニックネーム{' '}
                      {!formData.isAnonymous && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      required={!formData.isAnonymous}
                      disabled={formData.isAnonymous}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-oshi-purple focus:border-oshi-purple disabled:bg-gray-100"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-oshi-purple focus:border-oshi-purple"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      className="rounded border-gray-300 text-oshi-purple focus:ring-oshi-purple"
                      checked={formData.isAnonymous}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAnonymous: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="anonymous"
                      className="ml-2 text-sm text-gray-600"
                    >
                      匿名で支援する
                    </label>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 space-y-2">
                  <p>※支援金額には消費税が含まれます</p>
                  <p>※一度ご支援いただいた内容はキャンセル・返金できません</p>
                  <p>※リターン品は支援完了後、順次発送いたします</p>
                </div>
              </>
            ) : (
              <>
                {/* 支払い方法選択 */}
                <div className="space-y-4">
                  <div className="font-medium mb-2">支払い方法を選択</div>
                  <label className="block">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      required
                      className="mr-2"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as PaymentMethod,
                        })
                      }
                    />
                    クレジットカード
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      required
                      className="mr-2"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as PaymentMethod,
                        })
                      }
                    />
                    PayPal
                  </label>
                  <label className="block">
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      required
                      className="mr-2"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as PaymentMethod,
                        })
                      }
                    />
                    銀行振込
                  </label>
                </div>

                {formData.paymentMethod === 'bank_transfer' && (
                  <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                    ※銀行振込の場合、支援募集期間内のお振込みをお願いいたします
                  </div>
                )}
              </>
            )}
          </div>

          {/* フッター */}
          <div className="p-4 border-t bg-gray-50 sticky bottom-0">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 text-white py-4 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  処理中...
                </span>
              ) : step === 'confirm' ? (
                <span className="text-white drop-shadow-sm">次へ進む</span>
              ) : (
                <span className="text-white drop-shadow-sm">
                  支援を確定する
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
