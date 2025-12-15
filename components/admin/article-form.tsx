"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Eye, Save, FileText, Settings, Search } from "lucide-react"
import { saveArticle } from "@/app/actions/admin"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { ImageUpload } from "@/components/admin/image-upload"
import type { Article, Category } from "@/types"

const articleSchema = z.object({
  title: z.string().min(3, "הכותרת חייבת להכיל לפחות 3 תווים"),
  subtitle: z.string().optional(),
  slug: z.string().min(3, "ה-slug חייב להכיל לפחות 3 תווים"),
  content: z.string().min(50, "התוכן חייב להכיל לפחות 50 תווים"),
  excerpt: z.string().optional(),
  category_id: z.string().optional(),
  tags: z.string().optional(),
  hebrew_date: z.string().optional(),
  reading_time: z.number().min(1).default(5),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  featured_image: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleFormProps {
  article?: Article
  categories: Category[]
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [editorContent, setEditorContent] = useState(article?.content || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      subtitle: article?.subtitle || "",
      slug: article?.slug || "",
      content: article?.content || "",
      excerpt: article?.excerpt || "",
      category_id: article?.category_id || "",
      tags: article?.tags?.join(", ") || "",
      hebrew_date: article?.hebrew_date || "",
      reading_time: article?.reading_time || 5,
      status: article?.status || "draft",
      is_featured: article?.is_featured || false,
      meta_description: article?.meta_description || "",
      meta_keywords: article?.meta_keywords?.join(", ") || "",
      featured_image: article?.featured_image || "",
    },
  })

  const watchTitle = watch("title")
  const watchContent = watch("content")

  useEffect(() => {
    const wordCount = editorContent
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter(Boolean).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))
    setValue("reading_time", readingTime)
  }, [editorContent, setValue])

  useEffect(() => {
    const currentExcerpt = watch("excerpt")
    if (!currentExcerpt && editorContent) {
      const plainText = editorContent.replace(/<[^>]*>/g, "").trim()
      const autoExcerpt = plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "")
      setValue("excerpt", autoExcerpt)
    }
  }, [editorContent, watch, setValue])

  const generateSlug = () => {
    const slug = watchTitle
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setValue("slug", slug)
  }

  const handleEditorChange = (content: string) => {
    setEditorContent(content)
    setValue("content", content)
  }

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true)

    try {
      const result = await saveArticle({
        id: article?.id,
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        category_id: data.category_id || null,
      })

      if (result.success) {
        router.push("/admin/articles")
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as "draft" | "published" | "archived")}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">טיוטה</SelectItem>
              <SelectItem value="published">פורסם</SelectItem>
              <SelectItem value="archived">ארכיון</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              checked={watch("is_featured")}
              onCheckedChange={(checked) => setValue("is_featured", checked)}
            />
            <Label htmlFor="is_featured" className="text-sm">
              מומלץ
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            ביטול
          </Button>
          {article && (
            <Button type="button" variant="outline" asChild>
              <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 ml-2" />
                תצוגה מקדימה
              </a>
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
            {article ? "עדכן מאמר" : "צור מאמר"}
          </Button>
        </div>
      </div>

      {/* Title & Slug */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="title"
            placeholder="כותרת המאמר"
            className="text-2xl font-serif h-14 border-0 border-b rounded-none px-0 focus-visible:ring-0"
            {...register("title")}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">/articles/</span>
          <Input id="slug" placeholder="article-slug" dir="ltr" className="flex-1 max-w-xs" {...register("slug")} />
          <Button type="button" variant="ghost" size="sm" onClick={generateSlug}>
            צור אוטומטי
          </Button>
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content" className="gap-2">
            <FileText className="h-4 w-4" />
            תוכן
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            הגדרות
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">תת כותרת</Label>
            <Input id="subtitle" placeholder="תת כותרת (אופציונלי)" {...register("subtitle")} />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <Label>תוכן המאמר</Label>
            <TiptapEditor
              content={editorContent}
              onChange={handleEditorChange}
              placeholder="התחל לכתוב את תוכן המאמר..."
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>תמונה ראשית</Label>
                  <ImageUpload
                    value={watch("featured_image") || ""}
                    onChange={(url) => setValue("featured_image", url)}
                    bucket="article-images"
                    folder="featured"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">קטגוריה</Label>
                  <Select value={watch("category_id")} onValueChange={(value) => setValue("category_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">תגיות (מופרדות בפסיק)</Label>
                  <Input id="tags" placeholder="תורה, קבלה, מוסר" {...register("tags")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hebrew_date">תאריך עברי</Label>
                  <Input id="hebrew_date" placeholder="כ״ה כסלו תשפ״ה" {...register("hebrew_date")} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">תמונה ראשית (URL)</Label>
                  <Input id="featured_image" placeholder="https://..." dir="ltr" {...register("featured_image")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reading_time">זמן קריאה (דקות)</Label>
                  <Input
                    id="reading_time"
                    type="number"
                    min={1}
                    {...register("reading_time", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">מחושב אוטומטית לפי התוכן</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">תקציר</Label>
                  <Textarea id="excerpt" placeholder="תקציר קצר של המאמר" rows={3} {...register("excerpt")} />
                  <p className="text-xs text-muted-foreground">נוצר אוטומטית מהתוכן אם ריק</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_description">תיאור Meta</Label>
                <Textarea
                  id="meta_description"
                  placeholder="תיאור למנועי חיפוש (מומלץ 150-160 תווים)"
                  rows={3}
                  {...register("meta_description")}
                />
                <p className="text-xs text-muted-foreground">{(watch("meta_description") || "").length}/160 תווים</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">מילות מפתח (מופרדות בפסיק)</Label>
                <Input id="meta_keywords" placeholder="קבלה, זוהר, רוחניות" {...register("meta_keywords")} />
              </div>

              {/* SEO Preview */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">תצוגה מקדימה בגוגל:</p>
                <div className="space-y-1">
                  <p className="text-lg text-blue-600 hover:underline cursor-pointer">
                    {watch("title") || "כותרת המאמר"}
                  </p>
                  <p className="text-sm text-green-700" dir="ltr">
                    example.com/articles/{watch("slug") || "article-slug"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {watch("meta_description") || watch("excerpt") || "תיאור המאמר יופיע כאן..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
