import { Link } from 'react-router-dom';
import { ProjectCard } from '../components/features/ProjectCard';
import { Project } from '../types/project';
import mainVisual from '../assets/mainvisual.png';
import { useEffect, useState } from 'react';
import { GlitterEffect } from '../components/common/GlitterEffect';
import { projectService } from '../api/services/projectService';

// サービスの特徴データ
const features = [
  {
    title: '都内主要ビジョンに対応',
    description:
      '渋谷、新宿、池袋など都内の主要な街頭ビジョンと連携。お手頃な料金で想いを届けられます。',
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
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    link: '/visions',
  },
  {
    title: 'シンプルな支援システム',
    description:
      '一律金額制のクラウドファンディングで、誰でも安心して参加できる支援の仕組みを実現。',
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
    link: '/guide#support',
  },
  {
    title: '充実のガイド・サポート',
    description:
      '初めての方でも安心の詳細ガイドと、企画から実施まで経験豊富なスタッフがサポート。',
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    link: '/guide',
  },
];

// 仮のプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: '1',
    title: '渋谷ビジョンで推しの誕生日を祝おう！',
    description: '渋谷の大型ビジョンで、みんなで一緒に推しの誕生日をお祝いしましょう。',
    target_amount: 500000,
    current_amount: 300000,
    end_date: '2024-05-01',
    image_url: 'https://picsum.photos/seed/1/800/450',
    supporters_count: 30,
  },
  {
    id: '2',
    title: '池袋サンシャインでバースデー広告',
    description: '池袋サンシャインシティの大型ビジョンで誕生日広告を実施します。',
    target_amount: 400000,
    current_amount: 200000,
    end_date: '2024-06-15',
    image_url: 'https://picsum.photos/seed/2/800/450',
    supporters_count: 20,
  },
  {
    id: '3',
    title: '新宿アルタで誕生日をお祝い',
    description: '新宿アルタのビジョンで、推しの誕生日を華やかにお祝いしましょう。',
    target_amount: 300000,
    current_amount: 150000,
    end_date: '2024-07-30',
    image_url: 'https://picsum.photos/seed/3/800/450',
    supporters_count: 15,
  },
];

