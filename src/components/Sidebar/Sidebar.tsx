import { useState } from 'react'
import { usePageStore } from '../../store/pageStore'
import { useUIStore } from '../../store/uiStore'
import type { Page } from '../../types'

export default function Sidebar() {
  const pages = usePageStore((s) => s.pages)
  const activePageId = usePageStore((s) => s.activePageId)
  const setActivePage = usePageStore((s) => s.setActivePage)
  const createPage = usePageStore((s) => s.createPage)
  const deletePage = usePageStore((s) => s.deletePage)
  const updatePage = usePageStore((s) => s.updatePage)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const startEdit = (page: Page) => {
    setEditingId(page.id)
    setEditingTitle(page.title)
  }

  const commitEdit = (id: string) => {
    updatePage(id, { title: editingTitle || 'Untitled' })
    setEditingId(null)
  }

  return (
    <aside className={`sidebar${sidebarOpen ? '' : ' sidebar--collapsed'}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo">✦ Editor</span>
        <span className="sidebar-brand-subtitle">Workspace</span>
      </div>

      <div className="sidebar-actions">
        <button className="sidebar-new-btn" onClick={() => createPage()} title="Create a new page">
          <span className="sidebar-new-btn-icon">+</span>
          <span className="sidebar-new-btn-label">New page</span>
        </button>
      </div>

      <nav className="page-list" aria-label="Pages">
        {pages.length === 0 && (
          <p className="sidebar-empty">No pages yet.</p>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-item${page.id === activePageId ? ' active' : ''}`}
            onClick={() => setActivePage(page.id)}
          >
            <span className="page-item-emoji">{page.emoji ?? '📄'}</span>

            {editingId === page.id ? (
              <input
                autoFocus
                className="page-item-input"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => commitEdit(page.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(page.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="page-item-title"
                onDoubleClick={(e) => { e.stopPropagation(); startEdit(page) }}
              >
                {page.title || 'Untitled'}
              </span>
            )}

            <button
              className="page-item-delete"
              title="Delete page"
              onClick={(e) => { e.stopPropagation(); deletePage(page.id) }}
              aria-label={`Delete ${page.title}`}
            >
              ×
            </button>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-hint">Double-click to rename</span>
      </div>
    </aside>
  )
}
