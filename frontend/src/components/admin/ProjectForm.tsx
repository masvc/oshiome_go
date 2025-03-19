import React, { useState } from 'react';

interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
  agencyApproved: boolean;
  category: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const defaultFormData: ProjectFormData = {
  title: '',
  description: '',
  targetAmount: 0,
  startDate: '',
  endDate: '',
  imageUrl: '',
  agencyApproved: false,
  category: 'station',
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData = defaultFormData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '企画名は必須です';
    }

    if (!formData.description.trim()) {
      newErrors.description = '企画説明は必須です';
    }

    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = '目標金額は0より大きい値を入力してください';
    }

    if (!formData.startDate) {
      newErrors.startDate = '開始日は必須です';
    }

    if (!formData.endDate) {
      newErrors.endDate = '終了日は必須です';
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = '終了日は開始日より後の日付を指定してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 実際の実装ではSupabaseにデータを送信
      await onSubmit(formData);
    } catch (error) {
      console.error('企画の保存に失敗しました', error);
      alert('企画の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">
        {formData.id ? '企画を編集' : '新規企画登録'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            企画名 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="例：〇〇の誕生日広告（渋谷駅）"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            企画説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="企画の詳細説明を入力してください"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="targetAmount"
            >
              目標金額 (円) <span className="text-red-500">*</span>
            </label>
            <input
              id="targetAmount"
              name="targetAmount"
              type="number"
              min="0"
              step="1000"
              className={`w-full px-3 py-2 border rounded-md ${errors.targetAmount ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="例：500000"
            />
            {errors.targetAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="station">駅広告</option>
              <option value="digital">デジタルサイネージ</option>
              <option value="newspaper">新聞広告</option>
              <option value="other">その他</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              開始日 <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className={`w-full px-3 py-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              終了日 <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className={`w-full px-3 py-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="imageUrl"
          >
            画像URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="例：https://example.com/image.jpg"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="agencyApproved"
              checked={formData.agencyApproved}
              onChange={(e) =>
                setFormData({ ...formData, agencyApproved: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-gray-700 text-sm">事務所承認済み</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : formData.id ? '更新する' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
};
