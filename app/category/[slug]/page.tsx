import type React from "react"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArticleCard } from "@/components/articles/article-card"
import { getArticlesByCategory, getCategories } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Heart, Sparkles, Star, Target, Flame } from "lucide-react"
import type { Metadata } from "next"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Heart,
  Sparkles,
  Star,
  Target,
  Flame,
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const categories = await getCategories()
    const category = categories.find((c) => c.slug === slug)
    if (category) {
      return {
        title: `${category.name} | אור התורה`,
        description: category.description || `מאמרים בנושא ${category.name}`,
      }
    }
  } catch {}

  return {
    title: "קטגוריה | אור התורה",
  }
}

async function CategoryContent({ slug }: { slug: string }) {
  let category
  let articles = []

  try {
    const categories = await getCategories()
    category = categories.find((c) => c.slug === slug)
    if (!category) notFound()
    articles = await getArticlesByCategory(slug, 12)
  } catch {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>אין מאמרים להצגה כרגע</p>
      </div>
    )
  }

  const IconComponent = iconMap[category.icon || "BookOpen"] || BookOpen

  return (
    <>
      <div className="text-center mb-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <IconComponent className="h-10 w-10" style={{ color: category.color || undefined }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">{category.name}</h1>
        {category.description && <p className="text-muted-foreground max-w-lg mx-auto">{category.description}</p>}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>לא נמצאו מאמרים בקטגוריה זו</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <Suspense
            fallback={
              <div className="space-y-8">
                <div className="text-center">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-10 w-48 mx-auto mb-3" />
                  <Skeleton className="h-5 w-96 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              </div>
            }
          >
            <CategoryContent slug={slug} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
