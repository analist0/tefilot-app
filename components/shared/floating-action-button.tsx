"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Share2, Bookmark, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FABProps {
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}

export function FloatingActionButton({ onShare, onBookmark, className }: FABProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const actions = [
    { icon: ArrowUp, label: "חזרה למעלה", onClick: scrollToTop, color: "from-primary to-purple-600" },
    ...(onShare ? [{ icon: Share2, label: "שתף", onClick: onShare, color: "from-blue-500 to-cyan-500" }] : []),
    ...(onBookmark ? [{ icon: Bookmark, label: "סימניה", onClick: onBookmark, color: "from-amber-500 to-orange-500" }] : []),
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={cn("fixed bottom-6 left-6 z-50", className)}
          dir="ltr"
        >
          {/* Expanded Actions */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 left-0 flex flex-col gap-3"
              >
                {actions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      size="icon"
                      onClick={() => {
                        action.onClick()
                        setIsExpanded(false)
                      }}
                      className={cn(
                        "h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-br text-white group relative",
                        action.color
                      )}
                    >
                      <action.icon className="h-5 w-5" />

                      {/* Tooltip */}
                      <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {action.label}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            <Button
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl transition-all bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
