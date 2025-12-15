import Link from "next/link"
import { getFeaturedArticles } from "@/lib/queries"
import { ArticleCard } from "@/components/articles/article-card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function FeaturedArticles() {
  const articles = await getFeaturedArticles(3)

  if (articles.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif">מאמרים מומלצים</h2>
            <p className="text-muted-foreground mt-1">המאמרים הנבחרים שלנו</p>
          </div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/articles">
              כל המאמרים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
