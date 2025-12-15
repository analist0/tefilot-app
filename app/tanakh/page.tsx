"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ArrowRight } from "lucide-react"
import { TANAKH_BOOKS } from "@/lib/sefaria/tanakh"

export default function TanakhPage() {
  const [selectedSeder, setSelectedSeder] = useState<"torah" | "neviim" | "ketuvim">("torah")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-serif">תנ״ך</h1>
          </div>
          <p className="text-xl text-muted-foreground">תורה, נביאים וכתובים - קריאה מילה במילה עם מעקב התקדמות</p>
        </div>

        {/* Navigation back to learn */}
        <div className="flex justify-start">
          <Link href="/learn">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              חזרה למרכז הלימוד
            </Button>
          </Link>
        </div>

        {/* Tabs for Torah, Neviim, Ketuvim */}
        <Tabs value={selectedSeder} onValueChange={(v) => setSelectedSeder(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="torah" className="text-lg">
              תורה
              <Badge variant="secondary" className="mr-2">
                5
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="neviim" className="text-lg">
              נביאים
              <Badge variant="secondary" className="mr-2">
                21
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ketuvim" className="text-lg">
              כתובים
              <Badge variant="secondary" className="mr-2">
                13
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Torah */}
          <TabsContent value="torah" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TANAKH_BOOKS.torah.map((book) => (
                <Card key={book.en} className="hover:border-primary transition-all hover:shadow-lg group">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">{book.he}</CardTitle>
                    <CardDescription>{book.en}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{book.chapters} פרקים</p>
                    <Button asChild className="w-full">
                      <Link href={`/tanakh/${book.en}/1`}>
                        <BookOpen className="ml-2 h-4 w-4" />
                        התחל קריאה
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Neviim */}
          <TabsContent value="neviim" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TANAKH_BOOKS.neviim.map((book) => (
                <Card key={book.en} className="hover:border-primary transition-all hover:shadow-lg group">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">{book.he}</CardTitle>
                    <CardDescription>{book.en}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{book.chapters} פרקים</p>
                    <Button asChild className="w-full">
                      <Link href={`/tanakh/${book.en}/1`}>
                        <BookOpen className="ml-2 h-4 w-4" />
                        התחל קריאה
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ketuvim */}
          <TabsContent value="ketuvim" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TANAKH_BOOKS.ketuvim.map((book) => (
                <Card key={book.en} className="hover:border-primary transition-all hover:shadow-lg group">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">{book.he}</CardTitle>
                    <CardDescription>{book.en}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{book.chapters} פרקים</p>
                    <Button asChild className="w-full">
                      <Link href={`/tanakh/${book.en}/1`}>
                        <BookOpen className="ml-2 h-4 w-4" />
                        התחל קריאה
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">אודות קריאת התנ״ך</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• קריאה מילה במילה עם הדגשת שמות הקודש</p>
            <p>• מעקב אחר ההתקדמות שלך בכל ספר</p>
            <p>• שמירה אוטומטית של המיקום האחרון</p>
            <p>• סטטיסטיקות מפורטות על הקריאה שלך</p>
            <p>• הטקסטים נשלפים מספריית Sefaria</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
