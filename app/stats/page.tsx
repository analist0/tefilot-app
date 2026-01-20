import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import { getUserStatistics } from "@/lib/statistics"
import { StatsCard } from "@/components/statistics/stats-card"
import { SystemStatsCard } from "@/components/statistics/system-stats-card"
import { StreakDisplay } from "@/components/shared/streak-display"
import { AchievementsShowcase } from "@/components/shared/achievements-showcase"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Award,
  Book,
  Calendar,
  Flame,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "הסטטיסטיקות שלי | אור הישרה",
  description: "צפה בסטטיסטיקות הקריאה וההתקדמות שלך בתהילים, תלמוד, תנ\"ך ותפילות",
}

async function StatsContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/stats")
  }

  const stats = await getUserStatistics(user.id)

  if (!stats) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">לא נמצאו נתונים. התחל לקרוא כדי לצבור סטטיסטיקות!</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">הסטטיסטיקות שלי 📊</h1>
          <p className="text-muted-foreground">
            מצטרף מאז {stats.joinDate.toLocaleDateString("he-IL", { year: "numeric", month: "long" })}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">רמה</div>
                <div className="text-2xl font-bold">{stats.overall.level}</div>
                <div className="text-xs text-muted-foreground">{stats.overall.rank}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Progress
                value={(stats.overall.experiencePoints / stats.overall.nextLevelXP) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground text-center">
                {stats.overall.experiencePoints.toLocaleString("he-IL")} /{" "}
                {stats.overall.nextLevelXP.toLocaleString("he-IL")} XP
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="סה״כ תוכן שהושלם"
          value={stats.overall.totalContentCompleted.toLocaleString("he-IL")}
          subtitle="פרקים, דפים ותפילות"
          icon={Book}
          color="from-blue-500 to-cyan-500"
        />

        <StatsCard
          title="זמן קריאה כולל"
          value={stats.overall.totalReadingTimeHours}
          subtitle={`${stats.overall.totalReadingTimeMinutes} דקות`}
          icon={Clock}
          color="from-purple-500 to-pink-500"
        />

        <StatsCard
          title="ימים פעילים"
          value={stats.overall.totalDaysActive}
          subtitle="ימים בהם קראת"
          icon={Calendar}
          color="from-amber-500 to-orange-500"
        />

        <StatsCard
          title="הישגים"
          value={stats.unlockedAchievements.length}
          subtitle="הישגים שנפתחו"
          icon={Award}
          color="from-green-500 to-emerald-500"
        />
      </div>

      {/* Streak Display */}
      <StreakDisplay
        currentStreak={stats.overall.currentOverallStreak}
        longestStreak={stats.overall.longestOverallStreak}
      />

      {/* Systems Stats */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          התקדמות לפי מערכות
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SystemStatsCard type="tehilim" stats={stats.tehilim} />
          <SystemStatsCard type="talmud" stats={stats.talmud} />
          <SystemStatsCard type="tanakh" stats={stats.tanakh} />
          <SystemStatsCard type="tefilot" stats={stats.tefilot} />
        </div>
      </div>

      {/* Detailed Stats by System */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tehilim Details */}
        {stats.tehilim.totalChaptersCompleted > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-500" />
                תהילים - סטטיסטיקות מפורטות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">פסוקים נקראו</div>
                  <div className="text-xl font-bold">{stats.tehilim.totalVersesRead.toLocaleString("he-IL")}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">מהירות קריאה</div>
                  <div className="text-xl font-bold">{stats.tehilim.averageReadingSpeed} WPM</div>
                </div>
              </div>

              {stats.tehilim.favoriteChapters.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">פרקים אהובים</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.tehilim.favoriteChapters.map((chapter) => (
                      <Badge key={chapter} variant="secondary">
                        פרק {chapter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">קריאה אחרונה</span>
                  <span className="font-medium">
                    {stats.tehilim.lastReadDate
                      ? stats.tehilim.lastReadDate.toLocaleDateString("he-IL")
                      : "אף פעם"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Talmud Details */}
        {stats.talmud.totalDapimCompleted > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                תלמוד - סטטיסטיקות מפורטות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">דפים הושלמו</div>
                  <div className="text-xl font-bold">{stats.talmud.totalDapimCompleted}</div>
                  <div className="text-xs text-muted-foreground">מתוך 2,711</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">שעות לימוד</div>
                  <div className="text-xl font-bold">
                    {Math.floor(stats.talmud.totalTimeMinutes / 60)}
                  </div>
                </div>
              </div>

              {stats.talmud.masechtotCompleted.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">
                    מסכתות שהושלמו ({stats.talmud.masechtotCompleted.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.talmud.masechtotCompleted.map((masechet) => (
                      <Badge key={masechet} variant="secondary">
                        {masechet}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">לימוד אחרון</span>
                  <span className="font-medium">
                    {stats.talmud.lastStudyDate
                      ? stats.talmud.lastStudyDate.toLocaleDateString("he-IL")
                      : "אף פעם"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          ההישגים שלי
        </h2>
        <AchievementsShowcase
          stats={{
            currentStreak: stats.overall.currentOverallStreak,
            longestStreak: stats.overall.longestOverallStreak,
            chaptersCompleted: stats.tehilim.totalChaptersCompleted + stats.tanakh.totalChaptersCompleted,
            versesRead: stats.tehilim.totalVersesRead + stats.tanakh.totalVersesRead,
            averageSpeed: stats.tehilim.averageReadingSpeed,
            totalTimeMinutes: stats.overall.totalReadingTimeMinutes,
          }}
          unlockedAchievements={stats.unlockedAchievements}
        />
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <CardContent className="p-6 text-center space-y-2">
          <Zap className="h-8 w-8 mx-auto text-primary" />
          <h3 className="text-lg font-bold">המשך ככה! 🎉</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {stats.overall.level < 10
              ? "אתה בדרך הנכונה! המשך לקרוא כדי לעלות רמות ולפתוח הישגים חדשים."
              : stats.overall.level < 25
              ? "התקדמות מרשימה! אתה כבר קורא מתמיד. המשך ככה!"
              : "אתה תלמיד חכם אמיתי! המשך להעמיק בלימוד ובקריאה."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <Skeleton className="h-48" />

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  )
}

export default async function StatsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <StatsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
