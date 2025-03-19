package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Support struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	ProjectID uint      `json:"project_id"`
	Amount    int64     `json:"amount"`
	Message   string    `json:"message"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	User      *User     `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Project   Project   `gorm:"foreignkey:ProjectID" json:"project"`
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
