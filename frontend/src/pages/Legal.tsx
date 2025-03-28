import React from 'react';

export const Legal = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-6 sm:mb-8">
        特定商取引法に基づく表示
      </h1>

      <div className="prose prose-gray max-w-none">
        <div className="overflow-hidden">
          <table className="min-w-full border-collapse block sm:table">
            <tbody className="block sm:table-row-group">
              {[
                {
                  label: '販売事業者名',
                  content: '推しおめ運営事務局',
                },
                {
                  label: '販売事業者所在地',
                  content: (
                    <>
                      〒150-0043
                      <br />
                      東京都渋谷区道玄坂1-2-3 渋谷フォンティスビル 8F
                    </>
                  ),
                },
                {
                  label: '運営統括責任者',
                  content: '山田 太郎',
                },
                {
                  label: '連絡先',
                  content: (
                    <>
                      メール：info@oshiome.com
                      <br />
                      TEL：03-1234-5678
                      <br />
                      ホームページ：https://www.oshiome.com
                    </>
                  ),
                },
                {
                  label: '支援金額',
                  content: (
                    <>
                      各プロジェクトページの「支援金額」をご覧ください。
                      <br />
                      表示価格は税込です。
                    </>
                  ),
                },
                {
                  label: '広告掲出時期・リターン提供時期',
                  content:
                    '広告の掲出時期およびリターンの提供時期は、各プロジェクトページの記載をご確認ください。',
                },
                {
                  label: '支払方法',
                  content: (
                    <>
                      クレジットカード決済
                      <br />
                      ※プロジェクトの目標金額達成時に決済が実行されます。
                    </>
                  ),
                },
                {
                  label: '支援金額以外に必要な費用',
                  content: (
                    <>
                      支援金額に全ての費用が含まれています。
                      <br />
                      追加の費用は発生いたしません。
                    </>
                  ),
                },
                {
                  label: '返金の取扱い条件',
                  content: (
                    <div>
                      <p className="mb-4">
                        以下の場合を除き、お客様都合によるキャンセル・返金はお受けできません：
                      </p>
                      <ul className="list-disc pl-6">
                        <li className="mb-2">
                          サービスの提供内容が事前のプロジェクト説明と著しく異なる場合
                        </li>
                        <li className="mb-2">プロジェクトが中止となった場合</li>
                        <li>その他、当事務局が相当と認める理由がある場合</li>
                      </ul>
                      <p className="mt-4">
                        ※返金をご希望の場合は、プロジェクト終了後7日以内に当事務局までご連絡ください。
                      </p>
                    </div>
                  ),
                },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-t block sm:table-row text-sm sm:text-base"
                >
                  <th className="py-4 pr-4 align-top font-bold block sm:table-cell sm:w-1/4 sm:whitespace-nowrap bg-gray-50 sm:bg-transparent px-4 sm:px-0">
                    {item.label}
                  </th>
                  <td className="py-4 block sm:table-cell px-4 sm:px-0">
                    {item.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 sm:mt-12 text-sm text-gray-600 px-4 sm:px-0">
          2025年4月1日 制定
        </p>
      </div>
    </div>
  );
};

export default Legal;
