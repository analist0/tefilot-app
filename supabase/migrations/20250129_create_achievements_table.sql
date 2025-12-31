-- Create user_achievements table for tracking unlocked achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to unlock achievement
CREATE OR REPLACE FUNCTION unlock_achievement(
  p_user_id UUID,
  p_achievement_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_achievements (user_id, achievement_id)
  VALUES (p_user_id, p_achievement_id)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create view for user statistics summary
CREATE OR REPLACE VIEW user_stats_summary AS
SELECT
  rp.user_id,
  COUNT(DISTINCT CASE WHEN rp.text_type = 'tehilim' AND rp.completed THEN rp.text_id END) AS tehilim_completed,
  COUNT(DISTINCT CASE WHEN rp.text_type = 'talmud' AND rp.completed THEN rp.text_id END) AS talmud_completed,
  COUNT(DISTINCT CASE WHEN rp.text_type = 'tanakh' AND rp.completed THEN rp.text_id END) AS tanakh_completed,
  COUNT(DISTINCT CASE WHEN rp.text_type = 'tefilot' AND rp.completed THEN rp.text_id END) AS tefilot_completed,
  SUM(rp.verses_read) AS total_verses,
  MAX(rp.current_streak_days) AS max_streak,
  SUM(rp.total_time_seconds) / 60 AS total_minutes,
  COUNT(DISTINCT DATE(rp.updated_at)) AS days_active
FROM reading_progress rp
WHERE rp.user_id IS NOT NULL
GROUP BY rp.user_id;

-- Grant access to view
GRANT SELECT ON user_stats_summary TO authenticated;

COMMENT ON TABLE user_achievements IS 'Tracks achievements unlocked by users';
COMMENT ON COLUMN user_achievements.achievement_id IS 'ID matching achievement from achievements library';
COMMENT ON VIEW user_stats_summary IS 'Aggregated statistics for each user';
