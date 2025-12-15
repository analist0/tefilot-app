-- יצירת bucket לתמונות מאמרים
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies לבucket של תמונות מאמרים
CREATE POLICY "article_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

CREATE POLICY "article_images_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "article_images_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "article_images_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
