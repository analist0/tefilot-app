import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { BookOpen, BookMarked, Scroll, Users, TrendingUp, Calendar, Clock, Flame } from "lucide-react"

async function getReadingStats() {
  const supabase = await createClient()

  try {
    // Get total reading progress data
    const { data: progressData, error } = await supabase
      .from("reading_progress")
      .select("*")

    if (error) {
      console.error("Error fetching reading stats:", error)
      return null
    }

    // Calculate stats by text type
    const stats = {
      totalSessions: progressData?.length || 0,
      totalVersesRead: 0,
      totalTimeMinutes: 0,
      averageSpeed: 0,
      tehilim: { sessions: 0, verses: 0, time: 0, completed: 0 },
      tanakh: { sessions: 0, verses: 0, time: 0, completed: 0 },
      talmud: { sessions: 0, verses: 0, time: 0, completed: 0 },
      tefilot: { sessions: 0, verses: 0, time: 0, completed: 0 }
    }

    if (progressData) {
      progressData.forEach((session) => {
        const type = session.text_type as keyof typeof stats
        if (type && stats[type] && typeof stats[type] === 'object') {
          stats[type].sessions++
          stats[type].verses += session.verses_read || 0
          stats[type].time += (session.total_time_seconds || 0) / 60 // Convert to minutes
          if (session.completed) stats[type].completed++
        }

        stats.totalVersesRead += session.verses_read || 0
        stats.totalTimeMinutes += (session.total_time_seconds || 0) / 60
      })

      // Calculate average reading speed
      const totalSpeed = progressData.reduce((sum, s) => sum + (s.reading_speed_wpm || 0), 0)
      stats.averageSpeed = progressData.length > 0 ? Math.round(totalSpeed / progressData.length) : 0
    }

    return stats
  } catch (error) {
    console.error("Failed to fetch reading stats:", error)
    return null
  }
}

async function getUserStats() {
  const supabase = await createClient()

  try {
    const { data: profiles, count } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })

    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")

    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      totalUsers: count || 0,
      totalAdmins: admins?.length || 0,
      recentUsers: recentUsers || [],
      activeToday: 0 // TODO: implement active user tracking
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
    return {
      totalUsers: 0,
      totalAdmins: 0,
      recentUsers: [],
      activeToday: 0
    }
  }
}

export default async function StatisticsPage() {
  const readingStats = await getReadingStats()
  const userStats = await getUserStats()

  const textTypes = [
    {
      title: "תהילים",
      icon: <BookMarked className="h-6 w-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      stats: readingStats?.tehilim
    },
    {
      title: "תנ״ך",
      icon: <BookOpen className="h-6 w-6" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      stats: readingStats?.tanakh
    },
    {
      title: "תלמוד",
      icon: <BookOpen className="h-6 w-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      stats: readingStats?.talmud
    },
    {
      title: "תפילות",
      icon: <Scroll className="h-6 w-6" />,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      stats: readingStats?.tefilot
    }
  ]

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-['Frank_Ruhl_Libre']">סטטיסטיקות כלליות</h1>
        <p className="text-muted-foreground mt-2">
          סטטיסטיקות מלאות על שימוש במערכת, קריאה ולימוד
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">סך משתמשים</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.totalAdmins} מנהלים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">פסוקים נקראו</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readingStats?.totalVersesRead.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {readingStats?.totalSessions.toLocaleString() || 0} מפגשי קריאה
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">זמן לימוד</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(readingStats?.totalTimeMinutes || 0).toLocaleString()} דקות
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((readingStats?.totalTimeMinutes || 0) / 60)} שעות
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">מהירות קריאה</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingStats?.averageSpeed || 0} WPM</div>
            <p className="text-xs text-muted-foreground mt-1">ממוצע מילים לדקה</p>
          </CardContent>
        </Card>
      </div>

      {/* Reading Stats by Type */}
      <div>
        <h2 className="text-2xl font-bold font-['Frank_Ruhl_Libre'] mb-4">סטטיסטיקות לפי סוג</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {textTypes.map((type) => (
            <Card key={type.title} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${type.bgColor}`}>
                    <div className={type.color}>{type.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="font-['Frank_Ruhl_Libre']">{type.title}</CardTitle>
                    <CardDescription>{type.stats?.sessions || 0} מפגשי קריאה</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">פסוקים שנקראו</span>
                  <span className="font-bold">{type.stats?.verses.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">זמן לימוד</span>
                  <span className="font-bold">
                    {Math.round(type.stats?.time || 0)} דקות
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">הושלמו</span>
                  <span className="font-bold flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {type.stats?.completed || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="font-['Frank_Ruhl_Libre']">משתמשים חדשים</CardTitle>
          <CardDescription>5 המשתמשים האחרונים שנרשמו</CardDescription>
        </CardHeader>
        <CardContent>
          {userStats.recentUsers.length > 0 ? (
            <div className="space-y-4">
              {userStats.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.full_name || "משתמש אנונימי"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("he-IL")}
                    </p>
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {user.role || "user"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">אין משתמשים עדיין</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
