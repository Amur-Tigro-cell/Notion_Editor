import { openDB, type DBSchema } from 'idb'
import type { Page } from '../types'

interface EditorDB extends DBSchema {
  pages: {
    key: string
    value: Page
    indexes: { 'by-updated': string }
  }
}

async function getDB() {
  return openDB<EditorDB>('notion-editor', 1, {
    upgrade(db) {
      const store = db.createObjectStore('pages', { keyPath: 'id' })
      store.createIndex('by-updated', 'updatedAt')
    },
  })
}

export async function savePageLocally(page: Page): Promise<void> {
  const db = await getDB()
  await db.put('pages', page)
}

export async function getLocalPage(id: string): Promise<Page | undefined> {
  const db = await getDB()
  return db.get('pages', id)
}

export async function getAllLocalPages(): Promise<Page[]> {
  const db = await getDB()
  const pages = await db.getAllFromIndex('pages', 'by-updated')
  return pages.reverse() // newest first
}

export async function deleteLocalPage(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('pages', id)
}
