"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronRight, ChevronLeft, BookOpen, Loader2, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { VerseDisplay } from "./verse-display"
import { ReaderControls } from "./reader-controls"
import { HebrewDateDisplay } from "./hebrew-date-display"
import { getChapter } from "@/lib/tehilim/cache"
import { hebrewNumber } from "@/lib/tehilim/parse"
import type { TehilimChapter } from "@/lib/tehilim/types"
import {
  startReadingSession,
  updateReadingPosition,
  completeChapter,
  getLastPosition,
} from "@/lib/tehilim/progress-tracker"

interface ChapterReaderProps {
  chapter: number
}

const FONT_SIZE_KEY = "tehilim_font_size"
const SPEED_KEY = "tehilim_speed"

export function ChapterReader({ chapter }: ChapterReaderProps) {
  const [data, setData] = useState<TehilimChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    setLoading(true)
    setError(null)
    setIsPlaying(false)

    const loadTimeout = setTimeout(() => {
      setError("הטעינה לוקחת יותר מדי זמן. אנא נסה שוב.")
      setLoading(false)
    }, 15000)

    getChapter(chapter)
      .then((chapterData) => {
        clearTimeout(loadTimeout)
        setData(chapterData)
        setLoading(false)

        getLastPosition()
          .then((lastPos) => {
            if (lastPos && lastPos.chapter === chapter) {
              setActiveVerse(lastPos.verse - 1)
              setActiveWordIndex(lastPos.letterIndex || 0)
            }
          })
          .catch(() => {
            // ממשיך גם אם המיקום האחרון נכשל
          })

        // התחלת סשן קריאה
        startReadingSession(chapter)
      })
      .catch((err) => {
        clearTimeout(loadTimeout)
        setError(err.message || "שגיאה בטעינת הפרק")
        setLoading(false)
      })

    return () => clearTimeout(loadTimeout)
  }, [chapter])

  useEffect(() => {
    if (!data) return

    const saveInterval = setInterval(() => {
      updateReadingPosition(chapter, activeVerse + 1, activeWordIndex, wordCountRef.current)
    }, 3000)

    return () => clearInterval(saveInterval)
  }, [chapter, activeVerse, activeWordIndex, data])

  useEffect(() => {
    if (!isPlaying || !data) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const msPerWord = 60000 / speed

    intervalRef.current = setInterval(() => {
      setActiveWordIndex((prevIndex) => {
        const currentVerseText = data.verses[activeVerse] || ""
        const words = currentVerseText.split(/\s+/).filter((w) => w.length > 0)

        wordCountRef.current += 1

        if (prevIndex >= words.length - 1) {
          if (activeVerse < data.verses.length - 1) {
            setActiveVerse((v) => v + 1)
            return 0
          } else {
            setIsPlaying(false)
            completeChapter(chapter, data.verseCount)
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
  }, [isPlaying, data, activeVerse, speed, chapter])

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
    if (!data) return
    if (activeVerse < data.verses.length - 1) {
      setActiveVerse((v) => v + 1)
      setActiveWordIndex(0)
    }
  }, [data, activeVerse])

  const handlePrevVerse = useCallback(() => {
    if (activeVerse > 0) {
      setActiveVerse((v) => v - 1)
      setActiveWordIndex(0)
    }
  }, [activeVerse])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">טוען את הפרק...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8 text-center">
          <p className="text-destructive mb-4">שגיאה בטעינת הפרק: {error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4 sm:space-y-6 pb-36 sm:pb-32">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href="/tehilim" className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowRight className="h-4 w-4" />
              <span>חזרה לכל הפרקים</span>
            </Button>
          </Link>
          <Link href="/tehilim/stats">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <TrendingUp className="h-4 w-4" />
              <span>הסטטיסטיקות שלי</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif">
                תהילים פרק {hebrewNumber(chapter)}
              </h1>
              <p className="text-sm text-muted-foreground">{data.verseCount} פסוקים</p>
            </div>
          </div>
          <HebrewDateDisplay />
        </div>

        <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-xl p-2">
          {chapter > 1 ? (
            <Link href={`/tehilim/${chapter - 1}`}>
              <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-3 rounded-lg">
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm">פרק {hebrewNumber(chapter - 1)}</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <span className="text-sm font-medium text-muted-foreground">{chapter} / 150</span>

          {chapter < 150 ? (
            <Link href={`/tehilim/${chapter + 1}`}>
              <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-3 rounded-lg">
                <span className="text-sm">פרק {hebrewNumber(chapter + 1)}</span>
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
          {data.verses.map((verse, index) => (
            <VerseDisplay
              key={index}
              verse={verse}
              verseNumber={index + 1}
              isActive={activeVerse === index}
              activeWordIndex={activeVerse === index ? activeWordIndex : undefined}
              fontSize={fontSize}
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
        totalVerses={data.verseCount}
      />
    </div>
  )
}
