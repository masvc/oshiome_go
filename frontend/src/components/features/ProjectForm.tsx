import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ProjectFormData {
  idol_name: string;
  title: string;
  description: string;
  target_amount: number;
  start_date: string;
  end_date: string;
  birthday_date: string;
  thumbnail_url?: string;
  image_file?: File;
  office_status: 'approved' | 'pending';
  project_hashtag?: string;
  support_hashtag?: string;
}

interface ProjectSubmissionData {
  title: string;
  description: string;
  target_amount: number;
  deadline: string;
  status: 'draft';
}

interface ProjectFormProps {
  onSubmit: (formData: ProjectSubmissionData) => Promise<void>;
  isSubmitting?: boolean;
}

const defaultFormData: ProjectFormData = {
  idol_name: '',
  title: '',
  description: '',
  target_amount: 100000,
  start_date: '',
  end_date: '',
  birthday_date: '',
  thumbnail_url: '',
  office_status: 'pending',
  project_hashtag: '',
  support_hashtag: '',
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const applyTemplate = (idolName: string) => {
    if (!idolName) return;

    setFormData((prev: ProjectFormData) => ({
      ...prev,
      idol_name: idolName,
      title: `${idolName}誕生日記念広告企画`,
      description: `${idolName}の誕生日をお祝いする広告企画です。\n\n【企画概要】\n・期間：企画期間\n・場所：掲載場所\n・内容：お誕生日メッセージの掲載\n\n皆様のご支援をお待ちしております！`,
      project_hashtag: `#${idolName}生誕祭`,
      support_hashtag: `#${idolName}を応援`,
    }));
  };

  const calculateDisplayPeriod = (birthdayDate: string) => {
    if (!birthdayDate) return;

    const birthday = new Date(birthdayDate);
    const startDate = new Date(birthday);
    const endDate = new Date(birthday);

    // 誕生日の1週間前から
    startDate.setDate(birthday.getDate() - 7);
    // 誕生日の1週間後まで
    endDate.setDate(birthday.getDate() + 7);

    // YYYY-MM-DD形式に変換
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    setFormData((prev: ProjectFormData) => ({
      ...prev,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    }));
  };

  const handleChange = (field: keyof ProjectFormData, value: string | number | File | null) => {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      [field]: value
    }));

    // アイドル名が変更された場合、テンプレートを適用
    if (field === 'idol_name' && typeof value === 'string') {
      applyTemplate(value);
    }

    // 誕生日が変更された場合、掲載期間を自動設定
    if (field === 'birthday_date' && typeof value === 'string') {
      calculateDisplayPeriod(value);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.idol_name.trim()) {
      newErrors.idol_name = '推しの名前は必須です';
    }

    if (!formData.title.trim()) {
      newErrors.title = '企画名は必須です';
    }

    if (!formData.description.trim()) {
      newErrors.description = '企画の説明は必須です';
    }

    if (formData.target_amount < 10000) {
      newErrors.target_amount = '目標金額は10,000円以上を入力してください';
    }

    if (!formData.birthday_date) {
      newErrors.birthday_date = '誕生日は必須です';
    }

    if (!formData.start_date) {
      newErrors.start_date = '開始日は必須です';
    }

    if (!formData.end_date) {
      newErrors.end_date = '終了日は必須です';
    } else if (formData.end_date < formData.start_date) {
      newErrors.end_date = '終了日は開始日より後の日付を指定してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 日付をタイムスタンプに変換
    const toTimestamp = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toISOString();
    };

    const submissionData: ProjectSubmissionData = {
      title: formData.title,
      description: formData.description,
      target_amount: Number(formData.target_amount),
      deadline: toTimestamp(formData.end_date),
      status: 'draft',
    };

    await onSubmit(submissionData);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 仮の画像URL生成
      const imageNumber = Math.floor(Math.random() * 10) + 1;
      const mockImageUrl = `https://picsum.photos/seed/${imageNumber}/800/450`;
      
      setFormData((prev: ProjectFormData) => ({
        ...prev,
        thumbnail_url: mockImageUrl,
        image_file: file
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* 基本情報 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-6">基本情報</h3>
        
        <div className="space-y-6">
          {/* サムネイル画像 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              企画のサムネイル画像
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oshi-purple-500"
                >
                  画像を選択
                </button>
              </div>
              {formData.thumbnail_url && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnail_url}
                    alt="サムネイル"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {errors.thumbnail_url && (
              <p className="mt-2 text-sm text-red-600">{errors.thumbnail_url}</p>
            )}
          </div>

          {/* 推しの名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              推しの名前
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.idol_name}
              onChange={(e) => handleChange('idol_name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
              placeholder="例：田中花子"
            />
            {errors.idol_name && (
              <p className="mt-2 text-sm text-red-600">{errors.idol_name}</p>
            )}
          </div>

          {/* 企画名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              企画名
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
              placeholder="例：田中花子誕生日記念広告企画"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* 企画の説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              企画の説明
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
              placeholder="企画の詳細な説明を入力してください"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* 目標金額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              目標金額
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">¥</span>
              </div>
              <input
                type="number"
                value={formData.target_amount}
                onChange={(e) => handleChange('target_amount', Number(e.target.value))}
                className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
                placeholder="100000"
                min="10000"
                step="10000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">円</span>
              </div>
            </div>
            {errors.target_amount && (
              <p className="mt-2 text-sm text-red-600">{errors.target_amount}</p>
            )}
          </div>

          {/* 誕生日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              誕生日
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={formData.birthday_date}
              onChange={(e) => handleChange('birthday_date', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
            />
            {errors.birthday_date && (
              <p className="mt-2 text-sm text-red-600">{errors.birthday_date}</p>
            )}
          </div>

          {/* 掲載期間 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                掲載開始日
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
              />
              {errors.start_date && (
                <p className="mt-2 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                掲載終了日
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
              />
              {errors.end_date && (
                <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* ハッシュタグ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                プロジェクト用ハッシュタグ
              </label>
              <input
                type="text"
                value={formData.project_hashtag}
                onChange={(e) => handleChange('project_hashtag', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
                placeholder="#推し誕生日"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                支援報告用ハッシュタグ
              </label>
              <input
                type="text"
                value={formData.support_hashtag}
                onChange={(e) => handleChange('support_hashtag', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-oshi-purple-500 focus:border-oshi-purple-500 sm:text-sm"
                placeholder="#推しを応援"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex flex-col items-center space-y-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white font-medium rounded-full shadow-sm hover:from-oshi-pink-600 hover:to-oshi-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oshi-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              <span>送信中...</span>
            </>
          ) : (
            '企画を申請する'
          )}
        </button>
        <div className="w-full max-w-md bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">申請後の流れ</p>
              <p>企画は下書き状態で保存され、運営チームによる審査（約5営業日）を経て掲載されます。結果はメールにてご連絡いたします。</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
