import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif">הגדרות</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              בסיס נתונים
            </CardTitle>
            <CardDescription>ניהול בסיס הנתונים וסנכרון</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              בסיס הנתונים מחובר ל-Supabase. להרצת סקריפטים, השתמש בתיקיית scripts/ בפרויקט.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                רענן Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>מידע על המערכת</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">גרסה:</dt>
                <dd>1.0.0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Framework:</dt>
                <dd>Next.js 14</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Database:</dt>
                <dd>Supabase PostgreSQL</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
