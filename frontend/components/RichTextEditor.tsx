"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold,
  Code,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  ariaLabel?: string;
};

function ToolbarButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // mencegah editor kehilangan fokus saat tombol diklik
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded text-gray-700 hover:bg-gray-200 ${
        active ? "bg-gray-200" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-gray-300" />;
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Masukkan URL tautan", previous ?? "https://");
    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Masukkan URL gambar (https://...)");
    if (url && url.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1">
      <ToolbarButton
        label="Tebal"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Miring"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Garis bawah"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        label="Judul"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar poin"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar nomor"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="Tautan" active={editor.isActive("link")} onClick={setLink}>
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton label="Gambar" onClick={addImage}>
        <ImageIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Kode"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={15} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, ariaLabel }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      TiptapImage,
    ],
    content: value,
    immediatelyRender: false, // wajib untuk Next.js (SSR)
    shouldRerenderOnTransaction: true, // supaya tombol aktif ikut berubah
    editorProps: {
      attributes: {
        class:
          "rich-text min-h-[220px] max-h-[360px] overflow-y-auto px-4 py-3 text-sm outline-none",
        "aria-label": ariaLabel ?? "Editor teks",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="min-h-[260px] rounded-md border border-gray-300" />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 focus-within:border-slate-700">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}