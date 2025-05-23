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
	ID              uint           `json:"id" gorm:"primarykey"`
	Title           string         `json:"title" gorm:"type:varchar(255);not null"`
	Description     string         `json:"description" gorm:"type:text"`
	TargetAmount    int64          `json:"target_amount" gorm:"not null"`
	CurrentAmount   int64          `json:"current_amount" gorm:"default:0"`
	Deadline        time.Time      `json:"deadline" gorm:"not null"`
	UserID          uint           `json:"user_id" gorm:"not null"`
	Status          ProjectStatus  `json:"status" gorm:"type:character varying(20);default:'draft'"`
	ThumbnailURL    string         `json:"thumbnail_url" gorm:"type:varchar(255)"`
	OfficeApproved  bool           `json:"office_approved" gorm:"default:true"` // true: 確認中, false: 承認済
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
	User            User           `json:"user" gorm:"foreignKey:UserID"`
	Supports        []Support      `json:"-" gorm:"foreignKey:ProjectID"`
	SupportersCount int            `json:"supporters_count" gorm:"-"`
}

// TableName GORMのテーブル名を明示的に指定
func (Project) TableName() string {
	return "projects"
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

func (p *Project) AfterFind(tx *gorm.DB) error {
	// 支援者数のカウント
	var count int64
	if err := tx.Model(&Support{}).Where("project_id = ? AND status = ?", p.ID, SupportStatusCompleted).Count(&count).Error; err != nil {
		return err
	}
	p.SupportersCount = int(count)

	// 現在の支援金額を集計 (すでにcompletedになっている支援のみ)
	var totalAmount int64
	if err := tx.Model(&Support{}).Select("COALESCE(SUM(amount), 0)").Where("project_id = ? AND status = ?", p.ID, SupportStatusCompleted).Scan(&totalAmount).Error; err != nil {
		return err
	}
	p.CurrentAmount = totalAmount

	return nil
}
