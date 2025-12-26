"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft, BookOpen, Loader2, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VerseDisplay } from "./verse-display"
import { ReaderControls } from "./reader-controls"
import { HebrewDateDisplay } from "@/components/tehilim/hebrew-date-display"
import { hebrewNumber } from "@/lib/tehilim/parse"
import type { TextType } from "@/types/text-reader"
import {
  startReadingSession,
  updateReadingPosition,
  completeSection,
  getLastPosition,
} from "@/lib/reader/progress-tracker"

interface GenericTextReaderProps {
  textType: TextType
  textId: string
  title: string
  verses: string[]
  verseCount: number
  section: number
  totalSections: number
  backUrl: string
  statsUrl?: string
  prevSectionUrl?: string
  nextSectionUrl?: string
  sectionLabel?: string // e.g., "פרק", "דף"
  verseLabel?: string // e.g., "פסוק", "שורה"
  showHolyNames?: boolean
}

const FONT_SIZE_KEY = "reader_font_size"
const SPEED_KEY = "reader_speed"

export function GenericTextReader({
  textType,
  textId,
  title,
  verses,
  verseCount,
  section,
  totalSections,
  backUrl,
  statsUrl,
  prevSectionUrl,
  nextSectionUrl,
  sectionLabel = "פרק",
  verseLabel = "פסוק",
  showHolyNames = true,
}: GenericTextReaderProps) {
  const [activeVerse, setActiveVerse] = useState<number>(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const [fontSize, setFontSize] = useState(22)
  const [speed, setSpeed] = useState(60)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wordCountRef = useRef<number>(0)

  useEffect(() => {
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY)
    const savedSpeed = localStorage.getItem(SPEED_KEY)

    if (savedFontSize) setFontSize(Number(savedFontSize))
    if (savedSpeed) setSpeed(Number(savedSpeed))
  }, [])

  const handleFontSizeChange = useCallback((size: number) => {
    setFontSize(size)
    localStorage.setItem(FONT_SIZE_KEY, String(size))
  }, [])

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
    localStorage.setItem(SPEED_KEY, String(newSpeed))
  }, [])

  useEffect(() => {
    setIsPlaying(false)

    getLastPosition(textType)
      .then((lastPos) => {
        if (lastPos && lastPos.textId === textId && lastPos.section === section) {
          setActiveVerse(lastPos.verse - 1)
          setActiveWordIndex(lastPos.letterIndex || 0)
        }
      })
      .catch(() => {
        // Continue even if last position fails
      })

    startReadingSession(textType, textId, section)
  }, [textType, textId, section])

  useEffect(() => {
    if (verses.length === 0) return

    const saveInterval = setInterval(() => {
      updateReadingPosition(textType, textId, section, activeVerse + 1, activeWordIndex, wordCountRef.current)
    }, 3000)

    return () => clearInterval(saveInterval)
  }, [textType, textId, section, activeVerse, activeWordIndex, verses])

  useEffect(() => {
    if (!isPlaying || verses.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const msPerWord = 60000 / speed

    intervalRef.current = setInterval(() => {
      setActiveWordIndex((prevIndex) => {
        const currentVerseText = verses[activeVerse] || ""
        const words = currentVerseText.split(/\s+/).filter((w) => w.length > 0)

        wordCountRef.current += 1

        if (prevIndex >= words.length - 1) {
          if (activeVerse < verses.length - 1) {
            setActiveVerse((v) => v + 1)
            return 0
          } else {
            setIsPlaying(false)
            completeSection(textType, textId, section, verseCount)
            return prevIndex
          }
        }

        return prevIndex + 1
      })
    }, msPerWord)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, verses, activeVerse, speed, textType, textId, section, verseCount])

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setActiveVerse(0)
    setActiveWordIndex(0)
    wordCountRef.current = 0
  }, [])

  const handleNextVerse = useCallback(() => {
    if (activeVerse < verses.length - 1) {
      setActiveVerse((v) => v + 1)
      setActiveWordIndex(0)
    }
  }, [verses, activeVerse])

  const handlePrevVerse = useCallback(() => {
    if (activeVerse > 0) {
      setActiveVerse((v) => v - 1)
      setActiveWordIndex(0)
    }
  }, [activeVerse])

  if (verses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">טוען...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-36 sm:pb-32 relative">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href={backUrl} className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground transition-all hover:gap-3">
              <ArrowRight className="h-4 w-4" />
              <span>חזרה</span>
            </Button>
          </Link>
          {statsUrl && (
            <Link href={statsUrl}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent hover:bg-primary/5 transition-all hover:gap-3 border-primary/20">
                <TrendingUp className="h-4 w-4" />
                <span>הסטטיסטיקות שלי</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 shadow-lg shadow-primary/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1">
                {verseCount} {verseLabel === "פסוק" ? "פסוקים" : "שורות"}
              </p>
            </div>
          </div>
          <HebrewDateDisplay />
        </div>

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-br from-muted/80 to-muted/40 rounded-2xl p-3 shadow-md border border-border/50 backdrop-blur-sm">
          {prevSectionUrl ? (
            <Link href={prevSectionUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-10 px-4 rounded-xl hover:bg-background/50 transition-all hover:shadow-md hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {sectionLabel} {hebrewNumber(section - 1)}
                </span>
              </Button>
            </Link>
          ) : (
            <div className="w-24" />
          )}

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-sm font-bold text-primary">
              {section}
            </span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-sm font-medium text-muted-foreground">
              {totalSections}
            </span>
          </div>

          {nextSectionUrl ? (
            <Link href={nextSectionUrl}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-10 px-4 rounded-xl hover:bg-background/50 transition-all hover:shadow-md hover:scale-105 active:scale-95"
              >
                <span className="text-sm font-medium">
                  {sectionLabel} {hebrewNumber(section + 1)}
                </span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="w-24" />
          )}
        </div>
      </div>

      {/* Enhanced verses card */}
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md ring-1 ring-border/50">
        <CardContent className="py-6 sm:py-8 px-4 sm:px-8 space-y-0">
          {verses.map((verse, index) => (
            <VerseDisplay
              key={index}
              verse={verse}
              verseNumber={index + 1}
              isActive={activeVerse === index}
              activeWordIndex={activeVerse === index ? activeWordIndex : undefined}
              fontSize={fontSize}
              textType={textType}
              showHolyNames={showHolyNames}
            />
          ))}
        </CardContent>
      </Card>

      <ReaderControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onNextVerse={handleNextVerse}
        onPrevVerse={handlePrevVerse}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        currentVerse={activeVerse + 1}
        totalVerses={verseCount}
        verseLabel={verseLabel}
      />
    </div>
  )
}
