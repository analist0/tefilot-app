"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, BookOpen, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif">נשלח בהצלחה</CardTitle>
              <CardDescription className="mt-2">שלחנו לך אימייל עם קישור לאיפוס הסיסמה</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="text-center text-sm text-muted-foreground">
            <p>בדוק את תיבת הדואר שלך ב-{email}</p>
            <p className="mt-2">לא קיבלת? בדוק בתיקיית הספאם</p>
          </CardContent>

          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <ArrowRight className="h-4 w-4" />
                חזרה להתחברות
              </Button>
            </Link>
          </CardFooter>
        </Card>
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
            <CardTitle className="text-2xl font-serif">שכחת סיסמה?</CardTitle>
            <CardDescription className="mt-2">הזן את האימייל שלך ונשלח לך קישור לאיפוס</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {loading ? "שולח..." : "שלח קישור איפוס"}
            </Button>

            <Link href="/auth/login" className="text-sm text-primary hover:underline">
              חזרה להתחברות
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
