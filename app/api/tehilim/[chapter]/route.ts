import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ chapter: string }> }) {
  try {
    const { chapter } = await params
    const chapterNum = Number.parseInt(chapter)

    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 150) {
      return NextResponse.json({ error: "Invalid chapter" }, { status: 400 })
    }

    const supabase = await createClient()

    // בדיקה אם יש ב-cache
    const { data: cached } = await supabase.from("tehilim_cache").select("*").eq("chapter", chapterNum).single()

    if (cached) {
      return NextResponse.json({ verses: cached.verses })
    }

    // אם אין ב-cache, קריאה מ-Sefaria API
    const response = await fetch(`https://www.sefaria.org/api/texts/Psalms.${chapterNum}?context=0`)
    const data = await response.json()

    if (data.he) {
      const verses = Array.isArray(data.he) ? data.he : [data.he]

      // שמירה ב-cache
      await supabase.from("tehilim_cache").insert({
        chapter: chapterNum,
        verses,
        verse_count: verses.length,
        source: "sefaria",
        hebrew_text: verses.join("\n"),
      })

      return NextResponse.json({ verses })
    }

    return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
  } catch (error) {
    console.error("[v0] Error fetching chapter:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
