export interface Agency {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url: string;
  categories: string[];
  guidelineUrl?: string;
}

export const agencies: Agency[] = [
  {
    id: '1',
    name: 'ホリプロ',
    description: '1960年設立。タレント・ミュージシャン・俳優など、多岐にわたる芸能プロダクション。',
    website: 'https://www.horipro.co.jp/',
    logo_url: '/images/agencies/horipro.png',
    categories: ['芸能事務所', '音楽事務所'],
    guidelineUrl: 'https://www.horipro.co.jp/guidelines/'
  },
  {
    id: '2',
    name: 'アミューズ',
    description: '1978年設立。アーティストマネジメント、音楽制作、映像制作など幅広く展開。',
    website: 'https://www.amuse.co.jp/',
    logo_url: '/images/agencies/amuse.png',
    categories: ['芸能事務所', '音楽事務所'],
    guidelineUrl: 'https://www.amuse.co.jp/guidelines/'
  },
  {
    id: '3',
    name: 'ジャニーズ事務所',
    description: '1962年設立。男性アイドルグループの育成・マネジメントを中心に展開。',
    website: 'https://www.johnnys.co.jp/',
    logo_url: '/images/agencies/johnnys.png',
    categories: ['芸能事務所'],
    guidelineUrl: 'https://www.johnnys.co.jp/guidelines/'
  }
]; 