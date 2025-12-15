"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, X, BookOpen, Sparkles, ScrollText, Star, Heart, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { SearchDialog } from "@/components/shared/search-dialog"
import { UserMenu } from "@/components/auth/user-menu"

const navLinks = [
  { href: "/tehilim", label: "תהילים", icon: BookOpen },
  { href: "/category/parasha", label: "פרשות השבוע", icon: ScrollText },
  { href: "/category/kabbalah", label: "קבלה", icon: Sparkles },
  { href: "/category/segulot", label: "סגולות", icon: Star },
  { href: "/category/kavanot", label: "כוונות", icon: Lightbulb },
  { href: "/category/kedusha", label: "קדושה", icon: Heart },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Mobile Menu - Left side */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">תפריט</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 border-l-0">
            <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
              {/* Sidebar Header */}
              <div className="p-5 border-b bg-background">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold font-serif text-primary">אור הישרה</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="h-9 w-9 rounded-lg bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <Icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-[15px] font-medium">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t bg-muted/20">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  התחברות / הרשמה
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search - Mobile */}
        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="lg:hidden h-9 w-9">
          <Search className="h-5 w-5" />
          <span className="sr-only">חיפוש</span>
        </Button>

        {/* Logo - Center on mobile, right on desktop */}
        <Link href="/" className="flex items-center gap-2 lg:order-first">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg sm:text-xl font-bold font-serif text-primary">אור הישרה</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side - Search & User */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">חיפוש</span>
          </Button>

          <UserMenu />
        </div>

        {/* Mobile User Menu */}
        <div className="lg:hidden">
          <UserMenu />
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
