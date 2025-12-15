"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, BookOpen, Sparkles, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { hebrewNumber } from "@/lib/tehilim/parse"
import { cn } from "@/lib/utils"

const CHAPTER_PREVIEWS: Record<number, { preview: string; tag?: string }> = {
  1: { preview: "אשרי האיש אשר לא הלך בעצת רשעים", tag: "פתיחה" },
  23: { preview: "ה׳ רועי לא אחסר", tag: "אמונה" },
  27: { preview: "ה׳ אורי וישעי ממי אירא", tag: "אלול" },
  51: { preview: "חנני אלהים כחסדך", tag: "תשובה" },
  91: { preview: "יושב בסתר עליון בצל שדי יתלונן", tag: "שמירה" },
  119: { preview: "אשרי תמימי דרך ההולכים בתורת ה׳", tag: "הארוך" },
  121: { preview: "שיר למעלות אשא עיני אל ההרים", tag: "מעלות" },
  130: { preview: "שיר המעלות ממעמקים קראתיך ה׳", tag: "סליחות" },
  145: { preview: "תהלה לדוד ארוממך אלוהי המלך", tag: "אשרי" },
  150: { preview: "הללויה הללו אל בקדשו", tag: "סיום" },
}

const ALL_CHAPTERS = Array.from({ length: 150 }, (_, i) => i + 1)

const BOOKS = [
  { name: "ספר ראשון", start: 1, end: 41, color: "from-blue-500/10 to-blue-500/5" },
  { name: "ספר שני", start: 42, end: 72, color: "from-emerald-500/10 to-emerald-500/5" },
  { name: "ספר שלישי", start: 73, end: 89, color: "from-amber-500/10 to-amber-500/5" },
  { name: "ספר רביעי", start: 90, end: 106, color: "from-purple-500/10 to-purple-500/5" },
  { name: "ספר חמישי", start: 107, end: 150, color: "from-rose-500/10 to-rose-500/5" },
]

export function ChapterList() {
  const [search, setSearch] = useState("")

  const filteredChapters = useMemo(() => {
    if (!search) return ALL_CHAPTERS

    const searchNum = Number.parseInt(search)
    if (!isNaN(searchNum)) {
      return ALL_CHAPTERS.filter((ch) => ch === searchNum || ch.toString().includes(search))
    }

    return ALL_CHAPTERS.filter((ch) => hebrewNumber(ch).includes(search))
  }, [search])

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="חפש פרק לפי מספר..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-12 h-14 text-lg rounded-2xl border-2 focus:border-primary"
        />
      </div>

      {/* Popular Chapters */}
      <section>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-bold">פרקים נבחרים</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Object.entries(CHAPTER_PREVIEWS).map(([chapter, { preview, tag }]) => (
            <Link key={chapter} href={`/tehilim/${chapter}`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl sm:text-2xl font-serif font-bold text-primary">
                        {hebrewNumber(Number.parseInt(chapter))}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm sm:text-base font-semibold">פרק {chapter}</span>
                        {tag && (
                          <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{preview}...</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All Chapters by Book */}
      <section>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-bold">כל הפרקים</h3>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {BOOKS.map((book) => {
            const bookChapters = filteredChapters.filter((ch) => ch >= book.start && ch <= book.end)
            if (bookChapters.length === 0) return null

            return (
              <div
                key={book.name}
                className={cn("p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br", book.color)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm sm:text-base font-semibold">{book.name}</h4>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    פרקים {book.start}-{book.end}
                  </span>
                </div>

                <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                  {bookChapters.map((chapter) => {
                    const isPopular = CHAPTER_PREVIEWS[chapter]

                    return (
                      <Link key={chapter} href={`/tehilim/${chapter}`}>
                        <div
                          className={cn(
                            "aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center",
                            "transition-all duration-200 cursor-pointer",
                            "text-base sm:text-lg font-serif font-bold",
                            "active:scale-95 hover:scale-105 hover:shadow-md",
                            isPopular
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-background/80 hover:bg-background border border-border/50 hover:border-primary/30",
                          )}
                        >
                          {hebrewNumber(chapter)}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
