"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { saveTag } from "@/app/actions/tags"
import type { Tag } from "@/types"

const tagSchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  slug: z.string().min(2, "ה-slug חייב להכיל לפחות 2 תווים"),
})

type TagFormData = z.infer<typeof tagSchema>

interface TagFormProps {
  tag?: Tag | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TagForm({ tag, open, onOpenChange }: TagFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      slug: tag?.slug || "",
    },
  })

  const watchName = watch("name")

  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setValue("slug", slug)
  }

  const onSubmit = async (data: TagFormData) => {
    setIsSubmitting(true)

    try {
      const result = await saveTag({
        id: tag?.id,
        ...data,
      })

      if (result.success) {
        reset()
        onOpenChange(false)
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tag ? "עריכת תגית" : "תגית חדשה"}</DialogTitle>
          <DialogDescription>{tag ? "ערוך את פרטי התגית" : "צור תגית חדשה לסימון מאמרים"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם התגית</Label>
            <Input id="name" placeholder="שם התגית" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="slug" placeholder="tag-slug" dir="ltr" {...register("slug")} />
              <Button type="button" variant="outline" onClick={generateSlug}>
                צור
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {tag ? "עדכן" : "צור תגית"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
