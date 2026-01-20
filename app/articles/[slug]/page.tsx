import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArticleContent } from "@/components/articles/article-content"
import { RelatedArticles } from "@/components/articles/related-articles"
import { CommentsSection } from "@/components/comments/comments-section"
import { StarRating } from "@/components/ratings/star-rating"
import { ShareButton } from "@/components/shared/share-button"
import { FloatingActionButton } from "@/components/shared/floating-action-button"
import { ArticleContentSkeleton } from "@/components/shared/article-content-skeleton"
import { JsonLd } from "@/components/seo/json-ld"
import { getArticleBySlug } from "@/lib/queries"
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const article = await getArticleBySlug(slug)
    const keywords = [...(article.meta_keywords || []), ...(article.tags || [])]

    return {
      title: `${article.title} | אור הישרה`,
      description: article.meta_description || article.excerpt || article.title,
      keywords,
      authors: [{ name: article.author }],
      openGraph: {
        type: "article",
        title: article.title,
        description: article.meta_description || article.excerpt || article.title,
        url: `${SITE_URL}/articles/${article.slug}`,
        siteName: "אור הישרה",
        locale: "he_IL",
        images: article.featured_image
          ? [
              {
                url: article.featured_image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : [],
        publishedTime: article.published_at || article.created_at,
        modifiedTime: article.updated_at,
        authors: [article.author],
        tags: article.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.meta_description || article.excerpt || article.title,
        images: article.featured_image ? [article.featured_image] : [],
      },
      alternates: {
        canonical: `${SITE_URL}/articles/${article.slug}`,
      },
      robots: {
        index: article.status === "published",
        follow: true,
      },
    }
  } catch {
    return {
      title: "מאמר | אור הישרה",
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  let article
  try {
    article = await getArticleBySlug(slug)
  } catch {
    notFound()
  }

  const articleJsonLd = generateArticleJsonLd(article, article.category)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "בית", url: SITE_URL },
    { name: "מאמרים", url: `${SITE_URL}/articles` },
    ...(article.category
      ? [{ name: article.category.name, url: `${SITE_URL}/categories/${article.category.slug}` }]
      : []),
    { name: article.title, url: `${SITE_URL}/articles/${article.slug}` },
  ])

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Suspense fallback={<div className="h-16 border-b" />}>
        <Header />
      </Suspense>

      <main className="flex-1">
        <ArticleContent article={article} />

        <div className="container px-4 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <StarRating
              articleId={article.id}
              currentRating={article.average_rating}
              ratingsCount={article.ratings_count}
            />
            <ShareButton
              title={article.title}
              text={article.excerpt || article.title}
              url={`${SITE_URL}/articles/${article.slug}`}
              size="default"
              variant="outline"
            />
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <RelatedArticles articleId={article.id} categoryId={article.category_id} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <CommentsSection articleId={article.id} />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-16 border-t" />}>
        <Footer />
      </Suspense>

      <FloatingActionButton />
    </div>
  )
}
