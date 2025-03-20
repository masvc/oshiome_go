// APIエラーの基本型
export interface APIError {
  code: string;
  message: string;
  detail?: string;
  status: string;
}

// エラーコードの定数
export const ErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
} as const;

// エラーメッセージの定数
export const ErrorMessages = {
  // プロジェクト関連
  PROJECT_NOT_FOUND: 'プロジェクトが見つかりません',
  PROJECT_CREATE_FAIL: 'プロジェクトの作成に失敗しました',
  PROJECT_UPDATE_FAIL: 'プロジェクトの更新に失敗しました',
  PROJECT_DELETE_FAIL: 'プロジェクトの削除に失敗しました',
  PROJECT_LIST_FAIL: 'プロジェクト一覧の取得に失敗しました',
  // 認証関連
  UNAUTHORIZED_ACCESS: 'このアクションを実行する権限がありません',
  USER_CREATE_FAIL: 'ユーザーの作成に失敗しました',
  USER_NOT_FOUND: 'ユーザーが見つかりません',
  INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません',
  // 共通
  INVALID_INPUT: '入力が無効です',
  UNAUTHORIZED: '認証が必要です',
  NOT_FOUND: 'リソースが見つかりません',
  INTERNAL_SERVER_ERROR: 'サーバーエラーが発生しました',
  DUPLICATE_EMAIL: 'このメールアドレスは既に使用されています',
} as const;

// カスタムエラークラス
export class APIErrorResponse extends Error {
  constructor(
    public code: string,
    message: string,
    public detail?: string
  ) {
    super(message);
    this.name = 'APIErrorResponse';
  }
} 