import { getCategories } from "@/lib/queries"
import { CategoriesClient } from "@/components/admin/categories-client"

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    categories = await getCategories()
  } catch {
    // Database not ready
  }

  return (
    <div className="space-y-6">
      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
