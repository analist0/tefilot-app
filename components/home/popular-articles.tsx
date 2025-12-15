import Link from "next/link"
import { getPopularArticles } from "@/lib/queries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Star, Trophy, Medal, Award } from "lucide-react"

const rankIcons = [Trophy, Medal, Award]

export async function PopularArticles() {
  let articles = []

  try {
    articles = await getPopularArticles(5)
  } catch (error) {
    // Database not ready yet
    return null
  }

  if (articles.length === 0) return null

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-serif">הכי פופולריים</h2>
          <p className="text-muted-foreground mt-2">המאמרים הנצפים ביותר</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {articles.map((article, index) => {
            const RankIcon = rankIcons[index] || null
            return (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {RankIcon ? <RankIcon className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      {article.category && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {article.category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {article.average_rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {article.views_count}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
