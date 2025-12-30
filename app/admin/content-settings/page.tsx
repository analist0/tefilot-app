"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label as _Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, CheckCircle2 } from "lucide-react"
import { TEXT_TYPES_CONFIG, type TextType } from "@/types/text-reader"
import { toast } from "sonner"

export default function ContentSettingsPage() {
  const [settings, setSettings] = useState<Record<TextType, boolean>>({
    tehilim: true,
    tanakh: true,
    talmud: true,
    tefilot: true,
    halacha: true,
    sefarim: true,
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // טעינת הגדרות מ-localStorage
    const savedSettings = localStorage.getItem("content_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleToggle = (type: TextType) => {
    setSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("content_settings", JSON.stringify(settings))
    toast.success("הגדרות נשמרו בהצלחה!")
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const enabledCount = Object.values(settings).filter(Boolean).length
  const totalCount = Object.keys(settings).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">הגדרות תוכן</h1>
        <p className="text-muted-foreground mt-2">
          ניהול סוגי התוכן המוצגים באתר - הפעל או השבת קטגוריות לפי צורך
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>סטטוס כללי</CardTitle>
          <CardDescription>
            {enabledCount} מתוך {totalCount} קטגוריות פעילות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setSettings({ tehilim: true, tanakh: true, talmud: true, tefilot: true, halacha: true, sefarim: true })}>
              הפעל הכל
            </Button>
            <Button variant="outline" onClick={() => setSettings({ tehilim: true, tanakh: false, talmud: false, tefilot: false, halacha: false, sefarim: false })}>
              רק תהילים
            </Button>
            <Button variant="outline" onClick={() => setSettings({ tehilim: false, tanakh: false, talmud: false, tefilot: false, halacha: false, sefarim: false })}>
              השבת הכל
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {(Object.keys(TEXT_TYPES_CONFIG) as TextType[]).map((type) => {
          const config = TEXT_TYPES_CONFIG[type]
          const isEnabled = settings[type]

          return (
            <Card key={type} className={isEnabled ? "border-primary" : "opacity-60"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {config.heTitle}
                        <Badge variant={isEnabled ? "default" : "secondary"}>
                          {isEnabled ? "פעיל" : "מושבת"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{config.heDescription}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={() => handleToggle(type)} />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    {config.features.dailyReading && (
                      <Badge variant="outline">📅 קריאה יומית</Badge>
                    )}
                    {config.features.wordByWord && (
                      <Badge variant="outline">📝 מילה-מילה</Badge>
                    )}
                    {config.features.statistics && (
                      <Badge variant="outline">📊 סטטיסטיקות</Badge>
                    )}
                  </div>

                  {config.totalSections > 0 && (
                    <p className="text-xs">
                      סה"כ {config.totalSections.toLocaleString("he-IL")} {type === "talmud" ? "דפים" : "פרקים"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} size="lg" className="gap-2">
          {saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
          {saved ? "נשמר!" : "שמור הגדרות"}
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">הערה חשובה</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• הגדרות אלו נשמרות באופן מקומי בדפדפן</p>
          <p>• משתמשים יראו רק את הקטגוריות שהפעלת</p>
          <p>• ניתן לשנות הגדרות בכל עת</p>
          <p>• המערכת משתמשת ב-Sefaria API למשיכת הטקסטים</p>
        </CardContent>
      </Card>
    </div>
  )
}
