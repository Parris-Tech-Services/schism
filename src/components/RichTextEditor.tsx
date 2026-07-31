import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react';
import clsx from 'clsx';

export function RichTextEditor({ value, onChange, placeholder = 'Write lore…' }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'text-[15px] text-slate-200' } }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, false);
  }, [editor, value]);

  if (!editor) return null;
  const tool = (label: string, active: boolean, action: () => void, icon: React.ReactNode) => (
    <button type="button" aria-label={label} title={label} onClick={action} className={clsx('rounded-lg p-2 transition hover:bg-white/10', active ? 'bg-emerald-300/15 text-emerald-200' : 'text-slate-400')}>{icon}</button>
  );
  return (
    <div className="prose-editor overflow-hidden rounded-xl border border-white/10 bg-black/15">
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-2 py-1.5">
        {tool('Bold', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold size={16} />)}
        {tool('Italic', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic size={16} />)}
        {tool('Bullet list', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List size={16} />)}
        {tool('Numbered list', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={16} />)}
        {tool('Quote', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote size={16} />)}
        <div className="mx-1 w-px bg-white/10" />
        {tool('Undo', false, () => editor.chain().focus().undo().run(), <Undo2 size={16} />)}
        {tool('Redo', false, () => editor.chain().focus().redo().run(), <Redo2 size={16} />)}
      </div>
      <EditorContent editor={editor} className="px-4 py-4" />
    </div>
  );
}
