import { createClient } from "@/lib/supabase/client"
import type { TextType, ReadingProgress as _ReadingProgress } from "@/types/text-reader"

interface ProgressRecord {
  id?: string
  completed?: boolean
  verses_read?: number
  sections_completed?: number
  reading_speed_wpm?: number
  total_time_seconds?: number
  current_streak_days?: number
  longest_streak_days?: number
}

export interface ReadingSession {
  startTime: number
  wordCount: number
  textType: TextType
  textId: string
  section: number
  verse: number
  letterIndex: number
}

let currentSession: ReadingSession | null = null

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return `server_session_${Date.now()}`
  }

  let sessionId = localStorage.getItem("reader_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("reader_session_id", sessionId)
  }
  return sessionId
}

export async function startReadingSession(
  textType: TextType,
  textId: string,
  section: number = 1,
): Promise<void> {
  currentSession = {
    startTime: Date.now(),
    wordCount: 0,
    textType,
    textId,
    section,
    verse: 1,
    letterIndex: 0,
  }

  await saveProgress(textType, textId, section, 1, 0, false)
}

export async function updateReadingPosition(
  textType: TextType,
  textId: string,
  section: number,
  verse: number,
  letterIndex: number,
  wordCount: number,
): Promise<void> {
  if (currentSession) {
    currentSession.section = section
    currentSession.verse = verse
    currentSession.letterIndex = letterIndex
    currentSession.wordCount = wordCount
  }

  await saveProgress(textType, textId, section, verse, letterIndex, false)
}

export async function completeSection(
  textType: TextType,
  textId: string,
  section: number,
  verseCount?: number,
): Promise<void> {
  await saveProgress(textType, textId, section, verseCount || 0, 0, true)
  currentSession = null
}

async function saveProgress(
  textType: TextType,
  textId: string,
  section: number,
  verse: number,
  letterIndex: number,
  completed: boolean,
): Promise<void> {
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
      .from("reading_progress")
      .select("*")
      .eq("session_id", sessionId)
      .eq("text_type", textType)
      .eq("text_id", textId)
      .maybeSingle()

    const versesRead = completed ? verse : Math.max(verse, existing?.verses_read || 0)

    const sectionsCompleted =
      completed && !existing?.completed
        ? (existing?.sections_completed || 0) + 1
        : existing?.sections_completed || 0

    const progressData = {
      session_id: sessionId,
      text_type: textType,
      text_id: textId,
      section,
      verse: completed ? 0 : verse,
      letter_index: letterIndex,
      completed,
      verses_read: versesRead,
      sections_completed: sectionsCompleted,
      reading_speed_wpm: readingSpeed || existing?.reading_speed_wpm || 0,
      total_time_seconds: totalTime || existing?.total_time_seconds || 0,
      last_read_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      await supabase.from("reading_progress").update(progressData).eq("id", existing.id)
    } else {
      await supabase.from("reading_progress").insert({
        ...progressData,
        current_streak_days: 1,
        longest_streak_days: 1,
        total_sessions: 1,
        created_at: new Date().toISOString(),
      })
    }

    // Backup to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `${textType}_last_position`,
        JSON.stringify({
          textId,
          section,
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

export async function getLastPosition(
  textType: TextType,
): Promise<{ textId: string; section: number; verse: number; letterIndex: number } | null> {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const supabase = createClient()
    const sessionId = getSessionId()

    const { data } = await supabase
      .from("reading_progress")
      .select("text_id, section, verse, letter_index")
      .eq("session_id", sessionId)
      .eq("text_type", textType)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      return {
        textId: data.text_id,
        section: data.section,
        verse: data.verse,
        letterIndex: data.letter_index,
      }
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${textType}_last_position`)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          textId: parsed.textId,
          section: parsed.section,
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

export async function getStatistics(textType: TextType, totalSections: number = 150) {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const supabase = createClient()
    const sessionId = getSessionId()

    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("session_id", sessionId)
      .eq("text_type", textType)

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        sectionsRead: 0,
        versesRead: 0,
        totalTimeSeconds: 0,
        avgSpeedWpm: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionPercentage: 0,
        estimatedTimeRemaining: 0,
      }
    }

    const completedSections = data.filter((p: ProgressRecord) => p.completed === true).length
    const totalVerses = data.reduce((sum: number, p: ProgressRecord) => sum + (p.verses_read || 0), 0)
    const totalTime = data.reduce((sum: number, p: ProgressRecord) => sum + (p.total_time_seconds || 0), 0)

    const speedValues = data.filter((p: ProgressRecord) => (p.reading_speed_wpm || 0) > 0)
    const avgSpeed =
      speedValues.length > 0
        ? speedValues.reduce((sum: number, p: ProgressRecord) => sum + (p.reading_speed_wpm || 0), 0) / speedValues.length
        : 0

    const currentStreak = Math.max(...data.map((p: ProgressRecord) => p.current_streak_days || 0), 0)
    const longestStreak = Math.max(...data.map((p: ProgressRecord) => p.longest_streak_days || 0), 0)

    const completionPercentage = (completedSections / totalSections) * 100
    const remainingSections = totalSections - completedSections
    const avgTimePerSection = completedSections > 0 ? totalTime / completedSections : 0
    const estimatedTimeRemaining = remainingSections * avgTimePerSection

    return {
      sectionsRead: completedSections,
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
