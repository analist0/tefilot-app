-- מעדכן את טבלת tehilim_progress להוסיף סטטיסטיקות מתקדמות
ALTER TABLE tehilim_progress
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS verses_read INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS chapters_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_time_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_speed_wpm NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 1;

-- אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_tehilim_progress_user_id ON tehilim_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_tehilim_progress_session_id ON tehilim_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_tehilim_progress_last_read ON tehilim_progress(last_read_at);

-- עדכון RLS policies
DROP POLICY IF EXISTS tehilim_progress_public_all ON tehilim_progress;

-- Policy לקריאה - כולם יכולים לקרוא את שלהם
CREATE POLICY tehilim_progress_select ON tehilim_progress
FOR SELECT USING (
  user_id IS NULL OR 
  user_id = auth.uid() OR 
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Policy לעדכון - כולם יכולים לעדכן את שלהם
CREATE POLICY tehilim_progress_insert ON tehilim_progress
FOR INSERT WITH CHECK (
  user_id IS NULL OR 
  user_id = auth.uid() OR 
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

CREATE POLICY tehilim_progress_update ON tehilim_progress
FOR UPDATE USING (
  user_id IS NULL OR 
  user_id = auth.uid() OR 
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

CREATE POLICY tehilim_progress_delete ON tehilim_progress
FOR DELETE USING (
  user_id IS NULL OR 
  user_id = auth.uid() OR 
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- פונקציה לחישוב streak
CREATE OR REPLACE FUNCTION calculate_tehilim_streak(p_user_id UUID, p_session_id TEXT)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) AS $$
DECLARE
  v_dates DATE[];
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_prev_date DATE := NULL;
  v_date DATE;
BEGIN
  -- קבלת תאריכים ייחודיים של קריאה
  SELECT ARRAY_AGG(DISTINCT DATE(last_read_at) ORDER BY DATE(last_read_at) DESC)
  INTO v_dates
  FROM tehilim_progress
  WHERE (user_id = p_user_id OR (user_id IS NULL AND session_id = p_session_id))
    AND last_read_at IS NOT NULL;

  IF v_dates IS NULL OR array_length(v_dates, 1) = 0 THEN
    RETURN QUERY SELECT 0, 0;
    RETURN;
  END IF;

  -- חישוב streaks
  FOREACH v_date IN ARRAY v_dates LOOP
    IF v_prev_date IS NULL THEN
      v_temp_streak := 1;
    ELSIF v_prev_date - v_date = 1 THEN
      v_temp_streak := v_temp_streak + 1;
    ELSE
      IF v_temp_streak > v_longest_streak THEN
        v_longest_streak := v_temp_streak;
      END IF;
      v_temp_streak := 1;
    END IF;
    
    v_prev_date := v_date;
  END LOOP;

  -- בדיקת streak נוכחי
  IF v_dates[1] = CURRENT_DATE OR v_dates[1] = CURRENT_DATE - 1 THEN
    v_current_streak := v_temp_streak;
  END IF;

  IF v_temp_streak > v_longest_streak THEN
    v_longest_streak := v_temp_streak;
  END IF;

  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql;
