// Generic Sefaria API Client - תומך בכל סוגי הטקסטים

import type { SefariaTextResponse } from "@/types/text-reader"

const SEFARIA_BASE_URL = "https://www.sefaria.org/api"

export class SefariaClient {
  private baseUrl: string

  constructor(baseUrl: string = SEFARIA_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * טיהור טקסט מתגי HTML וסימני טעמים
   */
  private cleanText(text: string): string {
    let cleaned = text
      // Remove HTML tags
      .replace(/<[^>]*>/g, " ")
      // Replace HTML entities
      .replace(/&thinsp;/gi, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lrm;/gi, " ")
      .replace(/&rlm;/gi, " ")
      .replace(/&#x[0-9a-fA-F]+;/gi, " ")
      .replace(/&#\d+;/gi, " ")
      // Remove Hebrew punctuation
      .replace(/׃/g, " ") // סוף פסוק
      .replace(/׀/g, " ") // פסיק
      .replace(/־/g, " ") // מקף עברי
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, "")
      // Remove cantillation marks (טעמי מקרא)
      .replace(/[\u0591-\u05AF]/g, "")

    // Normalize spaces
    cleaned = cleaned.replace(/\s+/g, " ").trim()

    return cleaned
  }

  /**
   * Fetch text from Sefaria
   * @param ref - Text reference (e.g., "Psalms.1", "Genesis.1.1", "Berakhot.2a")
   * @param context - Number of surrounding sections to include
   */
  async fetchText(ref: string, context: number = 0): Promise<SefariaTextResponse> {
    const url = `${this.baseUrl}/texts/${encodeURIComponent(ref)}?context=${context}&pad=0`

    console.log(`[Sefaria] Fetching: ${ref}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log(`[Sefaria] Timeout for: ${ref}`)
      controller.abort()
    }, 15000)

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        next: { revalidate: 86400 }, // Cache for 24 hours
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Sefaria API error: ${response.statusText}`)
      }

      const data: SefariaTextResponse = await response.json()

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      console.error(`[Sefaria] Error fetching ${ref}:`, error)
      if ((error as Error).name === "AbortError") {
        throw new Error(`Timeout fetching ${ref}`)
      }
      throw error
    }
  }

  /**
   * Fetch Tanakh chapter
   */
  async fetchTanakhChapter(book: string, chapter: number): Promise<SefariaTextResponse> {
    return this.fetchText(`${book}.${chapter}`)
  }

  /**
   * Fetch Tanakh verse
   */
  async fetchTanakhVerse(book: string, chapter: number, verse: number): Promise<SefariaTextResponse> {
    return this.fetchText(`${book}.${chapter}.${verse}`)
  }

  /**
   * Fetch Talmud page (daf)
   */
  async fetchTalmudDaf(tractate: string, daf: string): Promise<SefariaTextResponse> {
    // daf format: "2a", "2b", etc.
    return this.fetchText(`${tractate}.${daf}`)
  }

  /**
   * Fetch Mishnah
   */
  async fetchMishnah(tractate: string, chapter: number, mishnah?: number): Promise<SefariaTextResponse> {
    const ref = mishnah ? `Mishnah ${tractate}.${chapter}.${mishnah}` : `Mishnah ${tractate}.${chapter}`
    return this.fetchText(ref)
  }

  /**
   * Search texts on Sefaria
   */
  async search(query: string, filters?: {
    type?: string[]
    categories?: string[]
    limit?: number
  }): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.limit && { size: filters.limit.toString() }),
    })

    if (filters?.type) {
      params.append("type", filters.type.join(","))
    }

    const url = `${this.baseUrl}/search?${params.toString()}`

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        throw new Error(`Search error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[Sefaria] Search error:", error)
      throw error
    }
  }

  /**
   * Get index/table of contents for a book
   */
  async fetchIndex(title: string): Promise<any> {
    const url = `${this.baseUrl}/index/${encodeURIComponent(title)}`

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      })

      if (!response.ok) {
        throw new Error(`Index error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[Sefaria] Index error:", error)
      throw error
    }
  }

  /**
   * Parse Hebrew text and clean it
   * Always use Hebrew (he) field, never English (text) field
   */
  parseHebrewText(response: any): string[] {
    console.log('[Sefaria] parseHebrewText called with:', {
      hasHe: !!response?.he,
      hasText: !!response?.text,
      heType: response?.he ? (Array.isArray(response.he) ? 'array' : typeof response.he) : 'undefined',
      textType: response?.text ? (Array.isArray(response.text) ? 'array' : typeof response.text) : 'undefined',
    })

    // Validate response exists
    if (!response) {
      console.error('[Sefaria] ❌ No response object provided')
      throw new Error('לא התקבלה תשובה מהשרת')
    }

    // Always prioritize Hebrew text over English
    const hebrewText = response.he || response.text

    // Validate we actually have text
    if (!hebrewText || (typeof hebrewText !== 'string' && !Array.isArray(hebrewText))) {
      console.error('[Sefaria] ❌ No valid Hebrew or English text found in response:', response)
      throw new Error('לא נמצא טקסט עברי בתשובה')
    }

    let verses: string[] = []

    if (Array.isArray(hebrewText)) {
      // Handle nested arrays (like Talmud)
      if (Array.isArray(hebrewText[0])) {
        verses = hebrewText.flat()
          .filter(t => t && typeof t === 'string' && t.trim().length > 0)
          .map((t) => this.cleanText(String(t)))
          .filter(t => t.length > 0)
      } else {
        verses = hebrewText
          .filter(t => t && typeof t === 'string' && t.trim().length > 0)
          .map((t) => this.cleanText(String(t)))
          .filter(t => t.length > 0)
      }
    } else if (typeof hebrewText === 'string') {
      const cleaned = this.cleanText(hebrewText)
      if (cleaned.length > 0) {
        verses = [cleaned]
      }
    }

    // Final validation - make sure we have actual content
    if (verses.length === 0) {
      console.error('[Sefaria] ❌ No verses found after parsing. Raw text:', hebrewText)
      throw new Error('לא נמצאו פסוקים תקינים בטקסט')
    }

    // Validate no verse is the literal string "undefined"
    const hasUndefinedStrings = verses.some(v => v === 'undefined' || v.trim() === 'undefined')
    if (hasUndefinedStrings) {
      console.error('[Sefaria] ❌ Found literal "undefined" strings in verses:', verses)
      throw new Error('שגיאה בעיבוד הטקסט - נתונים לא תקינים')
    }

    console.log(`[Sefaria] ✅ Successfully parsed ${verses.length} verses`)
    return verses
  }

  /**
   * Get daily learning (Daf Yomi, etc.)
   */
  async fetchCalendar(calendar: "daf-yomi" | "parashat-hashavua" | "929"): Promise<any> {
    const url = `${this.baseUrl}/calendars/${calendar}`

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // Refresh every hour
      })

      if (!response.ok) {
        throw new Error(`Calendar error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[Sefaria] Calendar error:", error)
      throw error
    }
  }
}

// Singleton instance
export const sefaria = new SefariaClient()
