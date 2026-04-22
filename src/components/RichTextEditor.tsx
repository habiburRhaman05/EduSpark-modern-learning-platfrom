import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Minus,
} from "lucide-react";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "Write something amazing…", minHeight = 280 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-3" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const Btn = ({ onClick, active, disabled, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough className="w-3.5 h-3.5" /></Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 className="w-3.5 h-3.5" /></Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code"><Code className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="w-3.5 h-3.5" /></Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <Btn onClick={setLink} active={editor.isActive("link")} title="Link"><LinkIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={addImage} title="Image"><ImageIcon className="w-3.5 h-3.5" /></Btn>
        <div className="flex-1" />
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="w-3.5 h-3.5" /></Btn>
      </div>
      <div className="overflow-y-auto" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
