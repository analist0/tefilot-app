"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GenericTextReader } from "@/components/reader/generic-text-reader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Wifi, WifiOff, Database, HardDrive, Cloud } from "lucide-react"
import { getCachedText, preloadText, getCacheStats } from "@/lib/reader/text-cache"
import { findBook } from "@/lib/sefaria/tanakh"

export default function TanakhChapterPage() {
  const params = useParams()
  const bookName = params.book as string
  const chapter = parseInt(params.chapter as string)

  const [verses, setVerses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cacheSource, setCacheSource] = useState<"memory" | "localStorage" | "supabase" | "api" | null>(null)

  const book = findBook(bookName)

  useEffect(() => {
    if (!book) {
      setError("ספר לא נמצא")
      setLoading(false)
      return
    }

    if (chapter < 1 || chapter > book.chapters) {
      setError("פרק לא תקין")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setCacheSource(null)

    const ref = `${book.en}.${chapter}`

    // Detect cache source
    const startTime = Date.now()

    getCachedText(ref)
      .then((cachedVerses) => {
        const loadTime = Date.now() - startTime

        // Determine cache source based on load time
        if (loadTime < 10) {
          setCacheSource("memory")
        } else if (loadTime < 100) {
          setCacheSource("localStorage")
        } else if (loadTime < 1000) {
          setCacheSource("supabase")
        } else {
          setCacheSource("api")
        }

        setVerses(cachedVerses)
        setLoading(false)

        // Preload next and previous chapters in background
        if (chapter > 1) {
          preloadText(`${book.en}.${chapter - 1}`)
        }
        if (chapter < book.chapters) {
          preloadText(`${book.en}.${chapter + 1}`)
        }
      })
      .catch((err) => {
        setError(err.message || "שגיאה בטעינת הפרק")
        setLoading(false)
      })
  }, [book, chapter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4" dir="rtl">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-3xl border border-primary/20 shadow-2xl">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold">טוען את הפרק...</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
            <Database className="h-4 w-4 animate-pulse" />
            מחפש בקאש מקומי
          </p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="border-2 border-destructive/50 max-w-md shadow-2xl bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="py-10 px-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-destructive">שגיאה בטעינת הפרק</h3>
              <p className="text-muted-foreground">{error || "ספר לא נמצא"}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.location.reload()} className="w-full">
                נסה שוב
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                חזרה
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="border-amber-500/50 max-w-md shadow-xl">
          <CardContent className="py-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">לא נמצא תוכן</h3>
              <p className="text-muted-foreground">הפרק המבוקש ריק או לא קיים</p>
            </div>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCacheIcon = () => {
    switch (cacheSource) {
      case "memory":
        return <HardDrive className="h-3.5 w-3.5 text-green-600" />
      case "localStorage":
        return <Database className="h-3.5 w-3.5 text-blue-600" />
      case "supabase":
        return <Cloud className="h-3.5 w-3.5 text-purple-600" />
      case "api":
        return <Wifi className="h-3.5 w-3.5 text-orange-600" />
      default:
        return null
    }
  }

  const getCacheLabel = () => {
    switch (cacheSource) {
      case "memory":
        return "זיכרון מהיר"
      case "localStorage":
        return "קאש מקומי"
      case "supabase":
        return "מאגר נתונים"
      case "api":
        return "נטען מהשרת"
      default:
        return ""
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8" dir="rtl">
      {/* Cache indicator */}
      {cacheSource && (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 text-xs font-medium">
            {getCacheIcon()}
            <span>{getCacheLabel()}</span>
          </div>
        </div>
      )}

      <GenericTextReader
        textType="tanakh"
        textId={`${book.en}.${chapter}`}
        title={`${book.he} פרק ${chapter}`}
        verses={verses}
        verseCount={verses.length}
        section={chapter}
        totalSections={book.chapters}
        backUrl="/tanakh"
        statsUrl="/tanakh/stats"
        prevSectionUrl={chapter > 1 ? `/tanakh/${book.en}/${chapter - 1}` : undefined}
        nextSectionUrl={chapter < book.chapters ? `/tanakh/${book.en}/${chapter + 1}` : undefined}
        sectionLabel="פרק"
        verseLabel="פסוק"
        showHolyNames={true}
      />
    </div>
  )
}
