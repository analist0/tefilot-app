"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Achievement } from "@/lib/achievements"

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Trigger confetti
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    // Auto close after 5 seconds
    const timeout = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onClose])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] max-w-md"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-xl",
              "bg-gradient-to-br",
              achievement.color
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />

            <div className="relative p-6 text-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute top-2 left-2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-8 w-8" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                    הישג חדש! 🎉
                  </div>
                  <h3 className="text-xl font-bold">{achievement.title}</h3>
                  <p className="text-sm opacity-90">{achievement.description}</p>
                </div>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 origin-right"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
