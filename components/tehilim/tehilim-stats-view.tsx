"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BookOpen, Clock, Zap, Flame, Target, TrendingUp, Award, Calendar } from "lucide-react"
import type { TehilimStats } from "@/types"

export function TehilimStatsView() {
  const [stats, setStats] = useState<TehilimStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/tehilim/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
        setError("שגיאה בטעינת הסטטיסטיקות")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>טוען סטטיסטיקות...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12">אין סטטיסטיקות זמינות</div>
  }

  const statCards = [
    {
      title: "פרקים שנקראו",
      value: stats.total_chapters_read,
      total: 150,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "פסוקים שנקראו",
      value: stats.total_verses_read,
      total: 2461,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "זמן קריאה (דקות)",
      value: stats.total_time_minutes,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "מהירות קריאה (מילים לדקה)",
      value: Math.round(stats.average_reading_speed),
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "רצף נוכחי (ימים)",
      value: stats.current_streak,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "רצף הכי ארוך (ימים)",
      value: stats.longest_streak,
      icon: Award,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "אחוז השלמה",
      value: `${stats.completion_percentage}%`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "זמן משוער לסיום (שעות)",
      value: Math.round(stats.estimated_completion_time / 60),
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">סטטיסטיקות קריאת תהילים</h1>
        <p className="text-muted-foreground mt-2">
          נותרו {stats.chapters_remaining} פרקים ו-{stats.verses_remaining} פסוקים להשלמה
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold">
                  {card.value}
                  {card.total && <span className="text-lg text-muted-foreground">/{card.total}</span>}
                </p>
              </div>
              <div className={cn("p-3 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* גרף התקדמות */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">התקדמות כללית</h2>
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${stats.completion_percentage}%` }}
          />
          <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {stats.completion_percentage}% הושלם
          </p>
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
