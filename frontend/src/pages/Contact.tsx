import { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectTitle: '',
    description: '',
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: フォームの送信処理を実装
    console.log('Form submitted:', formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="text-center relative py-16 bg-gradient-to-br from-oshi-purple-50 to-oshi-pink-50 rounded-3xl border border-oshi-pink-100/30">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-grid-oshi-purple/[0.03] bg-[size:20px_20px]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          推しの誕生日企画を
          <br />
          カタチにしましょう
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          企画の内容や実現可能性について、
          <br className="hidden sm:block" />
          専門スタッフが丁寧にサポートいたします。
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
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    required
                    placeholder="例：○○さんの誕生日を渋谷の大型ビジョンでお祝い！"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all"
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTitle: e.target.value })
                    }
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
                    required
                    rows={6}
                    placeholder="企画の目的、実施したい内容、目標金額、実施時期などについて具体的にご記入ください。"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-oshi-purple-500 focus:border-transparent transition-all resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* 画像アップロード */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    企画イメージ画像
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl bg-gray-50 transition-all hover:border-oshi-purple-400">
                    <div className="space-y-2 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-oshi-purple-500 hover:text-oshi-pink-500 focus-within:outline-none"
                        >
                          <span>画像をアップロード</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ＆ドロップ</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (最大 10MB)
                      </p>
                    </div>
                  </div>
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
