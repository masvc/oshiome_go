import { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { SessionContext } from '../../SessionProvider';
import { supabase } from '../../supabaseClient';
import { CreateProjectInput } from '../../types';

interface Vision {
  id: string;
  name: string;
  description: string;
}

// ユーザー型の定義
interface User {
  id: string;
  email: string;
  role: string;
}

export default function ProjectRegister() {
  const navigate = useNavigate();
  const [currentUser] = useContext(SessionContext);

  // プロジェクトのメイン情報
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [projectHashtag, setProjectHashtag] = useState('');
  const [supportHashtag, setSupportHashtag] = useState('');
  const [isOfficeApproved, setIsOfficeApproved] = useState(false);
  const [selectedVisionId, setSelectedVisionId] = useState('');
  const [visions, setVisions] = useState<Vision[]>([]);

  // ビジョンデータの取得
  useEffect(() => {
    const fetchVisions = async () => {
      try {
        const { data, error } = await supabase
          .from('visions')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        if (data) {
          setVisions(data);
        }
      } catch (error) {
        console.error('Vision fetch error:', error);
      }
    };
    fetchVisions();
  }, []);

  // スケジュール情報（複数）
  const [schedules, setSchedules] = useState([{ date: '', content: '' }]);

  const addSchedule = () => {
    setSchedules([...schedules, { date: '', content: '' }]);
  };

  // プロジェクト更新情報（複数）
  const [updates, setUpdates] = useState([
    { title: '', date: '', content: '' },
  ]);

  const addUpdate = () => {
    setUpdates([...updates, { title: '', date: '', content: '' }]);
  };

  const registerProject = async () => {
    try {
      // creator_idの取得を確実に
      if (!currentUser || typeof currentUser !== 'object' || !currentUser.id) {
        throw new Error('ユーザー情報が取得できません');
      }

      // 日付の変換とバリデーション
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
      
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('無効な日付形式です');
      }

      const projectData: CreateProjectInput = {
        title: title.trim(),
        description: description.trim(),
        target_amount: Math.floor(goalAmount),
        current_amount: 0,
        creator_id: currentUser.id,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        status: 'draft' as 'draft' | 'active' | 'ended' | 'cancelled',
        thumbnail_url: imageUrl || null,
        project_hashtag: projectHashtag || null,
        support_hashtag: supportHashtag || null,
        idol_name: title.trim(),
        office_status: (isOfficeApproved ? 'approved' : 'pending') as 'approved' | 'pending'
      };

      // デバッグ用のログ出力を追加
      console.log('送信するプロジェクトデータ:', {
        ...projectData,
        status: JSON.stringify(projectData.status),
        office_status: JSON.stringify(projectData.office_status),
        start_date: JSON.stringify(projectData.start_date),
        end_date: JSON.stringify(projectData.end_date)
      });

      // 拡張バリデーション
      if (!projectData.title) {
        throw new Error('タイトルは必須です');
      }
      if (!projectData.description) {
        throw new Error('説明は必須です');
      }
      if (projectData.target_amount < 10000) {
        throw new Error('目標金額は10,000円以上である必要があります');
      }
      if (!projectData.start_date || !projectData.end_date) {
        throw new Error('開始日と終了日は必須です');
      }
      if (endDateTime <= startDateTime) {
        throw new Error('終了日は開始日より後である必要があります');
      }

      // プロジェクトのメイン情報を登録
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (projectError) {
        console.error('プロジェクト作成エラーの詳細:', {
          error: projectError,
          code: projectError.code,
          message: projectError.message,
          details: projectError.details,
          hint: projectError.hint,
          requestData: projectData,
          sql: projectError.hint ? projectError.hint.match(/SQL: (.+)/)?.pop() : null
        });
        throw new Error(`プロジェクト作成に失敗しました: ${projectError.message}`);
      }

      if (!project) {
        throw new Error('プロジェクトの作成に失敗しました');
      }

      console.log('作成されたプロジェクト:', project);

      // スケジュールの登録
      const schedulePromises = schedules.map((schedule) =>
        supabase.from('project_schedules').insert({
          project_id: project.id,
          schedule_date: new Date(schedule.date).toISOString(),
          content: schedule.content,
        })
      );

      // プロジェクト更新情報の登録
      const updatePromises = updates.map((update) =>
        supabase.from('project_updates').insert({
          project_id: project.id,
          title: update.title,
          content: update.content,
          update_date: new Date(update.date).toISOString(),
        })
      );

      await Promise.all([...schedulePromises, ...updatePromises]);

      // 登録完了後、企画管理画面に遷移
      navigate('/admin/projects');
    } catch (error) {
      console.error('Project Registration Error:', error);
    }
  };

  if (currentUser == null) return <Navigate replace to={'/signin'} />;

  return (
    <AdminLayout>
      <div className="bg-gray-100 py-5 px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-extrabold text-oshi-purple">企画登録</h2>
          <div className="mt-4 w-full max-w-2xl">
            <div className="bg-white py-8 px-4 rounded-lg shadow-md">
              <div className="space-y-6">
                {/* メイン情報フォーム */}
                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    タイトル
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    説明
                  </label>
                  <textarea
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    目標金額
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-oshi-purple">
                      開始日
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-oshi-purple">
                      終了日
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    画像URL
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    企画ハッシュタグ
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={projectHashtag}
                    onChange={(e) => setProjectHashtag(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    応援ハッシュタグ
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={supportHashtag}
                    onChange={(e) => setSupportHashtag(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-oshi-purple">
                    ビジョン選択
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                    value={selectedVisionId}
                    onChange={(e) => setSelectedVisionId(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {visions.map((vision) => (
                      <option key={vision.id} value={vision.id}>
                        {vision.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOfficeApproved"
                    checked={isOfficeApproved}
                    onChange={(e) => setIsOfficeApproved(e.target.checked)}
                    className="h-4 w-4 text-oshi-purple focus:ring-oshi-purple border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isOfficeApproved"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    事務所承認済み
                  </label>
                </div>

                {/* スケジュール情報 */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-oshi-purple">
                    スケジュール
                  </h3>
                  {schedules.map((schedule, index) => (
                    <div key={index} className="mt-2 grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="例：2024年1月1日 / 1月上旬"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                        value={schedule.date}
                        onChange={(e) => {
                          const newSchedules = [...schedules];
                          newSchedules[index].date = e.target.value;
                          setSchedules(newSchedules);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="内容"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                        value={schedule.content}
                        onChange={(e) => {
                          const newSchedules = [...schedules];
                          newSchedules[index].content = e.target.value;
                          setSchedules(newSchedules);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSchedule}
                    className="mt-2 text-sm text-oshi-purple"
                  >
                    + スケジュールを追加
                  </button>
                </div>

                {/* プロジェクト更新情報 */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-oshi-purple">
                    更新情報
                  </h3>
                  {updates.map((update, index) => (
                    <div key={index} className="mt-4 space-y-2">
                      <input
                        type="date"
                        className="block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                        value={update.date}
                        onChange={(e) => {
                          const newUpdates = [...updates];
                          newUpdates[index].date = e.target.value;
                          setUpdates(newUpdates);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="タイトル"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                        value={update.title}
                        onChange={(e) => {
                          const newUpdates = [...updates];
                          newUpdates[index].title = e.target.value;
                          setUpdates(newUpdates);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="更新内容"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-oshi-purple focus:border-oshi-purple sm:text-sm"
                        value={update.content}
                        onChange={(e) => {
                          const newUpdates = [...updates];
                          newUpdates[index].content = e.target.value;
                          setUpdates(newUpdates);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addUpdate}
                    className="mt-4 text-sm text-oshi-purple"
                  >
                    + 更新情報を追加
                  </button>
                </div>

                {/* 登録ボタン */}
                <div>
                  <button
                    type="button"
                    onClick={registerProject}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-oshi-purple hover:bg-oshi-indigo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oshi-purple"
                  >
                    企画を登録する
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
