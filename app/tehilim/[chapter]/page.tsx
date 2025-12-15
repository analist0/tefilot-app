import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ChapterReader } from "@/components/tehilim/chapter-reader"
import { hebrewNumber } from "@/lib/tehilim/parse"

interface PageProps {
  params: Promise<{ chapter: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: chapterStr } = await params
  const chapter = Number.parseInt(chapterStr)

  if (isNaN(chapter) || chapter < 1 || chapter > 150) {
    return { title: "פרק לא נמצא | אור הישרה" }
  }

  return {
    title: `תהילים פרק ${hebrewNumber(chapter)} | אור הישרה`,
    description: `קראו את תהילים פרק ${chapter} (${hebrewNumber(chapter)}) עם סמן רץ וסימון שמות קדושים`,
    keywords: ["תהילים", `פרק ${chapter}`, `תהילים ${hebrewNumber(chapter)}`, "קריאת תהילים"],
  }
}

export function generateStaticParams() {
  return Array.from({ length: 150 }, (_, i) => ({
    chapter: String(i + 1),
  }))
}

export default async function TehilimChapterPage({ params }: PageProps) {
  const { chapter: chapterStr } = await params
  const chapter = Number.parseInt(chapterStr)

  if (isNaN(chapter) || chapter < 1 || chapter > 150) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-4 sm:py-6 lg:py-8 px-3 sm:px-4 max-w-4xl mx-auto">
        <ChapterReader chapter={chapter} />
      </main>

      <Footer />
    </div>
  )
}
