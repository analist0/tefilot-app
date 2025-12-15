-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage ON tags(usage_count DESC);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Tags are insertable by authenticated users" ON tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Tags are updatable by authenticated users" ON tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Tags are deletable by authenticated users" ON tags FOR DELETE TO authenticated USING (true);
