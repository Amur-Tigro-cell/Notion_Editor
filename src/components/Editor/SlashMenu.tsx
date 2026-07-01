import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import type { Editor } from '@tiptap/core'
import type { SlashCommandItem } from '@/extensions/SlashCommand'

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

interface Props {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
  editor: Editor
}

const SlashMenu = forwardRef<SlashMenuRef, Props>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        if (items[selectedIndex]) command(items[selectedIndex])
        return true
      }
      return false
    },
  }))

  if (!items.length) return null

  return (
    <div className="slash-menu">
      {items.map((item, i) => (
        <button
          key={item.title}
          className={`slash-item${i === selectedIndex ? ' selected' : ''}`}
          onClick={() => command(item)}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <span className="slash-icon">{item.icon}</span>
          <span className="slash-info">
            <span className="slash-title">{item.title}</span>
            <span className="slash-desc">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
})

SlashMenu.displayName = 'SlashMenu'
export default SlashMenu
