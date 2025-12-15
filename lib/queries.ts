import { createClient } from "@/lib/supabase/server"
import type { Category, Comment, ArticleWithCategory } from "@/types"

// Get all published articles
export async function getPublishedArticles(limit = 10, offset = 0) {
  const supabase = await createClient()

  const { data, error, count } = await supabase
    .from("articles")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { articles: data as ArticleWithCategory[], total: count }
}

// Get featured articles
export async function getFeaturedArticles(limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ArticleWithCategory[]
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) throw error
  return data as ArticleWithCategory
}

// Get articles by category
export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories!inner(*)")
    .eq("status", "published")
    .eq("category.slug", categorySlug)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ArticleWithCategory[]
}

// Get all categories
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("order_index", { ascending: true })

  if (error) throw error
  return data as Category[]
}

// Get popular articles
export async function getPopularArticles(limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("views_count", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ArticleWithCategory[]
}

// Increment article views
export async function incrementArticleViews(articleId: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc("increment_views", {
    article_uuid: articleId,
  })

  if (error) throw error
}

// Get article comments
export async function getArticleComments(articleId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .eq("status", "approved")
    .is("parent_id", null)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Comment[]
}

// Search articles
export async function searchArticles(query: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data as ArticleWithCategory[]
}

// Get related articles
export async function getRelatedArticles(articleId: string, categoryId: string | null, limit = 3) {
  const supabase = await createClient()

  let query = supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .neq("id", articleId)
    .limit(limit)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query.order("published_at", { ascending: false })

  if (error) throw error
  return data as ArticleWithCategory[]
}
