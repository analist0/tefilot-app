"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription as _CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  Flame,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { getStatistics } from "@/lib/reader/progress-tracker"
import type { TextType } from "@/types/text-reader"

interface StatsDisplayProps {
  textType: TextType
  title: string
  totalSections: number
  sectionLabel: string // "פרקים", "דפים"
  backUrl: string
  icon?: React.ReactNode
}

export function StatsDisplay({
  textType,
  title,
  totalSections,
  sectionLabel,
  backUrl,
  icon,
}: StatsDisplayProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStatistics(textType, totalSections)
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading stats:", err)
        setLoading(false)
      })
  }, [textType, totalSections])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">טוען סטטיסטיקות...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">לא נמצאו נתונים</p>
            <Button asChild>
              <Link href={backUrl}>חזרה</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours} שעות ו-${minutes} דקות`
    }
    return `${minutes} דקות`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {icon || (
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            )}
            <h1 className="text-4xl font-bold font-serif">הסטטיסטיקות שלי</h1>
          </div>
          <p className="text-xl text-muted-foreground">{title}</p>
        </div>

        {/* Back button */}
        <div className="flex justify-start">
          <Link href={backUrl}>
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              חזרה
            </Button>
          </Link>
        </div>

        {/* Overall Progress */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              התקדמות כללית
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {stats.sectionsRead} מתוך {totalSections} {sectionLabel}
                </span>
                <span className="font-bold text-primary">{stats.completionPercentage}%</span>
              </div>
              <Progress value={stats.completionPercentage} className="h-3" />
            </div>
            {stats.estimatedTimeRemaining > 0 && (
              <p className="text-sm text-muted-foreground">
                זמן משוער להשלמה: {formatTime(stats.estimatedTimeRemaining)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Sections Read */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {sectionLabel} שנקראו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.sectionsRead}</p>
              <p className="text-xs text-muted-foreground mt-1">מתוך {totalSections}</p>
            </CardContent>
          </Card>

          {/* Verses Read */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                פסוקים נקראו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.versesRead.toLocaleString("he-IL")}</p>
              <p className="text-xs text-muted-foreground mt-1">סה״כ</p>
            </CardContent>
          </Card>

          {/* Total Time */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                זמן לימוד
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatTime(stats.totalTimeSeconds)}</p>
              <p className="text-xs text-muted-foreground mt-1">סה״כ</p>
            </CardContent>
          </Card>

          {/* Reading Speed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                מהירות קריאה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.avgSpeedWpm}</p>
              <p className="text-xs text-muted-foreground mt-1">מילים לדקה (ממוצע)</p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                רצף נוכחי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">ימים רצופים</p>
            </CardContent>
          </Card>

          {/* Longest Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                שיא אישי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.longestStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">ימים רצופים</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {stats.completionPercentage > 0 && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                הישגים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.sectionsRead >= 1 && <Badge variant="secondary">התחלה חזקה 🎯</Badge>}
                {stats.sectionsRead >= 10 && <Badge variant="secondary">10 {sectionLabel} 📚</Badge>}
                {stats.sectionsRead >= 50 && <Badge variant="secondary">50 {sectionLabel} 🌟</Badge>}
                {stats.sectionsRead >= 100 && <Badge variant="secondary">100 {sectionLabel} 💪</Badge>}
                {stats.completionPercentage >= 25 && <Badge variant="secondary">רבע דרך ✨</Badge>}
                {stats.completionPercentage >= 50 && <Badge variant="secondary">חצי דרך 🎉</Badge>}
                {stats.completionPercentage >= 75 && <Badge variant="secondary">כמעט שם! 🚀</Badge>}
                {stats.completionPercentage >= 100 && <Badge variant="default">סיימת! 🏆</Badge>}
                {stats.currentStreak >= 7 && <Badge variant="secondary">שבוע רצוף 🔥</Badge>}
                {stats.currentStreak >= 30 && <Badge variant="secondary">חודש רצוף 🔥🔥</Badge>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
