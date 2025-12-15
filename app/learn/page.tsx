"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Book, ScrollText, Sparkles, TrendingUp, Calendar } from "lucide-react"
import { TEXT_TYPES_CONFIG, type TextType } from "@/types/text-reader"
import { calculateDafYomi } from "@/lib/sefaria/talmud"

export default function LearnPage() {
  const [enabledTypes, setEnabledTypes] = useState<TextType[]>(["tehilim"])
  const [dafYomi, setDafYomi] = useState<{ tractate: string; daf: number; amud: "a" | "b" } | null>(null)

  useEffect(() => {
    const settings = localStorage.getItem("content_settings")
    if (settings) {
      const parsed = JSON.parse(settings)
      const enabled = Object.entries(parsed)
        .filter(([_, value]) => value === true)
        .map(([key]) => key as TextType)
      setEnabledTypes(enabled)
    }

    // Calculate today's Daf Yomi
    setDafYomi(calculateDafYomi())
  }, [])

  const getTypeUrl = (type: TextType) => {
    switch (type) {
      case "tehilim":
        return "/tehilim"
      case "tanakh":
        return "/tanakh"
      case "talmud":
        return "/talmud"
      case "tefilot":
        return "/tefilot"
      case "halacha":
        return "/halacha"
      case "sefarim":
        return "/sefarim"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-serif">מרכז הלימוד</h1>
          <p className="text-xl text-muted-foreground">
            לימוד תורה בכל מקום ובכל זמן - עם מעקב התקדמות וסטטיסטיקות
          </p>
        </div>

        {/* Daf Yomi Card */}
        {enabledTypes.includes("talmud") && dafYomi && (
          <Card className="border-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <CardTitle>דף היומי להיום</CardTitle>
              </div>
              <CardDescription>מסכת {dafYomi.tractate} דף {dafYomi.daf}{dafYomi.amud}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link href={`/talmud/${dafYomi.tractate}/${dafYomi.daf}${dafYomi.amud}`}>
                  <BookOpen className="ml-2 h-5 w-5" />
                  התחל לימוד דף היומי
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Content Types Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enabledTypes.map((type) => {
            const config = TEXT_TYPES_CONFIG[type]
            return (
              <Card key={type} className="hover:border-primary transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{config.icon}</span>
                    <div>
                      <CardTitle>{config.heTitle}</CardTitle>
                      <CardDescription className="text-xs">{config.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{config.heDescription}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {config.features.dailyReading && (
                      <Badge variant="secondary" className="text-xs">
                        📅 יומי
                      </Badge>
                    )}
                    {config.features.wordByWord && (
                      <Badge variant="secondary" className="text-xs">
                        📝 מילה-מילה
                      </Badge>
                    )}
                    {config.features.statistics && (
                      <Badge variant="secondary" className="text-xs">
                        📊 סטטיסטיקות
                      </Badge>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={getTypeUrl(type)}>
                      <BookOpen className="ml-2 h-4 w-4" />
                      פתח
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Content Enabled */}
        {enabledTypes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                אין תוכן זמין כרגע. אנא פנה למנהל האתר להפעלת תכנים.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
