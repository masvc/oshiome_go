package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Support struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	ProjectID uint      `gorm:"not null" json:"project_id"`
	Amount    int       `gorm:"not null" json:"amount"`
	Message   string    `gorm:"type:text" json:"message"`
	Status    string    `gorm:"size:20;default:'pending'" json:"status"` // pending, completed, cancelled
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	User    User    `gorm:"foreignkey:UserID" json:"user"`
	Project Project `gorm:"foreignkey:ProjectID" json:"project"`
}

func (s *Support) BeforeCreate(tx *gorm.DB) error {
	s.CreatedAt = time.Now()
	s.UpdatedAt = time.Now()
	if s.Status == "" {
		s.Status = "pending"
	}
	return nil
}

func (s *Support) BeforeUpdate(tx *gorm.DB) error {
	s.UpdatedAt = time.Now()
	return nil
}
