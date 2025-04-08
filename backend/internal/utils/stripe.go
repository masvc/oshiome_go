package utils

import (
	"log"
	"os"
	"strconv"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/webhook"
)

// InitStripe はStripeの初期設定を行います
func InitStripe() {
	// APIキーの設定
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	// APIキーが設定されているかログ出力
	if stripe.Key != "" {
		log.Printf("Stripe initialized with key starting with: %s", stripe.Key[:8])
	} else {
		log.Printf("Warning: STRIPE_SECRET_KEY is not set")
	}
}

// ValidateWebhookSignature はWebhookの署名を検証します
func ValidateWebhookSignature(payload []byte, header string) (stripe.Event, error) {
	webhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	return webhook.ConstructEvent(payload, header, webhookSecret)
}

// CreateCheckoutSession はプロジェクト支援用のStripe Checkout Sessionを作成します
func CreateCheckoutSession(projectID uint, projectTitle string, amount int64, supportID uint, userID uint, successURL, cancelURL string) (*stripe.CheckoutSession, error) {
	// プロジェクトタイトルが空の場合はデフォルト値を設定
	productName := "プロジェクト支援"
	if projectTitle != "" {
		productName = projectTitle + " への支援"
	}

	// メタデータマップの作成
	metadata := map[string]string{
		"project_id": strconv.FormatUint(uint64(projectID), 10),
		"support_id": strconv.FormatUint(uint64(supportID), 10),
		"user_id":    strconv.FormatUint(uint64(userID), 10),
	}

	// Checkout Sessionの作成パラメータ
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("jpy"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(productName),
					},
					UnitAmount: stripe.Int64(amount),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
	}

	// メタデータを設定
	params.Params.Metadata = metadata

	// Checkout Sessionの作成
	s, err := session.New(params)
	if err != nil {
		return nil, err
	}

	return s, nil
}
