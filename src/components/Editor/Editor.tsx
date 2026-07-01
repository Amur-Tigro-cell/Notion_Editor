import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useEffect } from 'react'
import { usePageStore } from '@/store/pageStore'
import { useUIStore } from '@/store/uiStore'
import { useAutosave } from '@/hooks/useAutosave'
import { SlashCommand } from '@/extensions/SlashCommand'
import { TrailingNode } from '@/extensions/TrailingNode'
import Toolbar from './Toolbar'

export default function Editor() {
  const activePage = usePageStore((s) => s.getActivePage())
  const activePageId = usePageStore((s) => s.activePageId)
  const saveStatus = useUIStore((s) => s.saveStatus)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: { depth: 100 } }),
      Placeholder.configure({ placeholder: "Write something, or type '/' for commands…" }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      Highlight,
      SlashCommand,
      TrailingNode,
    ],
    content: activePage?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class: 'editor-content',
        spellcheck: 'true',
      },
    },
  })

  // Sync editor content when active page changes
  useEffect(() => {
    if (editor && activePage && !editor.isDestroyed) {
      const current = JSON.stringify(editor.getJSON())
      const next = JSON.stringify(activePage.content)
      if (current !== next) {
        editor.commands.setContent(activePage.content, false)
      }
    }
  }, [activePageId]) // eslint-disable-line react-hooks/exhaustive-deps

  useAutosave(editor, activePageId)

  if (!activePage) {
    return (
      <div className="editor-empty">
        <p>No page selected. Create one from the sidebar.</p>
      </div>
    )
  }

  return (
    <div className="editor-wrapper">
      {editor && <Toolbar editor={editor} />}

      <div className="editor-scroll">
        <div className="editor-inner">
          <div className="page-header">
            <span className="page-emoji">{activePage.emoji ?? '📄'}</span>
            <h1 className="page-title">
              {activePage.title || 'Untitled'}
            </h1>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="editor-footer">
        <span className="save-status">
          {saveStatus === 'saving' && 'Saving…'}
          {saveStatus === 'saved' && '✓ Saved'}
          {saveStatus === 'idle' && ''}
        </span>
        <span className="editor-hint">
          Type <kbd>/</kbd> for commands · <kbd>Cmd+K</kbd> to search
        </span>
      </div>
    </div>
  )
}
