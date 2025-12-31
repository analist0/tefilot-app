"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen, Clock, Zap, TrendingUp, Award, Target, Calendar } from "lucide-react"
import { TOTAL_ZOHAR_DAPIM, ZOHAR_STRUCTURE } from "@/lib/sefaria/zohar"

export default function ZoharStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement stats loading from Supabase
    setStats({
      completedPages: 0,
      totalPages: TOTAL_ZOHAR_DAPIM,
      completionPercentage: 0,
      totalTimeMinutes: 0,
      averageSpeed: 0,
      currentStreak: 0,
      longestStreak: 0,
      pagesRead: 0
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/20 dark:via-cyan-950/10 to-background flex items-center justify-center" dir="rtl">
        <p className="text-lg text-muted-foreground">טוען סטטיסטיקות...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/20 dark:via-cyan-950/10 to-background py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/zohar">
            <Button variant="ghost" className="gap-2 -mr-2">
              <ArrowRight className="h-4 w-4" />
              חזרה לזוהר
            </Button>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h1 className="text-4xl font-bold font-['Frank_Ruhl_Libre']">סטטיסטיקות לימוד הזוהר</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              עקוב אחרי ההתקדמות שלך בלימוד ספר הזוהר הקדוש
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              התקדמות כללית
            </CardTitle>
            <CardDescription>
              קראת {stats?.completedPages || 0} דפים מתוך {TOTAL_ZOHAR_DAPIM}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>אחוז השלמה</span>
                <span className="font-bold text-primary">{stats?.completionPercentage || 0}%</span>
              </div>
              <Progress value={stats?.completionPercentage || 0} className="h-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats?.completedPages || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">דפים הושלמו</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.pagesRead || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">דפים נקראו</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {TOTAL_ZOHAR_DAPIM - (stats?.completedPages || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">דפים נותרו</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats?.completionPercentage || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">אחוז השלמה</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-600" />
                זמן לימוד
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {stats?.totalTimeMinutes || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">דקות סה&quot;כ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                מהירות קריאה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.averageSpeed || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">מילים לדקה</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" />
                רצף נוכחי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.currentStreak || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">ימים</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pink-600" />
                רצף הכי ארוך
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                {stats?.longestStreak || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">ימים</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border-2">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">
                המשך את הלימוד
              </h3>
              <p className="text-muted-foreground">
                חזור ללימוד הזוהר והמשך את המסע הרוחני שלך
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/zohar">
                  <BookOpen className="h-5 w-5" />
                  חזרה לזוהר
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
