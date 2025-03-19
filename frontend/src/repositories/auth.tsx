import { supabase } from '../lib/supabase';

export type UserRole = 0 | 1 | 2;

export const authRepository = {
  /**
   * 新規ユーザー登録を行う
   * @param name ユーザー名
   * @param email メールアドレス
   * @param password パスワード
   * @returns 登録されたユーザー情報
   */
  async signup(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw new Error(`認証エラー: ${error.message}`);
    if (!data.user) throw new Error('ユーザー登録に失敗しました。');

    return data.user;
  },

  /**
   * ユーザーログインを行う
   * @param email メールアドレス
   * @param password パスワード
   * @returns ログインしたユーザー情報
   */
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    // ログイン時にlast_loginを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('Failed to update last_login:', updateError);
    }

    return data.user;
  },

  /**
   * 現在のログインユーザー情報を取得する
   * @returns ログイン中のユーザー情報（未ログインの場合はnull）
   */
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    if (!data.session) return null;

    // プロフィール情報も取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();

    if (profileError) {
      console.error('Failed to fetch profile:', profileError);
      return data.session.user;
    }

    return {
      ...data.session.user,
      profile,
    };
  },

  /**
   * ユーザーログアウトを行う
   * @returns ログアウト成功時はtrue
   */
  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  },

  // 権限チェック用のヘルパー関数
  isPlanner(user: any) {
    return user?.profile?.role_flag === 1;
  },

  isAdmin(user: any) {
    return user?.profile?.role_flag === 2;
  },
};
