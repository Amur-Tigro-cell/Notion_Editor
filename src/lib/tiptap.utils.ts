import type { JSONContent } from '@tiptap/core'

/** Recursively extract plain text from a Tiptap JSONContent doc */
export function getTextContent(node: JSONContent): string {
  if (node.type === 'text') return node.text ?? ''
  if (!node.content) return ''
  return node.content.map(getTextContent).join(' ')
}

/** Return first heading or paragraph text as a page title */
export function getTitleFromDoc(doc: JSONContent): string {
  const first = doc.content?.[0]
  if (!first) return 'Untitled'
  return getTextContent(first).trim() || 'Untitled'
}

/** True when the document has no meaningful content */
export function isEmpty(doc: JSONContent): boolean {
  return getTextContent(doc).trim() === ''
}

/** Generate a unique ID */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Extract a short excerpt around a search match */
export function getExcerpt(doc: JSONContent, maxLength = 120): string {
  const text = getTextContent(doc)
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}
