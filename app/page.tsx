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

  const getColor = (type: TextType) => {
    const colors = {
      tehilim: "from-blue-500 to-cyan-500",
      tanakh: "from-green-500 to-emerald-500",
      talmud: "from-purple-500 to-pink-500",
      tefilot: "from-amber-500 to-orange-500",
      halacha: "from-red-500 to-rose-500",
      sefarim: "from-indigo-500 to-violet-500",
    }
    return colors[type]
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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium font-['Frank_Ruhl_Libre']">לימוד תורה בכל מקום ובכל זמן</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-['Frank_Ruhl_Libre'] bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            אור הישרה
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-['Heebo']">
            פלטפורמה מתקדמת ללימוד תורה, תנ״ך, תלמוד ותפילות עם מעקב התקדמות וסטטיסטיקות
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/learn">
              <Button size="lg" className="gap-2 text-lg h-14 px-8 font-['Heebo']">
                <BookOpen className="h-6 w-6" />
                התחל ללמוד עכשיו
              </Button>
            </Link>
            <Link href="/tehilim/1">
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 font-['Heebo']">
                <BookMarked className="h-6 w-6" />
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium font-['Frank_Ruhl_Libre']">הישגי הקהילה</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Frank_Ruhl_Libre']">
              ביחד אנחנו עושים היסטוריה
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-['Heebo']">
              כל פעולה שלך מצטרפת להישגים המשותפים של כל הקהילה
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center p-6 border-2 bg-gradient-to-br from-blue-50 dark:from-blue-950/20 to-transparent">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4">
                <BookMarked className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">12,547</p>
                <p className="text-sm font-medium text-muted-foreground font-['Heebo']">פרקי תהילים נקראו</p>
              </div>
            </Card>

            <Card className="text-center p-6 border-2 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/20 to-transparent">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">8,923</p>
                <p className="text-sm font-medium text-muted-foreground font-['Heebo']">דפי זוהר נלמדו</p>
              </div>
            </Card>

            <Card className="text-center p-6 border-2 bg-gradient-to-br from-purple-50 dark:from-purple-950/20 to-transparent">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4">
                <Book className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">3,456</p>
                <p className="text-sm font-medium text-muted-foreground font-['Heebo']">דפי תלמוד הושלמו</p>
              </div>
            </Card>

            <Card className="text-center p-6 border-2 bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-transparent">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-4">
                <Scroll className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">25,891</p>
                <p className="text-sm font-medium text-muted-foreground font-['Heebo']">תפילות נאמרו</p>
              </div>
            </Card>
          </div>

          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-2 text-center md:text-right">
                  <h3 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">
                    הצטרף למהפכת הלימוד הדיגיטלי
                  </h3>
                  <p className="text-muted-foreground font-['Heebo']">
                    כל קריאה, כל תפילה, כל עמוד - נספרים וחשובים
                  </p>
                </div>
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2 text-lg h-14 px-10 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 font-['Heebo']">
                    <Star className="h-6 w-6" />
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
              <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">דף היומי</h2>
            </div>

            <Card className="border-2 border-primary shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <Badge className="text-lg px-4 py-2 font-['Heebo']">
                      <Calendar className="h-5 w-5 ml-2" />
                      היום
                    </Badge>
                    <h3 className="text-4xl font-bold font-['Frank_Ruhl_Libre']">
                      מסכת {dafYomi.tractate} דף {dafYomi.daf}{dafYomi.amud}
                    </h3>
                    <p className="text-muted-foreground text-lg font-['Heebo']">המחזור הנוכחי החל ב-5 בינואר 2020</p>
                  </div>

                  <Link href={`/talmud/${dafYomi.tractate}/${dafYomi.daf}${dafYomi.amud}`}>
                    <Button size="lg" className="gap-2 text-xl h-16 px-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-['Heebo']">
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
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Scroll className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">תפילות יומיות</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dailyTefilot.map((tefila) => (
              <Card key={tefila.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary">
                <CardHeader className={`bg-gradient-to-br ${tefila.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      {tefila.icon}
                    </div>
                    <Star className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 font-['Frank_Ruhl_Libre']">{tefila.title}</h3>
                  <Button asChild className="w-full font-['Heebo']" variant="outline">
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
            <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">ספריית הלימוד</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enabledTypes.map((type) => {
              const config = TEXT_TYPES_CONFIG[type]
              return (
                <Card
                  key={type}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${getColor(type)}`} />

                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${getColor(type)} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {getIcon(type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-['Frank_Ruhl_Libre']">{config.heTitle}</CardTitle>
                        <CardDescription className="text-base font-['Heebo']">{config.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed font-['Heebo']">
                      {config.heDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {config.features.dailyReading && (
                        <Badge variant="secondary" className="gap-1 font-['Heebo']">
                          <Calendar className="h-3 w-3" />
                          קריאה יומית
                        </Badge>
                      )}
                      {config.features.wordByWord && (
                        <Badge variant="secondary" className="gap-1 font-['Heebo']">
                          <BookOpen className="h-3 w-3" />
                          מילה-מילה
                        </Badge>
                      )}
                      {config.features.statistics && (
                        <Badge variant="secondary" className="gap-1 font-['Heebo']">
                          <TrendingUp className="h-3 w-3" />
                          סטטיסטיקות
                        </Badge>
                      )}
                    </div>

                    {config.totalSections > 0 && (
                      <p className="text-xs text-muted-foreground font-['Heebo']">
                        {config.totalSections.toLocaleString("he-IL")} {type === "talmud" ? "דפים" : "פרקים"}
                      </p>
                    )}

                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground font-['Heebo']" size="lg">
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
            <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">למה לבחור באור הישרה?</h2>
            <p className="text-xl text-muted-foreground font-['Heebo']">הטכנולוגיה המתקדמת ביותר ללימוד תורה</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">קריאה מילה-מילה</h3>
              <p className="text-sm text-muted-foreground font-['Heebo']">התקדמות אוטומטית עם הדגשת המילה הנוכחית</p>
            </Card>

            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">מעקב התקדמות</h3>
              <p className="text-sm text-muted-foreground font-['Heebo']">סטטיסטיקות מפורטות ומעקב אחר הקריאה שלך</p>
            </Card>

            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">הדגשת שמות קודש</h3>
              <p className="text-sm text-muted-foreground font-['Heebo']">כוונות מיוחדות לשמות הקודש</p>
            </Card>

            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <Flame className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">דף יומי</h3>
              <p className="text-sm text-muted-foreground font-['Heebo']">חישוב אוטומטי של דף היומי</p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600" />
          <div className="relative px-8 py-16 text-center text-white space-y-6">
            <Sparkles className="h-16 w-16 mx-auto opacity-80" />
            <h2 className="text-4xl font-bold font-['Frank_Ruhl_Libre']">מוכן להתחיל את מסע הלימוד?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto font-['Heebo']">
              הצטרף אלינו ללימוד תורה מתקדם עם מעקב התקדמות, סטטיסטיקות ועוד
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/learn">
                <Button size="lg" variant="secondary" className="gap-2 text-lg h-14 px-8 font-['Heebo']">
                  <BookOpen className="h-6 w-6" />
                  מרכז הלימוד
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30 font-['Heebo']">
                  <Star className="h-6 w-6" />
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
