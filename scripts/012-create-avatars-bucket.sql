-- יצירת bucket לתמונות פרופיל
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies לתמונות פרופיל
CREATE POLICY "כל אחד יכול לראות תמונות פרופיל"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "משתמשים יכולים להעלות תמונה משלהם"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "משתמשים יכולים לעדכן תמונה משלהם"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "משתמשים יכולים למחוק תמונה משלהם"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND (select auth.uid())::text = (storage.foldername(name))[1]
  );
