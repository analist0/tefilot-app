"use client"

import type React from "react"
import { useState } from "react"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, BookOpen, Loader2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const passwordChecks = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
  }
  const isPasswordValid = passwordChecks.length && passwordChecks.hasNumber

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים ומספר אחד")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: { full_name: fullName },
        },
      })

      if (signUpError) {
        setError(
          signUpError.message === "User already registered" ? "משתמש עם אימייל זה כבר קיים" : signUpError.message,
        )
        setLoading(false)
        return
      }

      if (!data.session) {
        setError("שגיאה ביצירת חשבון - אין session")
        setLoading(false)
        return
      }

      // Refresh the page to trigger middleware and update session
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Register error:", err)
      setError("שגיאה בהרשמה. נסה שוב")
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12"
      dir="rtl"
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">הרשמה</CardTitle>
            <CardDescription className="mt-2">צור חשבון חדש באור הישירה</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="ישראל ישראלי"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.length ? "bg-green-500" : "bg-muted"}`}
                    >
                      {passwordChecks.length && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordChecks.length ? "text-green-600" : "text-muted-foreground"}>
                      לפחות 6 תווים
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.hasNumber ? "bg-green-500" : "bg-muted"}`}
                    >
                      {passwordChecks.hasNumber && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={passwordChecks.hasNumber ? "text-green-600" : "text-muted-foreground"}>
                      מכיל מספר אחד לפחות
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={loading || !isPasswordValid}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "יוצר חשבון..." : "צור חשבון והתחבר"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              כבר יש לך חשבון?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                התחבר
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
