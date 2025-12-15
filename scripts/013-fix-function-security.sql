-- תיקון אזהרות אבטחה - הוספת search_path לכל הפונקציות

-- תיקון update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- תיקון increment_views
CREATE OR REPLACE FUNCTION increment_views(article_uuid UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE id = article_uuid;
END;
$$;

-- תיקון update_article_rating
CREATE OR REPLACE FUNCTION update_article_rating()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  total_ratings INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*) INTO avg_rating, total_ratings
  FROM ratings
  WHERE article_id = COALESCE(NEW.article_id, OLD.article_id);
  
  UPDATE articles
  SET average_rating = COALESCE(avg_rating, 0),
      ratings_count = total_ratings
  WHERE id = COALESCE(NEW.article_id, OLD.article_id);
  
  RETURN NEW;
END;
$$;

-- תיקון calculate_tehilim_streak
CREATE OR REPLACE FUNCTION calculate_tehilim_streak(p_user_id UUID, p_session_id TEXT)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
