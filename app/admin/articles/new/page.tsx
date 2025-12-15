import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArticleForm } from "@/components/admin/article-form"
import { getCategories } from "@/lib/queries"

export default async function NewArticlePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    categories = await getCategories()
  } catch {
    // Database not ready
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold font-serif">מאמר חדש</h1>

      <Card>
        <CardHeader>
          <CardTitle>פרטי המאמר</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
