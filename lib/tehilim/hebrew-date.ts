// Hebcal API Client

import type { HebrewDate } from "./types"

const HEBCAL_CONVERTER_URL = "https://www.hebcal.com/converter"
const HEBCAL_SHABBAT_URL = "https://www.hebcal.com/shabbat"

export async function fetchHebrewDate(date: Date = new Date()): Promise<HebrewDate> {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const url = `${HEBCAL_CONVERTER_URL}?cfg=json&gy=${year}&gm=${month}&gd=${day}&g2h=1`

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Hebrew date: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    hebrew: data.hebrew,
    gregorian: `${day}/${month}/${year}`,
    hebrewDay: data.hd,
    hebrewMonth: data.hm,
    hebrewYear: data.hy,
  }
}

export async function fetchParasha(): Promise<string | null> {
  try {
    const url = `${HEBCAL_SHABBAT_URL}?cfg=json&geonameid=281184&M=on`

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return null

    const data = await response.json()

    const parasha = data.items?.find((item: { category: string }) => item.category === "parashat")
    return parasha?.hebrew || null
  } catch {
    return null
  }
}

export async function getHebrewDateWithParasha(date: Date = new Date()): Promise<HebrewDate> {
  const [hebrewDate, parasha] = await Promise.all([fetchHebrewDate(date), fetchParasha()])

  return {
    ...hebrewDate,
    parasha: parasha || undefined,
  }
}
