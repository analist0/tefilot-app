import type React from "react"
import Link from "next/link"
import { getCategories } from "@/lib/queries"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Sparkles, Star, Target, Flame } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  BookOpen,
  Heart,
  Sparkles,
  Star,
  Target,
  Flame,
}

export async function CategoriesShowcase() {
  let categories = []

  try {
    categories = await getCategories()
  } catch (error) {
    // Database not ready yet - show default categories
    categories = [
      {
        id: "1",
        slug: "parasha",
        name: "פרשות השבוע",
        description: "פירושים ומאמרים על פרשת השבוע",
        icon: "BookOpen",
        color: "#D4A84B",
      },
      {
        id: "2",
        slug: "tehilim",
        name: "תהילים",
        description: "פירושי תהילים וסגולות",
        icon: "Heart",
        color: "#4A90A4",
      },
      {
        id: "3",
        slug: "kabbalah",
        name: "קבלה",
        description: "סודות הקבלה והזוהר",
        icon: "Sparkles",
        color: "#8B5CF6",
      },
      {
        id: "4",
        slug: "segulot",
        name: "סגולות",
        description: "סגולות לפרנסה, רפואה ועוד",
        icon: "Star",
        color: "#F59E0B",
      },
      {
        id: "5",
        slug: "kavanot",
        name: "כוונות",
        description: "כוונות לתפילה ולעבודת ה׳",
        icon: "Target",
        color: "#10B981",
      },
      {
        id: "6",
        slug: "kedusha",
        name: "קדושה",
        description: "מאמרים בענייני קדושה וטהרה",
        icon: "Flame",
        color: "#EF4444",
      },
    ]
  }

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-serif">קטגוריות</h2>
          <p className="text-muted-foreground mt-2">בחר נושא שמעניין אותך</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon || "BookOpen"] || BookOpen
            return (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6 text-center space-y-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: category.color || undefined }} />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
