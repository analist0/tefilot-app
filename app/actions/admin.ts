"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ArticleData {
  id?: string
  title: string
  subtitle?: string
  slug: string
  content: string
  excerpt?: string
  category_id: string | null
  tags: string[]
  hebrew_date?: string
  reading_time: number
  status: "draft" | "published" | "archived"
  is_featured: boolean
  meta_description?: string
}

export async function saveArticle(data: ArticleData) {
  const supabase = await createClient()

  const articleData = {
    title: data.title,
    subtitle: data.subtitle || null,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt || null,
    category_id: data.category_id,
    tags: data.tags,
    hebrew_date: data.hebrew_date || null,
    reading_time: data.reading_time,
    status: data.status,
    is_featured: data.is_featured,
    meta_description: data.meta_description || null,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  }

  if (data.id) {
    // Update existing article
    const { error } = await supabase.from("articles").update(articleData).eq("id", data.id)

    if (error) {
      console.error("Error updating article:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Create new article
    const { error } = await supabase.from("articles").insert(articleData)

    if (error) {
      console.error("Error creating article:", error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/")
  revalidatePath("/articles")
  revalidatePath("/admin/articles")

  return { success: true }
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("articles").delete().eq("id", id)

  if (error) {
    console.error("Error deleting article:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/articles")
  revalidatePath("/admin/articles")

  return { success: true }
}

export async function updateCommentStatus(id: string, status: "approved" | "spam") {
  const supabase = await createClient()

  const { error } = await supabase.from("comments").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating comment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/comments")

  return { success: true }
}

export async function deleteComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("comments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting comment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/comments")

  return { success: true }
}
