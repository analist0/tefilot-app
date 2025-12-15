import Link from "next/link"
import { BookOpen, Heart, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold font-serif text-primary">אור הישרה</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/rss.xml"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              title="RSS Feed"
            >
              <Rss className="h-4 w-4" />
              <span className="sr-only">RSS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              נבנה על ידי <span className="font-semibold text-foreground">יוסף אלישר</span> להגדיל תורה ולהאדיר
            </p>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>{new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
