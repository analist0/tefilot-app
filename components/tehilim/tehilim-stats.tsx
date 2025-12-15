"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStatistics } from "@/lib/tehilim/progress-tracker"
import { BookOpen, Clock, Zap, Flame, TrendingUp, Target, Timer, CheckCircle2 } from "lucide-react"

interface Stats {
  chaptersRead: number
  versesRead: number
  totalTimeSeconds: number
  avgSpeedWpm: number
  currentStreak: number
  longestStreak: number
  completionPercentage: number
  estimatedTimeRemaining: number
}

export function TehilimStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const data = await getStatistics()
    setStats(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground">אין נתונים זמינים</div>
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}ש' ${minutes}ד'`
    }
    return `${minutes} דקות`
  }

  const statCards = [
    {
      title: "פרקים שנקראו",
      value: stats.chaptersRead,
      suffix: "/ 150",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "פסוקים שנקראו",
      value: stats.versesRead,
      suffix: "",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "זמן קריאה כולל",
      value: formatTime(stats.totalTimeSeconds),
      suffix: "",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "מהירות קריאה",
      value: stats.avgSpeedWpm,
      suffix: "מילים לדקה",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      title: "רצף ימים נוכחי",
      value: stats.currentStreak,
      suffix: "ימים",
      icon: Flame,
      color: "text-orange-600",
    },
    {
      title: "רצף ימים ארוך ביותר",
      value: stats.longestStreak,
      suffix: "ימים",
      icon: TrendingUp,
      color: "text-red-600",
    },
    {
      title: "אחוז השלמה",
      value: `${stats.completionPercentage}%`,
      suffix: "",
      icon: Target,
      color: "text-indigo-600",
    },
    {
      title: "זמן משוער לסיום",
      value: formatTime(stats.estimatedTimeRemaining),
      suffix: "",
      icon: Timer,
      color: "text-pink-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}{" "}
                {stat.suffix && <span className="text-sm text-muted-foreground font-normal">{stat.suffix}</span>}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
