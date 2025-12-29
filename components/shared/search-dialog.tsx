"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Loader2, FileText, Clock, TrendingUp, X, ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ArticleWithCategory } from "@/types"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RECENT_SEARCHES_KEY = "recent_searches"
const MAX_RECENT_SEARCHES = 5

const popularSearches = [
  "תהילים",
  "פרשת השבוע",
  "קבלה",
  "סגולות",
  "כוונות",
  "קדושה",
]

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ArticleWithCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch {
          setRecentSearches([])
        }
      }
      // Focus input after dialog opens
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(0, MAX_RECENT_SEARCHES)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      const maxIndex = results.length - 1

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, maxIndex))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        const article = results[selectedIndex]
        saveRecentSearch(query)
        onOpenChange(false)
        window.location.href = `/articles/${article.slug}`
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, query, saveRecentSearch, onOpenChange])

  const handleSearchClick = (searchQuery: string) => {
    setQuery(searchQuery)
    saveRecentSearch(searchQuery)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            חיפוש חכם
          </DialogTitle>
          <DialogDescription>חפש מאמרים, פרקים ותכנים לפי מילות מפתח</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Input
            ref={inputRef}
            placeholder="חפש מאמר, פרק תהילים, נושא..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10 pl-10 h-12 text-base"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium">לא נמצאו תוצאות</p>
              <p className="text-sm text-muted-foreground">נסה מילות מפתח אחרות</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground">תוצאות ({results.length})</h3>
              </div>
              <AnimatePresence>
                {results.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/articles/${article.slug}`}
                      onClick={() => {
                        saveRecentSearch(query)
                        onOpenChange(false)
                      }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl transition-all group",
                        selectedIndex === index
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted border border-transparent"
                      )}
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{article.excerpt}</p>
                        {article.category && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">חיפושים אחרונים</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="h-7 text-xs">
                  נקה
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSearchClick(search)}
                    className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">חיפושים פופולריים</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSearchClick(search)}
                    className="px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-sm transition-colors border border-primary/20"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">↑↓</kbd>
            <span>ניווט</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Enter</kbd>
            <span>פתח</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Esc</kbd>
            <span>סגור</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
