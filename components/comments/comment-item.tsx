"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Reply } from "lucide-react"
import { CommentForm } from "./comment-form"
import type { Comment } from "@/types"

interface CommentItemProps {
  comment: Comment
  articleId: string
}

export function CommentItem({ comment, articleId }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">{getInitials(comment.author_name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{comment.author_name}</span>
            <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-foreground leading-relaxed">{comment.content}</p>
          <Button variant="ghost" size="sm" className="mt-2 gap-1" onClick={() => setShowReplyForm(!showReplyForm)}>
            <Reply className="h-4 w-4" />
            הגב
          </Button>
        </div>
      </div>

      {showReplyForm && (
        <div className="mr-14">
          <CommentForm
            articleId={articleId}
            parentId={comment.id}
            onSuccess={() => setShowReplyForm(false)}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mr-14 space-y-4 border-r-2 border-muted pr-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} articleId={articleId} />
          ))}
        </div>
      )}
    </div>
  )
}
