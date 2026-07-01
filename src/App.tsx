import { useEffect } from 'react'
import { usePageStore } from './store/pageStore'
import { useUIStore } from './store/uiStore'
import { useKeyboard } from './hooks/useKeyboard'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import './app.css'

export default function App() {
  const loadPages = usePageStore((s) => s.loadPages)
  const theme = useUIStore((s) => s.theme)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  useKeyboard()

  // Load pages from IndexedDB on mount
  useEffect(() => {
    loadPages()
  }, [loadPages])

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const apply = () => {
        document.body.classList.toggle('dark', mq.matches)
      }
      apply()
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])

  return (
    <div className="app-layout">
      {/* Sidebar toggle button (always visible) */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Close sidebar (Cmd+\\)' : 'Open sidebar (Cmd+\\)'}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar />

      <main className="main-area">
        <Editor />
      </main>
    </div>
  )
}
