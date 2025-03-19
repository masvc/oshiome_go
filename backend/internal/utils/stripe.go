package utils

import (
	"log"
	"os"

	"github.com/stripe/stripe-go/v72"
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
