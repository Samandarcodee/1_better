-- Migration: Add user_id column to habits table
-- Neon Dashboard → SQL Editor'da ishga tushiring

-- Agar eski ma'lumotlar bo'lsa, avval backup oling
-- SELECT * FROM habits;

-- 1. Eski jadvalni o'chirish (agar test ma'lumotlar bo'lsa)
DROP TABLE IF EXISTS habits CASCADE;

-- 2. Yangi jadval yaratish (user_id bilan)
CREATE TABLE IF NOT EXISTS habits (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL, -- Telegram user ID
  name TEXT NOT NULL,
  is_good_habit BOOLEAN NOT NULL DEFAULT true,
  duration INTEGER NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  completion_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 3. Index yaratish (performance uchun)
CREATE INDEX IF NOT EXISTS idx_habits_id ON habits(id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id); -- Yangi index
CREATE INDEX IF NOT EXISTS idx_habits_start_date ON habits(start_date);

-- 4. Table mavjudligini tekshirish
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'habits'
ORDER BY ordinal_position;

-- 5. Test ma'lumot qo'shish (ixtiyoriy)
-- INSERT INTO habits (user_id, name, duration, is_good_habit)
-- VALUES ('123456789', 'Test Habit', 30, true);

-- 6. Tekshirish
-- SELECT * FROM habits;

