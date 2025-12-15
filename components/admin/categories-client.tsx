"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, GripVertical } from "lucide-react"
import { CategoryForm } from "@/components/admin/category-form"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"
import type { Category } from "@/types"

interface CategoriesClientProps {
  initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories] = useState(initialCategories)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditingCategory(null)
    setFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingCategory(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif">קטגוריות</h1>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" />
          קטגוריה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>כל הקטגוריות ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>שם</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>אייקון</TableHead>
                  <TableHead>צבע</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell dir="ltr">{category.slug}</TableCell>
                    <TableCell>{category.icon || "-"}</TableCell>
                    <TableCell>
                      {category.color ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: category.color }} />
                          <span className="text-xs" dir="ltr">
                            {category.color}
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">אין קטגוריות עדיין. צור את הקטגוריה הראשונה!</p>
          )}
        </CardContent>
      </Card>

      <CategoryForm category={editingCategory} open={formOpen} onOpenChange={handleFormClose} />
    </>
  )
}
