import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Star, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getStats() {
  const supabase = await createClient()

  const [articlesRes, commentsRes, viewsRes] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact" }),
    supabase.from("comments").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("articles").select("views_count"),
  ])

  const totalViews = viewsRes.data?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0

  return {
    articlesCount: articlesRes.count || 0,
    pendingComments: commentsRes.count || 0,
    totalViews,
  }
}

async function getRecentArticles() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, status, views_count, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminDashboard() {
  let stats = { articlesCount: 0, pendingComments: 0, totalViews: 0 }
  let recentArticles: Awaited<ReturnType<typeof getRecentArticles>> = []

  try {
    stats = await getStats()
    recentArticles = await getRecentArticles()
  } catch {
    // Database not ready
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">דשבורד</h1>
        <Button asChild>
          <Link href="/admin/articles/new">מאמר חדש</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">מאמרים</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articlesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">צפיות</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">תגובות ממתינות</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">דירוג ממוצע</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>מאמרים אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          {recentArticles.length > 0 ? (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views_count}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${article.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {article.status === "published" ? "פורסם" : "טיוטה"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">אין מאמרים עדיין</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
