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
        "py-5 px-4 sm:px-6 rounded-2xl transition-all duration-300 mb-2",
        isActive
          ? "bg-amber-50 dark:bg-amber-950/30 shadow-sm ring-1 ring-amber-200 dark:ring-amber-800"
          : "hover:bg-muted/30",
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Verse/Line number badge */}
        <span
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center text-sm font-bold rounded-xl min-w-[2.5rem] h-9 px-2.5 transition-colors",
            isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground",
          )}
        >
          {hebrewNumber(verseNumber)}
        </span>

        {/* Verse text - word by word */}
        <p
          className="flex-1 leading-loose font-serif text-right"
          style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
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
                            "transition-all duration-200",
                            isActiveWord && "bg-primary text-primary-foreground px-1.5 py-1 rounded-lg font-semibold",
                            isPastWord && "text-muted-foreground/50",
                          )}
                        >
                          {segment.content}
                        </span>
                      )
                    })}
                    <span className="inline-block w-2"> </span>
                  </span>
                )
              }
            }

            // Regular word without holy names
            return (
              <span key={wordIdx} className="inline">
                <span
                  className={cn(
                    "transition-all duration-200 inline-block",
                    isActiveWord &&
                      "bg-primary text-primary-foreground px-2 py-1 rounded-lg font-semibold shadow-md scale-105",
                    isPastWord && "text-muted-foreground/40",
                  )}
                >
                  {word}
                </span>
                <span className="inline-block w-2"> </span>
              </span>
            )
          })}
        </p>
      </div>
    </div>
  )
}
