"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "شروع به نوشتن کنید...",
  height = 500,
  disabled = false,
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
        dir: "rtl",
        style: `min-height: ${height}px;`,
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          if (event.key === "Backspace" || event.key === "Enter") {
            const state: any = editor?.state;
            const { $from } = state.selection;
            const isInListItem = editor?.isActive("listItem");
            const atStartOfNode = $from.parentOffset === 0;
            const isEmptyItem = $from.parent?.textContent?.length === 0;

            if (isInListItem && isEmptyItem) {
              event.preventDefault();
              const lifted = editor
                ?.chain()
                .focus()
                .liftListItem("listItem")
                .run();
              if (!lifted) {
                editor?.chain().focus().toggleBulletList().run();
                editor?.chain().focus().toggleOrderedList().run();
              }
              return true;
            }

            if (isInListItem && atStartOfNode && event.key === "Backspace") {
              return false;
            }
          }
          return false;
        },
      },
    },
  });

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const uploadFile = async (file: File, isImage: boolean = false) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از 10 مگابایت باشد");
      return;
    }

    // Store current selection position
    const { from } = editor?.state.selection || { from: 0 };
    const loadingText = "در حال آپلود...";

    try {
      // Insert loading text at current cursor position
      editor?.chain().focus().insertContent(`<p>${loadingText}</p>`).run();

      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "folder",
        isImage ? "blog-content-images" : "blog-content-files"
      );

      const response = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("خطا در آپلود فایل");
      }

      const result = await response.json();

      // Get current content and find the loading text
      const currentHTML = editor?.getHTML() || "";
      const loadingIndex = currentHTML.indexOf(`<p>${loadingText}</p>`);

      if (loadingIndex !== -1) {
        // Replace loading text with actual content
        let replacementHTML = "";
        if (isImage) {
          replacementHTML = `<img src="${result.url}" class="max-w-full h-auto rounded-lg" alt="Uploaded image" />`;
        } else {
          const fileName = file.name;
          replacementHTML = `<p><a href="${result.url}" target="_blank" rel="noopener noreferrer">📎 ${fileName}</a></p>`;
        }

        const updatedHTML = currentHTML.replace(
          `<p>${loadingText}</p>`,
          replacementHTML
        );
        editor?.commands.setContent(updatedHTML);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("خطا در آپلود فایل");

      // Remove loading text
      const currentHTML = editor?.getHTML() || "";
      const updatedHTML = currentHTML.replace(`<p>${loadingText}</p>`, "");
      editor?.commands.setContent(updatedHTML);

      // Restore cursor position
      editor?.commands.setTextSelection(from);
    }
  };

  const addImage = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("لطفاً فقط فایل‌های تصویری آپلود کنید");
        return;
      }

      await uploadFile(file, true);
    };

    // Trigger file selection
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const addFile = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.style.display = "none";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      await uploadFile(file, false);
    };

    // Trigger file selection
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const setTextColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {/* Text formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-200" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Links and Media */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkDialog(true)}
          className={editor.isActive("link") ? "bg-gray-200" : ""}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={addFile}>
          <Upload className="h-4 w-4" />
        </Button>

        {/* Color picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette className="h-4 w-4" />
          </Button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-6 gap-1">
                {[
                  "#000000",
                  "#374151",
                  "#6B7280",
                  "#9CA3AF",
                  "#D1D5DB",
                  "#FFFFFF",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[300px] p-4"
          style={{ minHeight: `${height}px` }}
        />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">افزودن لینک</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="آدرس لینک را وارد کنید..."
              className="w-full p-2 border border-gray-300 rounded mb-4"
              dir="ltr"
            />
            <div className="flex gap-2">
              <Button onClick={addLink}>افزودن</Button>
              <Button
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
              >
                لغو
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
