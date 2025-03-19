package utils

// APIError はAPIのエラーを表す構造体
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Detail  string `json:"detail,omitempty"`
	Status  string `json:"status"`
}

// Error はエラーインターフェースを実装
func (e *APIError) Error() string {
	return e.Message
}

// WithDetail はエラーの詳細を追加
func (e *APIError) WithDetail(detail string) *APIError {
	return &APIError{
		Code:    e.Code,
		Message: e.Message,
		Detail:  detail,
		Status:  "error",
	}
}

// 定義済みエラー
var (
	ErrInvalidInput = &APIError{
		Code:    "INVALID_INPUT",
		Message: "入力が無効です",
		Status:  "error",
	}

	ErrUnauthorized = &APIError{
		Code:    "UNAUTHORIZED",
		Message: "認証が必要です",
		Status:  "error",
	}

	ErrNotFound = &APIError{
		Code:    "NOT_FOUND",
		Message: "リソースが見つかりません",
		Status:  "error",
	}

	ErrInternalServer = &APIError{
		Code:    "INTERNAL_SERVER_ERROR",
		Message: "サーバーエラーが発生しました",
		Status:  "error",
	}

	ErrDuplicateEmail = &APIError{
		Code:    "DUPLICATE_EMAIL",
		Message: "このメールアドレスは既に使用されています",
		Status:  "error",
	}

	ErrInvalidCredentials = &APIError{
		Code:    "INVALID_CREDENTIALS",
		Message: "メールアドレスまたはパスワードが正しくありません",
		Status:  "error",
	}
)

// エラーメッセージの定数
const (
	ErrMsgProjectNotFound    = "プロジェクトが見つかりません"
	ErrMsgProjectCreateFail  = "プロジェクトの作成に失敗しました"
	ErrMsgProjectUpdateFail  = "プロジェクトの更新に失敗しました"
	ErrMsgProjectDeleteFail  = "プロジェクトの削除に失敗しました"
	ErrMsgProjectListFail    = "プロジェクト一覧の取得に失敗しました"
	ErrMsgUnauthorizedAccess = "このアクションを実行する権限がありません"
	ErrMsgUserCreateFail     = "ユーザーの作成に失敗しました"
	ErrMsgUserNotFound       = "ユーザーが見つかりません"
	ErrMsgInvalidCredentials = "メールアドレスまたはパスワードが正しくありません"
)
