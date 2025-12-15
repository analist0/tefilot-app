import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArticleForm } from "@/components/admin/article-form"
import { getCategories } from "@/lib/queries"
import { createClient } from "@/lib/supabase/server"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

async function getArticle(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params

  let article
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    ;[article, categories] = await Promise.all([getArticle(id), getCategories()])
  } catch {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">עריכת מאמר</h1>

      <Card>
        <CardHeader>
          <CardTitle>פרטי המאמר</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm article={article} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
