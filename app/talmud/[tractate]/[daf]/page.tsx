"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GenericTextReader } from "@/components/reader/generic-text-reader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { sefaria } from "@/lib/sefaria/client"
import { getTractateByName } from "@/lib/sefaria/talmud"
import type { SefariaTextResponse } from "@/types/text-reader"

export default function TalmudDafPage() {
  const params = useParams()
  const tractateName = params.tractate as string
  const dafParam = params.daf as string

  const [data, setData] = useState<SefariaTextResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tractate = getTractateByName(tractateName)

  // Parse daf (e.g., "2a" -> daf: 2, amud: "a")
  const dafMatch = dafParam.match(/^(\d+)([ab])$/)
  const dafNumber = dafMatch ? parseInt(dafMatch[1]) : 0
  const amud = dafMatch ? (dafMatch[2] as "a" | "b") : "a"

  useEffect(() => {
    if (!tractate) {
      setError("מסכת לא נמצאה")
      setLoading(false)
      return
    }

    if (dafNumber < 2 || dafNumber > tractate.pages + 1) {
      setError("דף לא תקין")
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
      .fetchTalmudDaf(tractate.en, dafParam)
      .then((dafData) => {
        clearTimeout(loadTimeout)
        setData(dafData)
        setLoading(false)
      })
      .catch((err) => {
        clearTimeout(loadTimeout)
        setError(err.message || "שגיאה בטעינת הדף")
        setLoading(false)
      })

    return () => clearTimeout(loadTimeout)
  }, [tractate, dafParam, dafNumber])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">טוען את הדף...</p>
      </div>
    )
  }

  if (error || !tractate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-destructive max-w-md">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive mb-4">שגיאה: {error || "מסכת לא נמצאה"}</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data || !data.text) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="border-destructive max-w-md">
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-destructive mb-4">לא נמצא תוכן לדף זה</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parse text lines from Sefaria response
  const lines = sefaria.parseHebrewText(data.text)

  // Calculate previous and next daf
  const getPrevDaf = () => {
    if (amud === "b") {
      return `${dafNumber}a`
    } else if (dafNumber > 2) {
      return `${dafNumber - 1}b`
    }
    return null
  }

  const getNextDaf = () => {
    if (amud === "a") {
      return `${dafNumber}b`
    } else if (dafNumber < tractate.pages + 1) {
      return `${dafNumber + 1}a`
    }
    return null
  }

  const prevDaf = getPrevDaf()
  const nextDaf = getNextDaf()

  // Calculate section number (for progress tracking)
  const sectionNumber = (dafNumber - 2) * 2 + (amud === "a" ? 1 : 2)

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <GenericTextReader
        textType="talmud"
        textId={`${tractate.en}.${dafParam}`}
        title={`מסכת ${tractate.he} דף ${dafNumber}${amud}`}
        verses={lines}
        verseCount={lines.length}
        section={sectionNumber}
        totalSections={tractate.pages * 2}
        backUrl="/talmud"
        statsUrl="/talmud/stats"
        prevSectionUrl={prevDaf ? `/talmud/${tractate.en}/${prevDaf}` : undefined}
        nextSectionUrl={nextDaf ? `/talmud/${tractate.en}/${nextDaf}` : undefined}
        sectionLabel="דף"
        verseLabel="שורה"
        showHolyNames={false}
      />
    </div>
  )
}
