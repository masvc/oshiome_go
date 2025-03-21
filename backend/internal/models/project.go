package models

import (
	"time"

	"gorm.io/gorm"
)

type ProjectStatus string

const (
	ProjectStatusDraft     ProjectStatus = "draft"
	ProjectStatusActive    ProjectStatus = "active"
	ProjectStatusComplete  ProjectStatus = "complete"
	ProjectStatusCancelled ProjectStatus = "cancelled"
)

type Project struct {
	ID             uint           `json:"id" gorm:"primarykey"`
	Title          string         `json:"title" gorm:"size:255;not null"`
	Description    string         `json:"description" gorm:"type:text"`
	TargetAmount   int64          `json:"target_amount" gorm:"not null"`
	CurrentAmount  int64          `json:"current_amount" gorm:"default:0"`
	Deadline       time.Time      `json:"deadline" gorm:"not null"`
	UserID         uint           `json:"user_id" gorm:"not null"`
	Status         ProjectStatus  `json:"status" gorm:"type:varchar(20);default:'draft'"`
	ThumbnailURL   string         `json:"thumbnail_url" gorm:"size:255"`
	OfficeApproved int            `json:"office_approved" gorm:"type:tinyint;default:1"` // 0: 承認済, 1: 確認中
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
	User           User           `json:"user" gorm:"foreignKey:UserID"`
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	if p.Status == "" {
		p.Status = "draft"
	}
	return nil
}

func (p *Project) BeforeUpdate(tx *gorm.DB) error {
	p.UpdatedAt = time.Now()
	return nil
}
