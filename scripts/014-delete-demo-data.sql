-- מחיקת כל הנתונים הדמו מהמערכת
-- זה ימחק את כל המאמרים, קטגוריות, תגיות וכו'

-- מחיקת רייטינגים
DELETE FROM ratings;

-- מחיקת תגובות
DELETE FROM comments;

-- מחיקת מאמרים
DELETE FROM articles;

-- מחיקת קטגוריות
DELETE FROM categories;

-- מחיקת תגיות
DELETE FROM tags;

-- מחיקת מנויי ניוזלטר (אופציונלי)
-- DELETE FROM newsletter_subscribers;

-- איפוס רצף IDs
ALTER SEQUENCE IF EXISTS articles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS categories_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tags_id_seq RESTART WITH 1;
