import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '../types'

interface UIStore {
  sidebarOpen: boolean
  theme: Theme
  commandPaletteOpen: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: Theme) => void
  setCommandPaletteOpen: (open: boolean) => void
  setSaveStatus: (status: UIStore['saveStatus']) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      commandPaletteOpen: false,
      saveStatus: 'idle',

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setSaveStatus: (saveStatus) => set({ saveStatus }),
    }),
    { name: 'notion-editor-ui', partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }) }
  )
)
