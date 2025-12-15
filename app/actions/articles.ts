"use server"

import { createClient } from "@/lib/supabase/server"

export async function incrementViews(articleId: string) {
  const supabase = await createClient()

  await supabase.rpc("increment_views", {
    article_uuid: articleId,
  })
}
