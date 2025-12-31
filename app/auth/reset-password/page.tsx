"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, BookOpen, Loader2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // בדיקה שיש session תקין מהקישור
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        setError("קישור לא תקין או פג תוקף. נסה שוב.")
      }
    }
    checkSession()
  }, [supabase])

  const passwordChecks = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    match: password === confirmPassword && password.length > 0,
  }
  const isValid = passwordChecks.length && passwordChecks.hasNumber && passwordChecks.match

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      setError("אנא מלא את כל הדרישות")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  if (!ready && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">איפוס סיסמה</CardTitle>
            <CardDescription className="mt-2">בחר סיסמה חדשה לחשבון שלך</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה חדשה</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || !ready}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !ready}
                className="text-left"
                dir="ltr"
              />
            </div>

            {password.length > 0 && (
              <div className="space-y-1.5">
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
                    מכיל מספר
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.match ? "bg-green-500" : "bg-muted"}`}
                  >
                    {passwordChecks.match && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={passwordChecks.match ? "text-green-600" : "text-muted-foreground"}>
                    הסיסמאות תואמות
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full gap-2" disabled={loading || !isValid || !ready}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {loading ? "מעדכן..." : "עדכן סיסמה"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
