"use server"

import { createClient } from "@/lib/supabase/server"

export async function subscribeToNewsletter(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "כתובת המייל כבר רשומה" }
    }
    return { success: false, error: "אירעה שגיאה בהרשמה" }
  }

  return { success: true }
}
