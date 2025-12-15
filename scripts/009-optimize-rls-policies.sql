-- תיקון RLS policies לביצועים מיטביים
-- מחליף auth.uid() ב-(select auth.uid()) ו-auth.role() ב-(select auth.role())
-- מאחד policies כפולים

-- ========================================
-- ARTICLES TABLE
-- ========================================

-- מחיקת policies ישנים
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Service role full access to articles" ON public.articles;

-- יצירת policies מתוקנים
CREATE POLICY "Public can read published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Service role full access to articles"
ON public.articles
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- CATEGORIES TABLE
-- ========================================

DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Service role full access to categories" ON public.categories;

CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Service role full access to categories"
ON public.categories
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- COMMENTS TABLE
-- ========================================

DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Service role full access to comments" ON public.comments;

CREATE POLICY "Public can read approved comments"
ON public.comments
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Public can insert comments"
ON public.comments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Service role full access to comments"
ON public.comments
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- TAGS TABLE
-- ========================================

DROP POLICY IF EXISTS "Public can read tags" ON public.tags;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
DROP POLICY IF EXISTS "Tags are insertable by authenticated users" ON public.tags;
DROP POLICY IF EXISTS "Tags are updatable by authenticated users" ON public.tags;
DROP POLICY IF EXISTS "Tags are deletable by authenticated users" ON public.tags;
DROP POLICY IF EXISTS "Service role full access to tags" ON public.tags;

-- אחוד policies של SELECT
CREATE POLICY "Everyone can read tags"
ON public.tags
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can modify tags"
ON public.tags
FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Service role full access to tags"
ON public.tags
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- ========================================

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role full access to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Service role full access to newsletter"
ON public.newsletter_subscribers
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- PROFILES TABLE
-- ========================================

DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;

CREATE POLICY "profiles_select_all"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_admin_update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  )
);

-- ========================================
-- SETTINGS TABLE
-- ========================================

DROP POLICY IF EXISTS "Public can read public settings" ON public.settings;
DROP POLICY IF EXISTS "Service role full access to settings" ON public.settings;

CREATE POLICY "Public can read public settings"
ON public.settings
FOR SELECT
TO anon, authenticated
USING (is_public = true);

CREATE POLICY "Service role full access to settings"
ON public.settings
FOR ALL
TO service_role
USING ((select auth.role()) = 'service_role');

-- ========================================
-- TEHILIM_PROGRESS TABLE
-- ========================================

DROP POLICY IF EXISTS "tehilim_progress_select" ON public.tehilim_progress;
DROP POLICY IF EXISTS "tehilim_progress_insert" ON public.tehilim_progress;
DROP POLICY IF EXISTS "tehilim_progress_update" ON public.tehilim_progress;
DROP POLICY IF EXISTS "tehilim_progress_delete" ON public.tehilim_progress;

CREATE POLICY "tehilim_progress_select"
ON public.tehilim_progress
FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id OR session_id IS NOT NULL);

CREATE POLICY "tehilim_progress_insert"
ON public.tehilim_progress
FOR INSERT
TO authenticated, anon
WITH CHECK ((select auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "tehilim_progress_update"
ON public.tehilim_progress
FOR UPDATE
TO authenticated, anon
USING ((select auth.uid()) = user_id OR session_id IS NOT NULL);

CREATE POLICY "tehilim_progress_delete"
ON public.tehilim_progress
FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);
