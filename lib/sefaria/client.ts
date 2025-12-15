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
   */
  parseHebrewText(text: string | string[]): string[] {
    if (Array.isArray(text)) {
      return text.map((t) => this.cleanText(t))
    }
    return [this.cleanText(text)]
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
