-- Bible Reading Tracker - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Table for user reading progress
CREATE TABLE IF NOT EXISTS bible_reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  scripture_reference TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Table for push notification tokens
CREATE TABLE IF NOT EXISTS bible_push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  platform TEXT DEFAULT 'unknown',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for user reminder preferences
CREATE TABLE IF NOT EXISTS bible_reminder_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '08:00:00',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for daily scripture cache (optional - for offline sync)
CREATE TABLE IF NOT EXISTS daily_scriptures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  scripture_references TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_date ON bible_reading_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON bible_push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON bible_push_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_scriptures_date ON daily_scriptures(date);

-- Enable Row Level Security (RLS)
ALTER TABLE bible_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scriptures ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for now - adjust based on your auth)
CREATE POLICY "Allow all operations on reading progress" ON bible_reading_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on push tokens" ON bible_push_tokens FOR ALL USING (true);
CREATE POLICY "Allow all operations on reminder settings" ON bible_reminder_settings FOR ALL USING (true);
CREATE POLICY "Allow read on daily scriptures" ON daily_scriptures FOR SELECT USING (true);

-- Function to get today's reading status
CREATE OR REPLACE FUNCTION check_today_reading(p_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bible_reading_progress
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user reading streak
CREATE OR REPLACE FUNCTION get_reading_streak(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  LOOP
    IF EXISTS (
      SELECT 1 FROM bible_reading_progress
      WHERE user_id = p_user_id AND date = check_date
    ) THEN
      streak := streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN streak;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE bible_reading_progress IS 'Tracks daily Bible reading completion';
COMMENT ON TABLE bible_push_tokens IS 'Stores push notification tokens for reminders';
COMMENT ON TABLE bible_reminder_settings IS 'User preferences for daily reading reminders';
COMMENT ON TABLE daily_scriptures IS 'Cache of daily scripture references';
