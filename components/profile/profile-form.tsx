"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/admin/image-upload"
import type { Profile } from "@/types"

interface ProfileFormProps {
  user: any
  profile: Profile | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [saving, setSaving] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          email: user.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "הצלחה",
        description: "הפרופיל עודכן בהצלחה",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הפרופיל",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי משתמש</CardTitle>
        <CardDescription>עדכן את המידע האישי שלך</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* استخدام בקומפוננטת ImageUpload חדשה עם drag & drop */}
        <div className="space-y-2">
          <Label>תמונת פרופיל</Label>
          <div className="w-40 mx-auto">
            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} bucket="avatars" folder="profile" maxSize={2} />
          </div>
          <p className="text-xs text-muted-foreground text-center">JPG, PNG או WEBP. גודל מקסימלי 2MB</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">שם מלא</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="הכנס שם מלא"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">אימייל</Label>
          <Input id="email" value={user.email || ""} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">לא ניתן לשנות את כתובת המייל</p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2 w-full">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "שומר..." : "שמור שינויים"}
        </Button>
      </CardContent>
    </Card>
  )
}
