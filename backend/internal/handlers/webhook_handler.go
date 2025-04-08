package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/masvc/oshiome_go/backend/internal/db"
	"github.com/masvc/oshiome_go/backend/internal/models"
	"github.com/masvc/oshiome_go/backend/internal/utils"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
)

// HandleStripeWebhook はStripeからのWebhookを処理します
func (h *Handler) HandleStripeWebhook(c *gin.Context) {
	log.Printf("Webhook received: starting to process")

	// リクエストボディを読み取り
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Printf("Error reading request body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read request body"})
		return
	}

	log.Printf("Request body read successfully, length: %d bytes", len(body))
	log.Printf("Stripe-Signature header: %s", c.GetHeader("Stripe-Signature"))

	// Webhookの署名を検証
	event, err := utils.ValidateWebhookSignature(body, c.GetHeader("Stripe-Signature"))
	if err != nil {
		log.Printf("Error verifying webhook signature: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid signature"})
		return
	}

	log.Printf("Webhook signature validated successfully, event type: %s", event.Type)

	// イベントタイプに応じて処理
	switch event.Type {
	case "checkout.session.completed":
		log.Printf("Processing checkout.session.completed event")
		var checkoutSession stripe.CheckoutSession
		err := json.Unmarshal(event.Data.Raw, &checkoutSession)
		if err != nil {
			log.Printf("Error parsing webhook JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		handleCheckoutSessionCompleted(checkoutSession)

	case "payment_intent.succeeded":
		log.Printf("Processing payment_intent.succeeded event")
		var paymentIntent stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &paymentIntent)
		if err != nil {
			log.Printf("Error parsing webhook JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		handlePaymentIntentSucceeded(paymentIntent)

	case "payment_intent.payment_failed":
		log.Printf("Processing payment_intent.payment_failed event")
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
	log.Printf("Webhook processed successfully")
}

// CheckoutSession完了時の処理
func handleCheckoutSessionCompleted(checkoutSession stripe.CheckoutSession) {
	log.Printf("CheckoutSession completed: %s", checkoutSession.ID)

	// セッションが支払いモードかを確認
	if checkoutSession.Mode != "payment" {
		log.Printf("Skipping non-payment mode session: %s", checkoutSession.Mode)
		return
	}

	// 関連するサポート情報を取得
	// メタデータからsupport_idを取得
	supportIDStr, ok := checkoutSession.Metadata["support_id"]
	if !ok {
		log.Printf("No support_id in metadata")
		return
	}

	supportID, err := strconv.ParseUint(supportIDStr, 10, 64)
	if err != nil {
		log.Printf("Invalid support_id: %s", supportIDStr)
		return
	}

	var support models.Support
	if err := db.GetDB().First(&support, supportID).Error; err != nil {
		log.Printf("Support not found: %d", supportID)
		return
	}

	// PaymentIntent情報を取得
	if checkoutSession.PaymentIntent == nil {
		log.Printf("No PaymentIntent found in session: %s", checkoutSession.ID)
		return
	}

	// 支援ステータスを完了に更新
	tx := db.GetDB().Begin()
	if tx.Error != nil {
		log.Printf("Error starting transaction: %v", tx.Error)
		return
	}

	// トランザクションのロールバックを保証
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 支援情報を更新
	if err := tx.Model(&support).Updates(map[string]interface{}{
		"status":            models.SupportStatusCompleted,
		"payment_intent_id": checkoutSession.PaymentIntent.ID,
	}).Error; err != nil {
		tx.Rollback()
		log.Printf("Error updating support: %v", err)
		return
	}

	// プロジェクトの現在の支援額更新は不要（AfterFindで動的に計算するため）

	// トランザクションのコミット
	if err := tx.Commit().Error; err != nil {
		log.Printf("Error committing transaction: %v", err)
		return
	}

	log.Printf("Support completed: %d, Amount: %d", support.ID, support.Amount)
}

// 支払い成功時の処理
func handlePaymentIntentSucceeded(paymentIntent stripe.PaymentIntent) {
	log.Printf("PaymentIntent succeeded: %s", paymentIntent.ID)

	// 関連するチェックアウトセッションがあれば取得
	params := &stripe.CheckoutSessionListParams{
		PaymentIntent: stripe.String(paymentIntent.ID),
	}

	iter := session.List(params)
	for iter.Next() {
		s := iter.Current().(*stripe.CheckoutSession)
		supportIDStr, ok := s.Metadata["support_id"]
		if !ok {
			log.Printf("No support_id in metadata for session: %s", s.ID)
			continue
		}

		supportID, err := strconv.ParseUint(supportIDStr, 10, 64)
		if err != nil {
			log.Printf("Invalid support_id: %s", supportIDStr)
			continue
		}

		log.Printf("Found support_id %d for PaymentIntent %s", supportID, paymentIntent.ID)

		var support models.Support
		if err := db.GetDB().First(&support, supportID).Error; err != nil {
			log.Printf("Support not found: %d", supportID)
			continue
		}

		// 支援ステータスを完了に更新
		tx := db.GetDB().Begin()
		if tx.Error != nil {
			log.Printf("Error starting transaction: %v", tx.Error)
			continue
		}

		// トランザクションのロールバックを保証
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		// 支援情報を更新
		if err := tx.Model(&support).Updates(map[string]interface{}{
			"status":            models.SupportStatusCompleted,
			"payment_intent_id": paymentIntent.ID,
		}).Error; err != nil {
			tx.Rollback()
			log.Printf("Error updating support: %v", err)
			continue
		}

		// プロジェクトの現在の支援額更新は不要（AfterFindで動的に計算するため）

		// トランザクションのコミット
		if err := tx.Commit().Error; err != nil {
			log.Printf("Error committing transaction: %v", err)
			continue
		}

		log.Printf("Support completed: %d, Amount: %d", support.ID, support.Amount)
		return // 最初の有効なサポートのみ処理
	}

	if err := iter.Err(); err != nil {
		log.Printf("Error iterating sessions: %v", err)
	}
}

// 支払い失敗時の処理
func handlePaymentIntentFailed(paymentIntent stripe.PaymentIntent) {
	log.Printf("PaymentIntent failed: %s", paymentIntent.ID)

	// 関連するチェックアウトセッションがあれば取得
	params := &stripe.CheckoutSessionListParams{
		PaymentIntent: stripe.String(paymentIntent.ID),
	}

	iter := session.List(params)
	for iter.Next() {
		s := iter.Current().(*stripe.CheckoutSession)
		supportIDStr, ok := s.Metadata["support_id"]
		if !ok {
			continue
		}

		supportID, err := strconv.ParseUint(supportIDStr, 10, 64)
		if err != nil {
			continue
		}

		// 支援情報を失敗状態に更新
		if err := db.GetDB().Model(&models.Support{}).Where("id = ?", supportID).
			Updates(map[string]interface{}{
				"status":            models.SupportStatusFailed,
				"payment_intent_id": paymentIntent.ID,
			}).Error; err != nil {
			log.Printf("Error updating support %d: %v", supportID, err)
		} else {
			log.Printf("Support %d marked as failed", supportID)
		}
	}

	if err := iter.Err(); err != nil {
		log.Printf("Error iterating sessions: %v", err)
	}
}
