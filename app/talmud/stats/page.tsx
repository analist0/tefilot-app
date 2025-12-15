"use client"

import { StatsDisplay } from "@/components/reader/stats-display"
import { BookOpen } from "lucide-react"
import { TALMUD_TRACTATES } from "@/lib/sefaria/talmud"

export default function TalmudStatsPage() {
  const totalDapim = TALMUD_TRACTATES.reduce((sum, tractate) => sum + tractate.pages * 2, 0)

  return (
    <StatsDisplay
      textType="talmud"
      title="סטטיסטיקות לימוד הגמרא"
      totalSections={totalDapim}
      sectionLabel="דפים"
      backUrl="/talmud"
      icon={
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
      }
    />
  )
}
