import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArticlesGrid } from "@/components/articles/articles-grid"
import { CategoryFilter } from "@/components/articles/category-filter"
import { ArticleListSkeleton } from "@/components/shared/article-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams
  const categorySlug = params.category

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">כל המאמרים</h1>
            <p className="text-muted-foreground">גלה את אוצרות התורה</p>
          </div>

          <Suspense fallback={<Skeleton className="h-12 w-full mb-8" />}>
            <CategoryFilter selectedCategory={categorySlug} />
          </Suspense>

          <Suspense fallback={<ArticleListSkeleton count={9} />}>
            <ArticlesGrid categorySlug={categorySlug} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
