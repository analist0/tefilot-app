"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Home, BookOpen } from "lucide-react"
import { ZOHAR_STRUCTURE } from "@/lib/sefaria/zohar"

interface ZoharReaderPageProps {
  params: Promise<{
    section: string
    page: string
  }>
}

export default function ZoharReaderPage({ params }: ZoharReaderPageProps) {
  const { section, page } = use(params)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Parse section and page
  const sectionIndex = parseInt(section) - 1
  const pageNumber = parseInt(page)

  if (isNaN(sectionIndex) || isNaN(pageNumber)) {
    notFound()
  }

  // Get section from structure
  const currentSection = ZOHAR_STRUCTURE[sectionIndex]

  if (!currentSection) {
    notFound()
  }

  // Validate page number
  if (pageNumber < 1 || pageNumber > currentSection.dafim) {
    notFound()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/20 dark:via-cyan-950/10 to-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <BookOpen className="h-8 w-8" />
          </div>
          <p className="text-lg text-muted-foreground">טוען את הזוהר...</p>
        </div>
      </div>
    )
  }

  // Construct Sefaria reference
  // Example: "Zohar" for main sections
  const sefariaRef = currentSection.sefariaRef || "Zohar"

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/20 dark:via-cyan-950/10 to-background" dir="rtl">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/zohar">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                חזרה לזוהר
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold font-['Frank_Ruhl_Libre']">
                {currentSection.heTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                דף {pageNumber} מתוך {currentSection.dafim}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pageNumber > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/zohar/${section}/${pageNumber - 1}`}>
                  <ArrowRight className="h-4 w-4" />
                  דף קודם
                </Link>
              </Button>
            )}
            {pageNumber < currentSection.dafim && (
              <Button asChild size="sm">
                <Link href={`/zohar/${section}/${pageNumber + 1}`}>
                  דף הבא
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
                <Link href={`https://www.sefaria.org/${sefariaRef}.${pageNumber}`} target="_blank">
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
