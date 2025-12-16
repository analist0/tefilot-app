"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Clock, Moon, Heart, BookOpen, Scroll, Home, ArrowRight, Sparkles } from "lucide-react"

export default function TefilotPage() {
  const tefilot = [
    {
      title: "תפילת שחרית",
      description: "תפילת הבוקר - סידור מלא",
      longDescription: "תפילת שחרית היא תפילת הבוקר, המקבילה לקרבן התמיד של שחר. כוללת ברכות השחר, פסוקי דזמרה, קריאת שמע, עמידה ועוד.",
      icon: <Sun className="h-10 w-10" />,
      url: "/tefilot/shacharit",
      color: "from-yellow-400 to-orange-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      title: "תפילת מנחה",
      description: "תפילת אחר הצהריים",
      longDescription: "תפילת מנחה היא התפילה הקצרה ביותר, המקבילה לקרבן מנחה. כוללת אשרי, עמידה, תחנון ועלינו.",
      icon: <Clock className="h-10 w-10" />,
      url: "/tefilot/mincha",
      color: "from-orange-400 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "תפילת ערבית",
      description: "תפילת הערב - מעריב",
      longDescription: "תפילת ערבית (מעריב) היא תפילת הערב. כוללת קריאת שמע עם ברכותיה, עמידה ועלינו. תפילה זו מעבירה אותנו מיום ללילה.",
      icon: <Moon className="h-10 w-10" />,
      url: "/tefilot/maariv",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    {
      title: "ברכות",
      description: "ברכות יומיות ומצוות",
      longDescription: "אוסף ברכות לכל צורך - ברכות השחר, ברכות הנהנין, ברכת המזון וברכות על קיום מצוות. כל ברכה מקשרת אותנו לקב\"ה.",
      icon: <Heart className="h-10 w-10" />,
      url: "/tefilot/brachot",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-50/20 dark:via-amber-950/10 to-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white py-16 px-4">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_80%)]" />
        <div className="relative max-w-6xl mx-auto space-y-6">
          <Link href="/learn">
            <Button variant="ghost" className="text-white hover:bg-white/20 gap-2 -mr-2">
              <Home className="h-4 w-4" />
              חזרה למרכז הלימוד
            </Button>
          </Link>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">סידור תפילה מלא</span>
            </div>

            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white/20 rounded-3xl backdrop-blur-sm">
                <Scroll className="h-20 w-20" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-['Frank_Ruhl_Libre']">
              תפילות ישראל
            </h1>

            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto font-['Heebo']">
              סידור תפילה מלא לכל היום - שחרית, מנחה, ערבית וברכות
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Info Section */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <BookOpen className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <h2 className="text-2xl font-bold font-['Frank_Ruhl_Libre']">על התפילות</h2>
                <p className="text-muted-foreground leading-relaxed">
                  שלוש תפילות ביום - שחרית, מנחה וערבית - הן עמוד השדרה של חיי היהודי.
                  כל תפילה מקבילה לאחד מקרבנות התמיד שהיו במקדש, ומעבירה אותנו בין שלבי היום השונים.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  בנוסף לתפילות, הברכות המלוות אותנו לאורך היום - על האוכל, על המצוות, ועל כל דבר שאנו נהנים ממנו -
                  הן הדרך שלנו להודות לקב"ה ולהכיר בטובו.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre'] text-center">בחר תפילה</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {tefilot.map((tefila, index) => (
              <motion.div
                key={tefila.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="group overflow-hidden border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                <div className={`h-2 bg-gradient-to-r ${tefila.color}`} />

                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${tefila.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {tefila.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-['Frank_Ruhl_Libre']">
                        {tefila.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        {tefila.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tefila.longDescription}
                  </p>

                  <Button
                    asChild
                    className="w-full group-hover:bg-primary shadow-md"
                    size="lg"
                  >
                    <Link href={tefila.url} className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      פתח תפילה
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-['Frank_Ruhl_Libre'] text-center">מה כלול?</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">טקסט מלא</h3>
              <p className="text-sm text-muted-foreground">
                כל התפילות והברכות עם הטקסט המלא מתוך הסידור
              </p>
            </Card>

            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Scroll className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">ארגון ברור</h3>
              <p className="text-sm text-muted-foreground">
                חלוקה לפי קטעים עם הסברים וניווט נוח
              </p>
            </Card>

            <Card className="text-center p-6 border-2">
              <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 font-['Frank_Ruhl_Libre']">מעקב התקדמות</h3>
              <p className="text-sm text-muted-foreground">
                סמן קטעים שהשלמת ועקוב אחרי ההתקדמות שלך
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
