"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Calendar, Home, Flame, Star, TrendingUp, Info } from "lucide-react"
import { calculateZoharDailyPages, ZOHAR_STRUCTURE, ZOHAR_DAILY_RECOMMENDATIONS, ZOHAR_CYCLE_DAYS, TOTAL_ZOHAR_DAPIM } from "@/lib/sefaria/zohar"

export default function ZoharPage() {
  const [dailyZohar, setDailyZohar] = useState<ReturnType<typeof calculateZoharDailyPages> | null>(null)

  useEffect(() => {
    setDailyZohar(calculateZoharDailyPages())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/20 dark:via-cyan-950/10 to-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white py-16 px-4">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-6xl mx-auto space-y-6">
          <Link href="/learn">
            <Button variant="ghost" className="text-white hover:bg-white/20 gap-2 -mr-2">
              <Home className="h-4 w-4" />
              חזרה למרכז הלימוד
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">ספר הזוהר הקדוש</span>
            </div>

            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm">
                <Sparkles className="h-20 w-20" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-['Frank_Ruhl_Libre']">
              זוהר הקדוש
            </h1>

            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              לימוד יומי בספר הזוהר - 5 דפים ליום
            </p>

            <div className="flex justify-center gap-4 text-sm opacity-80">
              <span>📖 {TOTAL_ZOHAR_DAPIM.toLocaleString()} דפים</span>
              <span>•</span>
              <span>📅 מחזור של {ZOHAR_CYCLE_DAYS} ימים</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Daily Zohar Highlight */}
        {dailyZohar && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">הזוהר היומי</h2>
                <p className="text-muted-foreground">יום {dailyZohar.dayInCycle} במחזור</p>
              </div>
            </div>

            <Card className="border-2 border-primary shadow-2xl overflow-hidden group hover:shadow-3xl transition-all">
              <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/10 p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <Badge className="text-base px-4 py-2 bg-primary">
                      <Calendar className="h-4 w-4 ml-2" />
                      היום - {new Date().toLocaleDateString("he-IL")}
                    </Badge>
                    <h3 className="text-4xl md:text-5xl font-bold font-['Frank_Ruhl_Libre']">
                      {dailyZohar.hebrewSection}
                    </h3>
                    <p className="text-2xl font-medium text-primary">
                      דפים {dailyZohar.startPage}-{dailyZohar.endPage}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      {dailyZohar.currentSection}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2 text-xl h-16 px-12 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 shadow-lg">
                      <Flame className="h-7 w-7" />
                      התחל לימוד יומי
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 text-lg h-16 px-8">
                      <Star className="h-5 w-5" />
                      קטעים מיוחדים
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* About Zohar */}
        <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-50/50 dark:from-cyan-950/20 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">על ספר הזוהר</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ספר הזוהר הוא הספר המרכזי של הקבלה, שנכתב על ידי רבי שמעון בר יוחאי.
                  הוא מגלה את סודות התורה, סודות הבריאה והעולמות העליונים.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  הלימוד היומי המומלץ הוא <strong>5 דפי זוהר ליום</strong>, שמשלימים את כל הזוהר תוך כ-{ZOHAR_CYCLE_DAYS} ימים (כ-8 חודשים).
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {TOTAL_ZOHAR_DAPIM} דפים
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    מחזור {ZOHAR_CYCLE_DAYS} ימים
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Flame className="h-3 w-3" />
                    5 דפים ליום
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zohar Sections */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">חלקי הזוהר</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ZOHAR_STRUCTURE.map((section, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all hover:border-cyan-500/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-['Frank_Ruhl_Libre']">
                        {section.heTitle}
                      </CardTitle>
                      <CardDescription className="mt-1">{section.title}</CardDescription>
                      {section.description && (
                        <p className="text-sm text-muted-foreground mt-2">{section.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {section.dafim} דפים
                    </Badge>
                  </div>
                </CardHeader>
                {section.subsections && (
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">פרשות:</p>
                      <div className="flex flex-wrap gap-2">
                        {section.subsections.slice(0, 6).map((sub, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {sub.heTitle}
                          </Badge>
                        ))}
                        {section.subsections.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{section.subsections.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Special Sections */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">קטעים מיוחדים</h2>
          <div className="grid gap-4">
            {ZOHAR_DAILY_RECOMMENDATIONS.special.sections.map((section, index) => (
              <Card key={index} className="border-2 border-purple-500/20 hover:border-purple-500/50 transition-all group">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-['Frank_Ruhl_Libre']">
                        {section.heName}
                      </CardTitle>
                      <CardDescription className="mt-1">{section.name}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">{section.description}</p>
                      {section.sefariaRef && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {section.sefariaRef}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Preview */}
        <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="font-['Frank_Ruhl_Libre']">סטטיסטיקות לימוד</CardTitle>
                <CardDescription>עקוב אחרי ההתקדמות שלך בלימוד הזוהר</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">דפים שנקראו</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">זמן לימוד (דקות)</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">רצף ימים</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
