export interface Agency {
  name: string;
  categories: string[];
  description: string;
  guidelineUrl?: string;
}

export const agencies: Agency[] = [
  {
    name: 'にじさんじ',
    categories: ['VTuber'],
    description:
      'にじさんじ所属ライバーの応援広告ガイドラインを公開しています。事前申請が必要です。',
    guidelineUrl: 'https://www.nijisanji.jp/guidelines',
  },
  {
    name: 'ホロライブプロダクション',
    categories: ['VTuber'],
    description:
      'ホロライブ所属タレントの応援広告に関するガイドラインを公開しています。事前申請が必要です。',
    guidelineUrl: 'https://www.hololive.tv/terms',
  },
  {
    name: '株式会社 Brave group（ぶいすぽっ！）',
    categories: ['VTuber'],
    description:
      'ぶいすぽっ！所属ライバーの応援広告ガイドラインを公開しています。',
    guidelineUrl: 'https://vspo.jp/guide',
  },
  {
    name: 'ソニーミュージックエンタテインメント',
    categories: ['音楽事務所', '芸能事務所'],
    description:
      'アーティストごとにファンクラブを通じて応援広告の規定を確認できます。',
  },
  {
    name: 'アミューズ',
    categories: ['音楽事務所', '芸能事務所'],
    description:
      'タレントごとにファンクラブを通じて応援広告の規定を確認できます。',
  },
];
