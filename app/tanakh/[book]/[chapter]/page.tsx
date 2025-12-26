"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GenericTextReader } from "@/components/reader/generic-text-reader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { sefaria } from "@/lib/sefaria/client"
import { findBook } from "@/lib/sefaria/tanakh"
import type { SefariaTextResponse } from "@/types/text-reader"

export default function TanakhChapterPage() {
  const params = useParams()
  const bookName = params.book as string
  const chapter = parseInt(params.chapter as string)

  const [data, setData] = useState<SefariaTextResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    const loadTimeout = setTimeout(() => {
      setError("הטעינה לוקחת יותר מדי זמן. אנא נסה שוב.")
      setLoading(false)
    }, 15000)

    sefaria
      .fetchTanakhChapter(book.en, chapter)
      .then((chapterData) => {
        clearTimeout(loadTimeout)
        setData(chapterData)
        setLoading(false)
      })
      .catch((err) => {
        clearTimeout(loadTimeout)
        setError(err.message || "שגיאה בטעינת הפרק")
        setLoading(false)
      })

    return () => clearTimeout(loadTimeout)
  }, [book, chapter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">טוען את הפרק...</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-destructive max-w-md">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive mb-4">שגיאה: {error || "ספר לא נמצא"}</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parse verses from Sefaria response
  const verses = sefaria.parseHebrewText(data)

  if (!data || verses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-destructive max-w-md">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive mb-4">לא נמצא תוכן לפרק זה</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8" dir="rtl">
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
