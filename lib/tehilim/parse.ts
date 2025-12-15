// Parse and mark holy names in text

import type { HolyName, KavanaInfo } from "./types"
import { KAVANOT } from "./types"

// Regex patterns for holy names
const HOLY_NAMES_PATTERN = /(יהוה|אדני|אלהים|אלוהים|שדי|אל\b)/g

export interface ParsedSegment {
  type: "text" | "holy-name"
  content: string
  holyName?: HolyName
  kavana?: KavanaInfo
}

export function parseVerseForHolyNames(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = []
  let lastIndex = 0

  const matches = text.matchAll(HOLY_NAMES_PATTERN)

  for (const match of matches) {
    const matchIndex = match.index!
    const matchText = match[0]

    // Add text before the match
    if (matchIndex > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, matchIndex),
      })
    }

    // Add the holy name
    const kavana = KAVANOT[matchText]
    segments.push({
      type: "holy-name",
      content: matchText,
      holyName: matchText as HolyName,
      kavana,
    })

    lastIndex = matchIndex + matchText.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    })
  }

  return segments.length > 0 ? segments : [{ type: "text", content: text }]
}

// Convert Hebrew number to chapter number (for display)
export function hebrewNumber(num: number): string {
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"]
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"]
  const hundreds = ["", "ק", "ר", "ש", "ת"]

  if (num === 15) return 'ט"ו'
  if (num === 16) return 'ט"ז'

  let result = ""

  if (num >= 100) {
    const h = Math.floor(num / 100)
    result += hundreds[h]
    num %= 100
  }

  if (num >= 10) {
    const t = Math.floor(num / 10)
    result += tens[t]
    num %= 10
  }

  if (num > 0) {
    result += ones[num]
  }

  // Add gershayim for proper Hebrew number formatting
  if (result.length > 1) {
    result = result.slice(0, -1) + '"' + result.slice(-1)
  } else if (result.length === 1) {
    result += "׳"
  }

  return result
}
