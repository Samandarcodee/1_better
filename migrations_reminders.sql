-- Migration: Add reminder features and user settings
-- Neon Dashboard → SQL Editor'da ishga tushiring

-- 1. Habits jadvaliga reminder ustunlarini qo'shish
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_time VARCHAR(5) DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS reminder_timezone VARCHAR(50) DEFAULT 'Asia/Tashkent';

-- 2. User settings jadvali yaratish
CREATE TABLE IF NOT EXISTS user_settings (
  user_id VARCHAR(255) PRIMARY KEY,
  chat_id VARCHAR(255) NOT NULL,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  streak_reminders BOOLEAN NOT NULL DEFAULT true,
  milestone_notifications BOOLEAN NOT NULL DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'Asia/Tashkent',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Index'lar yaratish
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_reminder_enabled ON habits(reminder_enabled);

-- 4. Mavjud foydalanuvchilar uchun user_settings yaratish (ixtiyoriy)
-- Bu faqat mavjud habits bo'lsa ishlaydi
INSERT INTO user_settings (user_id, chat_id, notifications_enabled)
SELECT DISTINCT user_id, user_id, true
FROM habits
WHERE user_id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT (user_id) DO NOTHING;

-- 5. Tekshirish
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name IN ('habits', 'user_settings')
ORDER BY table_name, ordinal_position;

-- 6. Test query
SELECT 
  h.name, 
  h.reminder_enabled, 
  h.reminder_time,
  us.notifications_enabled
FROM habits h
LEFT JOIN user_settings us ON h.user_id = us.user_id
LIMIT 5;

