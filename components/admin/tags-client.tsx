"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, RefreshCw, Search, Loader2 } from "lucide-react"
import { TagForm } from "@/components/admin/tag-form"
import { deleteTag, syncAllTagUsageCounts } from "@/app/actions/tags"
import { useToast } from "@/hooks/use-toast"
import type { Tag } from "@/types"

interface TagsClientProps {
  initialTags: Tag[]
}

export function TagsClient({ initialTags }: TagsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [tags] = useState(initialTags)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditingTag(null)
    setFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingTag(null)
    }
  }

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!tagToDelete) return

    setIsDeleting(true)

    const result = await deleteTag(tagToDelete.id)

    if (result.success) {
      toast({
        title: "התגית נמחקה",
        description: `התגית "${tagToDelete.name}" נמחקה בהצלחה`,
      })
      router.refresh()
    } else {
      toast({
        title: "שגיאה במחיקה",
        description: result.error || "אירעה שגיאה במחיקת התגית",
        variant: "destructive",
      })
    }

    setIsDeleting(false)
    setDeleteDialogOpen(false)
    setTagToDelete(null)
  }

  const handleSync = async () => {
    setIsSyncing(true)

    const result = await syncAllTagUsageCounts()

    if (result.success) {
      toast({
        title: "סנכרון הושלם",
        description: "מוני השימוש של כל התגיות עודכנו",
      })
      router.refresh()
    }

    setIsSyncing(false)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">תגיות</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCw className="h-4 w-4 ml-2" />}
            סנכרן מונים
          </Button>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="h-4 w-4" />
            תגית חדשה
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>כל התגיות ({tags.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש תגיות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>שימושים</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{tag.name}</Badge>
                    </TableCell>
                    <TableCell dir="ltr">{tag.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tag.usage_count}</Badge>
                    </TableCell>
                    <TableCell>{new Date(tag.created_at).toLocaleDateString("he-IL")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(tag)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(tag)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? "לא נמצאו תגיות מתאימות" : "אין תגיות עדיין. צור את התגית הראשונה!"}
            </p>
          )}
        </CardContent>
      </Card>

      <TagForm tag={editingTag} open={formOpen} onOpenChange={handleFormClose} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את התגית?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את התגית &quot;{tagToDelete?.name}&quot; לצמיתות.
              {tagToDelete && tagToDelete.usage_count > 0 && (
                <span className="block mt-2 text-destructive">
                  שים לב: תגית זו משויכת ל-{tagToDelete.usage_count} מאמרים.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
