"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Check, Copy, MessageCircle, Facebook, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function ShareButton({
  title,
  text = "",
  url,
  size = "default",
  variant = "outline"
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareText = text || title

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("הקישור הועתק בהצלחה!", {
        duration: 2000,
        icon: "📋",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("שגיאה בהעתקת הקישור")
    }
  }

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`
    window.open(whatsappUrl, "_blank")
    toast.success("נפתח ב-WhatsApp", { icon: "📱" })
  }

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, "_blank", "width=600,height=400")
    toast.success("נפתח ב-Facebook", { icon: "👍" })
  }

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "width=600,height=400")
    toast.success("נפתח ב-Twitter", { icon: "🐦" })
  }

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
    window.location.href = emailUrl
    toast.success("נפתח בדוא\"ל", { icon: "✉️" })
  }

  // Native Web Share API (if available)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        })
        toast.success("שותף בהצלחה!", { icon: "🎉" })
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  }

  const hasNativeShare = typeof navigator !== "undefined" && navigator.share

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant={variant} size={size} className="gap-2">
            <Share2 className="h-4 w-4" />
            שתף
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" dir="rtl">
        {hasNativeShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare} className="gap-2 cursor-pointer">
              <Share2 className="h-4 w-4" />
              שתף...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Check className="h-4 w-4 text-green-600" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Copy className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          {copied ? "הועתק!" : "העתק קישור"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={shareViaWhatsApp} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaFacebook} className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaTwitter} className="gap-2 cursor-pointer">
          <Twitter className="h-4 w-4 text-sky-500" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaEmail} className="gap-2 cursor-pointer">
          <Mail className="h-4 w-4 text-gray-600" />
          דוא"ל
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
