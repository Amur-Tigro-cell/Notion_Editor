import { useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/core'
import { usePageStore } from '../store/pageStore'
import { useUIStore } from '../store/uiStore'
import { getTitleFromDoc } from '../lib/tiptap.utils'

const DEBOUNCE_MS = 400

/**
 * Subscribes to editor updates and debounces saves to the page store.
 * Shows a "Saving…" / "Saved" status indicator via uiStore.
 */
export function useAutosave(editor: Editor | null, pageId: string | null) {
  const updatePage = usePageStore((s) => s.updatePage)
  const setSaveStatus = useUIStore((s) => s.setSaveStatus)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!editor || !pageId) return

    const save = () => {
      const doc = editor.getJSON()
      const title = getTitleFromDoc(doc)
      setSaveStatus('saving')
      updatePage(pageId, { content: doc, title })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1500)
    }

    const handleUpdate = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(save, DEBOUNCE_MS)
    }

    // Save on blur (tab switch, window close)
    const handleBlur = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        save()
      }
    }

    editor.on('update', handleUpdate)
    window.addEventListener('blur', handleBlur)

    return () => {
      editor.off('update', handleUpdate)
      window.removeEventListener('blur', handleBlur)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [editor, pageId, updatePage, setSaveStatus])
}
