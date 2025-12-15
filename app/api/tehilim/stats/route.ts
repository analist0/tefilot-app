import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { TehilimStats } from "@/types"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: progress, error } = await supabase
      .from("tehilim_progress")
      .select("*")
      .or(user ? `user_id.eq.${user.id}` : "session_id.not.is.null")

    if (!progress || progress.length === 0) {
      const emptyStats: TehilimStats = {
        total_chapters_read: 0,
        total_verses_read: 0,
        total_time_minutes: 0,
        average_reading_speed: 0,
        current_streak: 0,
        longest_streak: 0,
        completion_percentage: 0,
        chapters_remaining: 150,
        verses_remaining: 2461,
        estimated_completion_time: 0,
      }
      return NextResponse.json(emptyStats)
    }

    const totalChapters = new Set(progress.map((p) => p.chapter)).size
    const totalVerses = progress.reduce((sum, p) => sum + (p.verses_read || 0), 0)
    const totalTime = progress.reduce((sum, p) => sum + (p.total_time_seconds || 0), 0)
    const avgSpeed =
      progress.filter((p) => p.reading_speed_wpm > 0).reduce((sum, p) => sum + (p.reading_speed_wpm || 0), 0) /
        progress.filter((p) => p.reading_speed_wpm > 0).length || 0

    const currentStreak = Math.max(...progress.map((p) => p.current_streak_days || 0))
    const longestStreak = Math.max(...progress.map((p) => p.longest_streak_days || 0))

    const stats: TehilimStats = {
      total_chapters_read: totalChapters,
      total_verses_read: totalVerses,
      total_time_minutes: Math.round(totalTime / 60),
      average_reading_speed: Math.round(avgSpeed),
      current_streak: currentStreak,
      longest_streak: longestStreak,
      completion_percentage: Math.round((totalChapters / 150) * 100),
      chapters_remaining: 150 - totalChapters,
      verses_remaining: 2461 - totalVerses,
      estimated_completion_time: avgSpeed > 0 ? Math.round((2461 - totalVerses) / avgSpeed) : 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
