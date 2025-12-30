import Link from "next/link"
import { getCategories } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  selectedCategory?: string
}

export async function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  let categories = []

  try {
    categories = await getCategories()
  } catch {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/articles">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/90 transition-colors"
        >
          הכל
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/articles?category=${category.slug}`}>
          <Badge
            variant={selectedCategory === category.slug ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90 transition-colors"
            style={selectedCategory === category.slug ? { backgroundColor: category.color || undefined } : {}}
          >
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
