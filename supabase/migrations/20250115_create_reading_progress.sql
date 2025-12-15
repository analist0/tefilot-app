-- Create reading_progress table for generic text reading tracking
-- Supports: Tehilim, Tanakh, Talmud, Tefilot, Halacha, Sefarim

CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text_type TEXT NOT NULL CHECK (text_type IN ('tehilim', 'tanakh', 'talmud', 'tefilot', 'halacha', 'sefarim')),
  text_id TEXT NOT NULL, -- e.g., "Genesis.1", "Berakhot.2a", "Psalms.23"
  section INTEGER NOT NULL DEFAULT 1, -- chapter/daf number
  verse INTEGER NOT NULL DEFAULT 1, -- verse/line number
  letter_index INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  reading_speed_wpm INTEGER DEFAULT 0,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  sections_completed INTEGER NOT NULL DEFAULT 0,
  verses_read INTEGER NOT NULL DEFAULT 0,
  current_streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak_days INTEGER NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_sessions INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_reading_progress_session_type ON reading_progress(session_id, text_type);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_type ON reading_progress(user_id, text_type);
CREATE INDEX IF NOT EXISTS idx_reading_progress_text_id ON reading_progress(text_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON reading_progress(last_read_at DESC);

-- Enable Row Level Security
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own progress or session-based progress
CREATE POLICY "Users can view their own reading progress"
  ON reading_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL -- Allow anonymous access for session-based tracking
  );

CREATE POLICY "Users can insert their own reading progress"
  ON reading_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL -- Allow anonymous inserts for session-based tracking
  );

CREATE POLICY "Users can update their own reading progress"
  ON reading_progress
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL -- Allow anonymous updates for session-based tracking
  );

CREATE POLICY "Users can delete their own reading progress"
  ON reading_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reading_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_reading_progress_timestamp
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_progress_timestamp();

-- Add comment to table
COMMENT ON TABLE reading_progress IS 'Generic table for tracking reading progress across all text types (Tehilim, Tanakh, Talmud, Tefilot, Halacha, Sefarim)';
