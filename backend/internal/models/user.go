package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type User struct {
	ID              uint      `gorm:"primary_key" json:"id"`
	Email           string    `gorm:"type:varchar(255);not null;unique" json:"email"`
	Password        string    `gorm:"type:varchar(255);not null" json:"-"`
	Name            string    `gorm:"type:varchar(255);not null" json:"name"`
	Bio             string    `gorm:"type:text" json:"bio"`
	ProfileImageURL string    `gorm:"type:varchar(255)" json:"profile_image_url"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}
