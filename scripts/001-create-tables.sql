-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  
  -- Category
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  parasha TEXT,
  
  -- Metadata
  author TEXT DEFAULT 'הרב',
  hebrew_date TEXT,
  reading_time INTEGER DEFAULT 5,
  
  -- Publishing status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  
  -- Spiritual sources
  sources JSONB DEFAULT '[]',
  holy_names TEXT[] DEFAULT '{}',
  sefirot TEXT[] DEFAULT '{}',
  
  -- Statistics
  views_count INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(article_id, fingerprint)
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_ratings_article_id ON ratings(article_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_articles_updated_at 
  BEFORE UPDATE ON articles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_views(article_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update article rating
CREATE OR REPLACE FUNCTION update_article_rating()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_article_rating();

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for published content
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read approved comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public can insert ratings" ON ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read ratings" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Admin policies (using service role key)
CREATE POLICY "Service role full access to articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to comments" ON comments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to tags" ON tags
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to newsletter" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');
