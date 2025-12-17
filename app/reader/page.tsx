"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { GenericTextReader } from "@/components/reader/generic-text-reader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { sefaria } from "@/lib/sefaria/client"
import {
  BookOpen,
  AlertCircle,
  Home,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react"

interface TefilaData {
  title: string
  heTitle: string
  verses: string[]
  ref: string
}

function ReaderContent() {
  const searchParams = useSearchParams()
  const type = searchParams?.get("type")
  const ref = searchParams?.get("ref")
  const title = searchParams?.get("title")

  const [tefilaData, setTefilaData] = useState<TefilaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadText() {
      if (!ref || !title) {
        setError("חסרים פרמטרים: ref ו-title נדרשים")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log(`[Reader] Fetching: ${ref}`)
        const response = await sefaria.fetchText(ref)

        // Parse Hebrew text
        const verses = sefaria.parseHebrewText(response)

        if (!verses || verses.length === 0) {
          throw new Error("לא נמצא טקסט עבור הפנייה זו")
        }

        setTefilaData({
          title: response.book || title,
          heTitle: response.heTitle || title,
          verses,
          ref,
        })
      } catch (err) {
        console.error("[Reader] Error:", err)
        setError(err instanceof Error ? err.message : "שגיאה בטעינת הטקסט")
      } finally {
        setLoading(false)
      }
    }

    loadText()
  }, [ref, title])

  // Loading state with beautiful skeleton
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-background via-amber-50/20 dark:via-amber-950/10 to-background"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <Card className="overflow-hidden">
            <CardContent className="py-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loading indicator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">טוען תפילה...</p>
              <p className="text-sm text-muted-foreground">מביא את הטקסט מ-Sefaria</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-b from-background to-red-50/20 dark:to-red-950/10"
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-xl font-bold">שגיאה בטעינת התפילה</AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p className="text-base">{error}</p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/tefilot">
                    <ArrowRight className="h-4 w-4" />
                    חזרה לתפילות
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  נסה שוב
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Debug info (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <div className="text-sm space-y-1 font-mono">
                  <p>Type: {type}</p>
                  <p>Ref: {ref}</p>
                  <p>Title: {title}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    )
  }

  // Success state - show the text reader
  if (!tefilaData) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background via-amber-50/20 dark:via-amber-950/10 to-background"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tefilaData.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GenericTextReader
              textType="tefilot"
              textId={tefilaData.ref}
              title={tefilaData.heTitle}
              verses={tefilaData.verses}
              verseCount={tefilaData.verses.length}
              section={1}
              totalSections={1}
              backUrl="/tefilot"
              sectionLabel="קטע"
              verseLabel="שורה"
              showHolyNames={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function ReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ReaderContent />
    </Suspense>
  )
}
