-- Migration: Add user_id column to habits table
-- Date: 2025-11-13
-- Description: Telegram user ID bilan bog'lash

-- 1. user_id column qo'shish (nullable, keyinchalik NOT NULL qilamiz)
ALTER TABLE habits 
ADD COLUMN IF NOT EXISTS user_id VARCHAR;

-- 2. Agar mavjud ma'lumotlar bo'lsa, ularni test user ID bilan to'ldirish
-- (Production'da real user ID'lar bilan almashtirish kerak)
UPDATE habits 
SET user_id = '0' 
WHERE user_id IS NULL;

-- 3. NOT NULL constraint qo'shish
ALTER TABLE habits 
ALTER COLUMN user_id SET NOT NULL;

-- 4. Index yaratish (performance uchun)
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);

-- 5. Tekshirish
SELECT id, user_id, name FROM habits LIMIT 5;

-- ESLATMA:
-- Bu migration'ni Neon SQL Editor'da ishga tushiring
-- Yoki drizzle-kit bilan push qiling

