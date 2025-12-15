"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CategoryData {
  id?: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  order_index?: number
}

export async function saveCategory(data: CategoryData) {
  const supabase = await createClient()

  const categoryData = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    icon: data.icon || null,
    color: data.color || null,
    order_index: data.order_index || 0,
  }

  if (data.id) {
    const { error } = await supabase.from("categories").update(categoryData).eq("id", data.id)

    if (error) {
      console.error("Error updating category:", error)
      return { success: false, error: error.message }
    }
  } else {
    const { error } = await supabase.from("categories").insert(categoryData)

    if (error) {
      console.error("Error creating category:", error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/")
  revalidatePath("/admin/categories")

  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Check if category has articles
  const { data: articles } = await supabase.from("articles").select("id").eq("category_id", id).limit(1)

  if (articles && articles.length > 0) {
    return { success: false, error: "לא ניתן למחוק קטגוריה שיש בה מאמרים" }
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin/categories")

  return { success: true }
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await createClient()

  const updates = orderedIds.map((id, index) => supabase.from("categories").update({ order_index: index }).eq("id", id))

  await Promise.all(updates)

  revalidatePath("/")
  revalidatePath("/admin/categories")

  return { success: true }
}
