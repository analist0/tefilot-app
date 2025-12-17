"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    try {
      const result = await subscribeToNewsletter(email)
      if (result.success) {
        setStatus("success")
        setMessage("תודה! נרשמת בהצלחה לניוזלטר")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(result.error || "אירעה שגיאה")
      }
    } catch {
      setStatus("error")
      setMessage("אירעה שגיאה בהרשמה")
    }
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="container px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3">הצטרף לניוזלטר</h2>
          <p className="text-muted-foreground mb-6">קבל מאמרים חדשים ותכנים מיוחדים ישירות למייל</p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="הכנס את המייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                dir="ltr"
                required
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "הרשם"}
              </Button>
            </form>
          )}

          {status === "error" && <p className="text-red-500 text-sm mt-2">{message}</p>}
        </div>
      </div>
    </section>
  )
}
