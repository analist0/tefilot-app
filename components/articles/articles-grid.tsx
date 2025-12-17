import { getPublishedArticles, getArticlesByCategory } from "@/lib/queries"
import { ArticleCard } from "@/components/articles/article-card"

interface ArticlesGridProps {
  categorySlug?: string
}

export async function ArticlesGrid({ categorySlug }: ArticlesGridProps) {
  let articles = []

  try {
    if (categorySlug) {
      articles = await getArticlesByCategory(categorySlug, 12)
    } else {
      const result = await getPublishedArticles(12)
      articles = result.articles
    }
  } catch {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>אין מאמרים להצגה כרגע</p>
        <p className="text-sm mt-2">אנא הרץ את סקריפטי הדאטהבייס</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>לא נמצאו מאמרים בקטגוריה זו</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
