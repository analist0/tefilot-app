import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { CommentActions } from "@/components/admin/comment-actions"

async function getComments() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("comments")
    .select("*, article:articles(title, slug)")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminCommentsPage() {
  let comments: Awaited<ReturnType<typeof getComments>> = []

  try {
    comments = await getComments()
  } catch {
    // Database not ready
  }

  const pendingCount = comments.filter((c) => c.status === "pending").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">תגובות</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            כל התגובות ({comments.length}) - {pendingCount} ממתינות
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>מגיב</TableHead>
                  <TableHead>תוכן</TableHead>
                  <TableHead>מאמר</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comment.author_name}</p>
                        <p className="text-xs text-muted-foreground">{comment.author_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                    <TableCell>
                      {comment.article ? (
                        <span className="text-sm">{comment.article.title}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          comment.status === "approved"
                            ? "default"
                            : comment.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {comment.status === "approved" ? "מאושר" : comment.status === "pending" ? "ממתין" : "ספאם"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(comment.created_at).toLocaleDateString("he-IL")}</TableCell>
                    <TableCell>
                      <CommentActions commentId={comment.id} currentStatus={comment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">אין תגובות עדיין</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
