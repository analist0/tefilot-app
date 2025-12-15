"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Loader2 } from "lucide-react"
import { deleteCategory } from "@/app/actions/categories"
import { useToast } from "@/hooks/use-toast"

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
}

export function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteCategory(categoryId)

    if (result.success) {
      toast({
        title: "הקטגוריה נמחקה",
        description: `הקטגוריה "${categoryName}" נמחקה בהצלחה`,
      })
      router.refresh()
    } else {
      toast({
        title: "שגיאה במחיקה",
        description: result.error || "אירעה שגיאה במחיקת הקטגוריה",
        variant: "destructive",
      })
    }

    setIsDeleting(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>האם למחוק את הקטגוריה?</AlertDialogTitle>
          <AlertDialogDescription>
            פעולה זו תמחק את הקטגוריה &quot;{categoryName}&quot; לצמיתות. לא ניתן לבטל פעולה זו.
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
  )
}
