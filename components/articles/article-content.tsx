"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Eye, Star, Calendar, User, Share2 } from "lucide-react"
import type { ArticleWithCategory } from "@/types"
import { incrementViews } from "@/app/actions/articles"

interface ArticleContentProps {
  article: ArticleWithCategory
}

export function ArticleContent({ article }: ArticleContentProps) {
  useEffect(() => {
    incrementViews(article.id)
  }, [article.id])

  const shareArticle = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.excerpt || article.title,
        url: window.location.href,
      })
    }
  }

  return (
    <article className="py-12">
      <div className="container px-4 max-w-3xl mx-auto">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-6 gap-2">
          <Link href="/articles">
            <ArrowRight className="h-4 w-4" />
            חזרה למאמרים
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8">
          {article.category && (
            <Badge
              variant="secondary"
              className="mb-4"
              style={{ backgroundColor: `${article.category.color}20`, color: article.category.color || undefined }}
            >
              {article.category.name}
            </Badge>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4 leading-tight">{article.title}</h1>

          {article.subtitle && <p className="text-xl text-muted-foreground mb-6">{article.subtitle}</p>}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y py-4">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author}
            </span>
            {article.hebrew_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {article.hebrew_date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.reading_time} דק׳ קריאה
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views_count} צפיות
            </span>
            {article.average_rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {article.average_rating.toFixed(1)} ({article.ratings_count})
              </span>
            )}
            <Button variant="ghost" size="sm" className="gap-1 mr-auto" onClick={shareArticle}>
              <Share2 className="h-4 w-4" />
              שתף
            </Button>
          </div>
        </header>

        {/* Featured image */}
        {article.featured_image && (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
            <img
              src={article.featured_image || "/placeholder.svg"}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:pr-4 prose-blockquote:not-italic prose-blockquote:text-muted-foreground">
          {article.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                  {paragraph.slice(2)}
                </h1>
              )
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                  {paragraph.slice(3)}
                </h2>
              )
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-bold mt-4 mb-2">
                  {paragraph.slice(4)}
                </h3>
              )
            }
            if (paragraph.startsWith("> ")) {
              return (
                <blockquote key={index} className="border-r-4 border-primary pr-4 my-4 text-muted-foreground">
                  {paragraph.slice(2)}
                </blockquote>
              )
            }
            if (paragraph.trim() === "") {
              return null
            }
            return (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">תגיות:</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
