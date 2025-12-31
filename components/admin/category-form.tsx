"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { saveCategory } from "@/app/actions/categories"
import type { Category } from "@/types"

const categorySchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  slug: z.string().min(2, "ה-slug חייב להכיל לפחות 2 תווים"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order_index: z.number(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const iconOptions = [
  { value: "BookOpen", label: "ספר פתוח" },
  { value: "Sparkles", label: "ניצוצות" },
  { value: "Heart", label: "לב" },
  { value: "Star", label: "כוכב" },
  { value: "Sun", label: "שמש" },
  { value: "Moon", label: "ירח" },
  { value: "Flame", label: "אש" },
  { value: "Crown", label: "כתר" },
  { value: "Scroll", label: "מגילה" },
  { value: "Lightbulb", label: "נורה" },
]

const colorOptions = [
  { value: "#c9a227", label: "זהב" },
  { value: "#1e3a5f", label: "כחול כהה" },
  { value: "#8b4513", label: "חום" },
  { value: "#2d5016", label: "ירוק" },
  { value: "#7c3aed", label: "סגול" },
  { value: "#dc2626", label: "אדום" },
  { value: "#0891b2", label: "ציאן" },
  { value: "#ea580c", label: "כתום" },
]

export function CategoryForm({ category, open, onOpenChange }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      icon: category?.icon || "",
      color: category?.color || "",
      order_index: category?.order_index || 0,
    },
  })

  const watchName = watch("name")
  const watchColor = watch("color")
  const watchIcon = watch("icon")

  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setValue("slug", slug)
  }

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    try {
      const result = await saveCategory({
        id: category?.id,
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
          <DialogTitle>{category ? "עריכת קטגוריה" : "קטגוריה חדשה"}</DialogTitle>
          <DialogDescription>{category ? "ערוך את פרטי הקטגוריה" : "צור קטגוריה חדשה עבור המאמרים"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם הקטגוריה</Label>
            <Input id="name" placeholder="שם הקטגוריה" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input id="slug" placeholder="category-slug" dir="ltr" {...register("slug")} />
              <Button type="button" variant="outline" onClick={generateSlug}>
                צור
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea id="description" placeholder="תיאור הקטגוריה (אופציונלי)" rows={2} {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>אייקון</Label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <Button
                  key={icon.value}
                  type="button"
                  variant={watchIcon === icon.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setValue("icon", icon.value)}
                >
                  {icon.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>צבע</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    watchColor === color.value ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue("color", color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">סדר תצוגה</Label>
            <Input id="order_index" type="number" min={0} {...register("order_index", { valueAsNumber: true })} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {category ? "עדכן" : "צור קטגוריה"}
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
