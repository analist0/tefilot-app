"use client"

import { StatsDisplay } from "@/components/reader/stats-display"
import { BookOpen } from "lucide-react"
import { getAllBooks } from "@/lib/sefaria/tanakh"

export default function TanakhStatsPage() {
  const allBooks = getAllBooks()
  const totalChapters = allBooks.reduce((sum, book) => sum + book.chapters, 0)

  return (
    <StatsDisplay
      textType="tanakh"
      title="סטטיסטיקות קריאת התנ״ך"
      totalSections={totalChapters}
      sectionLabel="פרקים"
      backUrl="/tanakh"
      icon={
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
      }
    />
  )
}
