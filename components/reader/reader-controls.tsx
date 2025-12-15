"use client"

import { Play, Pause, RotateCcw, Plus, Minus, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ReaderControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onReset: () => void
  onNextVerse: () => void
  onPrevVerse: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  fontSize: number
  onFontSizeChange: (size: number) => void
  currentVerse: number
  totalVerses: number
  verseLabel?: string // e.g., "פסוק" for verses, "שורה" for lines
}

export function ReaderControls({
  isPlaying,
  onPlayPause,
  onReset,
  onNextVerse,
  onPrevVerse,
  speed,
  onSpeedChange,
  fontSize,
  onFontSizeChange,
  currentVerse,
  totalVerses,
  verseLabel = "פסוק",
}: ReaderControlsProps) {
  const progressPercent = Math.round((currentVerse / totalVerses) * 100)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="container max-w-2xl mx-auto px-3 py-2.5">
        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Font size controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFontSizeChange(Math.max(18, fontSize - 2))}
              className="h-8 w-8 rounded-lg"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFontSizeChange(Math.min(40, fontSize + 2))}
              className="h-8 w-8 rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Main playback controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onPrevVerse} className="h-9 w-9 rounded-lg">
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={onPlayPause}
              className={cn("h-11 w-11 rounded-xl shadow-md", isPlaying && "bg-primary")}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 mr-[-1px]" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={onNextVerse} className="h-9 w-9 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 rounded-lg">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2">
            <Slider
              value={[speed]}
              onValueChange={(v) => onSpeedChange(v[0])}
              min={20}
              max={150}
              step={5}
              className="w-16"
            />
            <span className="text-xs text-muted-foreground w-6">{speed}</span>
          </div>
        </div>

        {/* Progress info */}
        <div className="flex items-center justify-center mt-1.5 text-[11px] text-muted-foreground">
          {verseLabel} {currentVerse} מתוך {totalVerses}
        </div>
      </div>
    </div>
  )
}
