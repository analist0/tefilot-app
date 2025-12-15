import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapter = searchParams.get("chapter")
    const sessionId = searchParams.get("session_id")

    if (!chapter || !sessionId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data } = await supabase
      .from("tehilim_progress")
      .select("*")
      .eq("chapter", Number.parseInt(chapter))
      .eq("session_id", sessionId)
      .single()

    return NextResponse.json(data || null)
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const progressData = {
      user_id: user?.id || null,
      session_id: body.session_id,
      chapter: body.chapter,
      verse: body.verse,
      letter_index: body.letter_index,
      completed: body.completed,
      verses_read: body.verses_read,
      total_time_seconds: body.total_time_seconds,
      reading_speed_wpm: body.reading_speed_wpm,
      last_read_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("tehilim_progress")
      .upsert(progressData, {
        onConflict: "session_id,chapter",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
