"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: string
  progress?: {
    current: number
    total: number
    percentage: number
  }
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  progress,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden relative", className)}>
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", color)} />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br", color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <motion.div
                key={value}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold"
              >
                {value}
              </motion.div>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}

            {progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress.current} / {progress.total}
                  </span>
                  <span className="font-medium">
                    {progress.percentage}%
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
