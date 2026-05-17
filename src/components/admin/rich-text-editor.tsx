"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Minus,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn("h-8 w-8 p-0", active && "bg-cream-100 text-bronze")}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value
      ? (() => { try { return JSON.parse(value) as object; } catch { return value; } })()
      : "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string ?? "";
    const url = window.prompt("Link URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "blog");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json() as { url: string };
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-md border border-input bg-white overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-taupe-400/20 p-1.5 bg-cream-50">
        <ToolbarButton
          title="Başlık 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        ><Heading1 className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        ><Heading2 className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        ><Heading3 className="h-4 w-4" /></ToolbarButton>

        <span className="w-px h-5 bg-taupe-400/30 mx-1" />

        <ToolbarButton
          title="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        ><Bold className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        ><Italic className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Üstü çizili"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        ><Strikethrough className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Kod"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        ><Code className="h-4 w-4" /></ToolbarButton>

        <span className="w-px h-5 bg-taupe-400/30 mx-1" />

        <ToolbarButton
          title="Madde işaretli liste"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        ><List className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Numaralı liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        ><ListOrdered className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Alıntı"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        ><Quote className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Yatay çizgi"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        ><Minus className="h-4 w-4" /></ToolbarButton>

        <span className="w-px h-5 bg-taupe-400/30 mx-1" />

        <ToolbarButton
          title="Link"
          active={editor.isActive("link")}
          onClick={setLink}
        ><LinkIcon className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Görsel ekle"
          onClick={addImage}
        ><ImageIcon className="h-4 w-4" /></ToolbarButton>

        <span className="w-px h-5 bg-taupe-400/30 mx-1" />

        <ToolbarButton
          title="Geri al"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        ><Undo className="h-4 w-4" /></ToolbarButton>

        <ToolbarButton
          title="Yinele"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        ><Redo className="h-4 w-4" /></ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      {!value && placeholder && (
        <p className="px-4 pb-4 text-sm text-ink-300 pointer-events-none">{placeholder}</p>
      )}
    </div>
  );
}
