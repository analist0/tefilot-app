import { createClient } from "@/lib/supabase/client"

export interface TehilimProgress {
  session_id: string
  user_id?: string
  chapter: number
  verse: number
  letter_index: number
  completed: boolean
  reading_speed_wpm?: number
  total_time_seconds: number
  chapters_completed: number
  verses_read: number
  current_streak_days: number
  longest_streak_days: number
  last_read_at: string
  total_sessions: number
}

export interface ReadingSession {
  startTime: number
  wordCount: number
  chapter: number
  verse: number
  letterIndex: number
}

let currentSession: ReadingSession | null = null

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return `server_session_${Date.now()}`
  }

  let sessionId = localStorage.getItem("tehilim_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("tehilim_session_id", sessionId)
  }
  return sessionId
}

export async function startReadingSession(chapter: number): Promise<void> {
  currentSession = {
    startTime: Date.now(),
    wordCount: 0,
    chapter,
    verse: 1,
    letterIndex: 0,
  }

  // שמירה ראשונית
  await saveProgress(chapter, 1, 0, false)
}

export async function updateReadingPosition(
  chapter: number,
  verse: number,
  letterIndex: number,
  wordCount: number,
): Promise<void> {
  if (currentSession) {
    currentSession.chapter = chapter
    currentSession.verse = verse
    currentSession.letterIndex = letterIndex
    currentSession.wordCount = wordCount
  }

  await saveProgress(chapter, verse, letterIndex, false)
}

export async function completeChapter(chapter: number, verseCount?: number): Promise<void> {
  await saveProgress(chapter, verseCount || 0, 0, true)
  currentSession = null
}

async function saveProgress(chapter: number, verse: number, letterIndex: number, completed: boolean): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  try {
    const supabase = createClient()
    const sessionId = getSessionId()

    let readingSpeed = 0
    let totalTime = 0

    if (currentSession) {
      const elapsed = (Date.now() - currentSession.startTime) / 1000 / 60 // minutes
      if (elapsed > 0 && currentSession.wordCount > 0) {
        readingSpeed = Math.round(currentSession.wordCount / elapsed)
      }
      totalTime = Math.round((Date.now() - currentSession.startTime) / 1000)
    }

    const { data: existing } = await supabase
      .from("tehilim_progress")
      .select("*")
      .eq("session_id", sessionId)
      .eq("chapter", chapter)
      .maybeSingle()

    const versesRead = completed ? verse : Math.max(verse, existing?.verses_read || 0)

    const chaptersCompleted =
      completed && !existing?.completed ? (existing?.chapters_completed || 0) + 1 : existing?.chapters_completed || 0

    const progressData = {
      session_id: sessionId,
      chapter,
      verse: completed ? 0 : verse, // verse=0 כאשר הפרק הושלם
      letter_index: letterIndex,
      completed,
      verses_read: versesRead,
      chapters_completed: chaptersCompleted,
      reading_speed_wpm: readingSpeed || existing?.reading_speed_wpm || 0,
      total_time_seconds: totalTime || existing?.total_time_seconds || 0,
      last_read_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      // עדכון רשומה קיימת
      await supabase.from("tehilim_progress").update(progressData).eq("id", existing.id)
    } else {
      // יצירת רשומה חדשה
      await supabase.from("tehilim_progress").insert({
        ...progressData,
        current_streak_days: 1,
        longest_streak_days: 1,
        total_sessions: 1,
        created_at: new Date().toISOString(),
      })
    }

    // שמירה ב-localStorage כגיבוי
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "tehilim_last_position",
        JSON.stringify({
          chapter,
          verse,
          letterIndex,
          timestamp: Date.now(),
        }),
      )
    }
  } catch (error) {
    console.error("Error saving progress:", error)
  }
}

export async function getLastPosition(): Promise<{ chapter: number; verse: number; letterIndex: number } | null> {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const supabase = createClient()
    const sessionId = getSessionId()

    // ניסיון לטעון מ-DB
    const { data } = await supabase
      .from("tehilim_progress")
      .select("chapter, verse, letter_index")
      .eq("session_id", sessionId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      return {
        chapter: data.chapter,
        verse: data.verse,
        letterIndex: data.letter_index,
      }
    }

    // fallback ל-localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tehilim_last_position")
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          chapter: parsed.chapter,
          verse: parsed.verse,
          letterIndex: parsed.letterIndex,
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error getting last position:", error)
    return null
  }
}

export async function getStatistics() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const supabase = createClient()
    const sessionId = getSessionId()

    const { data, error } = await supabase.from("tehilim_progress").select("*").eq("session_id", sessionId)

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        chaptersRead: 0,
        versesRead: 0,
        totalTimeSeconds: 0,
        avgSpeedWpm: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionPercentage: 0,
        estimatedTimeRemaining: 0,
      }
    }

    const completedChapters = data.filter((p: any) => p.completed === true).length

    const totalVerses = data.reduce((sum: number, p: any) => sum + (p.verses_read || 0), 0)

    const totalTime = data.reduce((sum: number, p: any) => sum + (p.total_time_seconds || 0), 0)

    const speedValues = data.filter((p: any) => (p.reading_speed_wpm || 0) > 0)
    const avgSpeed =
      speedValues.length > 0
        ? speedValues.reduce((sum: number, p: any) => sum + (p.reading_speed_wpm || 0), 0) / speedValues.length
        : 0

    const currentStreak = Math.max(...data.map((p: any) => p.current_streak_days || 0), 0)
    const longestStreak = Math.max(...data.map((p: any) => p.longest_streak_days || 0), 0)

    const completionPercentage = (completedChapters / 150) * 100
    const remainingChapters = 150 - completedChapters
    const avgTimePerChapter = completedChapters > 0 ? totalTime / completedChapters : 0
    const estimatedTimeRemaining = remainingChapters * avgTimePerChapter

    return {
      chaptersRead: completedChapters,
      versesRead: totalVerses,
      totalTimeSeconds: totalTime,
      avgSpeedWpm: Math.round(avgSpeed),
      currentStreak: currentStreak,
      longestStreak: longestStreak,
      completionPercentage: Math.round(completionPercentage * 10) / 10,
      estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
    }
  } catch (error) {
    console.error("Error getting statistics:", error)
    return null
  }
}
