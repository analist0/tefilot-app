"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sun, BookOpen, ChevronRight, Home, CheckCircle2, Circle } from "lucide-react"
import { SHACHARIT_STRUCTURE, type TefilaSection } from "@/lib/sefaria/tefilot"

export default function ShacharitPage() {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem("shacharit_completed")
    if (saved) {
      setCompletedSections(new Set(JSON.parse(saved)))
    }
  }, [])

  const toggleSection = (title: string) => {
    const newCompleted = new Set(completedSections)
    if (newCompleted.has(title)) {
      newCompleted.delete(title)
    } else {
      newCompleted.add(title)
    }
    setCompletedSections(newCompleted)
    localStorage.setItem("shacharit_completed", JSON.stringify([...newCompleted]))
  }

  const renderSection = (section: TefilaSection, index: number, level: number = 0) => {
    const isCompleted = completedSections.has(section.heTitle)
    const hasSubsections = section.subsections && section.subsections.length > 0

    return (
      <div key={index} className={level > 0 ? "mr-6" : ""}>
        <Card className={`mb-3 border-2 transition-all hover:shadow-lg ${isCompleted ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <CardTitle className="text-xl font-['Frank_Ruhl_Libre']">{section.heTitle}</CardTitle>
                </div>
                <CardDescription className="text-sm">{section.title}</CardDescription>
                {section.description && (
                  <p className="text-sm text-muted-foreground pt-1">{section.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                {section.sefariaRef && (
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    <BookOpen className="h-3 w-3 ml-1" />
                    יש טקסט
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {(hasSubsections || section.sefariaRef) && (
            <CardContent className="space-y-2">
              {section.sefariaRef && (
                <div className="flex gap-2">
                  <Button
                    variant={isCompleted ? "secondary" : "default"}
                    className="flex-1"
                    onClick={() => toggleSection(section.heTitle)}
                  >
                    {isCompleted ? "בוטל" : "סמן כהושלם"}
                  </Button>
                  <Button variant="outline" asChild className="gap-1">
                    <Link href={`/reader?type=tefila&ref=${encodeURIComponent(section.sefariaRef)}&title=${encodeURIComponent(section.heTitle)}`}>
                      קרא
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {hasSubsections && (
                <div className="space-y-2 pt-2">
                  {section.subsections!.map((sub, idx) => renderSection(sub, idx, level + 1))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    )
  }

  const totalSections = SHACHARIT_STRUCTURE.reduce((acc, section) => {
    return acc + 1 + (section.subsections?.length || 0)
  }, 0)
  const completedCount = completedSections.size
  const progressPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-50/30 dark:via-amber-950/10 to-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/learn">
            <Button variant="ghost" className="text-white hover:bg-white/20 gap-2 -mr-2">
              <Home className="h-4 w-4" />
              חזרה למרכז הלימוד
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sun className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold font-['Frank_Ruhl_Libre']">תפילת שחרית</h1>
              <p className="text-xl opacity-90 mt-2">תפילת הבוקר - סידור מלא</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">התקדמות: {completedCount}/{totalSections}</span>
              <span className="text-sm font-bold">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold text-lg">איך להשתמש?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  לחץ על "קרא" ליד כל קטע כדי לפתוח את הטקסט המלא עם קריאה מילה-מילה.
                  סמן קטעים כהושלמו כדי לעקוב אחרי ההתקדמות שלך.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">מבנה התפילה</h2>
          {SHACHARIT_STRUCTURE.map((section, index) => renderSection(section, index))}
        </div>

        {/* Reset Button */}
        {completedCount > 0 && (
          <Card className="border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">אפס התקדמות</h3>
                  <p className="text-sm text-muted-foreground">התחל מחדש את מעקב התפילה</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCompletedSections(new Set())
                    localStorage.removeItem("shacharit_completed")
                  }}
                >
                  אפס
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
