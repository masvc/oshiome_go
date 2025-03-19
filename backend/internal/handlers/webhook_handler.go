package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/utils"
	"github.com/stripe/stripe-go/v72"
)

// HandleStripeWebhook はStripeからのWebhookを処理します
func (h *Handler) HandleStripeWebhook(c *gin.Context) {
	// リクエストボディを読み取り
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Printf("Error reading request body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read request body"})
		return
	}

	// Webhookの署名を検証
	event, err := utils.ValidateWebhookSignature(body, c.GetHeader("Stripe-Signature"))
	if err != nil {
		log.Printf("Error verifying webhook signature: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid signature"})
		return
	}

	// イベントタイプに応じて処理
	switch event.Type {
	case "payment_intent.succeeded":
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			log.Printf("Error parsing webhook JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		handlePaymentIntentSucceeded(paymentIntent)

	case "payment_intent.payment_failed":
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			log.Printf("Error parsing webhook JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		handlePaymentIntentFailed(paymentIntent)

	default:
		log.Printf("Unhandled event type: %s\n", event.Type)
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

// 支払い成功時の処理
func handlePaymentIntentSucceeded(paymentIntent stripe.PaymentIntent) {
	log.Printf("PaymentIntent succeeded: %s", paymentIntent.ID)
	// TODO: 支援情報の更新処理
	// TODO: ユーザーへの通知処理
}

// 支払い失敗時の処理
func handlePaymentIntentFailed(paymentIntent stripe.PaymentIntent) {
	log.Printf("PaymentIntent failed: %s", paymentIntent.ID)
	// TODO: 支援情報の更新処理
	// TODO: ユーザーへの通知処理
}
