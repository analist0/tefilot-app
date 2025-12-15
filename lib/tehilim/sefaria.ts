// Sefaria API Client

import type { TehilimChapter } from "./types"

const SEFARIA_BASE_URL = "https://www.sefaria.org/api/texts"

interface SefariaResponse {
  text: string[]
  he: string[]
  ref: string
  heRef: string
  sectionRef: string
  heSectionRef: string
  firstAvailableSectionRef: string
  isSpanning: boolean
  spanningRefs: string[]
  next: string
  prev: string
  title: string
  heTitle: string
  primary_category: string
  book: string
  categories: string[]
}

function cleanText(text: string): string {
  let cleaned = text
    // Remove HTML tags but keep content
    .replace(/<[^>]*>/g, " ")
    // Replace HTML entities with proper characters/spaces
    .replace(/&thinsp;/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lrm;/gi, " ")
    .replace(/&rlm;/gi, " ")
    // Remove hex and decimal entities
    .replace(/&#x[0-9a-fA-F]+;/gi, " ")
    .replace(/&#\d+;/gi, " ")
    // Remove punctuation marks but add space
    .replace(/׃/g, " ") // סוף פסוק
    .replace(/׀/g, " ") // פסיק
    .replace(/־/g, " ") // מקף עברי
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, "")
    // Remove cantillation marks (טעמי מקרא)
    .replace(/[\u0591-\u05AF]/g, "")

  // Normalize multiple spaces to single space
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  return cleaned
}

export async function fetchChapterFromSefaria(chapter: number): Promise<TehilimChapter> {
  if (chapter < 1 || chapter > 150) {
    throw new Error(`Invalid chapter number: ${chapter}. Must be between 1 and 150.`)
  }

  const url = `${SEFARIA_BASE_URL}/Psalms.${chapter}?context=0&pad=0`

  console.log(`[v0] Sefaria: Fetching chapter ${chapter} from ${url}`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log(`[v0] Sefaria: Timeout for chapter ${chapter}`)
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 86400 },
    })

    clearTimeout(timeoutId)

    console.log(`[v0] Sefaria: Response status for chapter ${chapter}: ${response.status}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch chapter ${chapter} from Sefaria: ${response.statusText}`)
    }

    const data: SefariaResponse = await response.json()

    console.log(`[v0] Sefaria: Parsed JSON for chapter ${chapter}`)

    // Handle both array and string responses
    const verses = Array.isArray(data.he) ? data.he : [data.he]

    const cleanVerses = verses.map((verse) => (typeof verse === "string" ? cleanText(verse) : String(verse)))

    console.log(`[v0] Sefaria: Chapter ${chapter} has ${cleanVerses.length} verses`)

    return {
      chapter,
      verses: cleanVerses,
      verseCount: cleanVerses.length,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    console.error(`[v0] Sefaria: Error fetching chapter ${chapter}:`, error)
    if ((error as Error).name === "AbortError") {
      throw new Error(`Timeout fetching chapter ${chapter} from Sefaria`)
    }
    throw error
  }
}

// Fetch multiple chapters at once
export async function fetchChaptersFromSefaria(chapters: number[]): Promise<TehilimChapter[]> {
  const results = await Promise.all(
    chapters.map(async (chapter) => {
      try {
        return await fetchChapterFromSefaria(chapter)
      } catch (error) {
        console.error(`Failed to fetch chapter ${chapter}:`, error)
        return null
      }
    }),
  )

  return results.filter((r): r is TehilimChapter => r !== null)
}
