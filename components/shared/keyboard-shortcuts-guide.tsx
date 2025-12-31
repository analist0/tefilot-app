"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  Search,
  Home,
  BookOpen,
  Moon,
  Sun,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Play,
  Pause,
  Plus,
  Minus,
  RefreshCw,
  Keyboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Shortcut {
  key: string
  description: string
  icon?: React.ReactNode
  category: "navigation" | "reader" | "general"
}

const shortcuts: Shortcut[] = [
  // Navigation
  { key: "G H", description: "עבור לדף הבית", icon: <Home className="h-4 w-4" />, category: "navigation" },
  { key: "G T", description: "עבור לתהילים", icon: <BookOpen className="h-4 w-4" />, category: "navigation" },
  { key: "G S", description: "פתח חיפוש", icon: <Search className="h-4 w-4" />, category: "navigation" },
  { key: "/", description: "התמקד בחיפוש", icon: <Search className="h-4 w-4" />, category: "navigation" },

  // Reader Controls
  { key: "Space", description: "השהה/הפעל קריאה", icon: <Play className="h-4 w-4" />, category: "reader" },
  { key: "→", description: "פסוק הבא", icon: <ArrowLeft className="h-4 w-4" />, category: "reader" },
  { key: "←", description: "פסוק קודם", icon: <ArrowRight className="h-4 w-4" />, category: "reader" },
  { key: "↑", description: "גלילה למעלה", icon: <ArrowUp className="h-4 w-4" />, category: "reader" },
  { key: "↓", description: "גלילה למטה", icon: <ArrowDown className="h-4 w-4" />, category: "reader" },
  { key: "+", description: "הגדל גופן", icon: <Plus className="h-4 w-4" />, category: "reader" },
  { key: "-", description: "הקטן גופן", icon: <Minus className="h-4 w-4" />, category: "reader" },
  { key: "R", description: "אפס קריאה", icon: <RefreshCw className="h-4 w-4" />, category: "reader" },

  // General
  { key: "D", description: "החלף ערכת נושא", icon: <Moon className="h-4 w-4" />, category: "general" },
  { key: "S", description: "שתף", icon: <Share2 className="h-4 w-4" />, category: "general" },
  { key: "B", description: "הוסף סימנייה", icon: <Bookmark className="h-4 w-4" />, category: "general" },
  { key: "?", description: "הצג קיצורי מקלדת", icon: <Keyboard className="h-4 w-4" />, category: "general" },
  { key: "Esc", description: "סגור חלונות", category: "general" },
]

const categories = {
  navigation: { title: "ניווט", color: "from-blue-500 to-cyan-500" },
  reader: { title: "קורא טקסטים", color: "from-purple-500 to-pink-500" },
  general: { title: "כללי", color: "from-amber-500 to-orange-500" },
}

export function KeyboardShortcutsGuide() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open guide with "?" or "Ctrl+/"
      if (e.key === "?" || (e.ctrlKey && e.key === "/")) {
        e.preventDefault()
        setOpen(true)
      }

      // Close guide with "Esc"
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Keyboard className="h-5 w-5 text-white" />
            </div>
            קיצורי מקלדת
          </DialogTitle>
          <DialogDescription>
            השתמש בקיצורי מקלדת אלה כדי לנווט באתר בצורה מהירה ויעילה יותר
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {(Object.entries(categories) as [keyof typeof categories, typeof categories[keyof typeof categories]][]).map(
            ([categoryKey, category]) => {
              const categoryShortcuts = shortcuts.filter((s) => s.category === categoryKey)

              return (
                <div key={categoryKey} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-1 w-12 rounded-full bg-gradient-to-r", category.color)} />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>

                  <div className="grid gap-3">
                    {categoryShortcuts.map((shortcut, index) => (
                      <motion.div
                        key={shortcut.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {shortcut.icon && (
                            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              {shortcut.icon}
                            </div>
                          )}
                          <span className="text-sm font-medium">{shortcut.description}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {shortcut.key.split(" ").map((key, i) => (
                            <div key={i} className="flex items-center gap-1">
                              {i > 0 && <span className="text-xs text-muted-foreground mx-1">+</span>}
                              <kbd className="px-2.5 py-1.5 text-xs font-semibold text-foreground bg-background border border-border rounded-md shadow-sm">
                                {key}
                              </kbd>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            }
          )}
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>טיפ:</strong> לחץ על <kbd className="px-2 py-1 text-xs bg-background border rounded">?</kbd> או{" "}
            <kbd className="px-2 py-1 text-xs bg-background border rounded">Ctrl</kbd> +{" "}
            <kbd className="px-2 py-1 text-xs bg-background border rounded">/</kbd> בכל עת כדי לפתוח מדריך זה
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
