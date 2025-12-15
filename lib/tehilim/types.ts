// Tehilim Types

export type Pasuk = string

export type HolyName = "יהוה" | "אדני" | "אלהים" | "אלוהים" | "שדי" | "אל"

export interface Progress {
  chapter: number
  verse: number
  letterIndex: number
  completed: boolean
}

export interface CacheEntry {
  chapter: number
  verses: string[]
  hebrewText: string
  verseCount: number
  fetchedAt: string
}

export interface HebrewDate {
  hebrew: string
  gregorian: string
  hebrewDay: number
  hebrewMonth: string
  hebrewYear: number
  parasha?: string
}

export interface TehilimChapter {
  chapter: number
  verses: string[]
  verseCount: number
}

export interface KavanaInfo {
  name: HolyName
  kavana: string
  color: string
}

export const KAVANOT: Record<string, KavanaInfo> = {
  יהוה: { name: "יהוה", kavana: "המשכת חסדים", color: "text-yellow-400" },
  אדני: { name: "אדני", kavana: "קבלת עול מלכות שמים", color: "text-blue-400" },
  אלהים: { name: "אלהים", kavana: "המתקת הדינים", color: "text-red-400" },
  אלוהים: { name: "אלוהים", kavana: "המתקת הדינים", color: "text-red-400" },
  שדי: { name: "שדי", kavana: "השגחה פרטית", color: "text-green-400" },
  אל: { name: "אל", kavana: "מידת הרחמים", color: "text-purple-400" },
}

// Daily Tehilim division by Hebrew day of month
export const DAILY_TEHILIM: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [10, 11, 12, 13, 14, 15, 16, 17],
  3: [18, 19, 20, 21, 22],
  4: [23, 24, 25, 26, 27, 28, 29],
  5: [30, 31, 32, 33, 34],
  6: [35, 36, 37, 38],
  7: [39, 40, 41, 42, 43],
  8: [44, 45, 46, 47, 48],
  9: [49, 50, 51, 52, 53, 54],
  10: [55, 56, 57, 58, 59],
  11: [60, 61, 62, 63, 64, 65],
  12: [66, 67, 68],
  13: [69, 70, 71],
  14: [72, 73, 74, 75, 76],
  15: [77, 78],
  16: [79, 80, 81, 82],
  17: [83, 84, 85, 86, 87],
  18: [88, 89],
  19: [90, 91, 92, 93, 94, 95, 96],
  20: [97, 98, 99, 100, 101, 102, 103],
  21: [104, 105],
  22: [106, 107],
  23: [108, 109, 110, 111, 112],
  24: [113, 114, 115, 116, 117, 118],
  25: [119, 1, 119, 96],
  26: [119, 97, 119, 176],
  27: [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134],
  28: [135, 136, 137, 138, 139],
  29: [140, 141, 142, 143, 144, 145],
  30: [146, 147, 148, 149, 150],
}
