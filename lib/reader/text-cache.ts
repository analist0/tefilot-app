// מערכת Caching מתקדמת ל-3 שכבות: localStorage → Supabase → Sefaria API
import { createClient } from "@/lib/supabase/client"
import { sefaria } from "@/lib/sefaria/client"
import type { SefariaTextResponse } from "@/types/text-reader"

const CACHE_VERSION = "v1"
const CACHE_DURATION_DAYS = 30 // Cache texts for 30 days
const MEMORY_CACHE = new Map<string, { verses: string[]; timestamp: number }>()

interface CachedText {
  text_ref: string
  verses: string[]
  cached_at: string
  version: string
}

/**
 * שכבה 1: Memory Cache (הכי מהיר)
 */
function getFromMemory(ref: string): string[] | null {
  const cached = MEMORY_CACHE.get(ref)
  if (!cached) return null

  const isExpired = Date.now() - cached.timestamp > 1000 * 60 * 60 // 1 hour
  if (isExpired) {
    MEMORY_CACHE.delete(ref)
    return null
  }

  console.log(`[Cache] ✅ Hit - Memory: ${ref}`)
  return cached.verses
}

function saveToMemory(ref: string, verses: string[]) {
  MEMORY_CACHE.set(ref, { verses, timestamp: Date.now() })
}

/**
 * שכבה 2: localStorage (מהיר, זמין offline)
 */
function getFromLocalStorage(ref: string): string[] | null {
  if (typeof window === "undefined") return null

  try {
    const key = `text_cache_${CACHE_VERSION}_${ref}`
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const parsed: CachedText = JSON.parse(cached)

    // Validate data
    if (!parsed || !Array.isArray(parsed.verses) || parsed.verses.length === 0) {
      console.warn(`[Cache] ⚠️ Invalid data in localStorage for ${ref}, removing...`)
      localStorage.removeItem(key)
      return null
    }

    // Check expiration
    const cachedDate = new Date(parsed.cached_at)
    const daysSinceCached = (Date.now() - cachedDate.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCached > CACHE_DURATION_DAYS || parsed.version !== CACHE_VERSION) {
      localStorage.removeItem(key)
      return null
    }

    console.log(`[Cache] ✅ Hit - localStorage: ${ref} (${parsed.verses.length} verses)`)

    // Also save to memory for faster access
    saveToMemory(ref, parsed.verses)

    return parsed.verses
  } catch (error) {
    console.error("[Cache] Error reading from localStorage:", error)
    return null
  }
}

function saveToLocalStorage(ref: string, verses: string[]) {
  if (typeof window === "undefined") return

  // Validate input
  if (!ref || !Array.isArray(verses) || verses.length === 0) {
    console.warn(`[Cache] ⚠️ Cannot save invalid data to localStorage:`, { ref, versesLength: verses?.length })
    return
  }

  try {
    const key = `text_cache_${CACHE_VERSION}_${ref}`
    const data: CachedText = {
      text_ref: ref,
      verses,
      cached_at: new Date().toISOString(),
      version: CACHE_VERSION,
    }

    localStorage.setItem(key, JSON.stringify(data))
    console.log(`[Cache] 💾 Saved to localStorage: ${ref} (${verses.length} verses)`)
  } catch (error) {
    console.error("[Cache] Error saving to localStorage:", error)
    // If localStorage is full, clear old caches
    if (error instanceof Error && error.name === "QuotaExceededError") {
      clearOldLocalStorageCache()
      // Try again
      try {
        const key = `text_cache_${CACHE_VERSION}_${ref}`
        localStorage.setItem(key, JSON.stringify({ text_ref: ref, verses, cached_at: new Date().toISOString(), version: CACHE_VERSION }))
      } catch {
        // Still failed, ignore
      }
    }
  }
}

/**
 * שכבה 3: Supabase (עמיד, shared across devices if user logs in)
 */
async function getFromSupabase(ref: string): Promise<string[] | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("cached_texts")
      .select("verses, cached_at, version")
      .eq("text_ref", ref)
      .maybeSingle()

    if (error) {
      console.error("[Cache] Supabase error:", error)
      return null
    }

    if (!data) return null

    // Validate data
    if (!data.verses || !Array.isArray(data.verses) || data.verses.length === 0) {
      console.warn(`[Cache] ⚠️ Invalid data in Supabase for ${ref}, removing...`)
      await supabase.from("cached_texts").delete().eq("text_ref", ref)
      return null
    }

    // Check expiration
    const cachedDate = new Date(data.cached_at)
    const daysSinceCached = (Date.now() - cachedDate.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCached > CACHE_DURATION_DAYS || data.version !== CACHE_VERSION) {
      // Delete expired cache
      await supabase.from("cached_texts").delete().eq("text_ref", ref)
      return null
    }

    console.log(`[Cache] ✅ Hit - Supabase: ${ref} (${data.verses.length} verses)`)

    // Save to faster caches
    saveToLocalStorage(ref, data.verses)
    saveToMemory(ref, data.verses)

    return data.verses
  } catch (error) {
    console.error("[Cache] Error reading from Supabase:", error)
    return null
  }
}

