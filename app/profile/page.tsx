import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-serif">הפרופיל שלי</h1>
          <p className="text-muted-foreground mt-2">ערוך את פרטי המשתמש והגדרות החשבון שלך</p>
        </div>

        <ProfileForm user={user} profile={profile} />
      </div>
    </div>
  )
}
