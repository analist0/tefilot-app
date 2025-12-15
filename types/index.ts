export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order_index: number
  created_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string | null
  content: string
  excerpt: string | null
  featured_image: string | null
  category_id: string | null
  tags: string[]
  parasha: string | null
  author: string
  hebrew_date: string | null
  reading_time: number
  status: "draft" | "published" | "archived"
  is_featured: boolean
  meta_description: string | null
  meta_keywords: string[]
  sources: Source[]
  holy_names: string[]
  sefirot: string[]
  views_count: number
  average_rating: number
  ratings_count: number
  created_at: string
  updated_at: string
  published_at: string | null
  category?: Category
}

export interface Source {
  type: "zohar" | "arizal" | "ramchal" | "tanach" | "other"
  reference: string
  text?: string
  link?: string
}

export interface Comment {
  id: string
  article_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
  status: "pending" | "approved" | "spam"
  created_at: string
  updated_at: string
  replies?: Comment[]
}

export interface Rating {
  id: string
  article_id: string
  rating: 1 | 2 | 3 | 4 | 5
  fingerprint: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  usage_count: number
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

export interface ArticleWithCategory extends Article {
  category: Category | null
}

export type UserRole = "admin" | "editor" | "user"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

export interface TehilimProgress {
  id: string
  user_id: string | null
  session_id: string
  chapter: number
  verse: number
  letter_index: number
  completed: boolean
  verses_read: number
  chapters_completed: number
  total_time_seconds: number
  reading_speed_wpm: number
  longest_streak_days: number
  current_streak_days: number
  last_read_at: string | null
  total_sessions: number
  created_at: string
  updated_at: string
}

export interface TehilimStats {
  total_chapters_read: number
  total_verses_read: number
  total_time_minutes: number
  average_reading_speed: number
  current_streak: number
  longest_streak: number
  completion_percentage: number
  chapters_remaining: number
  verses_remaining: number
  estimated_completion_time: number
}
