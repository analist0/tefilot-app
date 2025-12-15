import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ChapterList } from "@/components/tehilim/chapter-list"
import { DailyRecommendation } from "@/components/tehilim/daily-recommendation"
import { HebrewDateDisplay } from "@/components/tehilim/hebrew-date-display"
import { BookOpen, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "ספר תהילים | אור הישרה",
  description: "קראו את כל 150 פרקי תהילים עם סמן רץ, סימון שמות קדושים וכוונות מיוחדות",
  keywords: ["תהילים", "ספר תהילים", "פרקי תהילים", "קריאת תהילים", "תפילה"],
}

export default function TehilimPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
        {/* Back button */}
        <Link href="/" className="inline-flex mb-6">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowRight className="h-4 w-4" />
            <span>חזרה לדף הבית</span>
          </Button>
        </Link>

        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 sm:mb-6">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-3 sm:mb-4">ספר תהילים</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            קראו את כל 150 פרקי תהילים עם סמן רץ, סימון שמות קדושים וכוונות מיוחדות
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center gap-4 flex-wrap">
            <HebrewDateDisplay />
            <Link href="/tehilim/stats">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <TrendingUp className="h-4 w-4" />
                <span>הסטטיסטיקות שלי</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Daily Recommendation */}
        <div className="max-w-lg mx-auto mb-10 sm:mb-14">
          <DailyRecommendation />
        </div>

        {/* All Chapters */}
        <ChapterList />
      </main>

      <Footer />
    </div>
  )
}
