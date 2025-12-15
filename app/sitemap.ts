import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Get all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  // Get all categories
  const { data: categories } = await supabase.from("categories").select("slug, created_at")

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tehilim`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Article pages
  const articlePages: MetadataRoute.Sitemap =
    articles?.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at || article.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  // Category pages
  const categoryPages: MetadataRoute.Sitemap =
    categories?.map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || []

  return [...staticPages, ...articlePages, ...categoryPages]
}
