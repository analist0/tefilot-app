-- Create cached_texts table for 3-layer caching system
CREATE TABLE IF NOT EXISTS cached_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_ref TEXT UNIQUE NOT NULL,
  verses TEXT[] NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_cached_texts_ref ON cached_texts(text_ref);
CREATE INDEX IF NOT EXISTS idx_cached_texts_cached_at ON cached_texts(cached_at);
CREATE INDEX IF NOT EXISTS idx_cached_texts_version ON cached_texts(version);

-- Enable RLS (Row Level Security)
ALTER TABLE cached_texts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cached texts (public data)
CREATE POLICY "Anyone can read cached texts"
  ON cached_texts
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert/update cached texts (for caching)
CREATE POLICY "Anyone can cache texts"
  ON cached_texts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cached texts"
  ON cached_texts
  FOR UPDATE
  TO public
  USING (true);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_cached_texts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.access_count = COALESCE(OLD.access_count, 0) + 1;
  NEW.last_accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cached_texts_timestamp
  BEFORE UPDATE ON cached_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_cached_texts_timestamp();

-- Function to clean old cache entries (older than 30 days)
CREATE OR REPLACE FUNCTION clean_old_text_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cached_texts
  WHERE cached_at < NOW() - INTERVAL '30 days'
  OR version != 'v1';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a comment
COMMENT ON TABLE cached_texts IS 'Caches Hebrew texts from Sefaria API to reduce load and improve performance';
