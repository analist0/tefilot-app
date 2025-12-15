-- Tehilim Cache Table
-- Stores cached chapters from Sefaria API to reduce external API calls

CREATE TABLE IF NOT EXISTS tehilim_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter INTEGER UNIQUE NOT NULL CHECK (chapter >= 1 AND chapter <= 150),
  verses TEXT[] NOT NULL,
  hebrew_text TEXT NOT NULL,
  verse_count INTEGER NOT NULL,
  source TEXT DEFAULT 'sefaria',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading Progress Table
-- Stores user reading progress (works with localStorage sync)
CREATE TABLE IF NOT EXISTS tehilim_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL DEFAULT 1,
  letter_index INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, chapter)
);

-- Hebrew Dates Cache (from Hebcal)
CREATE TABLE IF NOT EXISTS hebrew_dates_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gregorian_date DATE UNIQUE NOT NULL,
  hebrew_date TEXT NOT NULL,
  hebrew_day INTEGER NOT NULL,
  hebrew_month TEXT NOT NULL,
  hebrew_year INTEGER NOT NULL,
  parasha TEXT,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tehilim_cache_chapter ON tehilim_cache(chapter);
CREATE INDEX IF NOT EXISTS idx_tehilim_progress_session ON tehilim_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_hebrew_dates_gregorian ON hebrew_dates_cache(gregorian_date);

-- RLS Policies
ALTER TABLE tehilim_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE tehilim_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hebrew_dates_cache ENABLE ROW LEVEL SECURITY;

-- Public read access for cache tables
CREATE POLICY "tehilim_cache_public_read" ON tehilim_cache FOR SELECT USING (true);
CREATE POLICY "tehilim_cache_public_insert" ON tehilim_cache FOR INSERT WITH CHECK (true);

CREATE POLICY "hebrew_dates_public_read" ON hebrew_dates_cache FOR SELECT USING (true);
CREATE POLICY "hebrew_dates_public_insert" ON hebrew_dates_cache FOR INSERT WITH CHECK (true);

-- Progress accessible by session
CREATE POLICY "tehilim_progress_public_all" ON tehilim_progress FOR ALL USING (true);
