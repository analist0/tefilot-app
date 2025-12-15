import { getArticleComments } from "@/lib/queries"
import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"
import { MessageSquare } from "lucide-react"

interface CommentsSectionProps {
  articleId: string
}

export async function CommentsSection({ articleId }: CommentsSectionProps) {
  let comments: Awaited<ReturnType<typeof getArticleComments>> = []

  try {
    comments = await getArticleComments(articleId)
  } catch {
    // Comments not available
  }

  return (
    <section className="py-12 border-t">
      <div className="container px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold font-serif mb-8 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          תגובות ({comments.length})
        </h2>

        <div className="mb-8">
          <CommentForm articleId={articleId} />
        </div>

        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} articleId={articleId} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">עדיין אין תגובות. היה הראשון להגיב!</p>
        )}
      </div>
    </section>
  )
}
