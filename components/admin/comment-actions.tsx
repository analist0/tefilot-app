"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2, Loader2 } from "lucide-react"
import { updateCommentStatus, deleteComment } from "@/app/actions/admin"

interface CommentActionsProps {
  commentId: string
  currentStatus: string
}

export function CommentActions({ commentId, currentStatus }: CommentActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    await updateCommentStatus(commentId, "approved")
    router.refresh()
    setIsLoading(false)
  }

  const handleSpam = async () => {
    setIsLoading(true)
    await updateCommentStatus(commentId, "spam")
    router.refresh()
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את התגובה?")) return
    setIsLoading(true)
    await deleteComment(commentId)
    router.refresh()
    setIsLoading(false)
  }

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus !== "approved" && (
        <Button variant="ghost" size="icon" className="text-green-600" onClick={handleApprove} title="אשר">
          <Check className="h-4 w-4" />
        </Button>
      )}
      {currentStatus !== "spam" && (
        <Button variant="ghost" size="icon" className="text-yellow-600" onClick={handleSpam} title="סמן כספאם">
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete} title="מחק">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
