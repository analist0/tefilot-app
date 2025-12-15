-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
  ('פרשות השבוע', 'parasha', 'פירושים ומאמרים על פרשת השבוע', 'BookOpen', '#D4A84B', 1),
  ('תהילים', 'tehilim', 'פירושי תהילים וסגולות', 'Heart', '#4A90A4', 2),
  ('קבלה', 'kabbalah', 'סודות הקבלה והזוהר', 'Sparkles', '#8B5CF6', 3),
  ('סגולות', 'segulot', 'סגולות לפרנסה, רפואה ועוד', 'Star', '#F59E0B', 4),
  ('כוונות', 'kavanot', 'כוונות לתפילה ולעבודת ה׳', 'Target', '#10B981', 5),
  ('קדושה', 'kedusha', 'מאמרים בענייני קדושה וטהרה', 'Flame', '#EF4444', 6);
