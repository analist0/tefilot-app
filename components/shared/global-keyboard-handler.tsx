"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function GlobalKeyboardHandler() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // Navigation shortcuts
      if (e.key.toLowerCase() === "g") {
        // Wait for next key
        const handleSecondKey = (e2: KeyboardEvent) => {
          e2.preventDefault()
          switch (e2.key.toLowerCase()) {
            case "h":
              router.push("/")
              break
            case "t":
              router.push("/tehilim")
              break
            case "s":
              // Trigger search dialog
              document.querySelector<HTMLButtonElement>('[aria-label="חיפוש"]')?.click()
              break
          }
          window.removeEventListener("keydown", handleSecondKey)
        }
        window.addEventListener("keydown", handleSecondKey)
        setTimeout(() => window.removeEventListener("keydown", handleSecondKey), 2000)
      }

      // Search focus
      if (e.key === "/") {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>('[aria-label="חיפוש"]')?.click()
      }

      // Dark mode toggle
      if (e.key.toLowerCase() === "d" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }

      // Share (if available on page)
      if (e.key.toLowerCase() === "s" && !e.ctrlKey && !e.metaKey) {
        const shareButton = document.querySelector<HTMLButtonElement>('[aria-label="שתף"]')
        if (shareButton) {
          e.preventDefault()
          shareButton.click()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, theme, setTheme])

  return null
}
