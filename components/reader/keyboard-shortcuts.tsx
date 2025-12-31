"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface KeyboardShortcutsProps {
  onPlayPause: () => void
  onNextVerse: () => void
  onPrevVerse: () => void
  onNextSection?: () => void
  onPrevSection?: () => void
  onReset: () => void
  onFontIncrease: () => void
  onFontDecrease: () => void
  onSpeedIncrease: () => void
  onSpeedDecrease: () => void
  isPlaying: boolean
}

export function KeyboardShortcuts({
  onPlayPause,
  onNextVerse,
  onPrevVerse,
  onNextSection,
  onPrevSection,
  onReset,
  onFontIncrease,
  onFontDecrease,
  onSpeedIncrease,
  onSpeedDecrease,
  isPlaying,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        // Play/Pause
        case " ":
        case "k":
          e.preventDefault()
          onPlayPause()
          toast.success(isPlaying ? "הקריאה הושהתה" : "הקריאה התחילה", {
            duration: 1000,
            icon: isPlaying ? "⏸️" : "▶️",
          })
          break

        // Next verse
        case "arrowright":
        case "l":
          e.preventDefault()
          onNextVerse()
          toast.success("פסוק הבא", { duration: 800, icon: "⬅️" })
          break

        // Previous verse
        case "arrowleft":
        case "j":
          e.preventDefault()
          onPrevVerse()
          toast.success("פסוק קודם", { duration: 800, icon: "➡️" })
          break

        // Next section (chapter/daf)
        case "n":
          if (onNextSection) {
            e.preventDefault()
            onNextSection()
            toast.success("עובר לפרק/דף הבא", { duration: 1500, icon: "⏭️" })
          }
          break

        // Previous section
        case "p":
          if (onPrevSection) {
            e.preventDefault()
            onPrevSection()
            toast.success("חוזר לפרק/דף הקודם", { duration: 1500, icon: "⏮️" })
          }
          break

        // Reset
        case "r":
          e.preventDefault()
          onReset()
          toast.success("איפוס הקריאה", { duration: 1000, icon: "🔄" })
          break

        // Font size
        case "+":
        case "=":
          e.preventDefault()
          onFontIncrease()
          toast.success("הגדלת גופן", { duration: 800, icon: "🔠" })
          break

        case "-":
        case "_":
          e.preventDefault()
          onFontDecrease()
          toast.success("הקטנת גופן", { duration: 800, icon: "🔡" })
          break

        // Speed
        case "arrowup":
          e.preventDefault()
          onSpeedIncrease()
          toast.success("הגברת מהירות", { duration: 800, icon: "⚡" })
          break

        case "arrowdown":
          e.preventDefault()
          onSpeedDecrease()
          toast.success("הפחתת מהירות", { duration: 800, icon: "🐢" })
          break

        // Help
        case "?":
        case "h":
          e.preventDefault()
          showHelpToast()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [
    isPlaying,
    onPlayPause,
    onNextVerse,
    onPrevVerse,
    onNextSection,
    onPrevSection,
    onReset,
    onFontIncrease,
    onFontDecrease,
    onSpeedIncrease,
    onSpeedDecrease,
  ])

  return null
}

function showHelpToast() {
  toast.info(
    <div className="space-y-2 text-right" dir="rtl">
      <h3 className="font-bold text-lg mb-3">⌨️ קיצורי מקלדת</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">הפעל/השהה</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">רווח / K</kbd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">פסוק הבא/קודם</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">← / →</kbd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">פרק הבא/קודם</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">N / P</kbd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">מהירות</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↑ / ↓</kbd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">גופן</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">+ / -</kbd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">איפוס</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">R</kbd>
        </div>
      </div>
    </div>,
    {
      duration: 8000,
      closeButton: true,
    }
  )
}
