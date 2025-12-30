# 📋 Changelog

כל השינויים החשובים בפרויקט ימסמכו בקובץ זה.

הפורמט מבוסס על [Keep a Changelog](https://keepachangelog.com/he/1.0.0/),
והפרויקט עוקב אחר [Semantic Versioning](https://semver.org/lang/he/).

## [Unreleased]

### בתכנון
- פונקציית חיפוש מתקדמת עם filters
- PWA support עם offline mode
- התראות בזמן אמת
- נושאי עיצוב נוספים
- אינטגרציה עם לוח עברי
- מערכת הזמנות/תורים
- פורום משתמשים

---

## [2.0.0] - 2025-01-XX

### 🎉 Major Release - Text Reader System

גרסה עיקרית עם מערכת קריאת טקסטים גנרית ושיפורי איכות קוד מקיפים.

### Added ✨

#### מערכת קריאת טקסטים (Text Reader)
- **מערכת גנרית** לקריאת כל סוגי הטקסטים היהודיים
- **תהילים (Tehilim)** - 150 פרקים עם הדגשת שמות קודש
- **תנ"ך (Tanakh)** - 24 ספרים מלאים (תורה, נביאים, כתובים)
- **תלמוד בבלי (Talmud)** - 2,711 דפים עם דף יומי אוטומטי
- **תפילות (Tefilot)** - תפילת שחרית וברכות יומיות
- **קריאה מילה במילה** עם auto-advance מתכוונן (20-150 WPM)
- **מעקב התקדמות** עם Supabase + localStorage backup
- **סטטיסטיקות מפורטות**: אחוז השלמה, מהירות קריאה, זמן לימוד, רצפים
- **התאמה אישית**: גודל פונט, מהירות, מצב כהה/בהיר
- **שמירה אוטומטית** כל 3 שניות
- **הישגים ותגיות** - גיימיפיקציה של הלימוד

#### Testing & Quality Infrastructure
- **Vitest** - framework לבדיקות unit
- **Testing Library** - בדיקות components
- **25 unit tests** עם כיסוי למודולים מרכזיים
- **GitHub Actions CI/CD** - pipeline אוטומטי
  - ESLint checks
  - TypeScript compilation
  - Unit tests
  - Build verification
  - Matrix testing (Node 18.x, 20.x)
- **Pre-commit hooks** עם Husky + lint-staged
  - ESLint אוטומטי על קבצים שהשתנו
  - תיקון אוטומטי של בעיות פורמט
- **ESLint 9** עם flat config
  - 0 errors, 0 warnings
  - Strict TypeScript rules
  - Custom rules למניעת anti-patterns

#### Documentation
- **README מקיף** עם:
  - Badges מקצועיים
  - תיעוד ארכיטקטורה מפורט
  - מדריך התקנה שלב-אחר-שלב
  - Troubleshooting section
  - Deployment guides (Vercel, Docker)
- **CONTRIBUTING.md** - מדריך תרומה מקיף
- **CHANGELOG.md** - מסמך זה
- **קוד מתועד** עם JSDoc comments

#### Developer Experience
- **Type safety** - 100% TypeScript עם strict mode
- **ESLint integration** - בדיקות אוטומטיות
- **Hot reload** - עדכונים מיידיים בפיתוח
- **Error boundaries** - טיפול בשגיאות מתקדם
- **Loading states** - חוויית משתמש משופרת

### Changed 🔄

#### Sefaria Integration
- **Generic API client** במקום clients ספציפיים
- **טיפול משופר בשגיאות** עם retries וtimeouts
- **Caching** - 24 שעות למניעת rate limiting
- **Text cleaning** משופר - הסרת HTML, טעמים, ניקוי יוניקוד

#### Database Schema
- **טבלה חדשה**: `reading_progress` למעקב גנרי
- **Session-based tracking** - עובד ללא התחברות
- **User association** - קישור אוטומטי למשתמשים רשומים
- **RLS policies** משופרות לביצועים

#### Authentication
- **Proxy middleware** (Next.js 16 requirement)
- **Session refresh** אוטומטי
- **Redirect handling** משופר
- **Role-based access** עם admin/editor/user

### Fixed 🐛

- **61 TypeScript errors** - תוקנו כולם
- **59 ESLint warnings** - הופחתו ל-0
- **Type safety** - כל `any` הוחלפו בטיפוסים מתאימים
- **Null checks** - תיקון ל-Next.js 16 async params
- **Console logs** - הוסרו/הוחלפו ב-console.warn
- **Unused variables** - נוקו או קיבלו prefix `_`
- **Empty catch blocks** - נוספו comments
- **Daf Yomi calculator** - תיקון edge cases

### Performance ⚡

- **Server Components** - שימוש מקסימלי ב-RSC
- **Database indexes** - אופטימיזציה לשאילתות נפוצות
- **Image optimization** - Next.js Image component
- **Code splitting** - dynamic imports לקומפוננטות כבדות
- **Caching strategy** - Supabase + localStorage

### Security 🔐

- **RLS policies** מעודכנות ומאובטחות
- **Input validation** - בדיקות בצד client וserver
- **CSRF protection** - Next.js built-in
- **Rate limiting** - מניעת abuse
- **Secure sessions** - httpOnly cookies

---

## [1.5.0] - 2024-12-XX

### Added ✨
- **מערכת תגובות מקוננות** עם עומק אינסופי
- **מודרציה חכמה** - אישור, דחייה, spam filtering
- **מערכת דירוגים** - 1-5 כוכבים עם ממוצע דינמי
- **פרופילי משתמשים** - תמונות פרופיל, about me

### Changed 🔄
- **TipTap editor** משודרג לגרסה 2.1
- **UI components** - מעבר ל-shadcn/ui New York style
- **Dark mode** - שיפורים במעברים

### Fixed 🐛
- תיקון בעיות RTL במספר components
- תיקון loading states במאמרים
- תיקון session timeout issues

---

## [1.0.0] - 2024-11-XX

### 🎉 Initial Release

#### Core Features
- **מערכת CMS מלאה** עם TipTap editor
- **ניהול מאמרים** - טיוטות, פרסום, עריכה
- **קטגוריות ותגיות** - ארגון תוכן
- **תהילים reader** - 150 פרקים
- **אימות משתמשים** - Supabase Auth
- **SEO מתקדם**:
  - JSON-LD schemas
  - Open Graph tags
  - XML Sitemap
  - RSS/JSON feeds
  - robots.txt

#### Design & UX
- **RTL נאטיבי** - עיצוב מלא בעברית
- **פונטים עבריים** - Heebo + Frank Ruhl Libre
- **Responsive** - עובד על כל המכשירים
- **Dark mode** - תמיכה מלאה
- **Accessibility** - WCAG 2.1 AA

#### Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript 5.0
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- shadcn/ui
- Radix UI

---

## סוגי שינויים

- `Added` ✨ - תכונות חדשות
- `Changed` 🔄 - שינויים בפונקציונליות קיימת
- `Deprecated` ⚠️ - תכונות שיוסרו בעתיד
- `Removed` 🗑️ - תכונות שהוסרו
- `Fixed` 🐛 - תיקוני באגים
- `Security` 🔐 - תיקוני אבטחה
- `Performance` ⚡ - שיפורי ביצועים

---

## Versioning

הפרויקט עוקב אחר [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - שינויים לא תואמים לאחור (breaking changes)
- **MINOR** (x.X.0) - תכונות חדשות תואמות לאחור
- **PATCH** (x.x.X) - תיקוני באגים תואמים לאחור

---

## קישורים

- [Unreleased Changes](https://github.com/your-username/tefilot-app/compare/v2.0.0...HEAD)
- [2.0.0](https://github.com/your-username/tefilot-app/releases/tag/v2.0.0)
- [1.5.0](https://github.com/your-username/tefilot-app/releases/tag/v1.5.0)
- [1.0.0](https://github.com/your-username/tefilot-app/releases/tag/v1.0.0)

---

<div align="center">

**מעודכן לאחרונה:** ינואר 2025

[⬆️ חזרה למעלה](#-changelog)

</div>
