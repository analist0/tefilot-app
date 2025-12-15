import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Settings,
  BookMarked,
  Menu,
  Users,
  Tags,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/server"

const sidebarLinks = [
  { href: "/admin", label: "דשבורד", icon: LayoutDashboard },
  { href: "/admin/articles", label: "מאמרים", icon: FileText },
  { href: "/admin/categories", label: "קטגוריות", icon: FolderOpen },
  { href: "/admin/tags", label: "תגיות", icon: Tags },
  { href: "/admin/comments", label: "תגובות", icon: MessageSquare },
  { href: "/admin/tehilim", label: "תהילים", icon: BookMarked },
  { href: "/admin/users", label: "משתמשים", icon: Users, adminOnly: true },
  { href: "/admin/settings", label: "הגדרות", icon: Settings, adminOnly: true },
]

function SidebarContent({ userRole }: { userRole: string }) {
  const filteredLinks = sidebarLinks.filter((link) => !link.adminOnly || userRole === "admin")

  return (
    <>
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold font-serif text-primary">ניהול אור הישירה</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          חזרה לאתר
        </Link>
      </div>
    </>
  )
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

  const userRole = profile?.role || "user"

  if (userRole !== "admin" && userRole !== "editor") {
    redirect("/?error=unauthorized")
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <Link href="/admin" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold font-serif text-primary">ניהול</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <SidebarContent userRole={userRole} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-l flex-col flex-shrink-0">
        <SidebarContent userRole={userRole} />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-muted/30 min-h-[calc(100vh-65px)] lg:min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
