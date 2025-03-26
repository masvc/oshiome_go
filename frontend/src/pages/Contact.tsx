import { useState, ChangeEvent, FormEvent } from 'react';

interface FormDataType {
  name: string;
  email: string;
  projectTitle: string;
  description: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    email: '',
    projectTitle: '',
    description: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: バックエンドAPIとの連携を実装
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormDataType) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
          推しの誕生日企画をカタチにしましょう
        </h1>
        <p className="text-gray-600 max-w-2xl">
          企画の内容や実現可能性について、専門スタッフが丁寧にサポートいたします。
        </p>
      </section>

      {/* フォームセクション */}
      <section>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">
            <div className="space-y-6 sm:space-y-8">
              {/* フォームヘッダー */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent mb-4">
                  無料相談フォーム
                </h2>
                <p className="text-gray-600 text-lg">
                  以下のフォームに必要事項をご記入ください。
                  <br />
                  内容を確認後、担当者よりご連絡させていただきます。
                </p>
              </div>

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 名前 */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    お名前 <span className="text-oshi-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    メールアドレス <span className="text-oshi-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* 企画タイトル */}
                <div>
                  <label
                    htmlFor="projectTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    企画タイトル <span className="text-oshi-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    required
                    placeholder="例：○○さんの誕生日を渋谷の大型ビジョンでお祝い！"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.projectTitle}
                    onChange={handleChange}
                  />
                </div>

                {/* 企画内容 */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    企画内容の詳細 <span className="text-oshi-pink-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    placeholder="企画の目的、実施したい内容、目標金額、実施時期などについて具体的にご記入ください。"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* 送信ボタン */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white px-8 py-4 rounded-xl hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-lg"
                  >
                    相談内容を送信する
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    通常2営業日以内にご返信いたします
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
