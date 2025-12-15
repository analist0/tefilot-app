import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-8xl font-serif text-primary/5 select-none">א</div>
        <div className="absolute top-40 left-20 text-6xl font-serif text-primary/5 select-none">ב</div>
        <div className="absolute bottom-20 right-1/4 text-7xl font-serif text-primary/5 select-none">ג</div>
        <div className="absolute bottom-40 left-1/3 text-5xl font-serif text-primary/5 select-none">ד</div>
      </div>

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>גלה את אור התורה</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight text-balance">
            והגית בו יומם ולילה
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            מאמרים מעמיקים בענייני תורה, קבלה, פרשות השבוע, תהילים, סגולות וכוונות. התחבר לאור הפנימי של התורה הקדושה.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/articles">
                גלה את המאמרים
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/category/parasha">פרשת השבוע</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
