"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight, Calendar, Sparkles } from "lucide-react"
import { TALMUD_TRACTATES, calculateDafYomi } from "@/lib/sefaria/talmud"

export default function TalmudPage() {
  const [dafYomi, setDafYomi] = useState<{ tractate: string; daf: number; amud: "a" | "b" } | null>(null)

  useEffect(() => {
    setDafYomi(calculateDafYomi())
  }, [])

  // Group tractates by Seder
  const tractatesBySeder = TALMUD_TRACTATES.reduce(
    (acc, tractate) => {
      if (!acc[tractate.seder]) {
        acc[tractate.seder] = []
      }
      acc[tractate.seder].push(tractate)
      return acc
    },
    {} as Record<string, typeof TALMUD_TRACTATES>,
  )

  const sederNames: Record<string, string> = {
    Zeraim: "זרעים",
    Moed: "מועד",
    Nashim: "נשים",
    Nezikin: "נזיקין",
    Kodashim: "קדשים",
    Tahorot: "טהרות",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-serif">תלמוד בבלי</h1>
          </div>
          <p className="text-xl text-muted-foreground">לימוד דף יומי וכל מסכתות הש״ס - קריאה מילה במילה</p>
        </div>

        {/* Navigation back to learn */}
        <div className="flex justify-start">
          <Link href="/learn">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              חזרה למרכז הלימוד
            </Button>
          </Link>
        </div>

        {/* Daf Yomi Card */}
        {dafYomi && (
          <Card className="border-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">דף היומי להיום</CardTitle>
                  <CardDescription className="text-lg mt-1">
                    מסכת {dafYomi.tractate} דף {dafYomi.daf}
                    {dafYomi.amud}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full text-lg h-12">
                <Link href={`/talmud/${dafYomi.tractate}/${dafYomi.daf}${dafYomi.amud}`}>
                  <Sparkles className="ml-2 h-5 w-5" />
                  התחל לימוד דף היומי
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tractates by Seder */}
        <div className="space-y-8">
          {Object.entries(tractatesBySeder).map(([seder, tractates]) => (
            <div key={seder} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold font-serif">{sederNames[seder] || seder}</h2>
                <Badge variant="secondary">{tractates.length} מסכתות</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tractates.map((tractate) => (
                  <Card key={tractate.en} className="hover:border-primary transition-all hover:shadow-lg group">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">{tractate.he}</CardTitle>
                      <CardDescription>{tractate.en}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {tractate.pages} דפים ({tractate.pages * 2} עמודים)
                      </p>
                      <Button asChild className="w-full">
                        <Link href={`/talmud/${tractate.en}/2a`}>
                          <BookOpen className="ml-2 h-4 w-4" />
                          התחל לימוד
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">אודות לימוד הגמרא</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• דף יומי מחושב אוטומטית לפי המחזור הנוכחי (התחלה: 5 בינואר 2020)</p>
            <p>• 37 מסכתות מהתלמוד הבבלי</p>
            <p>• קריאה מילה במילה של הדף</p>
            <p>• מעקב אחר ההתקדמות שלך</p>
            <p>• הטקסטים נשלפים מספריית Sefaria</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
