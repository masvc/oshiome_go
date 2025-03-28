import React from 'react';

export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-6 sm:mb-8">
        プライバシーポリシー
      </h1>

      <div className="prose prose-gray max-w-none text-sm sm:text-base">
        <div className="space-y-6 sm:space-y-8">
          <p className="leading-relaxed">
            推しおめ運営事務局（以下、「当事務局」といいます。）は、推しの誕生日を、みんなで祝おうをコンセプトとしたクラウドファンディングサービス「推しおめ」（以下、「本サービス」といいます。）をご利用される皆様（以下、「利用者」といいます。）から取得する個人情報を、以下の方針に従い取り扱います。
          </p>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              1. 個人情報の取得
            </h2>
            <p className="mb-4">
              当事務局は、本サービスの提供にあたって、以下の情報を取得します。
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-bold mb-2">
                  (1) 本サービスへご登録いただくとき
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>氏名</li>
                  <li>メールアドレス</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">
                  (2) 本サービスで支援をいただくとき
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>支援者の氏名、住所、電話番号</li>
                  <li>クレジットカード情報（決済に必要な情報のみ）</li>
                  <li>
                    リターン配送先情報（氏名、住所、電話番号）※リターンがある場合のみ
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              2. 個人情報の利用目的
            </h2>
            <p className="mb-3">
              当事務局は、取得した個人情報を以下の目的で利用します。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスの提供・運営のため</li>
              <li>利用者からのお問い合わせに対応するため</li>
              <li>利用規約に違反する行為に対応するため</li>
              <li>当事務局サービスの改善・新規開発のため</li>
              <li>個人を特定できない形での統計データの作成のため</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              3. 個人情報の第三者提供
            </h2>
            <p className="mb-3">
              当事務局は、以下のいずれかに該当する場合を除き、個人情報を第三者に提供することはありません。
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>利用者の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>
                公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              4. 個人情報の安全管理
            </h2>
            <p>
              当事務局は、個人情報の漏洩、滅失またはき損を防止するため、必要かつ適切な安全管理措置を講じます。また、個人情報を取り扱う従業者に対して、個人情報の適切な取り扱いについて教育を行います。
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              5. 個人情報の開示・訂正・削除
            </h2>
            <p>
              利用者ご本人から個人情報の開示・訂正・削除のご請求があった場合、合理的な期間内に対応いたします。ただし、法令に基づき保管が必要な情報については、この限りではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              6. お問い合わせ窓口
            </h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、以下の窓口までご連絡ください。
              <br />
              メールアドレス：info@oshiome.com
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              7. プライバシーポリシーの変更
            </h2>
            <p>
              当事務局は、必要に応じて本ポリシーを変更することがあります。変更した場合は、本サービス上でお知らせします。
            </p>
          </section>
        </div>

        <p className="mt-8 sm:mt-12 text-sm text-gray-600">2025年4月1日 制定</p>
      </div>
    </div>
  );
};

export default Privacy;
