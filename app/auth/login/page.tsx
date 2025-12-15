"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, LogIn, BookOpen, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message === "Invalid login credentials" ? "אימייל או סיסמה שגויים" : signInError.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        setError("שגיאה בהתחברות - אין session")
        setLoading(false)
        return
      }

      // Refresh the page to trigger middleware and update session
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      console.error("Login error:", err)
      setError("שגיאה בהתחברות. נסה שוב")
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
            <CardTitle className="text-2xl font-serif">התחברות</CardTitle>
            <CardDescription className="mt-2">ברוכים הבאים לאור הישירה</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
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
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? "מתחבר..." : "התחבר"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              אין לך חשבון?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                הירשם עכשיו
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