export const Home = () => {
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects();
        if (!response?.data) {
          throw new Error('プロジェクトデータが取得できませんでした');
        }
        // アクティブなプロジェクトのみをフィルタリング
        const activeProjects = response.data.filter(
          (project: Project) => project.status === 'active'
        );
        // サポーター数で降順ソートして上位3件を取得
        const sortedProjects = activeProjects
          .sort((a, b) => (b.supporters_count || 0) - (a.supporters_count || 0))
          .slice(0, 3);
        setPopularProjects(sortedProjects);
      } catch (error) {
        console.error('プロジェクト取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProjects();
  }, []);

  // プロジェクトデータをProjectCardコンポーネントの形式に変換
  const formatProjectForCard = (project: Project) => {
    return {
      id: project.id.toString(),
      title: project.title,
      description: project.description || '',
      targetAmount: project.target_amount,
      currentAmount: project.current_amount || 0,
      deadline: project.end_date,
      imageUrl: project.image_url || 'https://picsum.photos/seed/default/800/450',
      supporterCount: project.supporters_count || 0,
      creator: project.user ? {
        name: project.user.name,
        avatarUrl: project.user.profile_image_url || 'https://picsum.photos/seed/default/100/100'
      } : undefined,
      office_approved: project.office_approved
    };
  };

  return (
    <>
      <GlitterEffect enabled={true} />
      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        {/* ヒーローセクション */}
        <section className="relative min-h-[600px] sm:h-[600px] lg:h-[700px] -mt-16 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={mainVisual}
              alt="推しの誕生日を祝おう"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
          </div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-20 sm:pt-24 lg:pt-12">
            <div className="max-w-2xl text-white space-y-4 sm:space-y-5 lg:space-y-6 mt-8 sm:mt-10 lg:mt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-tight leading-tight drop-shadow-lg">
                推しの誕生日を、
                <br />
                <span className="bg-gradient-to-r from-oshi-pink-400 to-oshi-purple-400 bg-clip-text text-transparent drop-shadow">
                  みんなで祝おう。
                </span>
              </h1>
              <p className="text-base sm:text-lg text-white leading-relaxed max-w-lg drop-shadow-md">
                大切な推しの誕生日を、ファンのみんなで一緒にお祝いしませんか？
                <br className="hidden sm:block" />
                駅広告やビジョンなど、様々な形で想いを届けられます。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-oshi-pink-400 flex-shrink-0"
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
                  <span className="text-xs sm:text-sm">
                    推しの為にファンが企画する誕生日広告に特化
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-oshi-pink-400 flex-shrink-0"
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
                  <span className="text-xs sm:text-sm">
                    初めての企画者でも運営しやすいシンプル設計
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-oshi-pink-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a4 4 0 00-4-4H5.45a4 4 0 00-3.743 2.608L.725 8.323A2 2 0 002.613 11H6.5a2 2 0 001.414-.586l1.121-1.121A3 3 0 0111.5 8.5h1a3 3 0 012.475 1.293l1.121 1.121A2 2 0 0017.5 11h3.887a2 2 0 001.888-2.677l-.983-3.715A4 4 0 0018.55 2H16a4 4 0 00-4 4v2z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    一律金額で安心なクラウドファンディング
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <Link
                  to="/projects"
                  className="bg-gradient-to-r from-oshi-pink-500 to-oshi-purple-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:from-oshi-pink-600 hover:to-oshi-purple-600 transition-all shadow-md hover:shadow-lg font-body text-center text-xs sm:text-base flex-1"
                >
                  企画一覧を見る
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/20 transition-all font-body text-center text-xs sm:text-base flex-1"
                >
                  企画を始める
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* 人気のプロジェクトセクション */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0 mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold">
              人気のプロジェクト
            </h2>
            <Link
              to="/projects"
              className="text-oshi-purple-500 hover:text-oshi-pink-500 transition-colors font-body flex items-center gap-1.5 text-sm"
            >
              すべてのプロジェクトを見る
              <svg
                className="w-4 h-4"
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

          {/* ローディング状態 */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oshi-purple-500"></div>
            </div>
          )}

          {/* プロジェクト一覧 */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularProjects.map((project) => (
                <ProjectCard key={project.id} {...formatProjectForCard(project)} />
              ))}
            </div>
          )}
        </section>

        {/* 特徴セクション */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100/80 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-oshi-pink-500 to-oshi-purple-500 text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-display font-bold mb-2 group-hover:text-oshi-pink-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 font-body">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-oshi-purple-500 text-sm font-medium group-hover:text-oshi-pink-500 transition-colors">
                    詳しく見る
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-oshi-purple-500/5 to-oshi-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
          <div className="mt-8 sm:mt-12 bg-gradient-to-br from-oshi-pink-50 to-oshi-purple-50 rounded-xl p-5 sm:p-6 lg:p-8 text-center border border-oshi-pink-100/50">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold mb-3">
              支援について
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-body leading-relaxed">
              支援金額は一律で、リターンは支援者様のニックネームを広告内で掲載させていただく形になります。
              <br className="hidden sm:block" />
              一部の企画では、事務所様との連携による特典（ポストカードやチェキなど）が追加される場合があります。
            </p>

            {/* ナビゲーションボタン */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/guide"
                className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-oshi-pink-100/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-oshi-pink-500/10 to-oshi-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <svg
                    className="w-8 h-8 text-oshi-purple-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h4 className="font-bold text-gray-900">ご利用ガイド</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    企画の立て方や支援方法をご案内
                  </p>
                </div>
              </Link>

              <Link
                to="/agencies"
                className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-oshi-pink-100/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-oshi-pink-500/10 to-oshi-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <svg
                    className="w-8 h-8 text-oshi-purple-500 mb-2"
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
                  <h4 className="font-bold text-gray-900">
                    応援広告規約を公開している事務所
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    応援広告規約を公開している事務所様の一覧
                  </p>
                </div>
              </Link>

              <Link
                to="/visions"
                className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-oshi-pink-100/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-oshi-pink-500/10 to-oshi-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <svg
                    className="w-8 h-8 text-oshi-purple-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <h4 className="font-bold text-gray-900">広告ビジョン</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    利用可能な広告ビジョン一例
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-gradient-to-br from-oshi-purple-500 to-oshi-pink-500 text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold">
              あなたも推しの誕生日企画を
              <br className="hidden sm:block" />
              始めませんか？
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 font-body max-w-2xl mx-auto">
              企画の立ち上げから実現まで、専門スタッフが丁寧にサポート。
              <br className="hidden sm:block" />
              まずは無料相談から始めましょう。
            </p>
            <div className="pt-2 sm:pt-3">
              <Link
                to="/contact"
                className="inline-block bg-white text-oshi-purple-500 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base font-body shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                無料相談をする
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
