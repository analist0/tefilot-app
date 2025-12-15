import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookMarked, Database, Clock, RefreshCw, ExternalLink, Layers, Zap, Server } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getTehilimStats() {
  const supabase = await createClient()

  const { data, count } = await supabase.from("tehilim_cache").select("*", { count: "exact" })

  return {
    cachedChapters: count || 0,
    totalChapters: 150,
    lastUpdated: data?.[0]?.fetched_at || null,
  }
}

export default async function AdminTehilimPage() {
  let stats = { cachedChapters: 0, totalChapters: 150, lastUpdated: null as string | null }

  try {
    stats = await getTehilimStats()
  } catch {
    // Database not ready
  }

  const cachePercentage = Math.round((stats.cachedChapters / stats.totalChapters) * 100)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">ניהול תהילים</h1>
          <p className="text-muted-foreground mt-1">מעקב אחר מטמון התהילים ונתונים סטטיסטיים</p>
        </div>
        <Button asChild className="gap-2 rounded-xl">
          <Link href="/tehilim">
            <ExternalLink className="h-4 w-4" />
            צפה בתהילים
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">פרקים במטמון</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{stats.cachedChapters}</div>
            <p className="text-xs text-muted-foreground mt-1">מתוך {stats.totalChapters} פרקים</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">אחוז מטמון</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{cachePercentage}%</div>
            <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${cachePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">סה״כ פרקים</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BookMarked className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">150</div>
            <p className="text-xs text-muted-foreground mt-1">ספר תהילים</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">עדכון אחרון</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-bold">
              {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString("he-IL") : "אין נתונים"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString("he-IL") : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cache System Info */}
      <Card className="rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            מערכת Cache בשלוש שכבות
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-6">
            מערכת התהילים משתמשת במטמון בשלוש שכבות לביצועים מיטביים וחוויית משתמש מהירה:
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-blue-500 mb-1">שכבה 1</span>
              <div className="font-semibold mb-1">LocalStorage</div>
              <p className="text-xs text-muted-foreground">מטמון מקומי בדפדפן - הכי מהיר</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Server className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-xs font-medium text-emerald-500 mb-1">שכבה 2</span>
              <div className="font-semibold mb-1">Supabase</div>
              <p className="text-xs text-muted-foreground">מטמון משותף לכל המשתמשים</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-3">
                <Database className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-xs font-medium text-amber-500 mb-1">שכבה 3</span>
              <div className="font-semibold mb-1">Sefaria API</div>
              <p className="text-xs text-muted-foreground">מקור הנתונים - פעם אחת לכל פרק</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
