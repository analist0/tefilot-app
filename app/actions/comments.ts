"use server"

import { createClient } from "@/lib/supabase/server"

interface CommentData {
  article_id: string
  parent_id: string | null
  author_name: string
  author_email: string
  content: string
}

export async function submitComment(data: CommentData) {
  const supabase = await createClient()

  const { error } = await supabase.from("comments").insert({
    article_id: data.article_id,
    parent_id: data.parent_id,
    author_name: data.author_name,
    author_email: data.author_email,
    content: data.content,
    status: "pending",
  })

  if (error) {
    console.error("Error submitting comment:", error)
    return { success: false, error: "שגיאה בשליחת התגובה" }
  }

  return { success: true }
}
