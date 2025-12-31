import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ReaderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" /> {/* Title */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon */}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-32" /> {/* Chapter info */}
            <Skeleton className="h-6 w-24" /> {/* Verse count */}
          </div>
        </CardHeader>
      </Card>

      {/* Verses */}
      <Card>
        <CardContent className="space-y-8 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-start gap-4">
                <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" /> {/* Verse number */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  {i % 2 === 0 && <Skeleton className="h-6 w-4/5" />}
                </div>
              </div>
              {i < 5 && <Skeleton className="h-px w-full" />} {/* Divider */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Controls placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
