import { getRelatedArticles } from "@/lib/queries"
import { ArticleCard } from "@/components/articles/article-card"

interface RelatedArticlesProps {
  articleId: string
  categoryId: string | null
}

export async function RelatedArticles({ articleId, categoryId }: RelatedArticlesProps) {
  let articles = []

  try {
    articles = await getRelatedArticles(articleId, categoryId, 3)
  } catch {
    return null
  }

  if (articles.length === 0) return null

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-2xl font-bold font-serif mb-6 text-center">מאמרים קשורים</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
