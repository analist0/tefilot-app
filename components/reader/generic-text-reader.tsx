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
    <div className="space-y-4 sm:space-y-6 pb-36 sm:pb-32">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href={backUrl} className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowRight className="h-4 w-4" />
              <span>חזרה</span>
            </Button>
          </Link>
          {statsUrl && (
            <Link href={statsUrl}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <TrendingUp className="h-4 w-4" />
                <span>הסטטיסטיקות שלי</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif">{title}</h1>
              <p className="text-sm text-muted-foreground">
                {verseCount} {verseLabel === "פסוק" ? "פסוקים" : "שורות"}
              </p>
            </div>
          </div>
          <HebrewDateDisplay />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-xl p-2">
          {prevSectionUrl ? (
            <Link href={prevSectionUrl}>
              <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-3 rounded-lg">
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm">
                  {sectionLabel} {hebrewNumber(section - 1)}
                </span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <span className="text-sm font-medium text-muted-foreground">
            {section} / {totalSections}
          </span>

          {nextSectionUrl ? (
            <Link href={nextSectionUrl}>
              <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-3 rounded-lg">
                <span className="text-sm">
                  {sectionLabel} {hebrewNumber(section + 1)}
                </span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-4 sm:py-6 px-3 sm:px-6 space-y-0">
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
