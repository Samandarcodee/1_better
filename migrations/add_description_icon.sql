-- Add description and icon columns to habits table
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS icon VARCHAR(10) DEFAULT '🎯';

-- Update existing habits with default icon
UPDATE habits
SET icon = '🎯'
WHERE icon IS NULL;

