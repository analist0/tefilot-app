import type { Article, Category } from "@/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
const SITE_NAME = "אור הישרה"

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
}

export function generateArticleSEO(article: Article, category?: Category | null): SEOData {
  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.meta_description || article.excerpt || article.title,
    keywords: [...(article.meta_keywords || []), ...(article.tags || [])],
    canonical: `${SITE_URL}/articles/${article.slug}`,
    ogImage: article.featured_image || `${SITE_URL}/og-default.jpg`,
    ogType: "article",
    publishedTime: article.published_at || article.created_at,
    modifiedTime: article.updated_at,
    author: article.author,
    section: category?.name,
    tags: article.tags,
  }
}

export function generateCategorySEO(category: Category): SEOData {
  return {
    title: `${category.name} | ${SITE_NAME}`,
    description: category.description || `מאמרים בנושא ${category.name}`,
    canonical: `${SITE_URL}/categories/${category.slug}`,
    ogType: "website",
  }
}

export function generateArticleJsonLd(article: Article, category?: Category | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.featured_image || `${SITE_URL}/og-default.jpg`,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
    articleSection: category?.name,
    keywords: [...(article.meta_keywords || []), ...(article.tags || [])].join(", "),
    wordCount: article.content.split(/\s+/).length,
    inLanguage: "he-IL",
    aggregateRating:
      article.ratings_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: article.average_rating,
            reviewCount: article.ratings_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Hebrew",
    },
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "he-IL",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
