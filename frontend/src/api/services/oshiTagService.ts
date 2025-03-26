import { client } from '../client';

export interface OshiTag {
  id: string;
  name: string;
  category: string;
  followerCount: number;
  isFollowing: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  daysLeft: number;
  thumbnail_url: string;
  supporters_count: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  date: string;
  url?: string;
  thumbnail_url: string;
}

export interface OshiTagDetailData {
  id: string;
  name: string;
  category: string;
  description: string;
  followerCount: number;
  isFollowing: boolean;
  projects: Project[];
  news: News[];
}

// モック用のディレイ関数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// モックデータ
const mockTags: OshiTag[] = [
  {
    id: '1',
    name: 'ホロライブ',
    category: 'VTuber',
    followerCount: 15600,
    isFollowing: false
  },
  {
    id: '2',
    name: '乃木坂46',
    category: 'アイドル',
    followerCount: 12500,
    isFollowing: true
  },
  {
    id: '3',
    name: 'YOASOBI',
    category: 'アーティスト',
    followerCount: 11200,
    isFollowing: false
  },
  {
    id: '4',
    name: '櫻坂46',
    category: 'アイドル',
    followerCount: 9800,
    isFollowing: false
  },
  {
    id: '5',
    name: 'Ado',
    category: 'アーティスト',
    followerCount: 8900,
    isFollowing: true
  }
];

const mockTagDetails: Record<string, OshiTagDetailData> = {
  '1': {
    id: '1',
    name: '乃木坂46',
    category: 'アイドル',
    description: '2011年に結成された日本の女性アイドルグループ。「会いに行けるアイドル」をコンセプトに、音楽活動だけでなく、バラエティ番組やファッション誌など幅広い分野で活躍しています。',
    followerCount: 125789,
    isFollowing: true,
    projects: [
      {
        id: 'p1',
        title: '13th Anniversary Live',
        description: '結成13周年を記念した特別ライブの開催支援プロジェクト',
        targetAmount: 5000000,
        daysLeft: 30,
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-live/400/300',
        supporters_count: 1250
      },
      {
        id: 'p2',
        title: '写真集制作プロジェクト',
        description: '13期生メンバーの初写真集制作プロジェクト',
        targetAmount: 2000000,
        daysLeft: 45,
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-photo/400/300',
        supporters_count: 890
      },
      {
        id: 'p3',
        title: 'ファンクラブイベント',
        description: '会員限定の特別イベント開催プロジェクト',
        targetAmount: 3000000,
        daysLeft: 15,
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-event/400/300',
        supporters_count: 670
      }
    ],
    news: [
      {
        id: 'n1',
        title: '新シングル発売決定',
        content: '33枚目のシングルの発売が決定しました。センターは...',
        date: '2024-03-15',
        url: '#',
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-news1/200/200'
      },
      {
        id: 'n2',
        title: '全国ツアー開催決定',
        content: '2024年夏の全国ツアーの開催が決定しました。',
        date: '2024-03-10',
        url: '#',
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-news2/200/200'
      },
      {
        id: 'n3',
        title: '新番組スタート',
        content: 'レギュラー番組「乃木坂スタイル」が4月からスタート！',
        date: '2024-03-05',
        url: '#',
        thumbnail_url: 'https://picsum.photos/seed/nogizaka-news3/200/200'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'YOASOBI',
    category: 'アーティスト',
    description: 'Ayase と ikura からなる音楽ユニット。小説を音楽化するというコンセプトで、数々のヒット曲を生み出しています。',
    followerCount: 98456,
    isFollowing: false,
    projects: [
      {
        id: 'p4',
        title: '野外ライブ企画',
        description: '初の野外ライブ開催支援プロジェクト',
        targetAmount: 8000000,
        daysLeft: 60,
        thumbnail_url: 'https://picsum.photos/seed/yoasobi-live/400/300',
        supporters_count: 2100
      },
      {
        id: 'p5',
        title: 'オリジナルグッズ制作',
        description: 'ファン投票による新グッズのデザイン企画',
        targetAmount: 1500000,
        daysLeft: 25,
        thumbnail_url: 'https://picsum.photos/seed/yoasobi-goods/400/300',
        supporters_count: 780
      }
    ],
    news: [
      {
        id: 'n4',
        title: '新曲MVが1000万回再生突破',
        content: '最新曲のMVが公開1週間で1000万回再生を突破...',
        date: '2024-03-14',
        url: '#',
        thumbnail_url: 'https://picsum.photos/seed/yoasobi-news1/200/200'
      },
      {
        id: 'n5',
        title: '海外公演決定',
        content: 'アジアツアーの開催が決定しました！',
        date: '2024-03-08',
        url: '#',
        thumbnail_url: 'https://picsum.photos/seed/yoasobi-news2/200/200'
      }
    ]
  }
};

export const oshiTagService = {
  // 人気の推しタグを取得
  getPopularTags: async (): Promise<OshiTag[]> => {
    // モック: フォロワー数順にソート
    return [...mockTags].sort((a, b) => b.followerCount - a.followerCount);
  },

  // ユーザーのフォロー中の推しタグを取得
  getFollowingTags: async (): Promise<OshiTag[]> => {
    // モック: フォロー中のタグのみを返す
    return mockTags.filter(tag => tag.isFollowing);
  },

  // 推しタグを検索
  searchTags: async (query: string): Promise<OshiTag[]> => {
    // モック: クエリに基づいて検索
    const normalizedQuery = query.toLowerCase();
    return mockTags.filter(tag => 
      tag.name.toLowerCase().includes(normalizedQuery) ||
      tag.category.toLowerCase().includes(normalizedQuery)
    );
  },

  // 推しタグの詳細を取得
  getTagDetail: async (tagId: string): Promise<OshiTagDetailData> => {
    // モック: タグIDに基づいて詳細を返す
    const detail = mockTagDetails[tagId];
    if (!detail) {
      throw new Error('Tag not found');
    }
    return detail;
  },

  // 推しタグをフォロー
  followTag: async (tagId: string): Promise<void> => {
    // モック: タグのフォロー状態を更新
    const tag = mockTags.find(t => t.id === tagId);
    if (tag) {
      tag.isFollowing = true;
    }
    const detail = mockTagDetails[tagId];
    if (detail) {
      detail.isFollowing = true;
    }
  },

  // 推しタグのフォローを解除
  unfollowTag: async (tagId: string): Promise<void> => {
    // モック: タグのフォロー状態を更新
    const tag = mockTags.find(t => t.id === tagId);
    if (tag) {
      tag.isFollowing = false;
    }
    const detail = mockTagDetails[tagId];
    if (detail) {
      detail.isFollowing = false;
    }
  }
}; 