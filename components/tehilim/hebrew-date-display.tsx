"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCachedHebrewDate } from "@/lib/tehilim/cache"
import type { HebrewDate } from "@/lib/tehilim/types"

export function HebrewDateDisplay() {
  const [hebrewDate, setHebrewDate] = useState<HebrewDate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCachedHebrewDate()
      .then(setHebrewDate)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Badge variant="outline" className="animate-pulse h-7 w-32">
        <Calendar className="h-3 w-3 ml-1" />
        <span className="text-transparent">טוען...</span>
      </Badge>
    )
  }

  if (!hebrewDate) return null

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm justify-center sm:justify-start">
      <Badge variant="outline" className="gap-1.5 font-normal px-3 py-1">
        <Calendar className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{hebrewDate.hebrew}</span>
      </Badge>

      {hebrewDate.parasha && (
        <Badge variant="secondary" className="font-normal px-3 py-1">
          פרשת {hebrewDate.parasha}
        </Badge>
      )}
    </div>
  )
}
