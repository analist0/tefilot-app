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
} from "lucide-react"
import { calculateDafYomi } from "@/lib/sefaria/talmud"
import { TEXT_TYPES_CONFIG, type TextType } from "@/types/text-reader"

export default function HomePage() {
  const [dafYomi, setDafYomi] = useState<{ tractate: string; daf: number; amud: "a" | "b" } | null>(null)
  const [enabledTypes, setEnabledTypes] = useState<TextType[]>(["tehilim", "tanakh", "talmud", "tefilot"])

  useEffect(() => {
    setDafYomi(calculateDafYomi())

    const settings = localStorage.getItem("content_settings")
    if (settings) {
      const parsed = JSON.parse(settings)
      const enabled = Object.entries(parsed)
        .filter(([_, value]) => value === true)
        .map(([key]) => key as TextType)
      setEnabledTypes(enabled)
    }
  }, [])

  const getIcon = (type: TextType) => {
    const icons = {
      tehilim: <BookMarked className="h-8 w-8" />,
      tanakh: <Book className="h-8 w-8" />,
      talmud: <BookOpen className="h-8 w-8" />,
      tefilot: <Scroll className="h-8 w-8" />,
      halacha: <Scale className="h-8 w-8" />,
      sefarim: <Library className="h-8 w-8" />,
    }
    return icons[type]
  }

  const getUrl = (type: TextType) => {
    const urls = {
      tehilim: "/tehilim",
      tanakh: "/tanakh",
      talmud: "/talmud",
      tefilot: "/tefilot",
      halacha: "/halacha",
      sefarim: "/sefarim",
    }
    return urls[type]
  }

  const dailyTefilot = [
    { title: "תפילת שחרית", icon: <Sun className="h-6 w-6" />, url: "/tefilot/shacharit", color: "from-yellow-400 to-orange-400" },
    { title: "תפילת מנחה", icon: <Clock className="h-6 w-6" />, url: "/tefilot/mincha", color: "from-orange-400 to-amber-500" },
    { title: "תפילת ערבית", icon: <Moon className="h-6 w-6" />, url: "/tefilot/maariv", color: "from-indigo-500 to-purple-600" },
    { title: "ברכות יומיות", icon: <Heart className="h-6 w-6" />, url: "/tefilot/brachot", color: "from-pink-400 to-rose-500" },
  ]

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-24 px-4">
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">לימוד תורה בכל מקום ובכל זמן</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-serif text-foreground">
            אור הישרה
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            פלטפורמה מתקדמת ללימוד תורה, תנ״ך, תלמוד ותפילות עם מעקב התקדמות וסטטיסטיקות
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/learn">
              <Button size="lg" className="gap-2 text-lg h-14 px-8">
                <BookOpen className="h-5 w-5" />
                התחל ללמוד עכשיו
              </Button>
            </Link>
            <Link href="/tehilim/1">
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8">
                <BookMarked className="h-5 w-5" />
                תהילים פרק א׳
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Community Stats */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">הישגי הקהילה</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif">
              ביחד אנחנו עושים היסטוריה
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              כל פעולה שלך מצטרפת להישגים המשותפים של כל הקהילה
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <BookMarked className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">12,547</p>
                <p className="text-sm font-medium text-muted-foreground">פרקי תהילים נקראו</p>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">8,923</p>
                <p className="text-sm font-medium text-muted-foreground">דפי זוהר נלמדו</p>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="inline-flex p-4 rounded-xl bg-secondary/10 mb-4">
                <Book className="h-8 w-8 text-secondary" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-secondary">3,456</p>
                <p className="text-sm font-medium text-muted-foreground">דפי תלמוד הושלמו</p>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-md transition-shadow">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <Scroll className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">25,891</p>
                <p className="text-sm font-medium text-muted-foreground">תפילות נאמרו</p>
              </div>
            </Card>
          </div>

          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-2 text-center md:text-right">
                  <h3 className="text-2xl font-bold font-serif">
                    הצטרף למהפכת הלימוד הדיגיטלי
                  </h3>
                  <p className="text-muted-foreground">
                    כל קריאה, כל תפילה, כל עמוד - נספרים וחשובים
                  </p>
                </div>
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2 text-lg h-14 px-10">
                    <Star className="h-5 w-5" />
                    הירשם והצטרף אלינו
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Daf Yomi Highlight */}
        {dafYomi && enabledTypes.includes("talmud") && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold font-serif">דף היומי</h2>
            </div>

            <Card className="border border-primary shadow-sm overflow-hidden">
              <div className="bg-primary/5 p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3">
                    <Badge className="text-base px-3 py-1.5">
                      <Calendar className="h-4 w-4 ml-2" />
                      היום
                    </Badge>
                    <h3 className="text-4xl font-bold font-serif">
                      מסכת {dafYomi.tractate} דף {dafYomi.daf}{dafYomi.amud}
                    </h3>
                    <p className="text-muted-foreground text-lg">המחזור הנוכחי החל ב-5 בינואר 2020</p>
                  </div>

                  <Link href={`/talmud/${dafYomi.tractate}/${dafYomi.daf}${dafYomi.amud}`}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-10">
                      <Flame className="h-5 w-5" />
                      התחל לימוד
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Daily Tefilot */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Scroll className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-serif">תפילות יומיות</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dailyTefilot.map((tefila) => (
              <Card key={tefila.title} className="group hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {tefila.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 font-serif">{tefila.title}</h3>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={tefila.url}>
                      <BookOpen className="ml-2 h-4 w-4" />
                      קרא עכשיו
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Types */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-serif">ספריית הלימוד</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enabledTypes.map((type) => {
              const config = TEXT_TYPES_CONFIG[type]
              return (
                <Card
                  key={type}
                  className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-primary overflow-hidden"
                >
                  <div className="h-1 bg-primary" />

                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <div className="text-primary">
                          {getIcon(type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-serif">{config.heTitle}</CardTitle>
                        <CardDescription className="text-base">{config.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {config.heDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {config.features.dailyReading && (
                        <Badge variant="secondary" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          קריאה יומית
                        </Badge>
                      )}
                      {config.features.wordByWord && (
                        <Badge variant="secondary" className="gap-1">
                          <BookOpen className="h-3 w-3" />
                          מילה-מילה
                        </Badge>
                      )}
                      {config.features.statistics && (
                        <Badge variant="secondary" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          סטטיסטיקות
                        </Badge>
                      )}
                    </div>

                    {config.totalSections > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {config.totalSections.toLocaleString("he-IL")} {type === "talmud" ? "דפים" : "פרקים"}
                      </p>
                    )}

                    <Button asChild className="w-full" size="lg" variant="outline">
                      <Link href={getUrl(type)}>
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

        {/* Features Section */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-serif">למה לבחור באור הישרה?</h2>
            <p className="text-xl text-muted-foreground">הטכנולוגיה המתקדמת ביותר ללימוד תורה</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-serif">קריאה מילה-מילה</h3>
              <p className="text-sm text-muted-foreground">התקדמות אוטומטית עם הדגשת המילה הנוכחית</p>
            </Card>

            <Card className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-accent/10 mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-serif">מעקב התקדמות</h3>
              <p className="text-sm text-muted-foreground">סטטיסטיקות מפורטות ומעקב אחר הקריאה שלך</p>
            </Card>

            <Card className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-secondary/10 mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-serif">הדגשת שמות קודש</h3>
              <p className="text-sm text-muted-foreground">כוונות מיוחדות לשמות הקודש</p>
            </Card>

            <Card className="text-center p-6">
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-serif">דף יומי</h3>
              <p className="text-sm text-muted-foreground">חישוב אוטומטי של דף היומי</p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
          <div className="relative px-8 py-16 text-center text-white space-y-6">
            <Sparkles className="h-16 w-16 mx-auto" />
            <h2 className="text-4xl font-bold font-serif">מוכן להתחיל את מסע הלימוד?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-95">
              הצטרף אלינו ללימוד תורה מתקדם עם מעקב התקדמות, סטטיסטיקות ועוד
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/learn">
                <Button size="lg" variant="secondary" className="gap-2 text-lg h-14 px-8">
                  <BookOpen className="h-5 w-5" />
                  מרכז הלימוד
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Star className="h-5 w-5" />
                  הירשם עכשיו
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
