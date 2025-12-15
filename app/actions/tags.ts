"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface TagData {
  id?: string
  name: string
  slug: string
}

export async function getTags() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("tags").select("*").order("usage_count", { ascending: false })

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  return data || []
}

export async function saveTag(data: TagData) {
  const supabase = await createClient()

  const tagData = {
    name: data.name,
    slug: data.slug,
  }

  if (data.id) {
    const { error } = await supabase.from("tags").update(tagData).eq("id", data.id)

    if (error) {
      console.error("Error updating tag:", error)
      return { success: false, error: error.message }
    }
  } else {
    const { error } = await supabase.from("tags").insert(tagData)

    if (error) {
      console.error("Error creating tag:", error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/admin/tags")

  return { success: true }
}

export async function deleteTag(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tags").delete().eq("id", id)

  if (error) {
    console.error("Error deleting tag:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/tags")

  return { success: true }
}

export async function mergeTags(sourceId: string, targetId: string) {
  const supabase = await createClient()

  // Get source tag name
  const { data: sourceTag } = await supabase.from("tags").select("name").eq("id", sourceId).single()
  const { data: targetTag } = await supabase.from("tags").select("name, usage_count").eq("id", targetId).single()

  if (!sourceTag || !targetTag) {
    return { success: false, error: "תגית לא נמצאה" }
  }

  // Update all articles that use source tag to use target tag instead
  const { data: articles } = await supabase.from("articles").select("id, tags").contains("tags", [sourceTag.name])

  if (articles) {
    for (const article of articles) {
      const newTags = article.tags.filter((t: string) => t !== sourceTag.name).concat(targetTag.name)

      // Remove duplicates
      const uniqueTags = [...new Set(newTags)]

      await supabase.from("articles").update({ tags: uniqueTags }).eq("id", article.id)
    }
  }

  // Delete source tag
  await supabase.from("tags").delete().eq("id", sourceId)

  // Update target tag usage count
  await updateTagUsageCount(targetTag.name)

  revalidatePath("/admin/tags")

  return { success: true }
}

export async function updateTagUsageCount(tagName: string) {
  const supabase = await createClient()

  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .contains("tags", [tagName])

  await supabase
    .from("tags")
    .update({ usage_count: count || 0 })
    .eq("name", tagName)
}

export async function syncAllTagUsageCounts() {
  const supabase = await createClient()

  const { data: tags } = await supabase.from("tags").select("name")

  if (tags) {
    for (const tag of tags) {
      await updateTagUsageCount(tag.name)
    }
  }

  revalidatePath("/admin/tags")

  return { success: true }
}
