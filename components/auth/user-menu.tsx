"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, Shield, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Profile } from "@/types/auth"

export function UserMenu() {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    const timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, 3000) // אם אחרי 3 שניות עדיין טוען, מפסיקים

    const getUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          if (mounted) {
            setLoading(false)
            setUser(null)
            setProfile(null)
          }
          return
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          if (mounted) {
            setLoading(false)
            setUser(null)
            setProfile(null)
          }
          return
        }

        if (mounted) {
          setUser({ email: user.email || "", id: user.id })

          try {
            const { data: profile, error: profileError } = await Promise.race([
              supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
              new Promise<{ data: null; error: Error }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: new Error("Timeout") }), 2000),
              ),
            ])

            if (mounted && profile && !profileError) {
              setProfile(profile as Profile)
            }
          } catch (error) {
            // שגיאה בטעינת פרופיל - לא חמור, נמשיך בלי
            console.error("Error loading profile:", error)
          }

          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading user:", error)
        if (mounted) {
          setLoading(false)
          setUser(null)
          setProfile(null)
        }
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (!mounted) return

      if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser({ email: session.user.email || "", id: session.user.id })

        try {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle()

          if (mounted && profile) {
            setProfile(profile as Profile)
          }
        } catch (error) {
          console.error("Error loading profile on sign in:", error)
        }
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser({ email: session.user.email || "", id: session.user.id })
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">התחברות</span>
        </Button>
      </Link>
    )
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  const canAccessAdmin = profile?.role === "admin" || profile?.role === "editor"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{profile?.full_name || "משתמש"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {profile?.role && profile.role !== "user" && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              <Shield className="h-3 w-3" />
              {profile.role === "admin" ? "מנהל" : "עורך"}
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="h-4 w-4 ml-2" />
            הפרופיל שלי
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="h-4 w-4 ml-2" />
            הגדרות
          </Link>
        </DropdownMenuItem>
        {canAccessAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="h-4 w-4 ml-2" />
                ניהול האתר
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
          <LogOut className="h-4 w-4 ml-2" />
          התנתק
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
