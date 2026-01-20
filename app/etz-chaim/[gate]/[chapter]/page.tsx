"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Home, BookOpen } from "lucide-react"
import { ETZ_CHAIM_GATES, getGateByNumber } from "@/lib/sefaria/etz-chaim"

interface EtzChaimReaderPageProps {
  params: Promise<{
    gate: string
    chapter: string
  }>
}

export default function EtzChaimReaderPage({ params }: EtzChaimReaderPageProps) {
  const { gate, chapter } = use(params)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Parse gate and chapter
  const gateNumber = parseInt(gate)
  const chapterNumber = parseInt(chapter)

  if (isNaN(gateNumber) || isNaN(chapterNumber)) {
    notFound()
  }

  // Get gate from structure
  const currentGate = getGateByNumber(gateNumber)

  if (!currentGate) {
    notFound()
  }

  // Validate chapter number
  if (chapterNumber < 1 || chapterNumber > currentGate.chapters) {
    notFound()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-emerald-50/20 dark:via-emerald-950/10 to-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <BookOpen className="h-8 w-8" />
          </div>
          <p className="text-lg text-muted-foreground">טוען את עץ חיים...</p>
        </div>
      </div>
    )
  }

  // Construct Sefaria reference
  const sefariaRef = currentGate.sefariaRef || `Etz Chaim ${gateNumber}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-emerald-50/20 dark:via-emerald-950/10 to-background" dir="rtl">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/etz-chaim">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                חזרה לעץ חיים
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold font-['Frank_Ruhl_Libre']">
                {currentGate.heTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                פרק {chapterNumber} מתוך {currentGate.chapters}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {chapterNumber > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/etz-chaim/${gate}/${chapterNumber - 1}`}>
                  <ArrowRight className="h-4 w-4" />
                  פרק קודם
                </Link>
              </Button>
            )}
            {chapterNumber < currentGate.chapters && (
              <Button asChild size="sm">
                <Link href={`/etz-chaim/${gate}/${chapterNumber + 1}`}>
                  פרק הבא
                  <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reader */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 space-y-4">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">מערכת הקריאה בפיתוח</h3>
              <p className="text-muted-foreground">
                עמוד הקריאה עדיין בשלבי פיתוח. בינתיים תוכל לקרוא ישירות ב-Sefaria.
              </p>
              <Button asChild>
                <Link href={`https://www.sefaria.org/${sefariaRef}.${chapterNumber}`} target="_blank">
                  קרא ב-Sefaria
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
