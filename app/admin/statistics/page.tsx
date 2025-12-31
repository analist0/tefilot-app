import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAllUsersStatistics, getTopUsers, getRecentUserActivity } from "@/lib/admin-statistics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Book,
  Clock,
  Trophy,
  Flame,
  Award,
  Target,
  Activity,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "סטטיסטיקות מערכת | אדמין",
  description: "סטטיסטיקות מקיפות של כל המשתמשים במערכת",
}

async function StatisticsContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    redirect("/")
  }

  const { users, totalStats } = await getAllUsersStatistics()
  const topByLevel = await getTopUsers("level", 5)
  const topByStreak = await getTopUsers("streak", 5)
  const recentActivity = await getRecentUserActivity(7)

  if (!totalStats) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">אין נתונים להצגה</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">סטטיסטיקות מערכת 📊</h1>
        <p className="text-muted-foreground">נתונים מקיפים על כל המשתמשים והפעילות במערכת</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">משתמשים רשומים</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.activeUsers} פעילים בשבוע האחרון
            </p>
            <Progress
              value={(totalStats.activeUsers / totalStats.totalUsers) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">תוכן שהושלם</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.overall.totalContentCompleted.toLocaleString("he-IL")}
            </div>
            <p className="text-xs text-muted-foreground">פרקים, דפים ותפילות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">זמן קריאה כולל</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.overall.totalReadingTimeHours.toLocaleString("he-IL")}
            </div>
            <p className="text-xs text-muted-foreground">שעות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">הישגים שנפתחו</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.overall.totalAchievementsUnlocked}</div>
            <p className="text-xs text-muted-foreground">
              ממוצע {Math.round(totalStats.overall.totalAchievementsUnlocked / totalStats.totalUsers)} למשתמש
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tehilim Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              תהילים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">פרקים הושלמו</span>
                <span className="font-bold">{totalStats.tehilim.totalChaptersCompleted.toLocaleString("he-IL")}</span>
              </div>
              <Progress value={totalStats.tehilim.averageCompletion} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                ממוצע {totalStats.tehilim.averageCompletion}% השלמה
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">פסוקים</div>
                <div className="text-lg font-bold">{totalStats.tehilim.totalVersesRead.toLocaleString("he-IL")}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">סיימו</div>
                <div className="text-lg font-bold">{totalStats.tehilim.usersCompleted}</div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="text-xs text-muted-foreground mb-1">זמן קריאה</div>
              <div className="text-lg font-bold">
                {Math.round(totalStats.tehilim.totalTimeMinutes / 60).toLocaleString("he-IL")} שעות
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Talmud Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              תלמוד
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">דפים הושלמו</span>
                <span className="font-bold">{totalStats.talmud.totalDapimCompleted.toLocaleString("he-IL")}</span>
              </div>
              <Progress value={totalStats.talmud.averageCompletion} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                מתוך 2,711 דפים ({totalStats.talmud.averageCompletion}%)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">מסכתות</div>
                <div className="text-lg font-bold">{totalStats.talmud.totalMasechtotCompleted}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">שעות</div>
                <div className="text-lg font-bold">
                  {Math.round(totalStats.talmud.totalTimeMinutes / 60).toLocaleString("he-IL")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tanakh Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Book className="h-5 w-5 text-white" />
              </div>
              תנ״ך
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">פרקים הושלמו</span>
                <span className="font-bold">{totalStats.tanakh.totalChaptersCompleted.toLocaleString("he-IL")}</span>
              </div>
              <Progress value={totalStats.tanakh.averageCompletion} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                מתוך 929 פרקים ({totalStats.tanakh.averageCompletion}%)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">ספרים</div>
                <div className="text-lg font-bold">{totalStats.tanakh.totalBooksCompleted}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">סיימו תורה</div>
                <div className="text-lg font-bold">{totalStats.tanakh.usersCompletedTorah}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top by Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              דירוג לפי רמה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByLevel.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-500 to-amber-500 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.display_name || user.email}</div>
                      <div className="text-xs text-muted-foreground">{user.stats?.overall.rank}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {user.stats?.overall.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top by Streak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              דירוג לפי רצף
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByStreak.slice(0, 5).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-500 to-amber-500 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-600 to-orange-700 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.display_name || user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.stats?.overall.currentOverallStreak} ימים נוכחי
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {user.stats?.overall.longestOverallStreak} 🔥
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            פעילות אחרונה (7 ימים)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.slice(0, 10).map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{activity.text_type}</Badge>
                  <div className="text-sm">
                    <span className="font-medium">{activity.profiles?.display_name || "משתמש"}</span>
                    <span className="text-muted-foreground"> קרא </span>
                    <span className="font-medium">{activity.text_id}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(activity.updated_at).toLocaleDateString("he-IL", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User List with Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            כל המשתמשים ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="font-medium">{user.display_name || user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    הצטרף {new Date(user.created_at).toLocaleDateString("he-IL")}
                  </div>
                </div>
                {user.stats && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-500">
                        {user.stats.tehilim.totalChaptersCompleted}
                      </div>
                      <div className="text-xs text-muted-foreground">תהילים</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-500">
                        {user.stats.talmud.totalDapimCompleted}
                      </div>
                      <div className="text-xs text-muted-foreground">דפים</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-amber-500">{user.stats.overall.level}</div>
                      <div className="text-xs text-muted-foreground">רמה</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatisticsLoadingSkeleton() {
  return (
    <div className="container px-4 py-8 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  )
}

export default async function AdminStatisticsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<StatisticsLoadingSkeleton />}>
        <StatisticsContent />
      </Suspense>
    </div>
  )
}
