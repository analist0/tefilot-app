"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BookOpen, GraduationCap, Book, Sparkles, ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { TehilimStats, TalmudStats, TanakhStats, TefilotStats } from "@/types/statistics"

interface SystemStatsCardProps {
  type: 'tehilim' | 'talmud' | 'tanakh' | 'tefilot'
  stats: TehilimStats | TalmudStats | TanakhStats | TefilotStats
}

const SYSTEM_CONFIG = {
  tehilim: {
    title: "תהילים",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    link: "/tehilim",
  },
  talmud: {
    title: "תלמוד",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-500",
    link: "/talmud",
  },
  tanakh: {
    title: 'תנ"ך',
    icon: Book,
    color: "from-amber-500 to-orange-500",
    link: "/tanakh",
  },
  tefilot: {
    title: "תפילות",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500",
    link: "/tefilot",
  },
}

export function SystemStatsCard({ type, stats }: SystemStatsCardProps) {
  const config = SYSTEM_CONFIG[type]
  const Icon = config.icon

  const getMainMetrics = () => {
    if (type === 'tehilim') {
      const s = stats as TehilimStats
      return {
        completed: s.totalChaptersCompleted,
        total: 150,
        percentage: s.completionPercentage,
        label: "פרקים הושלמו",
        current: `פרק ${s.currentChapter}`,
        streak: s.currentStreak,
      }
    } else if (type === 'talmud') {
      const s = stats as TalmudStats
      return {
        completed: s.totalDapimCompleted,
        total: 2711,
        percentage: s.completionPercentage,
        label: "דפים הושלמו",
        current: s.currentMasechet ? `${s.currentMasechet} ${s.currentDaf}` : 'טרם החל',
        streak: s.currentStreak,
      }
    } else if (type === 'tanakh') {
      const s = stats as TanakhStats
      return {
        completed: s.totalChaptersCompleted,
        total: 929,
        percentage: s.completionPercentage,
        label: "פרקים הושלמו",
        current: s.currentBook ? `${s.currentBook} ${s.currentChapter}` : 'טרם החל',
        streak: s.currentStreak,
      }
    } else {
      const s = stats as TefilotStats
      return {
        completed: s.totalPrayersCompleted,
        total: 0,
        percentage: 0,
        label: "תפילות הושלמו",
        current: '',
        streak: s.dailyPrayerStreak,
      }
    }
  }

  const metrics = getMainMetrics()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={config.link}>
        <Card className="overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", config.color)} />

          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", config.color)}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{config.title}</CardTitle>
                  {metrics.current && (
                    <p className="text-sm text-muted-foreground">{metrics.current}</p>
                  )}
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Main Progress */}
            {type !== 'tefilot' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metrics.label}</span>
                  <Badge variant="secondary">
                    {metrics.completed} / {metrics.total}
                  </Badge>
                </div>
                <Progress value={metrics.percentage} className="h-3" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{metrics.percentage}% הושלם</span>
                  <span>נותרו {metrics.total - metrics.completed}</span>
                </div>
              </div>
            )}

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">{metrics.streak}</div>
                <div className="text-xs text-muted-foreground">ימים ברצף</div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {type === 'tehilim' && (stats as TehilimStats).totalVersesRead}
                  {type === 'talmud' && Math.floor((stats as TalmudStats).totalTimeMinutes / 60)}
                  {type === 'tanakh' && (stats as TanakhStats).booksCompleted.length}
                  {type === 'tefilot' && (stats as TefilotStats).totalPrayersCompleted}
                </div>
                <div className="text-xs text-muted-foreground">
                  {type === 'tehilim' && 'פסוקים'}
                  {type === 'talmud' && 'שעות'}
                  {type === 'tanakh' && 'ספרים'}
                  {type === 'tefilot' && 'תפילות'}
                </div>
              </div>
            </div>

            {/* Tanakh Sections */}
            {type === 'tanakh' && (
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground mb-2">התקדמות לפי חלקים</div>
                {Object.entries((stats as TanakhStats).sections).map(([section, data]) => (
                  <div key={section} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium capitalize">{section}</span>
                      <span>{data.percentage}%</span>
                    </div>
                    <Progress value={data.percentage} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}

            {/* Talmud Masechtot */}
            {type === 'talmud' && (stats as TalmudStats).masechtotCompleted.length > 0 && (
              <div className="pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  מסכתות שהושלמו ({(stats as TalmudStats).masechtotCompleted.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {(stats as TalmudStats).masechtotCompleted.slice(0, 3).map((masechet) => (
                    <Badge key={masechet} variant="outline" className="text-xs">
                      {masechet}
                    </Badge>
                  ))}
                  {(stats as TalmudStats).masechtotCompleted.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(stats as TalmudStats).masechtotCompleted.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
