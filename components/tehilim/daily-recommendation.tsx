"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Sparkles, Calendar, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCachedHebrewDate } from "@/lib/tehilim/cache"
import { DAILY_TEHILIM } from "@/lib/tehilim/types"
import { hebrewNumber } from "@/lib/tehilim/parse"

export function DailyRecommendation() {
  const [chapters, setChapters] = useState<number[]>([])
  const [hebrewDay, setHebrewDay] = useState<number>(1)
  const [hebrewDate, setHebrewDate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCachedHebrewDate()
      .then((date) => {
        setHebrewDay(date.hebrewDay)
        setHebrewDate(date.hebrew)
        setChapters(DAILY_TEHILIM[date.hebrewDay] || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-6 bg-muted rounded-lg w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded-lg w-full mb-4" />
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-16 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="h-12 bg-muted rounded-xl w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg sm:text-xl">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            תהילים היום
          </CardTitle>
          <Badge variant="outline" className="text-xs sm:text-sm font-normal gap-1.5 px-3 py-1 rounded-full">
            <Calendar className="h-3.5 w-3.5" />
            יום {hebrewNumber(hebrewDay)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <p className="text-sm sm:text-base text-muted-foreground">
          פרקים לקריאה ליום {hebrewNumber(hebrewDay)} בחודש ({hebrewDate}):
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {chapters.map((chapter, index) => (
            <Link key={chapter} href={`/tehilim/${chapter}`}>
              <Button
                variant={index === 0 ? "default" : "outline"}
                size="lg"
                className="font-serif text-lg sm:text-xl h-12 sm:h-14 min-w-[4rem] sm:min-w-[4.5rem] rounded-xl gap-1.5"
              >
                {index === 0 && <Play className="h-4 w-4" />}
                {hebrewNumber(chapter)}
              </Button>
            </Link>
          ))}
        </div>

        <Link href="/tehilim" className="block">
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground h-12 rounded-xl">
            <BookOpen className="h-4 w-4" />
            לכל ספר התהילים
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
