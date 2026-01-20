"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Lock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { achievements, getAchievementProgress, type Achievement } from "@/lib/achievements"

interface AchievementsShowcaseProps {
  stats: {
    currentStreak: number
    longestStreak: number
    chaptersCompleted: number
    versesRead: number
    averageSpeed: number
    totalTimeMinutes: number
  }
  unlockedAchievements: string[]
}

export function AchievementsShowcase({ stats, unlockedAchievements }: AchievementsShowcaseProps) {
  const categories = {
    streak: { title: "רצפי קריאה", color: "from-orange-500 to-red-500" },
    chapters: { title: "פרקים", color: "from-blue-500 to-cyan-500" },
    verses: { title: "פסוקים", color: "from-purple-500 to-pink-500" },
    speed: { title: "מהירות", color: "from-yellow-500 to-orange-500" },
    special: { title: "מיוחדים", color: "from-green-500 to-emerald-500" },
  }

  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = []
    }
    acc[achievement.category].push({
      ...achievement,
      unlocked: unlockedAchievements.includes(achievement.id),
      progress: getAchievementProgress(achievement, stats),
    })
    return acc
  }, {} as Record<string, Achievement[]>)

  const unlockedCount = unlockedAchievements.length
  const totalCount = achievements.length
  const completionPercent = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">רצף נוכחי</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">ימים ברצף</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">רצף ארוך ביותר</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">ימים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">פרקים הושלמו</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chaptersCompleted}</div>
            <p className="text-xs text-muted-foreground">פרקים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">הישגים</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedCount}/{totalCount}
            </div>
            <Progress value={completionPercent} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Achievements by Category */}
      {Object.entries(categories).map(([categoryKey, category]) => {
        const categoryAchievements = achievementsByCategory[categoryKey] || []
        if (categoryAchievements.length === 0) return null

        return (
          <div key={categoryKey} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("h-1 w-12 rounded-full bg-gradient-to-r", category.color)} />
              <h3 className="text-lg font-semibold">{category.title}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      "relative overflow-hidden transition-all duration-300",
                      achievement.unlocked
                        ? "border-primary/50 shadow-lg hover:shadow-xl"
                        : "opacity-60 hover:opacity-80"
                    )}
                  >
                    {achievement.unlocked && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-5",
                          achievement.color
                        )}
                      />
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center",
                            achievement.unlocked
                              ? `bg-gradient-to-br ${achievement.color}`
                              : "bg-muted"
                          )}
                        >
                          {achievement.unlocked ? (
                            <Trophy className="h-6 w-6 text-white" />
                          ) : (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            ✓ הושג
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>

                      {!achievement.unlocked && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">התקדמות</span>
                            <span className="font-medium">{Math.round(achievement.progress || 0)}%</span>
                          </div>
                          <Progress value={achievement.progress || 0} className="h-2" />
                        </div>
                      )}

                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-muted-foreground">
                          הושג ב-{new Date(achievement.unlockedAt).toLocaleDateString("he-IL")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
