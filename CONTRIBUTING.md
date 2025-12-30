# 🤝 מדריך תרומה לפרויקט

תודה על העניין שלך לתרום לפרויקט **אור הישרה**! 🙏

מסמך זה מכיל הנחיות לתרומה לפרויקט. אנא קרא אותו בעיון לפני שאתה מתחיל.

---

## 📋 תוכן עניינים

- [קוד התנהגות](#-קוד-התנהגות)
- [איך אני יכול לתרום?](#-איך-אני-יכול-לתרום)
- [הגדרת סביבת הפיתוח](#️-הגדרת-סביבת-הפיתוח)
- [תהליך הפיתוח](#-תהליך-הפיתוח)
- [סטנדרטים של קוד](#-סטנדרטים-של-קוד)
- [הנחיות Commit](#-הנחיות-commit)
- [תהליך Pull Request](#-תהליך-pull-request)
- [הנחיות בדיקות](#-הנחיות-בדיקות)
- [דיווח באגים](#-דיווח-באגים)
- [הצעת תכונות חדשות](#-הצעת-תכונות-חדשות)

---

## 📜 קוד התנהגות

### ההתחייבויות שלנו

אנחנו מחויבים ליצור סביבה פתוחה ומזמינה לכולם, ללא קשר ל:
- גיל, מגדר, זהות מגדרית
- רמת ניסיון, השכלה
- לאומיות, גזע, דת
- נטייה מינית
- מוגבלות או מראה חיצוני

### התנהגות מקובלת ✅

- **כבוד הדדי** - התייחס לכולם בכבוד
- **שפה הולמת** - השתמש בשפה מקצועית ומכבדת
- **קבלת ביקורת** - קבל משוב בחן
- **התמקדות בטוב הקהילה** - חשוב על האינטרס הכללי
- **הצגת אמפתיה** - הבן את נקודות המבט של אחרים

### התנהגות בלתי מקובלת ❌

- שפה פוגענית, מינית או מפלה
- טרולינג, תקיפות אישיות או פוליטיות
- הטרדה פומבית או פרטית
- פרסום מידע פרטי של אחרים ללא רשות
- התנהגות לא מקצועית אחרת

### אכיפה

מקרים של התנהגות בלתי מקובלת ניתן לדווח ב-[your-email@example.com]. כל התלונות ייבחנו ויטופלו במהירות ובהגינות.

---

## 💡 איך אני יכול לתרום?

ישנן דרכים רבות לתרום לפרויקט:

### 1. 🐛 דיווח על באגים

מצאת באג? עזור לנו לתקן אותו!
- חפש ב-[Issues](../../issues) אם הבאג כבר דווח
- אם לא, פתח Issue חדש עם תבנית "Bug Report"
- כלול מידע מפורט: צעדים לשחזור, תוצאה צפויה מול ממשית, screenshots

### 2. 💡 הצעת תכונות

יש לך רעיון מעולה?
- חפש ב-[Discussions](../../discussions) אם הרעיון כבר הוצע
- פתח Discussion חדש בקטגוריית "Ideas"
- תאר את התכונה, הבעיה שהיא פותרת, ודוגמאות שימוש

### 3. 📝 שיפור תיעוד

התיעוד יכול תמיד להשתפר!
- תיקון שגיאות כתיב או דקדוק
- הוספת דוגמאות
- הבהרת הסברים
- תרגום לשפות נוספות

### 4. 🔧 תיקון באגים

מצאת באג ויודע איך לתקן?
- בחר Issue עם התווית `good first issue` או `bug`
- פתח Pull Request עם התיקון
- עקוב אחר הנחיות הקוד והבדיקות

### 5. ✨ פיתוח תכונות

רוצה לפתח תכונה חדשה?
- **חשוב:** דבר איתנו קודם! פתח Discussion או Issue
- קבל אישור מ-maintainer לפני שאתה מתחיל
- עקוב אחר הנחיות הפיתוח

### 6. 🧪 כתיבת בדיקות

עזור לשמור על איכות הקוד!
- הוסף unit tests לקוד קיים
- שפר כיסוי הבדיקות
- תקן בדיקות שנכשלות

### 7. 🎨 עיצוב UI/UX

מעצב? נשמח לקבל עזרה!
- שיפורי נגישות
- רספונסיביות
- אנימציות וחוויית משתמש
- עיצובים לתכונות חדשות

---

## ⚙️ הגדרת סביבת הפיתוח

### דרישות מקדימות

וודא שיש לך:
- **Node.js 18+** (מומלץ 20 LTS)
- **npm 9+** או **pnpm** (מומלץ)
- **Git**
- **חשבון GitHub**
- **חשבון Supabase** (חינם)

### שלבי ההתקנה

1. **Fork את הפרויקט**
   ```bash
   # לחץ "Fork" ב-GitHub
   ```

2. **Clone ה-fork שלך**
   ```bash
   git clone https://github.com/YOUR-USERNAME/tefilot-app.git
   cd tefilot-app
   ```

3. **הוסף remote למקור**
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/tefilot-app.git
   ```

4. **התקן תלויות**
   ```bash
   npm install
   # או:
   pnpm install
   ```

5. **העתק `.env.example` ל-`.env.local`**
   ```bash
   cp .env.example .env.local
   ```

6. **הגדר משתני סביבה**

   ערוך `.env.local` והוסף:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

7. **הרץ migrations בSupabase**

   ראה [README.md](README.md#שלב-4-הגדרת-מסד-הנתונים) להנחיות מפורטות.

8. **הפעל dev server**
   ```bash
   npm run dev
   ```

9. **וודא שהכל עובד**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

---

## 🔄 תהליך הפיתוח

### 1. סנכרן עם Upstream

לפני שמתחילים לעבוד:

```bash
# וודא שאתה על main
git checkout main

# שלוף שינויים מהמקור
git fetch upstream

# מזג את השינויים
git merge upstream/main

# דחף ל-fork שלך
git push origin main
```

### 2. צור Branch חדש

```bash
# שם תיאורי של הבranch
git checkout -b feature/user-authentication
git checkout -b fix/article-loading-bug
git checkout -b docs/api-documentation
git checkout -b refactor/supabase-client
```

**מוסכמות שמות Branch:**
- `feature/` - תכונות חדשות
- `fix/` - תיקוני באגים
- `docs/` - תיעוד
- `refactor/` - שינויי קוד ללא שינוי פונקציונליות
- `test/` - בדיקות
- `chore/` - משימות תחזוקה

### 3. עבוד על השינויים

```bash
# ערוך קבצים...

# בדוק שינויים
git status
git diff

# הרץ בדיקות מקומיות
npm run lint
npm test
```

### 4. Commit השינויים

```bash
git add .
git commit -m "feat: add user authentication with Supabase"
```

ראה [הנחיות Commit](#-הנחיות-commit) למידע נוסף.

### 5. Push ל-Fork

```bash
git push origin feature/user-authentication
```

### 6. פתח Pull Request

- לך ל-GitHub repository שלך
- לחץ "Compare & pull request"
- מלא את התבנית
- המתן ל-review

---

## 📏 סטנדרטים של קוד

### TypeScript

✅ **עשה:**
```typescript
// טיפוסים מפורשים
interface User {
  id: string
  name: string
  email: string
}

// JSDoc לפונקציות ציבוריות
/**
 * Fetches user by ID
 * @param userId - The user ID
 * @returns User object or null
 */
async function getUserById(userId: string): Promise<User | null> {
  // ...
}

// Early returns
if (!user) {
  return null
}
// המשך...
```

❌ **אל תעשה:**
```typescript
// any types
function fetchData(): any { }

// קוד מת
if (false) {
  // ...
}

// nested ternaries
const x = a ? b : c ? d : e
```

### React Components

✅ **עשה:**
```typescript
// Server Component (ברירת מחדל)
async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug)
  return <ArticleView article={article} />
}

// Client Component (כשצריך)
"use client"

function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

❌ **אל תעשה:**
```typescript
// "use client" ללא צורך
"use client"

function StaticContent() {
  return <div>Static content</div>
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ArticleCard` |
| Functions/Variables | camelCase | `getUserName` |
| Constants | UPPER_SNAKE_CASE | `MAX_ARTICLES` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Files | kebab-case | `article-card.tsx` |
| Private | `_prefix` | `_internalHelper` |

### File Structure

```typescript
// 1. Imports - מסודרים לפי סוגים
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

import type { User } from "@/types"

// 2. Types/Interfaces
interface Props {
  userId: string
}

// 3. Component
export function UserProfile({ userId }: Props) {
  // ...
}
```

### CSS/Tailwind

✅ **עשה:**
```tsx
// קבוצות לוגיות של classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>

// RTL-aware spacing
<div className="mr-4"> {/* margin-right בRTL, margin-left בLTR */}
```

---

## 📝 הנחיות Commit

אנחנו משתמשים ב-[Conventional Commits](https://www.conventionalcommits.org/).

### פורמט

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | תיאור | דוגמה |
|------|-------|-------|
| `feat` | תכונה חדשה | `feat: add user authentication` |
| `fix` | תיקון באג | `fix: resolve article loading issue` |
| `docs` | שינויי תיעוד | `docs: update API documentation` |
| `style` | פורמט, נקודה-פסיק | `style: format with prettier` |
| `refactor` | שינוי קוד ללא שינוי פונקציונליות | `refactor: simplify user service` |
| `test` | הוספת/תיקון בדיקות | `test: add unit tests for auth` |
| `chore` | תחזוקה | `chore: update dependencies` |
| `perf` | שיפור ביצועים | `perf: optimize image loading` |
| `ci` | שינויי CI/CD | `ci: add test coverage reporting` |
| `build` | שינויי build | `build: update webpack config` |

### Scope (אופציונלי)

תחום השינוי: `auth`, `articles`, `reader`, `api`, `ui`, `db`

### Subject

- **אל תעבור 50 תווים**
- התחל באות קטנה
- אל תשים נקודה בסוף
- השתמש בציווי (imperative): "add" לא "added" או "adds"

### Body (אופציונלי)

- הסבר **מה** ו**למה**, לא **איך**
- עטוף ב-72 תווים
- השתמש בציווי

### Footer (אופציונלי)

- Breaking changes: `BREAKING CHANGE: description`
- קישור ל-Issues: `Fixes #123`, `Closes #456`

### דוגמאות

**פשוט:**
```bash
git commit -m "feat: add dark mode toggle"
```

**עם scope:**
```bash
git commit -m "fix(reader): resolve word highlighting issue"
```

**עם body:**
```bash
git commit -m "feat(auth): implement OAuth login

Add Google and GitHub OAuth providers using Supabase Auth.
Users can now sign in with their existing accounts.

Closes #42"
```

**Breaking change:**
```bash
git commit -m "refactor(api)!: change article API response format

BREAKING CHANGE: Article API now returns `publishedAt` instead of `created_at`.
Update all consumers to use the new field name."
```

---

## 🔍 תהליך Pull Request

### לפני שאתה פותח PR

- ✅ הרץ `npm run lint` - 0 errors, 0 warnings
- ✅ הרץ `npm test` - כל הבדיקות עוברות
- ✅ הרץ `npm run build` - build מצליח
- ✅ בדוק ידנית שהתכונה עובדת
- ✅ עדכן תיעוד אם צריך
- ✅ הוסף בדיקות לקוד חדש

### תבנית PR

כשפותחים PR, מלאו את התבנית:

```markdown
## 📝 תיאור

תאר את השינויים שעשית ולמה.

## 🔗 Issue קשור

Fixes #123
Related to #456

## 🧪 איך בדקת?

- [ ] Tested manually
- [ ] Added unit tests
- [ ] Tested on mobile
- [ ] Tested with screen reader

## 📸 Screenshots

אם רלוונטי, הוסף screenshots או GIFs.

## ✅ Checklist

- [ ] הקוד עובר ESLint ללא אזהרות
- [ ] כל הבדיקות עוברות
- [ ] הוספתי בדיקות לקוד חדש
- [ ] עדכנתי תיעוד
- [ ] הcommit messages עוקבים אחר הconvention
- [ ] הבדקתי RTL (אם רלוונטי)
```

### תהליך Review

1. **אוטומטי - CI Pipeline**
   - ESLint checks
   - TypeScript compilation
   - Unit tests
   - Build test

2. **ידני - Code Review**
   - Maintainer סוקר את הקוד
   - בודק איכות, קריאות, ביצועים
   - מוודא עמידה בסטנדרטים

3. **שיחה**
   - Reviewer עשוי לבקש שינויים
   - תקן את ההערות
   - Push לאותו branch

4. **Approval**
   - לאחר אישור מ-maintainer
   - PR ימוזג ל-main

5. **Merge**
   - Squash and merge (ברירת מחדל)
   - Commit message יעודכן אם צריך

---

## 🧪 הנחיות בדיקות

### כתיבת Unit Tests

אנחנו משתמשים ב-**Vitest** ו-**Testing Library**.

**מבנה בדיקה:**
```typescript
import { describe, it, expect } from 'vitest'

describe('calculateDafYomi', () => {
  it('should return correct daf for a given date', () => {
    const daf = calculateDafYomi(new Date(2020, 0, 6))

    expect(daf.tractate).toBe('Berakhot')
    expect(daf.daf).toBe(2)
    expect(daf.amud).toBe('a')
  })

  it('should handle dates before cycle start', () => {
    const daf = calculateDafYomi(new Date(2020, 0, 1))

    expect(daf).toBeDefined()
    expect(daf.daf).toBeGreaterThanOrEqual(0)
  })
})
```

### כיסוי בדיקות

- **Functions/Utilities:** 80%+ coverage
- **Components:** בדיקות עיקריות (happy path + edge cases)
- **Server Actions:** בדיקות integration

### הרצת בדיקות

```bash
# כל הבדיקות
npm test

# מצב watch
npm run test:watch

# UI interactiveממשק
npm run test:ui

# כיסוי
npm run test:coverage
```

---

## 🐛 דיווח באגים

### לפני שאתה מדווח

1. **חפש Issues קיימים** - אולי הבאג כבר דווח
2. **וודא שזה באג** - ולא שימוש לא נכון
3. **נסה לשחזר** - וודא שאתה יכול לשחזר את הבעיה

### תבנית דיווח באג

```markdown
## 🐛 תיאור הבאג

תיאור ברור וקצר של הבעיה.

## 📋 צעדים לשחזור

1. לך ל-'...'
2. לחץ על '...'
3. גלול ל-'...'
4. ראה שגיאה

## ✅ תוצאה צפויה

מה היית מצפה שיקרה.

## ❌ תוצאה ממשית

מה קרה בפועל.

## 📸 Screenshots

אם אפשר, הוסף screenshots.

## 🌐 סביבה

- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]
- נסיעversion: [e.g., 2.0.0]

## 📝 הקשר נוסף

מידע נוסף שעשוי לעזור.
```

---

## 💡 הצעת תכונות חדשות

### לפני שאתה מציע

1. **חפש Discussions** - אולי מישהו כבר הציע
2. **חשוב על Use Case** - למה זה נחוץ?
3. **שקול חלופות** - האם יש דרכים אחרות?

### תבנית הצעת תכונה

```markdown
## 💡 התכונה המוצעת

תיאור ברור וקצר של התכונה.

## 🎯 הבעיה שהתכונה פותרת

הסבר איזו בעיה התכונה פותרת או איזה צורך היא ממלאת.

## 📝 תיאור מפורט

תיאור מפורט של איך התכונה תעבוד.

## 🎨 דוגמאות/Mockups

אם אפשר, הוסף דוגמאות, mockups, או code snippets.

## 🔄 חלופות

תאר חלופות ששקלת.

## 📊 השפעה

מי ייהנה מזה? כמה משתמשים?

## ✅ Checklist

- [ ] חיפשתי ב-Discussions ולא מצאתי הצעה דומה
- [ ] חשבתי על ההשפעה על משתמשים קיימים
- [ ] התכונה מתאימה לחזון הפרויקט
```

---

## 🙋 שאלות?

- 📖 **תיעוד:** [README.md](README.md), [CLAUDE.md](CLAUDE.md)
- 💬 **Discussions:** [GitHub Discussions](../../discussions)
- 📧 **Email:** your-email@example.com
- 🐛 **Issues:** [GitHub Issues](../../issues)

---

## 📜 רישיון

בתרומה לפרויקט, אתה מסכים שהתרומה שלך תהיה תחת [רישיון MIT](LICENSE).

---

<div align="center">

### תודה שאתה עוזר לשפר את אור הישרה! 🌟

**נבנה ביחד משהו מיוחד • Building something special together**

</div>
