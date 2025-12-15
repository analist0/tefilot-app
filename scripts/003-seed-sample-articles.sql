-- ==========================================
-- Seed Sample Articles (Production Ready Content)
-- UPSERT - Safe to run multiple times
-- ==========================================

-- Get category IDs
DO $$
DECLARE
  kedusha_id UUID;
  parasha_id UUID;
  tehilim_id UUID;
  segulot_id UUID;
  kavanot_id UUID;
  kabbalah_id UUID;
BEGIN
  SELECT id INTO kedusha_id FROM categories WHERE slug = 'kedusha';
  SELECT id INTO parasha_id FROM categories WHERE slug = 'parasha';
  SELECT id INTO tehilim_id FROM categories WHERE slug = 'tehilim';
  SELECT id INTO segulot_id FROM categories WHERE slug = 'segulot';
  SELECT id INTO kavanot_id FROM categories WHERE slug = 'kavanot';
  SELECT id INTO kabbalah_id FROM categories WHERE slug = 'kabbalah';

  -- Using INSERT ... ON CONFLICT DO UPDATE for all articles to allow re-running

  -- Article 1: Kedusha
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'shmiras-einayim',
    'שמירת העיניים - שער הקדושה',
    'כיצד לשמור על קדושת המחשבה בעידן הדיגיטלי',
    E'# שמירת העיניים - שער הקדושה\n\nאמרו חז"ל: "העין רואה והלב חומד" (במדבר רבה י, ב). בדורנו, יותר מאי פעם, נדרשת מאיתנו שמירה מיוחדת על קדושת העיניים.\n\n## חשיבות השמירה\n\nהזוהר הקדוש מלמד שהעיניים הן "שערי הנשמה". כל מה שאדם רואה נחקק בנפשו ומשפיע על מידותיו ועבודת ה'' שלו.\n\n> "עיניך לנוכח יביטו ועפעפיך יישירו נגדך" (משלי ד, כה)\n\n## עצות מעשיות\n\n### 1. קביעת גדרים\nיש להציב גדרים ברורים - אילו מקומות להימנע מהם, אילו תכנים לא לצפות בהם.\n\n### 2. תפילה יומית\nלהוסיף בתפילה: "ואל תביאנו לידי ניסיון" - בכוונה מיוחדת על שמירת העיניים.\n\n### 3. לימוד מוסר\nלימוד קבוע בספרי מוסר מחזק את הנפש ונותן כוחות להתמודד.',
    'מאמר מעמיק על חשיבות שמירת העיניים בעידן המודרני, עם עצות מעשיות מתורת החסידות והקבלה.',
    kedusha_id,
    ARRAY['קדושה', 'שמירת העיניים', 'מוסר', 'זוהר'],
    'יוסף',
    'כ"ה כסלו תשפ"ה',
    8,
    'published',
    true,
    'שמירת העיניים - מאמר מעמיק על קדושת המחשבה עם עצות מעשיות',
    NOW()
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

  -- Article 2: Parasha
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'parshat-vayeshev-yosef',
    'פרשת וישב - יוסף הצדיק',
    'לקחים מחייו של יוסף הצדיק לדורנו',
    E'# פרשת וישב - יוסף הצדיק\n\nפרשת וישב פותחת בסיפורו המופלא של יוסף הצדיק, "צדיק יסוד עולם".\n\n## החלומות\n\nהחלומות של יוסף לא היו חלומות סתם - הם היו נבואה. הזוהר הקדוש מלמד שיוסף היה הראשון שהשתמש בכוח החלום כדי להשפיע על המציאות.\n\n## הבור והבאר\n\n> "והבור ריק אין בו מים" (בראשית לז, כד)\n\nדרשו חז"ל: "מים אין בו, אבל נחשים ועקרבים יש בו". זהו סוד עמוק - כאשר אין תורה (מים), הריקנות מתמלאת בדברים מזיקים.\n\n## יוסף בבית פוטיפר\n\nניסיון אשת פוטיפר הוא אחד הניסיונות הגדולים בתורה. חז"ל מספרים שבאותו רגע ראה יוסף דמות דיוקנו של אביו, וזה נתן לו כוח לעמוד בניסיון.\n\n### לקח לדורנו\n- לזכור תמיד את מורשת האבות\n- לדעת שכל ניסיון הוא הזדמנות לעליה רוחנית\n- להאמין שגם מתוך החושך יצא אור',
    'ביאור עמוק על פרשת וישב וחייו של יוסף הצדיק, עם לקחים מעשיים לעבודת ה''.',
    parasha_id,
    ARRAY['פרשת השבוע', 'וישב', 'יוסף הצדיק', 'חלומות'],
    'יוסף',
    'כ"ד כסלו תשפ"ה',
    10,
    'published',
    true,
    'פרשת וישב - ביאור על יוסף הצדיק עם לקחים לדורנו',
    NOW() - INTERVAL '1 day'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

  -- Article 3: Tehilim
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'tehilim-perek-kuf-yud-tet',
    'תהילים קי"ט - הפרק הארוך בתנ"ך',
    'סודות וכוונות באמירת תהילים קי"ט',
    E'# תהילים קי"ט - סודות הפרק הארוך בתנ"ך\n\nפרק קי"ט הוא הפרק הארוך ביותר בספר תהילים ובכל התנ"ך - 176 פסוקים המסודרים לפי א"ב.\n\n## מבנה הפרק\n\nהפרק מחולק ל-22 קטעים, כמניין אותיות הא"ב. כל קטע מכיל 8 פסוקים המתחילים באותה אות.\n\n> "אשרי תמימי דרך ההולכים בתורת ה''" (תהילים קיט, א)\n\n## סגולות הפרק\n\n### לפרנסה\nאמירת "פתח" (פסוקים קכט-קלו) מסוגלת לפרנסה.\n\n### לזיכרון\nאמירת הפרק כולו מסייעת לחיזוק הזיכרון.\n\n### להצלחה בלימודים\nנהגו לומר את הקטע של האות הראשונה של השם לפני לימוד.\n\n## כוונות באמירה\n\nבעת אמירת הפרק, יש לכוון שכל אות מכ"ב האותיות היא שער להשפעה עליונה. כשאומרים את הפסוקים של אות מסוימת, פותחים את השער הרוחני של אותה אות.',
    'סודות וסגולות בפרק קי"ט בתהילים - הפרק הארוך ביותר בתנ"ך.',
    tehilim_id,
    ARRAY['תהילים', 'סגולות', 'תפילה', 'א-ב'],
    'יוסף',
    'כ"ג כסלו תשפ"ה',
    7,
    'published',
    false,
    'תהילים קי"ט - סודות וסגולות הפרק הארוך בתנ"ך',
    NOW() - INTERVAL '2 days'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

  -- Article 4: Segulot
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'segulot-parnasa',
    'סגולות לפרנסה בהרחבה',
    'אוסף סגולות מקובלות לשפע וברכה בפרנסה',
    E'# סגולות לפרנסה בהרחבה\n\nהפרנסה היא אחד הנושאים שמעסיקים כל יהודי. להלן אוסף סגולות מקובלות מגדולי ישראל.\n\n## סגולת פרשת המן\n\n> "אמר ר'' יהושע בן לוי: כל האומר פרשת המן בכל יום, מובטח לו שלא יתמעטו מזונותיו" (ירושלמי ברכות)\n\n### כיצד לומר:\n1. לומר ביום שלישי - יום שנאמר בו "כי טוב" פעמיים\n2. לומר בכוונה, לא בחיפזון\n3. להוסיף תפילה אישית בסוף\n\n## סגולת פסוקי הפרנסה\n\n"פותח את ידך ומשביע לכל חי רצון"\n\nיש לומר פסוק זה 7 פעמים אחרי תפילת שחרית.\n\n## סגולת הצדקה\n\nמעשר כספים הוא הסגולה הגדולה ביותר לפרנסה:\n\n> "עשר בשביל שתתעשר" (שבת קיט)\n\n## סגולת ההודאה\n\nלהודות לה'' על כל דבר - גם על הקשיים. ההודאה פותחת צינורות שפע.',
    'אוסף סגולות מקובלות לפרנסה טובה וברכה בעסקים, מגדולי ישראל לדורותיהם.',
    segulot_id,
    ARRAY['סגולות', 'פרנסה', 'צדקה', 'פרשת המן'],
    'יוסף',
    'כ"ב כסלו תשפ"ה',
    9,
    'published',
    true,
    'סגולות לפרנסה - אוסף סגולות מקובלות לשפע וברכה',
    NOW() - INTERVAL '3 days'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

  -- Article 5: Kavanot
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'kavanot-shema',
    'כוונות קריאת שמע',
    'כיצד לכוון בקריאת שמע לפי הקבלה',
    E'# כוונות קריאת שמע\n\nקריאת שמע היא יסוד האמונה ועמוד התפילה. להלן כוונות עיקריות מתורת הקבלה.\n\n## "שמע ישראל"\n\n### כוונת המילה "שמע"\nש - שמירה\nמ - מסירות\nע - עדות\n\n### כוונת "ה'' אלהינו"\nשם הוי"ה (יהוה) - מידת הרחמים\nשם אלהים - מידת הדין\n\n## "ואהבת את ה'' אלהיך"\n\n> "בכל לבבך" - בשני יצריך, ביצר הטוב וביצר הרע\n\n### כוונות מעשיות:\n1. **בכל לבבך** - למסור את כל הרגשות לה''\n2. **בכל נפשך** - אפילו הוא נוטל את נפשך\n3. **בכל מאדך** - בכל ממונך\n\n## סגולת קריאת שמע\n\n- בכוונה - מתקנת פגמי הברית\n- בדבקות - ממשיכה קדושה עליונה\n- באהבה - מקרבת את הגאולה',
    'מדריך מפורט לכוונות קריאת שמע לפי תורת הקבלה והחסידות.',
    kavanot_id,
    ARRAY['כוונות', 'קריאת שמע', 'תפילה', 'קבלה'],
    'יוסף',
    'כ"א כסלו תשפ"ה',
    6,
    'published',
    false,
    'כוונות קריאת שמע - מדריך מפורט לפי הקבלה',
    NOW() - INTERVAL '4 days'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

  -- Article 6: Kabbalah
  INSERT INTO articles (
    slug, title, subtitle, content, excerpt, category_id, tags, author,
    hebrew_date, reading_time, status, is_featured, meta_description, published_at
  ) VALUES (
    'eser-sefirot-hakedoshot',
    'עשר ספירות הקודש',
    'מבוא ליסודות הקבלה - הבנת עשר הספירות',
    E'# עשר ספירות הקודש\n\nעשר הספירות הן היסוד של תורת הקבלה. הן מתארות את האופן בו האור האלוקי משתלשל ומתגלה בעולמות.\n\n## סדר הספירות\n\n### שלוש ראשונות (מוחין)\n1. **כתר** - הרצון העליון\n2. **חכמה** - ההברקה הראשונית\n3. **בינה** - ההבנה וההרחבה\n\n### שבע תחתונות (מידות)\n4. **חסד** - הנתינה והאהבה\n5. **גבורה** - הדין והצמצום\n6. **תפארת** - האיזון והרחמים\n7. **נצח** - הניצחון וההתמדה\n8. **הוד** - ההודאה והתפילה\n9. **יסוד** - החיבור וההשפעה\n10. **מלכות** - הקבלה וההתגלות\n\n## יישום בחיים\n\nכל ספירה מקבילה למידה נפשית שעלינו לתקן:\n\n| ספירה | מידה | תיקון |\n|--------|------|--------|\n| חסד | אהבה | לתת ללא גבול |\n| גבורה | יראה | לשים גבולות |\n| תפארת | רחמים | לאזן בין חסד לדין |',
    'מבוא מקיף ליסודות הקבלה והבנת עשר הספירות הקדושות.',
    kabbalah_id,
    ARRAY['קבלה', 'ספירות', 'זוהר', 'מיסטיקה'],
    'יוסף',
    'כ'' כסלו תשפ"ה',
    12,
    'published',
    true,
    'עשר ספירות הקודש - מבוא ליסודות הקבלה',
    NOW() - INTERVAL '5 days'
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    category_id = EXCLUDED.category_id,
    tags = EXCLUDED.tags,
    updated_at = NOW();

END $$;
