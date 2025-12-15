"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, SkipBack, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  text: string
  onProgress?: (charIndex: number) => void
  onComplete?: () => void
}

export function AudioPlayer({ text, onProgress, onComplete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    const newUtterance = new SpeechSynthesisUtterance(text)
    newUtterance.lang = "he-IL"
    newUtterance.rate = speed
    newUtterance.pitch = 1

    newUtterance.onboundary = (event) => {
      if (event.name === "word" && onProgress) {
        onProgress(event.charIndex)
      }
    }

    newUtterance.onend = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    setUtterance(newUtterance)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text, speed, onProgress, onComplete])

  const handlePlay = useCallback(() => {
    if (!utterance) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      } else {
        window.speechSynthesis.speak(utterance)
      }
      setIsPlaying(true)
    }
  }, [utterance, isPlaying])

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  const handleSpeedChange = useCallback(
    (value: number[]) => {
      const newSpeed = value[0]
      setSpeed(newSpeed)

      // If playing, restart with new speed
      if (isPlaying && utterance) {
        window.speechSynthesis.cancel()
        utterance.rate = newSpeed
        window.speechSynthesis.speak(utterance)
      }
    },
    [isPlaying, utterance],
  )

  const toggleMute = useCallback(() => {
    if (utterance) {
      utterance.volume = isMuted ? 1 : 0
    }
    setIsMuted(!isMuted)
  }, [utterance, isMuted])

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null
  }

  return (
    <div className="flex items-center gap-4 bg-card border rounded-full px-4 py-2 shadow-lg">
      <Button variant="ghost" size="icon" onClick={handleStop} className="h-8 w-8">
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button variant="default" size="icon" onClick={handlePlay} className="h-10 w-10 rounded-full">
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 mr-[-2px]" />}
      </Button>

      <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>

      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="text-xs text-muted-foreground">מהירות</span>
        <Slider value={[speed]} onValueChange={handleSpeedChange} min={0.5} max={2} step={0.1} className="w-20" />
        <span className="text-xs font-medium w-8">{speed.toFixed(1)}x</span>
      </div>
    </div>
  )
}
