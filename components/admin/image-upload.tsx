"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import { X, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  maxSize?: number // in MB
  accept?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket = "article-images",
  folder = "featured",
  maxSize = 5,
  accept = "image/jpeg,image/png,image/webp,image/jpg",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    setError("")
    setIsUploading(true)

    try {
      // בדיקת גודל
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`הקובץ גדול מדי. מקסימום ${maxSize}MB`)
      }

      // בדיקת סוג
      if (!file.type.startsWith("image/")) {
        throw new Error("ניתן להעלות רק קבצי תמונה")
      }

      // קבלת משתמש
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error("נדרשת התחברות")

      // יצירת שם קובץ ייחודי
      const fileExt = file.name.split(".").pop()
      const fileName = `${session.user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // מחיקת תמונה קודמת אם קיימת
      if (value) {
        const oldPath = value.split(`/${bucket}/`)[1]
        if (oldPath) {
          await supabase.storage.from(bucket).remove([oldPath])
        }
      }

      // העלאה
      const { data, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      // קבלת URL ציבורי
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)

      onChange(publicUrl)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError(err instanceof Error ? err.message : "שגיאה בהעלאת תמונה")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const removeImage = async () => {
    if (value) {
      try {
        const path = value.split(`/${bucket}/`)[1]
        if (path) {
          await supabase.storage.from(bucket).remove([path])
        }
      } catch (err) {
        console.error("Error removing image:", err)
      }
      onChange("")
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <div className="relative group">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
            <Image src={value || "/placeholder.svg"} alt="תמונה שהועלתה" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative w-full aspect-video rounded-lg border-2 border-dashed
            flex flex-col items-center justify-center gap-2
            cursor-pointer transition-colors
            ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
          onClick={() => !isUploading && inputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">מעלה תמונה...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">גרור תמונה לכאן או לחץ להעלאה</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP עד {maxSize}MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