async function saveToSupabase(ref: string, verses: string[]) {
  // Validate input
  if (!ref || !Array.isArray(verses) || verses.length === 0) {
    console.warn(`[Cache] ⚠️ Cannot save invalid data to Supabase:`, { ref, versesLength: verses?.length })
    return
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.from("cached_texts").upsert(
      {
        text_ref: ref,
        verses,
        cached_at: new Date().toISOString(),
        version: CACHE_VERSION,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "text_ref" }
    )

    if (error) {
      console.error("[Cache] Error saving to Supabase:", error)
    } else {
      console.log(`[Cache] 💾 Saved to Supabase: ${ref} (${verses.length} verses)`)
    }
  } catch (error) {
    console.error("[Cache] Error in saveToSupabase:", error)
  }
}

/**
 * שכבה 4: Sefaria API (המקור, הכי איטי)
 */
async function fetchFromSefaria(ref: string): Promise<string[]> {
  console.log(`[Cache] 🌐 Fetching from Sefaria API: ${ref}`)

  try {
    const response = await sefaria.fetchText(ref)
    console.log(`[Cache] 📦 Received response from Sefaria:`, {
      hasHe: !!response.he,
      hasText: !!response.text,
      heType: Array.isArray(response.he) ? 'array' : typeof response.he,
      textType: Array.isArray(response.text) ? 'array' : typeof response.text,
    })

    const verses = sefaria.parseHebrewText(response)
    console.log(`[Cache] ✅ Parsed ${verses.length} verses from response`)

    if (!verses || verses.length === 0) {
      console.error(`[Cache] ❌ No verses found for ${ref}. Response:`, response)
      throw new Error(`לא נמצא טקסט עבור ${ref}`)
    }

    // Save to all caches
    saveToMemory(ref, verses)
    saveToLocalStorage(ref, verses)
    saveToSupabase(ref, verses) // async, don't wait

    console.log(`[Cache] 💾 Saved ${verses.length} verses to all caches for ${ref}`)
    return verses
  } catch (error) {
    console.error(`[Cache] ❌ Error fetching from Sefaria:`, error)
    throw error
  }
}

/**
 * Main function: Get text with 3-layer caching
 */
export async function getCachedText(ref: string): Promise<string[]> {
  // Layer 1: Memory (instant)
  const memoryResult = getFromMemory(ref)
  if (memoryResult) return memoryResult

  // Layer 2: localStorage (very fast)
  const localStorageResult = getFromLocalStorage(ref)
  if (localStorageResult) return localStorageResult

  // Layer 3: Supabase (medium speed)
  const supabaseResult = await getFromSupabase(ref)
  if (supabaseResult) return supabaseResult

  // Layer 4: Sefaria API (slowest, but always works)
  return await fetchFromSefaria(ref)
}

/**
 * Clear old caches from localStorage
 */
function clearOldLocalStorageCache() {
  if (typeof window === "undefined") return

  try {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter((k) => k.startsWith("text_cache_"))

    // Remove old version caches
    cacheKeys.forEach((key) => {
      if (!key.includes(CACHE_VERSION)) {
        localStorage.removeItem(key)
      }
    })

    console.log(`[Cache] 🧹 Cleared ${cacheKeys.length - keys.filter(k => k.includes(CACHE_VERSION)).length} old cache entries`)
  } catch (error) {
    console.error("[Cache] Error clearing old cache:", error)
  }
}

/**
 * Preload text in background (for next/prev chapters)
 */
export async function preloadText(ref: string): Promise<void> {
  // Only preload if not in any cache
  if (getFromMemory(ref) || getFromLocalStorage(ref)) {
    return // Already cached
  }

  // Preload in background
  getCachedText(ref).catch(() => {
    // Ignore errors in preloading
  })
}

/**
 * Clear all caches for a specific text
 */
export async function invalidateCache(ref: string): Promise<void> {
  // Clear memory
  MEMORY_CACHE.delete(ref)

  // Clear localStorage
  if (typeof window !== "undefined") {
    const key = `text_cache_${CACHE_VERSION}_${ref}`
    localStorage.removeItem(key)
  }

  // Clear Supabase
  try {
    const supabase = createClient()
    await supabase.from("cached_texts").delete().eq("text_ref", ref)
    console.log(`[Cache] 🗑️ Invalidated cache for: ${ref}`)
  } catch (error) {
    console.error("[Cache] Error invalidating Supabase cache:", error)
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  memorySize: number
  localStorageSize: number
  estimatedSizeMB: number
} {
  const memorySize = MEMORY_CACHE.size

  let localStorageSize = 0
  let totalBytes = 0

  if (typeof window !== "undefined") {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter((k) => k.startsWith(`text_cache_${CACHE_VERSION}_`))
    localStorageSize = cacheKeys.length

    // Estimate size
    cacheKeys.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value) {
        totalBytes += key.length + value.length
      }
    })
  }

  return {
    memorySize,
    localStorageSize,
    estimatedSizeMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
  }
}
