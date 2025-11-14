-- Neon Database Setup Script
-- Bu SQL'ni Neon Dashboard → SQL Editor'da ishga tushiring

-- Habits table yaratish
CREATE TABLE IF NOT EXISTS habits (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_good_habit BOOLEAN NOT NULL DEFAULT true,
  duration INTEGER NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  completion_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Index yaratish (performance uchun)
CREATE INDEX IF NOT EXISTS idx_habits_id ON habits(id);
CREATE INDEX IF NOT EXISTS idx_habits_start_date ON habits(start_date);

-- Table mavjudligini tekshirish
SELECT * FROM habits LIMIT 1;







