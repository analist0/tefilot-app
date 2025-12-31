import { Skeleton } from "@/components/ui/skeleton"

export function ArticleContentSkeleton() {
  return (
    <article className="container px-4 max-w-3xl mx-auto py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Category Badge */}
      <Skeleton className="h-6 w-24 mb-4" />

      {/* Title */}
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-4/5 mb-8" />

      {/* Meta Info */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Featured Image */}
      <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />

      {/* Excerpt */}
      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            {i % 3 === 0 && <Skeleton className="h-3 w-full mb-4" />}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </article>
  )
}
