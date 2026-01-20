"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Home, TreeDeciduous, Star, TrendingUp, Info, Sparkles } from "lucide-react"
import {
  ETZ_CHAIM_GATES,
  ETZ_CHAIM_SPECIAL_TOPICS,
  ETZ_CHAIM_DAILY_RECOMMENDATIONS,
  TOTAL_ETZ_CHAIM_GATES,
  TOTAL_ETZ_CHAIM_CHAPTERS,
  calculateEtzChaimDailyPosition,
  type EtzChaimGate
} from "@/lib/sefaria/etz-chaim"

export default function EtzChaimPage() {
  const [dailyPosition, setDailyPosition] = useState<ReturnType<typeof calculateEtzChaimDailyPosition> | null>(null)

  useEffect(() => {
    setDailyPosition(calculateEtzChaimDailyPosition())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-emerald-50/20 dark:via-emerald-950/10 to-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white py-16 px-4">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
              <TreeDeciduous className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">כתבי האר&quot;י הקדוש</span>
            </div>

            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm">
                <TreeDeciduous className="h-20 w-20" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-['Frank_Ruhl_Libre']">
              עץ חיים
            </h1>

            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              תורת הקבלה של האר&quot;י הקדוש - לימוד שיטתי בשערי הקבלה
            </p>

            <div className="flex justify-center gap-4 text-sm opacity-80">
              <span>🚪 {TOTAL_ETZ_CHAIM_GATES} שערים</span>
              <span>•</span>
              <span>📖 {TOTAL_ETZ_CHAIM_CHAPTERS} פרקים</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Daily Position Highlight */}
        {dailyPosition && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">הלימוד היומי</h2>
                <p className="text-muted-foreground">יום {dailyPosition.dayInCycle} במחזור</p>
              </div>
            </div>

            <Card className="border-2 border-primary shadow-2xl overflow-hidden group hover:shadow-3xl transition-all">
              <div className="bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/10 p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <Badge className="text-base px-4 py-2 bg-primary">
                      <Calendar className="h-4 w-4 ml-2" />
                      היום - {new Date().toLocaleDateString("he-IL")}
                    </Badge>
                    <h3 className="text-4xl md:text-5xl font-bold font-['Frank_Ruhl_Libre']">
                      {dailyPosition.currentGate.heTitle}
                    </h3>
                    <p className="text-2xl font-medium text-primary">
                      פרק {dailyPosition.currentChapter}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      {dailyPosition.currentGate.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>התקדמות בשער</span>
                      <span>{dailyPosition.gateProgress}%</span>
                    </div>
                    <Progress value={dailyPosition.gateProgress} className="h-3" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="gap-2 text-xl h-16 px-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-lg"
                      asChild
                    >
                      <Link href={`/etz-chaim/${dailyPosition.currentGate.number}/${dailyPosition.currentChapter}`}>
                        <BookOpen className="h-7 w-7" />
                        התחל לימוד יומי
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 text-lg h-16 px-8" asChild>
                      <Link href="/etz-chaim/stats">
                        <Star className="h-5 w-5" />
                        הסטטיסטיקות שלי
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* About Etz Chaim */}
        <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 dark:from-emerald-950/20 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h3 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">על ספר עץ חיים</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ספר עץ חיים הוא הספר המרכזי של תורת הקבלה של האר&quot;י הקדוש (רבי יצחק לוריא).
                  הספר נכתב על ידי תלמידו הגדול רבי חיים ויטאל, ומכיל את יסודות הקבלה הלוריאנית.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  הספר מחולק ל-<strong>{TOTAL_ETZ_CHAIM_GATES} שערים</strong> העוסקים בסודות הבריאה, העולמות העליונים, הפרצופים והתיקונים.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {TOTAL_ETZ_CHAIM_GATES} שערים
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    {TOTAL_ETZ_CHAIM_CHAPTERS} פרקים
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Learning Recommendations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">מסלולי לימוד</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(ETZ_CHAIM_DAILY_RECOMMENDATIONS).map(([key, rec]) => (
              <Card key={key} className="hover:border-emerald-500/50 transition-all">
                <CardHeader>
                  <CardTitle className="font-['Frank_Ruhl_Libre']">
                    {key === 'beginner' && 'מתחילים'}
                    {key === 'intermediate' && 'בינוני'}
                    {key === 'advanced' && 'מתקדמים'}
                  </CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {rec.chapters}
                    </span>
                    <span className="text-muted-foreground">פרקים ליום</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    סיום מלא תוך {rec.completionDays} ימים
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Gates List */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">שערי עץ חיים</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ETZ_CHAIM_GATES.map((gate: EtzChaimGate) => (
              <Card key={gate.number} className="group hover:shadow-xl transition-all hover:border-emerald-500/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="shrink-0">
                          שער {gate.number}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-['Frank_Ruhl_Libre']">
                        {gate.heTitle}
                      </CardTitle>
                      <CardDescription className="mt-1">{gate.title}</CardDescription>
                      {gate.description && (
                        <p className="text-sm text-muted-foreground mt-2">{gate.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {gate.chapters} פרקים
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full gap-2">
                    <Link href={`/etz-chaim/${gate.number}/1`}>
                      <BookOpen className="h-4 w-4" />
                      התחל לימוד
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Special Topics */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">נושאים מיוחדים</h2>
          <div className="grid gap-4">
            {ETZ_CHAIM_SPECIAL_TOPICS.map((topic, index) => (
              <Card key={index} className="border-2 border-purple-500/20 hover:border-purple-500/50 transition-all group">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-['Frank_Ruhl_Libre']">
                        {topic.heName}
                      </CardTitle>
                      <CardDescription className="mt-1">{topic.name}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">{topic.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {topic.gates.map(gateNum => {
                          const gate = ETZ_CHAIM_GATES.find(g => g.number === gateNum)
                          return gate ? (
                            <Badge key={gateNum} variant="outline" className="text-xs">
                              {gate.heTitle}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Preview */}
        <Card className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="font-['Frank_Ruhl_Libre']">סטטיסטיקות לימוד</CardTitle>
                <CardDescription>עקוב אחרי ההתקדמות שלך בלימוד עץ חיים</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">פרקים שנלמדו</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">זמן לימוד (דקות)</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">0</p>
                <p className="text-sm text-muted-foreground mt-1">רצף ימים</p>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full gap-2">
                <Link href="/etz-chaim/stats">
                  <TrendingUp className="h-4 w-4" />
                  צפה בסטטיסטיקות המלאות
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
