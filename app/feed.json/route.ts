import { createClient } from "@/lib/supabase/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
const SITE_NAME = "אור הישרה"

export async function GET() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50)

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: "מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות",
    language: "he",
    icon: `${SITE_URL}/icon-512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    items:
      articles?.map((article) => ({
        id: `${SITE_URL}/articles/${article.slug}`,
        url: `${SITE_URL}/articles/${article.slug}`,
        title: article.title,
        content_html: article.excerpt || article.meta_description,
        summary: article.excerpt || article.meta_description,
        date_published: article.published_at || article.created_at,
        date_modified: article.updated_at,
        authors: [{ name: article.author }],
        tags: article.tags,
        image: article.featured_image,
      })) || [],
  }

  return Response.json(feed, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
