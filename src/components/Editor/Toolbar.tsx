import type { Editor } from '@tiptap/core'

interface Props {
  editor: Editor
}

interface ToolbarButton {
  label: string
  action: () => void
  isActive?: boolean
  title: string
}

export default function Toolbar({ editor }: Props) {
  const buttons: ToolbarButton[] = [
    {
      label: 'B',
      title: 'Bold (Cmd+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      label: 'I',
      title: 'Italic (Cmd+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      label: 'U',
      title: 'Underline (Cmd+U)',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      label: 'S',
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
  ]

  const blockButtons: ToolbarButton[] = [
    {
      label: 'H1',
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: '•',
      title: 'Bullet list',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: '☐',
      title: 'Task list',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
    {
      label: '"',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      label: '<>',
      title: 'Code block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
  ]

  return (
    <div className="toolbar">
      <div className="toolbar-cluster">
        {blockButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className={`toolbar-btn${btn.isActive ? ' active' : ''}`}
            onClick={btn.action}
            aria-pressed={btn.isActive}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="toolbar-sep" />
      <div className="toolbar-cluster">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className={`toolbar-btn${btn.isActive ? ' active' : ''}`}
            onClick={btn.action}
            aria-pressed={btn.isActive}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="toolbar-sep" />
      <div className="toolbar-cluster toolbar-cluster--actions">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          —
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Cmd+Z)"
          disabled={!editor.can().undo()}
        >
          ↩
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          disabled={!editor.can().redo()}
        >
          ↪
        </button>
      </div>
    </div>
  )
}
