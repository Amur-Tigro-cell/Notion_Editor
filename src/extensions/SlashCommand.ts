import { Extension } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import SlashMenu, { type SlashMenuRef } from '../components/Editor/SlashMenu'
import tippy, { type Instance } from 'tippy.js'

export interface SlashCommandItem {
  title: string
  description: string
  icon: string
  command: (editor: Editor) => void
}

export const SLASH_ITEMS: SlashCommandItem[] = [
  {
    title: 'Text',
    description: 'Plain paragraph',
    icon: '¶',
    command: (editor) =>
      editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet list',
    description: 'Unordered list',
    icon: '•',
    command: (editor) =>
      editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered list',
    description: 'Ordered list',
    icon: '1.',
    command: (editor) =>
      editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'To-do list',
    description: 'Checkable task list',
    icon: '☐',
    command: (editor) =>
      editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Quote',
    description: 'Blockquote callout',
    icon: '"',
    command: (editor) =>
      editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code block',
    description: 'Monospace code',
    icon: '<>',
    command: (editor) =>
      editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Horizontal rule',
    icon: '—',
    command: (editor) =>
      editor.chain().focus().setHorizontalRule().run(),
  },
]

const suggestion: Partial<SuggestionOptions> = {
  char: '/',
  startOfLine: false,

  items: ({ query }: { query: string }) => {
    const q = query.toLowerCase()
    return SLASH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    ).slice(0, 8)
  },

  render: () => {
    let component: ReactRenderer<SlashMenuRef>
    let popup: Instance[]

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashMenu, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) return

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          animation: 'shift-away',
          theme: 'slash-menu',
        })
      },

      onUpdate(props) {
        component.updateProps(props)
        if (!props.clientRect) return
        popup[0].setProps({ getReferenceClientRect: props.clientRect as () => DOMRect })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        return component.ref?.onKeyDown(props) ?? false
      },

      onExit() {
        popup[0]?.destroy()
        component.destroy()
      },
    }
  },
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return { suggestion }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
