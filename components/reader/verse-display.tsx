"use client"

import { useRef, useEffect } from "react"
import { parseVerseForHolyNames, hebrewNumber } from "@/lib/tehilim/parse"
import { HolyName } from "@/components/tehilim/holy-name"
import { cn } from "@/lib/utils"
import type { TextType } from "@/types/text-reader"

interface VerseDisplayProps {
  verse: string
  verseNumber: number
  isActive?: boolean
  activeWordIndex?: number
  fontSize?: number
  textType: TextType
  showHolyNames?: boolean
}

export function VerseDisplay({
  verse,
  verseNumber,
  isActive,
  activeWordIndex,
  fontSize = 24,
  textType,
  showHolyNames = true,
}: VerseDisplayProps) {
  const verseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && verseRef.current) {
      verseRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isActive])

  const words = verse.split(/\s+/).filter((w) => w.trim().length > 0)

  // Only show holy names for religious texts (Tehilim, Tanakh, Tefilot)
  const shouldHighlightHolyNames =
    showHolyNames && (textType === "tehilim" || textType === "tanakh" || textType === "tefilot")

  return (
    <div
      ref={verseRef}
      className={cn(
        "py-6 px-5 sm:px-7 rounded-2xl transition-all duration-500 mb-3 group relative overflow-hidden",
        isActive
          ? "bg-gradient-to-br from-amber-50 via-amber-50/90 to-amber-100/50 dark:from-amber-950/40 dark:via-amber-950/30 dark:to-amber-900/20 shadow-xl shadow-amber-500/10 ring-2 ring-amber-300/60 dark:ring-amber-700/60 scale-[1.02] border border-amber-200/50 dark:border-amber-800/50"
          : "hover:bg-gradient-to-br hover:from-muted/60 hover:via-muted/40 hover:to-muted/20 hover:shadow-lg hover:scale-[1.01] border border-transparent hover:border-border/50",
      )}
    >
      {/* Gradient overlay for active verse */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-200/10 to-transparent dark:via-amber-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex gap-4 sm:gap-5 relative z-10">
        {/* Enhanced Verse/Line number badge */}
        <span
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center text-base font-bold rounded-xl min-w-[3rem] h-11 px-3 transition-all duration-300 shadow-sm",
            isActive
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/30 ring-offset-2 ring-offset-background scale-110"
              : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground group-hover:from-muted group-hover:to-muted/90 group-hover:text-foreground group-hover:shadow-md group-hover:scale-105",
          )}
        >
          {hebrewNumber(verseNumber)}
        </span>

        {/* Enhanced Verse text - word by word */}
        <p
          className="flex-1 leading-loose font-serif text-right"
          style={{ fontSize: `${fontSize}px`, lineHeight: 2.4 }}
        >
          {words.map((word, wordIdx) => {
            const isActiveWord = isActive && activeWordIndex === wordIdx
            const isPastWord = isActive && activeWordIndex !== undefined && wordIdx < activeWordIndex

            // Check if word contains holy name (only for religious texts)
            if (shouldHighlightHolyNames) {
              const segments = parseVerseForHolyNames(word)
              const hasHolyName = segments.some((s) => s.type === "holy-name")

              if (hasHolyName) {
                return (
                  <span key={wordIdx} className="inline">
                    {segments.map((segment, segIdx) => {
                      if (segment.type === "holy-name") {
                        return (
                          <HolyName key={segIdx} name={segment.content} kavana={segment.kavana} isActive={isActiveWord} />
                        )
                      }
                      return (
                        <span
                          key={segIdx}
                          className={cn(
                            "transition-all duration-300",
                            isActiveWord &&
                              "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-2.5 py-1.5 rounded-xl font-bold shadow-lg shadow-primary/30 scale-110 inline-block",
                            isPastWord && "text-muted-foreground/40 opacity-60",
                          )}
                        >
                          {segment.content}
                        </span>
                      )
                    })}
                    <span className="inline-block w-2.5"> </span>
                  </span>
                )
              }
            }

            // Regular word without holy names
            return (
              <span key={wordIdx} className="inline">
                <span
                  className={cn(
                    "transition-all duration-300 inline-block hover:text-primary/80 cursor-default",
                    isActiveWord &&
                      "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground px-3 py-1.5 rounded-xl font-bold shadow-2xl shadow-primary/40 scale-[1.15] ring-2 ring-primary/30 ring-offset-2 ring-offset-amber-50 dark:ring-offset-amber-950/30 animate-in zoom-in-50",
                    isPastWord && "text-muted-foreground/30 opacity-50",
                    !isActiveWord && !isPastWord && "hover:scale-105",
                  )}
                >
                  {word}
                </span>
                <span className="inline-block w-2.5"> </span>
              </span>
            )
          })}
        </p>
      </div>
    </div>
  )
}
