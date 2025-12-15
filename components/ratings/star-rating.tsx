"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitRating } from "@/app/actions/ratings"

interface StarRatingProps {
  articleId: string
  currentRating: number
  ratingsCount: number
}

export function StarRating({ articleId, currentRating, ratingsCount }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleRate = async (rating: number) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitRating(articleId, rating)

      if (result.success) {
        setUserRating(rating)
        setMessage("תודה על הדירוג!")
      } else {
        setMessage(result.error || "שגיאה בשליחת הדירוג")
      }
    } catch {
      setMessage("שגיאה בשליחת הדירוג")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6 border rounded-lg bg-muted/30">
      <p className="text-sm text-muted-foreground">דרג את המאמר</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting || userRating > 0}
            className={cn(
              "p-1 transition-transform hover:scale-110",
              isSubmitting && "opacity-50 cursor-not-allowed",
              userRating > 0 && "cursor-default",
            )}
            onMouseEnter={() => !userRating && setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                (hoveredStar >= star || userRating >= star) && "text-yellow-500 fill-yellow-500",
                hoveredStar < star && userRating < star && "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>

      <div className="text-center">
        {currentRating > 0 && (
          <p className="text-sm text-muted-foreground">
            ממוצע: {currentRating.toFixed(1)} ({ratingsCount} דירוגים)
          </p>
        )}
        {message && (
          <p className={cn("text-sm mt-1", message.includes("תודה") ? "text-green-600" : "text-destructive")}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
