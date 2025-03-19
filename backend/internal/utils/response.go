package utils

// Response はAPIレスポンスの基本構造
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// NewSuccessResponse は成功時のレスポンスを生成
func NewSuccessResponse(data interface{}) Response {
	return Response{
		Status: "success",
		Data:   data,
	}
}

// NewSuccessMessageResponse はメッセージ付きの成功レスポンスを生成
func NewSuccessMessageResponse(message string) Response {
	return Response{
		Status:  "success",
		Message: message,
	}
}

// NewSuccessDataMessageResponse はデータとメッセージ付きの成功レスポンスを生成
func NewSuccessDataMessageResponse(data interface{}, message string) Response {
	return Response{
		Status:  "success",
		Message: message,
		Data:    data,
	}
}

// NewErrorResponse エラーレスポンスを生成
func NewErrorResponse(message string) Response {
	return Response{
		Status:  "error",
		Message: message,
	}
}
