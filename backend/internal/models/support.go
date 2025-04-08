package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type SupportStatus string

const (
	SupportStatusPending   SupportStatus = "pending"
	SupportStatusCompleted SupportStatus = "completed"
	SupportStatusFailed    SupportStatus = "failed"
	SupportStatusCancelled SupportStatus = "cancelled"
)

type Support struct {
	ID                uint          `json:"id" gorm:"primaryKey"`
	UserID            uint          `json:"user_id"`
	ProjectID         uint          `json:"project_id"`
	Amount            int64         `json:"amount"`
	Message           string        `json:"message"`
	Status            SupportStatus `json:"status"`
	PaymentIntentID   string        `json:"payment_intent_id" gorm:"type:varchar(255)"`
	CheckoutSessionID string        `json:"checkout_session_id" gorm:"type:varchar(255)"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
	User              *User         `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Project           Project       `gorm:"foreignkey:ProjectID" json:"project"`
}

// TableName GORMのテーブル名を明示的に指定
func (Support) TableName() string {
	return "supports"
}

func (s *Support) BeforeCreate(tx *gorm.DB) error {
	s.CreatedAt = time.Now()
	s.UpdatedAt = time.Now()
	if s.Status == "" {
		s.Status = SupportStatusPending
	}
	return nil
}

func (s *Support) BeforeUpdate(tx *gorm.DB) error {
	s.UpdatedAt = time.Now()
	return nil
}
