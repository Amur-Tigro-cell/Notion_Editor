import type { JSONContent } from '@tiptap/core'

export interface Page {
  id: string
  title: string
  content: JSONContent
  emoji?: string
  parentId?: string | null
  createdAt: string
  updatedAt: string
  userId?: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface SearchResult {
  page: Page
  excerpt: string
}
