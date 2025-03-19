package utils

import "net/http"

// AppError アプリケーションのエラー型
type AppError struct {
	StatusCode int    `json:"-"`       // HTTPステータスコード
	Code       string `json:"code"`    // エラーコード
	Message    string `json:"message"` // ユーザー向けメッセージ
	Detail     string `json:"detail"`  // 詳細なエラー情報（開発者向け）
}

func (e *AppError) Error() string {
	return e.Message
}

// 共通エラーの定義
var (
	ErrInvalidInput = &AppError{
		StatusCode: http.StatusBadRequest,
		Code:       "INVALID_INPUT",
		Message:    "入力内容が正しくありません",
	}

	ErrUnauthorized = &AppError{
		StatusCode: http.StatusUnauthorized,
		Code:       "UNAUTHORIZED",
		Message:    "認証が必要です",
	}

	ErrNotFound = &AppError{
		StatusCode: http.StatusNotFound,
		Code:       "NOT_FOUND",
		Message:    "リソースが見つかりません",
	}

	ErrInternalServer = &AppError{
		StatusCode: http.StatusInternalServerError,
		Code:       "INTERNAL_SERVER_ERROR",
		Message:    "サーバーエラーが発生しました",
	}

	ErrDuplicateEmail = &AppError{
		StatusCode: http.StatusConflict,
		Code:       "DUPLICATE_EMAIL",
		Message:    "このメールアドレスは既に使用されています",
	}

	ErrInvalidCredentials = &AppError{
		StatusCode: http.StatusUnauthorized,
		Code:       "INVALID_CREDENTIALS",
		Message:    "メールアドレスまたはパスワードが正しくありません",
	}
)

// WithDetail エラーに詳細情報を追加
func (e *AppError) WithDetail(detail string) *AppError {
	return &AppError{
		StatusCode: e.StatusCode,
		Code:       e.Code,
		Message:    e.Message,
		Detail:     detail,
	}
}

const (
	ErrMsgProjectNotFound    = "指定されたプロジェクトが見つかりません"
	ErrMsgProjectCreateFail  = "プロジェクトの作成に失敗しました"
	ErrMsgProjectUpdateFail  = "プロジェクトの更新に失敗しました"
	ErrMsgProjectDeleteFail  = "プロジェクトの削除に失敗しました"
	ErrMsgProjectListFail    = "プロジェクト一覧の取得に失敗しました"
	ErrMsgUnauthorizedAccess = "このプロジェクトへのアクセス権限がありません"
)
