"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  BookMarked,
  Book,
  Scroll,
  Scale,
  Library,
  Sparkles,
  TrendingUp,
  Calendar,
  Sun,
  Moon,
  Clock,
  Heart,
  Star,
  Flame,
  ArrowRight,
} from "lucide-react"
import { TEXT_TYPES_CONFIG, type TextType } from "@/types/text-reader"
import { calculateDafYomi } from "@/lib/sefaria/talmud"

export default function LearnPage() {
  const [enabledTypes, setEnabledTypes] = useState<TextType[]>(["tehilim", "tanakh", "talmud", "tefilot", "zohar", "etz_chaim"])
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

    setDafYomi(calculateDafYomi())
  }, [])

  const getTypeUrl = (type: TextType) => {
    const urls = {
      tehilim: "/tehilim",
      tanakh: "/tanakh",
      talmud: "/talmud",
      tefilot: "/tefilot",
      halacha: "/halacha",
      sefarim: "/sefarim",
      zohar: "/zohar",
      etz_chaim: "/etz-chaim",
    }
    return urls[type]
  }

  const getIcon = (type: TextType) => {
    const icons = {
      tehilim: <BookMarked className="h-10 w-10" />,
      tanakh: <Book className="h-10 w-10" />,
      talmud: <BookOpen className="h-10 w-10" />,
      tefilot: <Scroll className="h-10 w-10" />,
      halacha: <Scale className="h-10 w-10" />,
      sefarim: <Library className="h-10 w-10" />,
      zohar: <Sparkles className="h-10 w-10" />,
      etz_chaim: <Star className="h-10 w-10" />,
    }
    return icons[type]
  }

  const getColor = (type: TextType) => {
    const colors = {
      tehilim: "from-blue-500 to-cyan-500",
      tanakh: "from-green-500 to-emerald-500",
      talmud: "from-purple-500 to-pink-500",
      tefilot: "from-amber-500 to-orange-500",
      halacha: "from-red-500 to-rose-500",
      sefarim: "from-indigo-500 to-violet-500",
      zohar: "from-cyan-400 to-blue-600",
      etz_chaim: "from-emerald-400 to-green-600",
    }
    return colors[type]
  }

  const dailyTefilot = [
    { title: "תפילת שחרית", icon: <Sun className="h-8 w-8" />, url: "/tefilot/shacharit", color: "from-yellow-400 to-orange-400", desc: "תפילת הבוקר" },
    { title: "תפילת מנחה", icon: <Clock className="h-8 w-8" />, url: "/tefilot/mincha", color: "from-orange-400 to-amber-500", desc: "תפילת אחר הצהריים" },
    { title: "תפילת ערבית", icon: <Moon className="h-8 w-8" />, url: "/tefilot/maariv", color: "from-indigo-500 to-purple-600", desc: "תפילת הערב" },
    { title: "ברכות", icon: <Heart className="h-8 w-8" />, url: "/tefilot/brachot", color: "from-pink-400 to-rose-500", desc: "ברכות יומיות" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]" />
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">מרכז לימוד מתקדם</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            מרכז הלימוד
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            לימוד תורה, תנ״ך, תלמוד ותפילות עם מעקב התקדמות, סטטיסטיקות וקריאה מילה-מילה
          </p>

          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              חזרה לדף הראשי
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Daf Yomi Highlight */}
        {dafYomi && enabledTypes.includes("talmud") && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-serif">דף היומי</h2>
                <p className="text-muted-foreground">המחזור הנוכחי החל ב-5 בינואר 2020</p>
              </div>
            </div>

            <Card className="border-2 border-primary shadow-2xl overflow-hidden group hover:shadow-3xl transition-all">
              <div className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 text-center md:text-right">
                    <Badge className="text-base px-4 py-2 bg-primary">
                      <Calendar className="h-4 w-4 ml-2" />
                      היום
                    </Badge>
                    <h3 className="text-4xl md:text-5xl font-bold font-serif">
                      מסכת {dafYomi.tractate}
                    </h3>
                    <p className="text-3xl font-medium text-primary">
                      דף {dafYomi.daf}{dafYomi.amud}
                    </p>
                  </div>

                  <Link href={`/talmud/${dafYomi.tractate}/${dafYomi.daf}${dafYomi.amud}`}>
                    <Button size="lg" className="gap-2 text-xl h-16 px-12 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-lg">
                      <Flame className="h-7 w-7" />
                      התחל לימוד
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Daily Tefilot */}
        {enabledTypes.includes("tefilot") && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                <Scroll className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-serif">תפילות יומיות</h2>
                <p className="text-muted-foreground">סידור מלא לכל היום</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dailyTefilot.map((tefila) => (
                <Card key={tefila.title} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${tefila.color}`} />
                  <CardHeader className="space-y-3">
                    <div className={`inline-flex self-start p-4 rounded-2xl bg-gradient-to-br ${tefila.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {tefila.icon}
                    </div>
                    <CardTitle className="text-2xl">{tefila.title}</CardTitle>
                    <CardDescription className="text-base">{tefila.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full group-hover:bg-primary" size="lg">
                      <Link href={tefila.url}>
                        <BookOpen className="ml-2 h-5 w-5" />
                        התחל תפילה
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Types */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
              <Library className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-serif">ספריית הלימוד</h2>
              <p className="text-muted-foreground">כל מה שצריך ללימוד מעמיק</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enabledTypes.map((type) => {
              const config = TEXT_TYPES_CONFIG[type]
              return (
                <Card
                  key={type}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary overflow-hidden"
                >
                  <div className={`h-3 bg-gradient-to-r ${getColor(type)}`} />

                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-5 rounded-2xl bg-gradient-to-br ${getColor(type)} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {getIcon(type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-serif">{config.heTitle}</CardTitle>
                        <CardDescription className="text-sm mt-1">{config.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                      {config.heDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {config.features.dailyReading && (
                        <Badge variant="secondary" className="gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          קריאה יומית
                        </Badge>
                      )}
                      {config.features.wordByWord && (
                        <Badge variant="secondary" className="gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          מילה-מילה
                        </Badge>
                      )}
                      {config.features.statistics && (
                        <Badge variant="secondary" className="gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                          סטטיסטיקות
                        </Badge>
                      )}
                    </div>

                    {config.totalSections > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>{config.totalSections.toLocaleString("he-IL")} {type === "talmud" ? "דפים" : "פרקים"}</span>
                      </div>
                    )}

                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground shadow-md" size="lg">
                      <Link href={getTypeUrl(type)}>
                        <BookOpen className="ml-2 h-5 w-5" />
                        התחל לימוד
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* No Content Enabled */}
        {enabledTypes.length === 0 && (
          <Card className="border-2">
            <CardContent className="py-16 text-center space-y-4">
              <Library className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">אין תוכן זמין כרגע</h3>
                <p className="text-muted-foreground">אנא פנה למנהל האתר להפעלת תכנים</p>
              </div>
              <Link href="/admin/content-settings">
                <Button variant="outline" className="gap-2">
                  <Scale className="h-4 w-4" />
                  הגדרות תוכן
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
