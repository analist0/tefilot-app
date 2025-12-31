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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-background/95 border-t border-border/50 shadow-2xl backdrop-blur-xl">
      {/* Enhanced Progress bar */}
      <div className="h-1.5 bg-gradient-to-r from-muted/50 via-muted to-muted/50 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-500 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-3.5">
        {/* Enhanced Controls */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Font size controls with label */}
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-xl p-1.5 border border-border/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFontSizeChange(Math.max(18, fontSize - 2))}
              className="h-9 w-9 rounded-lg hover:bg-background hover:shadow-md transition-all hover:scale-110 active:scale-95"
              disabled={fontSize <= 18}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="px-2 text-xs font-medium text-muted-foreground min-w-[2rem] text-center">
              {fontSize}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFontSizeChange(Math.min(40, fontSize + 2))}
              className="h-9 w-9 rounded-lg hover:bg-background hover:shadow-md transition-all hover:scale-110 active:scale-95"
              disabled={fontSize >= 40}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Main playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevVerse}
              className="h-11 w-11 rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all hover:scale-110 active:scale-95 border-border/50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={onPlayPause}
              className={cn(
                "h-14 w-14 rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 relative overflow-hidden",
                isPlaying
                  ? "bg-gradient-to-br from-primary via-primary to-primary/90 shadow-primary/40 ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                  : "bg-gradient-to-br from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/50",
              )}
            >
              {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              )}
              {isPlaying ? (
                <Pause className="h-6 w-6 relative z-10" />
              ) : (
                <Play className="h-6 w-6 mr-[-2px] relative z-10" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onNextVerse}
              className="h-11 w-11 rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all hover:scale-110 active:scale-95 border-border/50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all hover:scale-110 active:scale-95 border-border/50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Enhanced Speed control */}
          <div className="flex items-center gap-2.5 bg-muted/50 rounded-xl px-3 py-2 border border-border/30">
            <Slider
              value={[speed]}
              onValueChange={(v) => onSpeedChange(v[0])}
              min={20}
              max={150}
              step={5}
              className="w-20 sm:w-24"
            />
            <div className="flex flex-col items-center min-w-[2.5rem]">
              <span className="text-xs font-bold text-primary">{speed}</span>
              <span className="text-[10px] text-muted-foreground">WPM</span>
            </div>
          </div>
        </div>

        {/* Enhanced Progress info */}
        <div className="flex items-center justify-center mt-2.5 gap-2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-medium text-muted-foreground">{verseLabel}</span>
            <span className="text-sm font-bold text-primary">{currentVerse}</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground">{totalVerses}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/30">
            <span className="text-xs font-medium text-muted-foreground">{progressPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
