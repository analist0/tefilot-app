import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Shield, User } from "lucide-react"

const roleLabels = {
  admin: { label: "מנהל", color: "bg-red-500/10 text-red-500" },
  editor: { label: "עורך", color: "bg-blue-500/10 text-blue-500" },
  user: { label: "משתמש", color: "bg-gray-500/10 text-gray-500" },
}

export default async function UsersPage() {
  const supabase = await createClient()

  // בדיקה שהמשתמש הוא admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (currentProfile?.role !== "admin") {
    redirect("/admin")
  }

  // שליפת כל המשתמשים
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">ניהול משתמשים</h1>
          <p className="text-muted-foreground">ניהול משתמשים והרשאות</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{profiles?.length || 0} משתמשים</span>
        </div>
      </div>

      <div className="grid gap-4">
        {profiles?.map((profile) => {
          const role = roleLabels[profile.role as keyof typeof roleLabels]
          const initials = profile.full_name
            ? profile.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
            : profile.email.slice(0, 2).toUpperCase()

          return (
            <Card key={profile.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{profile.full_name || "ללא שם"}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      הצטרף: {new Date(profile.created_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={role.color}>
                    <Shield className="h-3 w-3 ml-1" />
                    {role.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!profiles || profiles.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium">אין משתמשים</h3>
              <p className="text-sm text-muted-foreground">משתמשים חדשים יופיעו כאן</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
