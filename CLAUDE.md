# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hebrew spiritual blog platform ("אור הישרה") built with Next.js 16 (App Router), React 19, TypeScript, Supabase, and TipTap editor. The site features articles about Torah, Kabbalah, Parashat HaShavua, Tehilim, and spiritual content, with a unique Tehilim reading tracker feature.

**Key characteristics:**
- **RTL (Right-to-Left)**: The entire application is Hebrew-first with RTL layout (`dir="rtl"` in layout.tsx:107)
- **Hebrew fonts**: Uses Heebo and Frank Ruhl Libre for Hebrew content
- **Supabase backend**: All data operations go through Supabase (PostgreSQL)
- **Server-first architecture**: Uses React Server Components extensively with Server Actions

## Development Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Build & Production
npm run build           # Build for production (TypeScript errors ignored - see next.config.mjs:4)
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
```

## Architecture

### Database & Data Layer

**Supabase Client Pattern:**
- **Server Components**: Use `lib/supabase/server.ts` - creates a cached server client with cookie handling
- **Client Components**: Use `lib/supabase/client.ts` - creates a singleton browser client
- **Proxy Client**: `lib/supabase/proxy.ts` exists for special proxy scenarios

**Data Fetching Pattern:**
- Server Components use query functions from `lib/queries.ts` (getPublishedArticles, getFeaturedArticles, etc.)
- Client Components use Server Actions from `app/actions/*.ts`
- All Server Actions are marked with `"use server"` directive

**Common Database Functions:**
- `increment_views(article_uuid)` - RPC function to increment article view count
- See `lib/queries.ts` for complete list of query helpers

### Routing Structure

```
app/
├── (public routes)
│   ├── page.tsx                    # Home page
│   ├── articles/
│   │   ├── page.tsx               # Articles listing
│   │   └── [slug]/page.tsx        # Individual article
│   ├── category/[slug]/           # Category pages
│   ├── tehilim/                   # Tehilim reader
│   └── auth/                      # Login, forgot password, reset password
├── admin/                         # Admin dashboard (protected)
│   ├── articles/                  # Article management (new, edit, list)
│   ├── categories/                # Category management
│   ├── comments/                  # Comment moderation
│   ├── tags/                      # Tag management
│   ├── users/                     # User management
│   ├── tehilim/                   # Tehilim analytics
│   └── settings/                  # Site settings
├── profile/                       # User profile
├── settings/                      # User settings
└── api/
    ├── search/                    # Search API endpoint
    └── proxy/                     # Proxy API endpoint
```

### Component Organization

Components are organized by feature/domain:

```
components/
├── admin/              # Admin-specific components
├── articles/           # Article display components
├── auth/              # Authentication forms
├── comments/          # Comment system
├── home/              # Homepage sections
├── layout/            # Header, Footer, Navigation
├── profile/           # Profile-related components
├── ratings/           # Article rating system
├── seo/               # SEO components (JSON-LD, metadata)
├── settings/          # Settings pages
├── shared/            # Shared/common components
├── tehilim/           # Tehilim reader components
└── ui/                # shadcn/ui components (primitive UI)
```

### Type System

All types are centralized in `types/index.ts`:
- `Article`, `ArticleWithCategory` - Article data structure
- `Category` - Content categories
- `Comment` - Comment system with nested replies
- `Rating` - 1-5 star article ratings
- `Tag` - Article tags
- `Profile`, `AuthUser` - User authentication
- `TehilimProgress`, `TehilimStats` - Tehilim reading tracking
- `Source` - References (Zohar, Arizal, Ramchal, Tanach, etc.)

**Important type fields:**
- Articles have `status: "draft" | "published" | "archived"`
- Articles contain special fields: `parasha`, `hebrew_date`, `holy_names`, `sefirot`, `sources[]`
- Comments have `status: "pending" | "approved" | "spam"`

### Rich Text Editor

Uses TipTap editor with extensive extensions:
- Code blocks with syntax highlighting (lowlight + highlight.js)
- Tables, images, links
- Text styling (color, highlight, underline, alignment)
- Custom placeholder extension

See package.json:45-63 for full list of TipTap extensions.

### Server Actions Pattern

Server Actions are organized in `app/actions/`:
- `articles.ts` - Article operations (incrementViews, etc.)
- `categories.ts` - Category management
- `comments.ts` - Comment CRUD
- `ratings.ts` - Article rating system
- `tags.ts` - Tag operations
- `newsletter.ts` - Newsletter subscriptions
- `admin.ts` - Admin-specific actions

All actions follow Next.js 16 patterns with `"use server"` directive.

### SEO & Metadata

The site has comprehensive SEO implementation:
- **Static metadata**: Defined in `app/layout.tsx` with Hebrew content
- **JSON-LD**: Organization and Website schemas via `lib/seo.ts`
- **RSS/JSON feeds**: `/rss.xml` and `/feed.json` routes
- **Sitemap**: `app/sitemap.ts` generates dynamic sitemap
- **Robots**: `app/robots.ts` for crawler directives
- **Open Graph**: Full OG and Twitter card support

**Important**: Site URL from `NEXT_PUBLIC_SITE_URL` env variable (defaults to `https://example.com`)

### UI Library

Uses shadcn/ui (New York style) with:
- Radix UI primitives for accessibility
- Tailwind CSS v4 for styling
- CSS variables for theming (`app/globals.css`)
- RTL-aware components
- `next-themes` for dark mode

Install new components with:
```bash
npx shadcn@latest add <component-name>
```

Configuration in `components.json` with path aliases:
- `@/components` → components/
- `@/lib` → lib/
- `@/hooks` → hooks/
- `@/ui` → components/ui/

### Authentication Flow

The app uses Supabase auth with proper session management:

1. **Proxy (Next.js 16 requirement)**:
   - `proxy.ts` - Entry point that calls the session update function
   - `lib/supabase/proxy.ts` - Contains the actual middleware logic
   - Refreshes Supabase session on every request - prevents disconnection issues
   - Protects routes: `/admin`, `/profile`, `/settings` require authentication
   - Auto-redirects authenticated users away from `/auth/login` and `/auth/register`
   - Preserves redirect parameter for post-login navigation
   - **Note**: Next.js 16 uses `proxy.ts` instead of `middleware.ts`

2. **Auth Pages**:
   - Login: `app/auth/login/page.tsx` - uses `router.push()` + `router.refresh()` after successful login
   - Register: `app/auth/register/page.tsx` - creates account and auto-logs in
   - Callback: `app/api/auth/callback/route.ts` - handles OAuth flows and email confirmations

3. **Admin Protection**:
   - Proxy checks authentication (is user logged in?)
   - Proxy also checks role authorization for `/admin/*` routes (admin/editor only)
   - Admin layout (`app/admin/layout.tsx`) provides additional role checking as defense-in-depth
   - Two-layer security: authentication + authorization

### Important Notes

1. **TypeScript Build Errors**: The project has `ignoreBuildErrors: true` in next.config.mjs:4 - this is intentional for the current setup but should be addressed eventually.

2. **Image Optimization**: Disabled (`unoptimized: true` in next.config.mjs:7) - likely for static export or specific deployment requirements.

3. **Hebrew/RTL Development**: Always consider RTL layout when working on UI. Text alignment, margins, padding, and flexbox direction should account for RTL.

4. **Supabase Environment Variables Required**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (optional, defaults to https://example.com)
   - `GOOGLE_SITE_VERIFICATION` (optional)

5. **Path Alias**: The project uses `@/*` to reference root-level imports (tsconfig.json:22)

6. **Deployment**: Originally built with v0.dev and deployed on Vercel with automatic sync from v0.dev deployments (see README.md)

## Generic Text Reader System

The application now includes a comprehensive text reader system that supports multiple types of Jewish texts with word-by-word reading, progress tracking, and statistics.

### Supported Text Types

1. **Tehilim** (תהילים) - Book of Psalms
2. **Tanakh** (תנ״ך) - Complete Hebrew Bible (Torah, Neviim, Ketuvim)
3. **Talmud** (תלמוד) - Talmud Bavli with Daf Yomi tracking
4. **Tefilot** (תפילות) - Daily prayers and blessings
5. **Halacha** (הלכה) - Daily Halacha and Jewish law
6. **Sefarim** (ספרים) - Jewish books library with search

### Architecture

**Generic Components** (reusable for all text types):
```
components/reader/
├── generic-text-reader.tsx    # Main reader component
├── verse-display.tsx          # Word-by-word verse display
├── reader-controls.tsx        # Playback controls (play/pause, speed, font)
└── stats-display.tsx          # Statistics dashboard
```

**Text-Specific Pages**:
```
app/
├── learn/page.tsx             # Main learning hub (shows all enabled types)
├── tanakh/
│   ├── page.tsx              # Book selection (Torah, Neviim, Ketuvim)
│   ├── [book]/[chapter]/    # Chapter reader
│   └── stats/page.tsx        # Statistics
├── talmud/
│   ├── page.tsx              # Tractate selection + Daf Yomi
│   ├── [tractate]/[daf]/    # Daf reader (e.g., /talmud/Berakhot/2a)
│   └── stats/page.tsx        # Statistics
├── tehilim/                  # Existing Tehilim reader
└── admin/content-settings/   # Enable/disable content types
```

### Data Flow

**Sefaria API Integration**:
- `lib/sefaria/client.ts` - Generic API client for fetching all text types
- `lib/sefaria/tanakh.ts` - Tanakh book structure (24 books, chapters)
- `lib/sefaria/talmud.ts` - Talmud tractates + Daf Yomi calculator

**Progress Tracking**:
- `lib/reader/progress-tracker.ts` - Generic progress tracking for all types
- Dual storage: Supabase `reading_progress` table + localStorage backup
- Tracks: section, verse, letter_index, reading speed (WPM), time, streaks

**Database Schema**:
```sql
reading_progress table:
- session_id (TEXT) - Anonymous session tracking
- user_id (UUID) - Optional authenticated user
- text_type (TEXT) - 'tehilim' | 'tanakh' | 'talmud' | 'tefilot' | 'halacha' | 'sefarim'
- text_id (TEXT) - e.g., "Genesis.1", "Berakhot.2a", "Psalms.23"
- section (INTEGER) - chapter/daf number
- verse (INTEGER) - verse/line number
- letter_index (INTEGER) - current word position
- completed (BOOLEAN)
- reading_speed_wpm (INTEGER)
- total_time_seconds (INTEGER)
- sections_completed, verses_read, current_streak_days, longest_streak_days
```

### Key Features

**Word-by-Word Reading**:
- Auto-advance with configurable speed (20-150 WPM)
- Visual highlighting of current word
- Font size control (18-40px)
- Smooth scrolling to active verse

**Holy Names** (for religious texts):
- Special rendering for יהוה, אדני, אלהים, שדי, אל
- Displays kavanot (intentions) on hover
- Only for Tehilim, Tanakh, Tefilot (not for Talmud)

**Progress Tracking**:
- Auto-save every 3 seconds
- Resume from last position
- Statistics: completion %, reading speed, time spent, streaks
- Session-based (works without login) or user-based (when authenticated)

**Daf Yomi** (Talmud):
- Auto-calculated from cycle start date (January 5, 2020)
- 2,711 total dapim in Shas
- Prominently displayed on /talmud and /learn pages

**Admin Controls**:
- `/admin/content-settings` - Enable/disable text types
- Settings stored in localStorage
- `content_settings` key: `{ tehilim: true, tanakh: true, ... }`

### Type Definitions

All text reader types are in `types/text-reader.ts`:
- `TextType` - Union type of all supported types
- `ReadingProgress` - Database schema interface
- `SefariaTextResponse` - API response format
- `TEXT_TYPES_CONFIG` - Configuration for each text type

### Integration Points

**Navigation**:
- `/learn` - Main hub showing all enabled content types
- Each type has its own route: `/tanakh`, `/talmud`, `/tehilim`
- Stats pages: `/tanakh/stats`, `/talmud/stats`

**Sefaria API Endpoints**:
- Tanakh: `https://www.sefaria.org/api/texts/{Book}.{Chapter}`
- Talmud: `https://www.sefaria.org/api/texts/{Tractate}.{Daf}{Amud}`
- Tehilim: `https://www.sefaria.org/api/texts/Psalms.{Chapter}`

**Text Cleaning**:
- Removes HTML tags, cantillation marks, zero-width characters
- Normalizes spaces and punctuation
- See `lib/sefaria/client.ts:cleanText()`

### Important Notes

1. **Environment Variables**: Uses existing Supabase credentials
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (not ANON_KEY)

2. **RLS Policies**: The `reading_progress` table allows anonymous access (user_id IS NULL) for session-based tracking

3. **Caching**: Sefaria API responses are cached for 24 hours (`next: { revalidate: 86400 }`)

4. **Migration**: Database migration at `supabase/migrations/20250115_create_reading_progress.sql`

5. **Existing Tehilim**: The original Tehilim reader still exists and works independently. The generic system complements it.
