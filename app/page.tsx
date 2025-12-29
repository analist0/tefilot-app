"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
  ArrowLeft,
  Zap,
  Target,
  Users,
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
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-sm font-medium font-['Frank_Ruhl_Libre']">לימוד תורה בכל מקום ובכל זמן</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-['Frank_Ruhl_Libre'] bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            אור הישרה
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-['Heebo']"
          >
            פלטפורמה מתקדמת ללימוד תורה, תנ״ך, תלמוד ותפילות עם מעקב התקדמות וסטטיסטיקות
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link href="/learn">
              <Button size="lg" className="gap-2 text-lg h-14 px-8 font-['Heebo'] shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
                התחל ללמוד עכשיו
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/tehilim/1">
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 font-['Heebo'] hover:shadow-lg transition-all hover:scale-105 group border-2">
                <BookMarked className="h-6 w-6 group-hover:scale-110 transition-transform" />
                תהילים פרק א׳
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Community Stats */}
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2 rounded-full border border-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium font-['Frank_Ruhl_Libre']">הישגי הקהילה</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Frank_Ruhl_Libre']">
              ביחד אנחנו עושים היסטוריה
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-['Heebo']">
              כל פעולה שלך מצטרפת להישגים המשותפים של כל הקהילה
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center p-6 border-2 bg-gradient-to-br from-blue-50 dark:from-blue-950/20 to-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4 shadow-lg"
                >
                  <BookMarked className="h-8 w-8" />
                </motion.div>
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-4xl font-bold text-blue-600 dark:text-blue-400"
                  >
                    12,547
                  </motion.p>
                  <p className="text-sm font-medium text-muted-foreground font-['Heebo']">פרקי תהילים נקראו</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="text-center p-6 border-2 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/20 to-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white mb-4 shadow-lg"
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl font-bold text-cyan-600 dark:text-cyan-400"
                  >
                    8,923
                  </motion.p>
                  <p className="text-sm font-medium text-muted-foreground font-['Heebo']">דפי זוהר נלמדו</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="text-center p-6 border-2 bg-gradient-to-br from-purple-50 dark:from-purple-950/20 to-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg"
                >
                  <Book className="h-8 w-8" />
                </motion.div>
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-4xl font-bold text-purple-600 dark:text-purple-400"
                  >
                    3,456
                  </motion.p>
                  <p className="text-sm font-medium text-muted-foreground font-['Heebo']">דפי תלמוד הושלמו</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="text-center p-6 border-2 bg-gradient-to-br from-amber-50 dark:from-amber-950/20 to-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white mb-4 shadow-lg"
                >
                  <Scroll className="h-8 w-8" />
                </motion.div>
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-4xl font-bold text-amber-600 dark:text-amber-400"
                  >
                    25,891
                  </motion.p>
                  <p className="text-sm font-medium text-muted-foreground font-['Heebo']">תפילות נאמרו</p>
                </div>
              </Card>
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
              <Scroll className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">תפילות יומיות</h2>
              <p className="text-muted-foreground">סידור מלא לכל היום</p>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dailyTefilot.map((tefila, index) => (
              <motion.div
                key={tefila.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${tefila.color}`} />
                  <CardHeader className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`inline-flex self-start p-4 rounded-2xl bg-gradient-to-br ${tefila.color} text-white shadow-lg mb-3`}
                    >
                      {tefila.icon}
                    </motion.div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold font-['Frank_Ruhl_Libre']">{tefila.title}</h3>
                      <Star className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:fill-current transition-all" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full font-['Heebo'] group-hover:bg-primary shadow-md" size="lg" variant="outline">
                      <Link href={tefila.url} className="gap-2">
                        <BookOpen className="h-5 w-5" />
                        קרא עכשיו
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Content Types */}
        <section className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
              <Library className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">ספריית הלימוד</h2>
              <p className="text-muted-foreground">כל מה שצריך ללימוד מעמיק</p>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enabledTypes.map((type, index) => {
              const config = TEXT_TYPES_CONFIG[type]
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary overflow-hidden h-full">
                    <div className={`h-3 bg-gradient-to-r ${getColor(type)}`} />

                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`p-4 rounded-2xl bg-gradient-to-br ${getColor(type)} text-white shadow-lg`}
                        >
                          {getIcon(type)}
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-['Frank_Ruhl_Libre'] group-hover:text-primary transition-colors">{config.heTitle}</CardTitle>
                          <CardDescription className="text-base font-['Heebo']">{config.title}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed font-['Heebo'] min-h-[3rem]">
                        {config.heDescription}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {config.features.dailyReading && (
                          <Badge variant="secondary" className="gap-1.5 font-['Heebo'] hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Calendar className="h-3.5 w-3.5" />
                            קריאה יומית
                          </Badge>
                        )}
                        {config.features.wordByWord && (
                          <Badge variant="secondary" className="gap-1.5 font-['Heebo'] hover:bg-primary hover:text-primary-foreground transition-colors">
                            <BookOpen className="h-3.5 w-3.5" />
                            מילה-מילה
                          </Badge>
                        )}
                        {config.features.statistics && (
                          <Badge variant="secondary" className="gap-1.5 font-['Heebo'] hover:bg-primary hover:text-primary-foreground transition-colors">
                            <TrendingUp className="h-3.5 w-3.5" />
                            סטטיסטיקות
                          </Badge>
                        )}
                      </div>

                      {config.totalSections > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span className="font-['Heebo']">
                            {config.totalSections.toLocaleString("he-IL")} {type === "talmud" ? "דפים" : "פרקים"}
                          </span>
                        </div>
                      )}

                      <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground font-['Heebo'] shadow-md" size="lg">
                        <Link href={getUrl(type)} className="gap-2">
                          <Zap className="h-5 w-5 group-hover:animate-pulse" />
                          התחל לימוד
                          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
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
