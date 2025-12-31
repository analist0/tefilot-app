import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Category badge */}
        <Skeleton className="h-6 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-full" /> {/* Excerpt line 1 */}
        <Skeleton className="h-4 w-5/6" /> {/* Excerpt line 2 */}
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-40 w-full rounded-lg" /> {/* Featured image */}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
          <Skeleton className="h-4 w-24" /> {/* Author name */}
        </div>
        <Skeleton className="h-4 w-16" /> {/* Date */}
      </CardFooter>
    </Card>
  )
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  )
}
