package utils

// Response APIレスポンスの共通構造体
type Response struct {
	Status  string      `json:"status"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

// NewSuccessResponse 成功レスポンスを生成
func NewSuccessResponse(data interface{}) Response {
	return Response{
		Status: "success",
		Data:   data,
	}
}

// NewErrorResponse エラーレスポンスを生成
func NewErrorResponse(message string) Response {
	return Response{
		Status:  "error",
		Message: message,
	}
}
