import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { JSONContent } from '@tiptap/core'
import type { Page } from '@/types'
import { generateId } from '@/lib/tiptap.utils'
import { savePageLocally, getAllLocalPages, deleteLocalPage } from '@/lib/idb'

const DEFAULT_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

interface PageStore {
  pages: Page[]
  activePageId: string | null

  // Actions
  loadPages: () => Promise<void>
  createPage: (parentId?: string) => Page
  updatePage: (id: string, patch: Partial<Omit<Page, 'id' | 'createdAt'>>) => void
  deletePage: (id: string) => void
  setActivePage: (id: string) => void
  getActivePage: () => Page | undefined
}

export const usePageStore = create<PageStore>()(
  subscribeWithSelector((set, get) => ({
    pages: [],
    activePageId: null,

    loadPages: async () => {
      const pages = await getAllLocalPages()
      if (pages.length === 0) {
        // Seed with a welcome page
        const welcome: Page = {
          id: generateId(),
          title: 'Getting started',
          emoji: '👋',
          content: {
            type: 'doc',
            content: [
              { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome to your editor' }] },
              { type: 'paragraph', content: [{ type: 'text', text: 'Start writing, or type / for commands.' }] },
              { type: 'taskList', content: [
                { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Try the / slash menu' }] }] },
                { type: 'taskItem', attrs: { checked: true },  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Create your first page' }] }] },
              ]},
            ],
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await savePageLocally(welcome)
        set({ pages: [welcome], activePageId: welcome.id })
      } else {
        set({ pages, activePageId: pages[0].id })
      }
    },

    createPage: (parentId) => {
      const now = new Date().toISOString()
      const page: Page = {
        id: generateId(),
        title: 'Untitled',
        content: DEFAULT_CONTENT,
        parentId: parentId ?? null,
        createdAt: now,
        updatedAt: now,
      }
      set((s) => ({ pages: [page, ...s.pages], activePageId: page.id }))
      savePageLocally(page)
      return page
    },

    updatePage: (id, patch) => {
      set((s) => ({
        pages: s.pages.map((p) =>
          p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
        ),
      }))
      const updated = get().pages.find((p) => p.id === id)
      if (updated) savePageLocally(updated)
    },

    deletePage: (id) => {
      const { pages, activePageId } = get()
      const remaining = pages.filter((p) => p.id !== id)
      const nextActive =
        activePageId === id ? (remaining[0]?.id ?? null) : activePageId
      set({ pages: remaining, activePageId: nextActive })
      deleteLocalPage(id)
    },

    setActivePage: (id) => set({ activePageId: id }),

    getActivePage: () => {
      const { pages, activePageId } = get()
      return pages.find((p) => p.id === activePageId)
    },
  }))
)
