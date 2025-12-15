import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DeleteArticleButton } from "@/components/admin/delete-article-button"

async function getArticles() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = []

  try {
    articles = await getArticles()
  } catch {
    // Database not ready
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">מאמרים</h1>
        <Button asChild>
          <Link href="/admin/articles/new" className="gap-2">
            <Plus className="h-4 w-4" />
            מאמר חדש
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>כל המאמרים ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">כותרת</TableHead>
                    <TableHead className="text-right">קטגוריה</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">צפיות</TableHead>
                    <TableHead className="text-right">תאריך</TableHead>
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>
                        {article.category ? (
                          <Badge variant="secondary">{article.category.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.status === "published" ? "default" : "outline"}>
                          {article.status === "published" ? "פורסם" : article.status === "draft" ? "טיוטה" : "ארכיון"}
                        </Badge>
                      </TableCell>
                      <TableCell>{article.views_count}</TableCell>
                      <TableCell>{new Date(article.created_at).toLocaleDateString("he-IL")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/articles/${article.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/articles/${article.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">אין מאמרים עדיין. צור את המאמר הראשון שלך!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
