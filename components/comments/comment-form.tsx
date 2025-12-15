"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { submitComment } from "@/app/actions/comments"

const commentSchema = z.object({
  author_name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  author_email: z.string().email("כתובת מייל לא תקינה"),
  content: z.string().min(10, "התגובה חייבת להכיל לפחות 10 תווים").max(1000, "התגובה ארוכה מדי"),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  articleId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function CommentForm({ articleId, parentId, onSuccess, onCancel }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    mode: "onChange", // validate on change for immediate feedback
  })

  const contentValue = watch("content", "")
  const contentLength = contentValue?.length || 0

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await submitComment({
        article_id: articleId,
        parent_id: parentId || null,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
      })

      if (result.success) {
        setSubmitMessage({ type: "success", text: "התגובה נשלחה בהצלחה ותפורסם לאחר אישור" })
        reset()
        onSuccess?.()
      } else {
        setSubmitMessage({ type: "error", text: result.error || "שגיאה בשליחת התגובה" })
      }
    } catch {
      setSubmitMessage({ type: "error", text: "שגיאה בשליחת התגובה" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-amber-200/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          {parentId ? "כתוב תגובה" : "השאר תגובה"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">שם *</Label>
              <Input
                id="author_name"
                placeholder="השם שלך"
                className={errors.author_name ? "border-red-500" : ""}
                {...register("author_name")}
              />
              {errors.author_name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.author_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_email">מייל *</Label>
              <Input
                id="author_email"
                type="email"
                placeholder="המייל שלך"
                className={errors.author_email ? "border-red-500" : ""}
                {...register("author_email")}
              />
              {errors.author_email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.author_email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">תגובה *</Label>
              <span className={`text-xs ${contentLength < 10 ? "text-red-500" : "text-gray-500"}`}>
                {contentLength}/1000 (מינימום 10)
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="כתוב את התגובה שלך (לפחות 10 תווים)..."
              rows={4}
              className={errors.content ? "border-red-500" : ""}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.content.message}
              </p>
            )}
          </div>

          {submitMessage && (
            <div
              className={`text-sm p-3 rounded-lg ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              שלח תגובה
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                ביטול
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
