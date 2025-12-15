"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

function generateFingerprint(ip: string, userAgent: string): string {
  // Simple fingerprint based on IP and user agent
  const data = `${ip}-${userAgent}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function submitRating(articleId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    return { success: false, error: "דירוג לא תקין" }
  }

  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
  const userAgent = headersList.get("user-agent") || "unknown"
  const fingerprint = generateFingerprint(ip, userAgent)

  const supabase = await createClient()

  // Upsert rating
  const { error: ratingError } = await supabase.from("ratings").upsert(
    {
      article_id: articleId,
      rating,
      fingerprint,
    },
    {
      onConflict: "article_id,fingerprint",
    },
  )

  if (ratingError) {
    console.error("Error submitting rating:", ratingError)
    return { success: false, error: "שגיאה בשליחת הדירוג" }
  }

  // Update article average rating
  const { data: ratings } = await supabase.from("ratings").select("rating").eq("article_id", articleId)

  if (ratings && ratings.length > 0) {
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

    await supabase
      .from("articles")
      .update({
        average_rating: Math.round(average * 10) / 10,
        ratings_count: ratings.length,
      })
      .eq("id", articleId)
  }

  return { success: true }
}
