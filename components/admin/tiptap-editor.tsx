"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  Unlink,
  ImageIcon,
  TableIcon,
  Highlighter,
  Palette,
  ChevronDown,
  Columns,
  RowsIcon,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({ content, onChange, placeholder = "התחל לכתוב...", className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-border",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-muted font-bold border border-border p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-muted rounded-lg p-4 font-mono text-sm",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none",
          "prose-headings:font-serif prose-headings:text-foreground",
          "prose-p:text-foreground prose-p:leading-relaxed",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:pr-4 prose-blockquote:not-italic",
          "prose-code:bg-muted prose-code:px-1 prose-code:rounded",
          "prose-ul:list-disc prose-ol:list-decimal",
          "[direction:rtl]",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("הכנס URL:", previousUrl)

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt("הכנס URL של תמונה:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <span className="text-muted-foreground">טוען עורך...</span>
      </div>
    )
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-card", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="ביטול"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="חזרה"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Heading1 className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>פסקה רגילה</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="h-4 w-4 ml-2" /> כותרת 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="h-4 w-4 ml-2" /> כותרת 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="h-4 w-4 ml-2" /> כותרת 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          title="מודגש"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          title="נטוי"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          title="קו תחתון"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          title="קו חוצה"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          title="קוד"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Colors */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="צבע טקסט">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="grid grid-cols-5 gap-1 p-2">
            {[
              "#000000",
              "#ef4444",
              "#f97316",
              "#eab308",
              "#22c55e",
              "#3b82f6",
              "#8b5cf6",
              "#ec4899",
              "#6b7280",
              "#ffffff",
            ].map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
            <button
              className="col-span-5 text-sm text-muted-foreground hover:text-foreground mt-1"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              הסר צבע
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="הדגשת רקע">
              <Highlighter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="grid grid-cols-5 gap-1 p-2">
            {[
              "#fef08a",
              "#bbf7d0",
              "#bfdbfe",
              "#ddd6fe",
              "#fbcfe8",
              "#fed7aa",
              "#fecaca",
              "#d1d5db",
              "#ffffff",
              "transparent",
            ].map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: color === "transparent" ? "transparent" : color }}
                onClick={() =>
                  color === "transparent"
                    ? editor.chain().focus().unsetHighlight().run()
                    : editor.chain().focus().toggleHighlight({ color }).run()
                }
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          title="יישור לימין"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          title="יישור למרכז"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          title="יישור לשמאל"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          title="רשימה"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          title="רשימה ממוספרת"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          title="ציטוט"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          title="בלוק קוד"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
          title="הוסף קישור"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {editor.isActive("link") && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="הסר קישור"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        )}

        {/* Image */}
        <Button type="button" variant="ghost" size="icon" onClick={addImage} title="הוסף תמונה">
          <ImageIcon className="h-4 w-4" />
        </Button>

        {/* Table */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="טבלה">
              <TableIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={insertTable}>
              <TableIcon className="h-4 w-4 ml-2" /> הוסף טבלה
            </DropdownMenuItem>
            {editor.isActive("table") && (
              <>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Columns className="h-4 w-4 ml-2" /> הוסף עמודה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <RowsIcon className="h-4 w-4 ml-2" /> הוסף שורה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                  <Trash2 className="h-4 w-4 ml-2" /> מחק עמודה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                  <Trash2 className="h-4 w-4 ml-2" /> מחק שורה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
                  <Trash2 className="h-4 w-4 ml-2" /> מחק טבלה
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bubble Menu - appears on text selection */}
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-1 p-1 bg-card border rounded-lg shadow-lg">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3 w-3" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3 w-3" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-3 w-3" />
          </Toggle>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={setLink}>
            <LinkIcon className="h-3 w-3" />
          </Button>
        </div>
      </BubbleMenu>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Word Count */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-sm text-muted-foreground">
        <span>{editor.storage.characterCount?.words?.() || 0} מילים</span>
        <span>{editor.storage.characterCount?.characters?.() || 0} תווים</span>
      </div>
    </div>
  )
}
