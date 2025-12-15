import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Star } from "lucide-react"
import type { ArticleWithCategory } from "@/types"

interface ArticleCardProps {
  article: ArticleWithCategory
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <Card
        className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden ${featured ? "border-primary/20" : ""}`}
      >
        {article.featured_image && (
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              className="object-cover w-full h-full"
            />
            {featured && <Badge className="absolute top-2 right-2 bg-primary">מומלץ</Badge>}
          </div>
        )}
        {!article.featured_image && (
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
            <span className="text-6xl font-serif text-primary/20">{article.title.charAt(0)}</span>
            {featured && <Badge className="absolute top-2 right-2 bg-primary">מומלץ</Badge>}
          </div>
        )}

        <CardHeader className="pb-2">
          {article.category && (
            <Badge
              variant="secondary"
              className="w-fit text-xs"
              style={{ backgroundColor: `${article.category.color}20`, color: article.category.color || undefined }}
            >
              {article.category.name}
            </Badge>
          )}
          <h3 className="font-bold text-lg font-serif line-clamp-2 mt-2">{article.title}</h3>
        </CardHeader>

        <CardContent className="pt-0">
          {article.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time} דק׳ קריאה
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.views_count}
            </span>
            {article.average_rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                {article.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
