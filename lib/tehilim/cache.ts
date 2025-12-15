// Three-layer cache: LocalStorage -> Supabase -> Sefaria API

import { createClient } from "@/lib/supabase/client"
import { fetchChapterFromSefaria } from "./sefaria"
import { fetchHebrewDate } from "./hebrew-date"
import type { TehilimChapter, CacheEntry, HebrewDate } from "./types"

const STORAGE_KEY_PREFIX = "tehilim_chapter_"
const HEBREW_DATE_KEY = "hebrew_date_cache"
const CACHE_EXPIRY_DAYS = 30

// LocalStorage helpers
function getFromLocalStorage(chapter: number): CacheEntry | null {
  if (typeof window === "undefined") return null

  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${chapter}`)
    if (!data) return null

    const entry: CacheEntry = JSON.parse(data)

    // Check if cache is expired
    const fetchedAt = new Date(entry.fetchedAt)
    const now = new Date()
    const daysDiff = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysDiff > CACHE_EXPIRY_DAYS) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${chapter}`)
      return null
    }

    return entry
  } catch {
    return null
  }
}

function saveToLocalStorage(chapter: number, data: TehilimChapter): void {
  if (typeof window === "undefined") return

  try {
    const entry: CacheEntry = {
      chapter,
      verses: data.verses,
      hebrewText: data.verses.join("\n"),
      verseCount: data.verseCount,
      fetchedAt: new Date().toISOString(),
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${chapter}`, JSON.stringify(entry))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// Supabase cache helpers
async function getFromSupabase(chapter: number): Promise<CacheEntry | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("tehilim_cache").select("*").eq("chapter", chapter).single()

    if (error || !data) return null

    return {
      chapter: data.chapter,
      verses: data.verses,
      hebrewText: data.hebrew_text,
      verseCount: data.verse_count,
      fetchedAt: data.fetched_at,
    }
  } catch {
    return null
  }
}

async function saveToSupabase(chapter: number, data: TehilimChapter): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from("tehilim_cache").upsert(
      {
        chapter,
        verses: data.verses,
        hebrew_text: data.verses.join("\n"),
        verse_count: data.verseCount,
        source: "sefaria",
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "chapter" },
    )
  } catch (error) {
    console.error("Failed to save to Supabase:", error)
  }
}

// Main cache function - three layers
export async function getChapter(chapter: number): Promise<TehilimChapter> {
  try {
    const localCache = getFromLocalStorage(chapter)
    if (localCache) {
      console.log(`[v0] Cache: Found chapter ${chapter} in LocalStorage`)
      return {
        chapter: localCache.chapter,
        verses: localCache.verses,
        verseCount: localCache.verseCount,
      }
    }

    console.log(`[v0] Cache: Chapter ${chapter} not in LocalStorage, checking Supabase...`)

    const supabaseCache = await Promise.race([
      getFromSupabase(chapter),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ])

    if (supabaseCache) {
      console.log(`[v0] Cache: Found chapter ${chapter} in Supabase`)
      // Save to localStorage for next time
      saveToLocalStorage(chapter, {
        chapter: supabaseCache.chapter,
        verses: supabaseCache.verses,
        verseCount: supabaseCache.verseCount,
      })

      return {
        chapter: supabaseCache.chapter,
        verses: supabaseCache.verses,
        verseCount: supabaseCache.verseCount,
      }
    }

    console.log(`[v0] Cache: Chapter ${chapter} not in Supabase, fetching from Sefaria...`)

    const sefariaData = await fetchChapterFromSefaria(chapter)

    console.log(`[v0] Cache: Fetched chapter ${chapter} from Sefaria`)

    // Save to both caches (don't wait)
    saveToLocalStorage(chapter, sefariaData)
    saveToSupabase(chapter, sefariaData).catch((err) => console.error("[v0] Cache: Failed to save to Supabase:", err))

    return sefariaData
  } catch (error) {
    console.error(`[v0] Cache: Error loading chapter ${chapter}:`, error)
    throw new Error(`לא הצלחנו לטעון את הפרק. נסה שוב מאוחר יותר.`)
  }
}

// Get multiple chapters efficiently
export async function getChapters(chapters: number[]): Promise<TehilimChapter[]> {
  return Promise.all(chapters.map(getChapter))
}

// Hebrew date cache
export async function getCachedHebrewDate(): Promise<HebrewDate> {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(HEBREW_DATE_KEY)
      if (cached) {
        const { date, data } = JSON.parse(cached)
        const today = new Date().toDateString()
        if (date === today) {
          return data
        }
      }
    } catch {
      // Continue to fetch
    }
  }

  const hebrewDate = await fetchHebrewDate()

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        HEBREW_DATE_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          data: hebrewDate,
        }),
      )
    } catch {
      // Ignore storage errors
    }
  }

  return hebrewDate
}
