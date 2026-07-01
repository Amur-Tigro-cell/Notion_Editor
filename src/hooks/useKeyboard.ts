import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
import { usePageStore } from '../store/pageStore'

/**
 * Global keyboard shortcuts:
 *   Cmd/Ctrl + \   → toggle sidebar
 *   Cmd/Ctrl + K   → command palette
 *   Cmd/Ctrl + N   → new page
 */
export function useKeyboard() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const createPage = usePageStore((s) => s.createPage)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      }

      if (mod && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }

      if (mod && e.key === 'n') {
        e.preventDefault()
        createPage()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [toggleSidebar, setCommandPaletteOpen, createPage])
}
