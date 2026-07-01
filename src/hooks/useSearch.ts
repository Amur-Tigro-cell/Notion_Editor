import { useMemo } from 'react'
import Fuse from 'fuse.js'
import { usePageStore } from '../store/pageStore'
import { getTextContent } from '../lib/tiptap.utils'
import type { SearchResult } from '../types'

/**
 * Full-text search across all pages using Fuse.js.
 * Returns ranked results with a short excerpt.
 */
export function useSearch(query: string): SearchResult[] {
  const pages = usePageStore((s) => s.pages)

  const fuse = useMemo(() => {
    const indexed = pages.map((p) => ({
      ...p,
      _text: getTextContent(p.content),
    }))
    return new Fuse(indexed, {
      keys: ['title', '_text'],
      threshold: 0.35,
      includeMatches: true,
    })
  }, [pages])

  return useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).map(({ item }) => {
      const text = getTextContent(item.content)
      const excerpt = text.length > 100 ? text.slice(0, 100) + '…' : text
      return { page: item, excerpt }
    })
  }, [fuse, query])
}
