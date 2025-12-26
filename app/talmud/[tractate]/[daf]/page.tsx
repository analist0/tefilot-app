"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GenericTextReader } from "@/components/reader/generic-text-reader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Wifi, WifiOff, Database, HardDrive, Cloud } from "lucide-react"
import { getCachedText, preloadText } from "@/lib/reader/text-cache"
import { getTractateByName } from "@/lib/sefaria/talmud"

export default function TalmudDafPage() {
  const params = useParams()
  const tractateName = params.tractate as string
  const dafParam = params.daf as string

  const [lines, setLines] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cacheSource, setCacheSource] = useState<"memory" | "localStorage" | "supabase" | "api" | null>(null)

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
    setCacheSource(null)

    const ref = `${tractate.en}.${dafParam}`
    const startTime = Date.now()

    getCachedText(ref)
      .then((cachedLines) => {
        const loadTime = Date.now() - startTime

        if (loadTime < 10) {
          setCacheSource("memory")
        } else if (loadTime < 100) {
          setCacheSource("localStorage")
        } else if (loadTime < 1000) {
          setCacheSource("supabase")
        } else {
          setCacheSource("api")
        }

        setLines(cachedLines)
        setLoading(false)

        // Preload adjacent dapim
        const prevDaf = getPrevDaf()
        const nextDaf = getNextDaf()
        if (prevDaf) preloadText(`${tractate.en}.${prevDaf}`)
        if (nextDaf) preloadText(`${tractate.en}.${nextDaf}`)
      })
      .catch((err) => {
        setError(err.message || "שגיאה בטעינת הדף")
        setLoading(false)
      })
  }, [tractate, dafParam, dafNumber])

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
    } else if (tractate && dafNumber < tractate.pages + 1) {
      return `${dafNumber + 1}a`
    }
    return null
  }

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
          <p className="text-xl font-semibold">טוען את הדף...</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
            <Database className="h-4 w-4 animate-pulse" />
            מחפש בקאש מקומי
          </p>
        </div>
      </div>
    )
  }

  if (error || !tractate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="border-2 border-destructive/50 max-w-md shadow-2xl bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="py-10 px-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-destructive">שגיאה בטעינת הדף</h3>
              <p className="text-muted-foreground">{error || "מסכת לא נמצאה"}</p>
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

  if (lines.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <Card className="border-amber-500/50 max-w-md shadow-xl">
          <CardContent className="py-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">לא נמצא תוכן</h3>
              <p className="text-muted-foreground">הדף המבוקש ריק או לא קיים</p>
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

  const prevDaf = getPrevDaf()
  const nextDaf = getNextDaf()

  // Calculate section number (for progress tracking)
  const sectionNumber = (dafNumber - 2) * 2 + (amud === "a" ? 1 : 2)

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
