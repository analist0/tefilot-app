import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TehilimStatsView } from "@/components/tehilim/tehilim-stats-view"

export const metadata: Metadata = {
  title: "סטטיסטיקות קריאת תהילים | אור הישרה",
  description: "מעקב אחר התקדמות קריאת התהילים - פרקים, פסוקים, זמן קריאה ועוד",
}

export default function TehilimStatsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8 px-4 max-w-6xl mx-auto">
        <TehilimStatsView />
      </main>

      <Footer />
    </div>
  )
}
