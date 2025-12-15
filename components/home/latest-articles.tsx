import Link from "next/link"
import { getPublishedArticles } from "@/lib/queries"
import { ArticleCard } from "@/components/articles/article-card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function LatestArticles() {
  const result = await getPublishedArticles(6)

  if (result.articles.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">אין מאמרים אחרונים כרגע</h2>
            <p className="text-muted-foreground">נא להוסיף מאמרים דרך ממשק הניהול</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif">מאמרים אחרונים</h2>
            <p className="text-muted-foreground mt-1">התעדכן במאמרים החדשים</p>
          </div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/articles">
              כל המאמרים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
