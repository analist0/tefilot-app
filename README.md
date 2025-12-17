# אור הישרה - בלוג רוחני בעברית

פלטפורמת בלוג מלאה בעברית עם מערכת ניהול תוכן, תגובות, דירוגים ומעקב קריאת תהילים.

## 🚀 תכונות

- **ניהול מאמרים מלא** - עורך TipTap עשיר עם תמיכה בטבלאות, תמונות, קוד ועוד
- **מערכת תגובות** - עם מודרציה ותשובות מקוננות
- **דירוגי מאמרים** - מערכת כוכבים 1-5
- **קטגוריות ותגיות** - ארגון תוכן גמיש
- **מעקב תהילים** - מערכת ייחודית למעקב אחר קריאת תהילים
- **SEO מתקדם** - JSON-LD, RSS, Sitemap, Open Graph
- **אימות משתמשים** - עם Supabase Auth
- **מצב כהה/בהיר** - תמיכה מלאה ב-themes
- **RTL נאטיבי** - עיצוב מלא בעברית מימין לשמאל

## 📋 דרישות מקדימות

- Node.js 18+
- npm או pnpm
- חשבון Supabase (חינם)

## ⚙️ התקנה

### 1. שכפול הפרויקט

```bash
git clone <repository-url>
cd blog-for-articles
```

### 2. התקנת תלויות

```bash
# אם אתה על Termux/Android:
npm install --no-bin-links

# אחרת:
npm install
```

### 3. הגדרת משתני סביבה

צור קובץ `.env` בשורש הפרויקט (או העתק מ-`.env.example`):

```bash
cp .env.example .env
```

ערוך את `.env` והוסף את פרטי Supabase שלך:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. הגדרת מסד הנתונים

הרץ את הסקריפטים ב-`scripts/` לפי הסדר בפרוייקט Supabase שלך:

1. `001-create-tables.sql` - יצירת טבלאות
2. `002-seed-categories.sql` - קטגוריות ראשוניות
3. `004-create-tags-table.sql` - טבלת תגיות
4. `004-create-tehilim-cache.sql` - cache לתהילים
5. `006-create-auth-tables.sql` - טבלאות אימות
6. `009-optimize-rls-policies.sql` - מדיניות אבטחה
7. `010-create-admin-user.sql` - משתמש admin (ערוך לפני הרצה!)
8. `011-create-profile-avatars-bucket.sql` - bucket לתמונות פרופיל
9. `015-create-article-images-bucket.sql` - bucket לתמונות מאמרים

### 5. הרצת הפרויקט

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

האתר יהיה זמין ב-`http://localhost:3000`

## 🏗️ מבנה הפרויקט

```
├── app/                    # Next.js App Router
│   ├── admin/             # ממשק ניהול (מוגן)
│   ├── articles/          # דפי מאמרים
│   ├── auth/              # התחברות והרשמה
│   ├── api/               # API routes
│   └── middleware.ts      # ניהול session ואבטחה
├── components/            # קומפוננטות React
│   ├── admin/            # קומפוננטות ניהול
│   ├── articles/         # קומפוננטות מאמרים
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # פונקציות עזר
│   ├── supabase/         # Supabase clients
│   ├── queries.ts        # שאילתות DB
│   └── seo.ts            # פונקציות SEO
├── types/                 # TypeScript types
└── scripts/              # SQL scripts למסד נתונים
```

## 🔐 אבטחה

הפרויקט משתמש בגישה דו-שכבתית:

1. **Middleware** (`middleware.ts`) - בודק אימות (authentication)
2. **Layout Guards** - בודק הרשאות (authorization)

מסלולים מוגנים:
- `/admin/*` - דורש הרשאת admin/editor
- `/profile` - דורש משתמש מחובר
- `/settings` - דורש משתמש מחובר

## 👨‍💻 פיתוח

### הרצת Linter

```bash
npm run lint        # בדיקת שגיאות
npm run lint:fix    # תיקון אוטומטי
```

### בדיקות (Tests)

הפרויקט משתמש ב-Vitest ו-Testing Library:

```bash
npm test                # הרצת בדיקות
npm run test:watch      # מצב watch
npm run test:ui         # ממשק UI לבדיקות
npm run test:coverage   # דוח כיסוי קוד
```

### בדיקת טיפוסים

```bash
npm run type-check  # בדיקת TypeScript
```

### Pre-commit Hooks

הפרויקט משתמש ב-Husky ו-lint-staged:
- בכל commit, ESLint רץ אוטומטית על הקבצים שהשתנו
- הקוד מתוקן אוטומטית לפני ה-commit

### CI/CD

GitHub Actions מריץ אוטומטית:
- ✅ ESLint על כל הקוד
- ✅ TypeScript type checking
- ✅ בדיקות unit tests
- ✅ בנייה (build) של הפרויקט

### קונבנציות קוד

- השתמש ב-TypeScript עבור כל הקבצים
- עקוב אחר ESLint rules
- כתוב בדיקות לפונקציונליות חדשה
- קומפוננטות ב-PascalCase
- פונקציות ב-camelCase
- קבועים ב-UPPER_SNAKE_CASE

### הוספת קומפוננטות UI חדשות

```bash
npx shadcn@latest add <component-name>
```

## 🗄️ Supabase

### טבלאות עיקריות

- `articles` - מאמרים
- `categories` - קטגוריות
- `comments` - תגובות
- `ratings` - דירוגים
- `tags` - תגיות
- `profiles` - פרופילי משתמשים
- `tehilim_progress` - מעקב תהילים

### RLS Policies

כל הטבלאות מוגנות ב-Row Level Security. ראה `scripts/009-optimize-rls-policies.sql`.

## 📝 יצירת מאמר ראשון

1. התחבר לאתר
2. עבור ל-`/admin`
3. לחץ על "מאמרים חדשים"
4. מלא את הפרטים ושמור

## 🌐 Deploy

הפרויקט מוכן ל-deploy ב-Vercel:

1. דחוף את הקוד ל-GitHub
2. חבר ל-Vercel
3. הוסף משתני סביבה ב-Vercel
4. Deploy!

זכור לעדכן את `NEXT_PUBLIC_SITE_URL` ל-URL של הייצור.

## 🐛 בעיות נפוצות

### "next: not found" על Termux
הרץ: `npm install --no-bin-links`

### שגיאות Session
וודא ש-`middleware.ts` קיים ו-`NEXT_PUBLIC_SUPABASE_URL/KEY` מוגדרים.

### TypeScript Errors בבנייה
הפרויקט מוגדר עם `ignoreBuildErrors: true` - זה בכוונה אך מומלץ לתקן.

## 📚 תיעוד נוסף

ראה `CLAUDE.md` למידע טכני מפורט על הארכיטקטורה.

## 🤝 תרומה

1. Fork הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📄 רישיון

הפרויקט הזה הוא קוד פתוח תחת רישיון MIT.

## 💡 תמיכה

לשאלות ותמיכה, פתח issue ב-GitHub.

---

**נבנה עם ❤️ בעברית**
