import { Link } from 'react-router-dom';

export const Guide = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ヒーローセクション */}
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
          応援広告ガイド
        </h1>
        <p className="text-gray-600 max-w-2xl">
          推しの誕生日を祝う新しい形、応援広告の全てがわかるガイドです
        </p>
      </section>

      {/* 応援広告とは？セクション */}
      <section>
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          応援広告とは？
        </h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <p className="text-lg text-gray-700 leading-relaxed">
            応援広告は、企業ではなくファンが主体となって出稿する新しい広告形式です。
            韓国発祥のこの文化は、アイドルやVTuberの誕生日や記念日を祝うために、
            駅や街頭ビジョンなどに広告を出して応援の気持ちを形にするものです。
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-gradient-to-br from-oshi-purple-50 to-white rounded-xl p-6 border border-oshi-purple-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
              <div className="w-12 h-12 bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">
                知名度向上
              </h3>
              <p className="text-gray-600">
                多くの人の目に触れる場所で広告を展開することで、推しの認知度アップに貢献できます
              </p>
            </div>
            <div className="bg-gradient-to-br from-oshi-pink-50 to-white rounded-xl p-6 border border-oshi-pink-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
              <div className="w-12 h-12 bg-gradient-to-br from-oshi-pink-500 to-oshi-purple-500 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">
                想いを形に
              </h3>
              <p className="text-gray-600">
                日頃の感謝や応援の気持ちを、目に見える形で表現することができます
              </p>
            </div>
            <div className="bg-gradient-to-br from-oshi-purple-50 to-white rounded-xl p-6 border border-oshi-purple-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
              <div className="w-12 h-12 bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">
                ファン同士の絆
              </h3>
              <p className="text-gray-600">
                共同で企画を立ち上げることで、ファン同士の繋がりも深まります
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 実施の流れセクション */}
      <section>
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          応援広告の実施の流れ
          <span className="block text-base font-normal text-gray-600 mt-2">
            お客様の負担を最小化するスムーズな進行を心がけています
          </span>
        </h2>
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'お問い合わせ',
              description:
                '掲出時期、予算、広告を出したい場所などをお問い合わせください。JR東日本をご希望の場合は、デザイン審査が先にございますので、ラフデザインをご用意ください。',
              icon: (
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              ),
            },
            {
              step: 2,
              title: '事務所への許可取り',
              description:
                '応援広告を出すことを、アーティストなどの事務所へ事前に許可を取っていただきます。多くの事務所が応援広告を容認しており、スムーズな許可取得をサポートいたします。',
              icon: (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              step: 3,
              title: '団体審査・デザイン審査',
              description:
                'ご希望の広告が決まりましたら団体概要書をご記入いただき、事務所からの許可証明と一緒に承認審査にかけさせていただきます。',
              icon: (
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              ),
            },
            {
              step: 4,
              title: 'お支払い',
              description:
                'ご入金が確認でき次第、広告枠の確保を行います。支払い方法や時期については、個別にご案内させていただきます。',
              icon: (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              step: 5,
              title: '広告枠取り',
              description:
                '広告枠の確保を行います。この段階以降のキャンセルはできませんので、ご注意ください。',
              icon: (
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              step: 6,
              title: 'デザイン入稿',
              description:
                'デザインの完成後、まず電鉄の審査に出します。審査通過後、そのデザインで入稿いたします。電鉄によって審査基準が異なりますので、ご了承ください。',
              icon: (
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              step: 7,
              title: '広告掲出',
              description:
                '無事広告を掲出！ポスターの場合、取り付けが完了するのは、お昼12時以降になります。掲出後の写真撮影なども可能です（場所により制限あり）。',
              icon: (
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              ),
            },
          ].map((step, index) => (
            <div
              key={index}
              className="flex gap-8 items-start bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {step.step}
                </div>
                {index < 6 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-oshi-pink-500/50 to-transparent" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-oshi-purple-100 flex items-center justify-center text-oshi-purple-500">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 補足情報 */}
        <div className="mt-12 bg-gradient-to-br from-oshi-purple-50/50 to-oshi-pink-50/50 p-8 rounded-2xl border border-oshi-pink-100/30">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
            応援広告を容認している事務所について
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            多くの芸能事務所やVTuber事務所が応援広告を容認しています。
            事務所への許可申請や手続きについては、弊社が豊富な実績とノウハウを活かしてサポートいたします。
            <br />
            ※事務所によって規定や方針が異なる場合がございます。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-oshi-purple-600 rounded-xl border border-oshi-purple-200 hover:bg-oshi-purple-50 transition-colors group shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>対応事務所一覧を見る</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              to="/visions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-oshi-purple-600 rounded-xl border border-oshi-purple-200 hover:bg-oshi-purple-50 transition-colors group shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>ビジョン一覧を見る</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 注意事項セクション */}
      <section>
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-oshi-purple-600 to-oshi-pink-600 bg-clip-text text-transparent">
          実施時の注意点
        </h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <ul className="space-y-4">
            {[
              '著作権の確認と許可取得を必ず行う',
              '事務所の規定や方針を事前に確認',
              '掲出媒体ごとの規定を遵守',
              '支払いは原則前払い',
              'スケジュールに余裕を持った計画を',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700">
                <div className="w-6 h-6 rounded-full bg-oshi-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-oshi-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="text-center relative py-16 bg-gradient-to-br from-oshi-purple-600 to-oshi-pink-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        </div>
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            応援広告を始めてみませんか？
          </h2>
          <p className="text-lg mb-8 text-white/90">
            推しへの想いを形にする。その一歩を、私たちがサポートします。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-white text-oshi-purple-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              企画一覧を見る
            </Link>
            <Link
              to="/contact"
              className="bg-oshi-purple-700 text-white px-8 py-4 rounded-xl hover:bg-oshi-purple-800 transition-colors border border-white/20 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              無料相談をする
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
