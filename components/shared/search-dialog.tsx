"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Loader2, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ArticleWithCategory } from "@/types"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ArticleWithCategory[]>([])
  const [loading, setLoading] = useState(false)

  const searchArticles = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.articles || [])
    } catch (error) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchArticles(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchArticles])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>חיפוש מאמרים</DialogTitle>
          <DialogDescription>חפש מאמרים לפי כותרת, תוכן או קטגוריה</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש מאמר..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
            autoFocus
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">לא נמצאו תוצאות עבור "{query}"</div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{article.title}</h4>
                    {article.category && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {article.category.name}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
