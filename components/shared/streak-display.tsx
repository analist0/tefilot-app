"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  className?: string
}

export function StreakDisplay({ currentStreak, longestStreak, className }: StreakDisplayProps) {
  const isOnFire = currentStreak >= 7
  const isLegendary = currentStreak >= 30

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <motion.div
                animate={isOnFire ? { rotate: [0, -10, 10, -10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Flame
                  className={cn(
                    "h-6 w-6",
                    isLegendary
                      ? "text-purple-500"
                      : isOnFire
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  )}
                />
              </motion.div>
              <h3 className="text-sm font-medium text-muted-foreground">רצף קריאה</h3>
            </div>

            <div className="flex items-baseline gap-2">
              <motion.span
                key={currentStreak}
                initial={{ scale: 1.5, color: "#f59e0b" }}
                animate={{ scale: 1, color: "inherit" }}
                className="text-4xl font-bold"
              >
                {currentStreak}
              </motion.span>
              <span className="text-lg text-muted-foreground">ימים</span>
            </div>

            {isOnFire && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-primary"
              >
                {isLegendary ? "🔥 אתה אגדה! 🔥" : "🔥 אתה בוער! 🔥"}
              </motion.p>
            )}
          </div>

          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>שיא אישי</span>
            </div>
            <div className="text-2xl font-bold">{longestStreak}</div>

            {currentStreak > longestStreak && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
              >
                <TrendingUp className="h-3 w-3" />
                <span>שיא חדש!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Streak Calendar (last 7 days) */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayStreak = i < currentStreak
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                  dayStreak
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {dayStreak ? "✓" : i + 1}
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
