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

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות</description>
    <language>he</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${
      articles
        ?.map(
          (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/articles/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt || article.meta_description || "")}</description>
      ${article.category ? `<category>${escapeXml(article.category.name)}</category>` : ""}
      <author>${escapeXml(article.author)}</author>
    </item>`,
        )
        .join("") || ""
    }
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
