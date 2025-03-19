import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';

interface ProjectFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting?: boolean;
}

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
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const applyTemplate = (idolName: string) => {
    if (!idolName) return;

    setFormData(prev => ({
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

    setFormData(prev => ({
      ...prev,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    }));
  };

  const handleChange = (field: keyof ProjectFormData, value: string | number | File | null) => {
    setFormData(prev => ({
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

    if (!formData.thumbnail_url) {
      newErrors.thumbnail_url = 'サムネイル画像は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 日付をタイムスタンプに変換
    const toTimestamp = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toISOString();
    };

    const submissionData = {
      title: formData.title,
      description: formData.description,
      target_amount: Number(formData.target_amount),
      start_date: toTimestamp(formData.start_date),
      end_date: toTimestamp(formData.end_date),
      idol_name: formData.idol_name,
      office_status: formData.office_status,
      status: 'draft' as const,
      thumbnail_url: formData.thumbnail_url,
      current_amount: 0,
    };

    await onSubmit(submissionData);
  };

  const handleImageUpload = async (file: File) => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 公開URLの取得
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      console.log('公開URL:', publicUrl);

      if (!publicUrl) {
        throw new Error('有効な公開URLの取得に失敗しました');
      }

      setFormData(prev => ({
        ...prev,
        thumbnail_url: publicUrl,
        image_file: file
      }));

    } catch (error) {
      console.error('画像アップロードエラー:', error);
      if (error instanceof Error) {
        alert(`画像のアップロードに失敗しました：${error.message}`);
      } else {
        alert('画像のアップロードに失敗しました。');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {isUploading ? '画像をアップロード中...' : '画像を選択'}
              </label>
              {formData.thumbnail_url && (
                <div className="relative w-24 h-24">
                  <img
                    src={formData.thumbnail_url}
                    alt="プレビュー"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('thumbnail_url', '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {errors.thumbnail_url && (
              <p className="mt-1 text-sm text-red-600">{errors.thumbnail_url}</p>
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="例：田中さくら"
            />
            {errors.idol_name && (
              <p className="mt-1 text-sm text-red-600">{errors.idol_name}</p>
            )}
          </div>

          {/* 企画タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              企画タイトル
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="例：田中さくら誕生日記念広告企画"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* 企画内容 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-6">企画内容</h3>
        
        <div className="space-y-6">
          {/* 企画説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              企画の説明
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="企画の目的や内容について説明してください。&#13;&#10;例：&#13;&#10;【企画概要】&#13;&#10;・期間：企画期間&#13;&#10;・場所：掲載場所&#13;&#10;・内容：お誕生日メッセージの掲載&#13;&#10;&#13;&#10;【企画の目的】&#13;&#10;・推しの誕生日をお祝いする&#13;&#10;・ファンの想いを形にする"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* ハッシュタグ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                企画用ハッシュタグ
              </label>
              <input
                type="text"
                value={formData.project_hashtag}
                onChange={(e) => handleChange('project_hashtag', e.target.value)}
                placeholder="#推し生誕祭"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                応援用ハッシュタグ
              </label>
              <input
                type="text"
                value={formData.support_hashtag}
                onChange={(e) => handleChange('support_hashtag', e.target.value)}
                placeholder="#推しを応援"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 期間と金額 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-900 mb-6">期間と金額</h3>
        
        <div className="space-y-6">
          {/* 日付関連 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* 誕生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                推しの誕生日
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.birthday_date}
                onChange={(e) => handleChange('birthday_date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
              {errors.birthday_date && (
                <p className="mt-1 text-sm text-red-600">{errors.birthday_date}</p>
              )}
            </div>

            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                開始日
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            {/* 終了日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                終了日
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* 目標金額 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              目標金額
              <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-500 text-xs ml-2">（10,000円以上）</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                min="10000"
                step="1000"
                value={formData.target_amount}
                onChange={(e) => handleChange('target_amount', parseInt(e.target.value))}
                className="block w-full pr-12 border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="100000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">円</span>
              </div>
            </div>
            {errors.target_amount && (
              <p className="mt-1 text-sm text-red-600">{errors.target_amount}</p>
            )}
          </div>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white
            ${isSubmitting 
              ? 'bg-pink-400 cursor-not-allowed' 
              : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              送信中...
            </>
          ) : (
            '企画を作成'
          )}
        </button>
      </div>
    </form>
  );
};
