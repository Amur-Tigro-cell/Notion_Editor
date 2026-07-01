# Notion-like Editor

A full-featured block editor built with React, TypeScript, and Tiptap.

## Features

- **Block editor** — Paragraph, H1/H2/H3, Bullet list, Ordered list, Task list, Blockquote, Code block, Divider
- **Slash commands** — Type `/` anywhere to open the block picker
- **Rich text formatting** — Bold, italic, underline, strikethrough, highlight
- **Multi-page sidebar** — Create, rename (double-click), delete pages
- **Autosave** — Debounced save on every keystroke, force-save on blur
- **Offline support** — Pages persisted to IndexedDB via `idb`
- **Keyboard shortcuts** — `Cmd+\` sidebar, `Cmd+K` search, `Cmd+N` new page
- **Dark mode** — System, light, or dark via Zustand UI store
- **Supabase ready** — DB helpers and SQL schema included, just add env vars

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the SQL in `src/lib/supabase.ts` (bottom of the file) in your Supabase SQL editor to create the `pages` table.

```bash
npm run dev
```

## Supabase SQL schema

```sql
create table pages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  title      text not null default '',
  content    jsonb not null default '{}',
  emoji      text,
  parent_id  uuid references pages(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pages enable row level security;

create policy "Users manage own pages"
  on pages for all using (auth.uid() = user_id);
```

## Project structure

```
src/
├── main.tsx                  # App entry
├── App.tsx                   # Root component
├── app.css                   # All component styles
├── index.css                 # Global + Tiptap styles
│
├── types/index.ts            # Shared TypeScript interfaces
│
├── lib/
│   ├── supabase.ts           # Supabase client + DB helpers
│   ├── tiptap.utils.ts       # Document text extraction helpers
│   └── idb.ts                # IndexedDB wrapper (offline)
│
├── store/
│   ├── pageStore.ts          # Pages state (Zustand)
│   └── uiStore.ts            # UI state: sidebar, theme, save status
│
├── hooks/
│   ├── useAutosave.ts        # Debounced editor → store sync
│   ├── useKeyboard.ts        # Global keyboard shortcuts
│   └── useSearch.ts          # Fuse.js full-text search
│
├── extensions/
│   ├── SlashCommand.ts       # / command Tiptap extension
│   └── TrailingNode.ts       # Ensures doc ends with paragraph
│
└── components/
    ├── Editor/
    │   ├── Editor.tsx         # Main editor (useEditor + EditorContent)
    │   ├── Toolbar.tsx        # Formatting toolbar
    │   └── SlashMenu.tsx      # Slash command dropdown UI
    └── Sidebar/
        └── Sidebar.tsx        # Page list + create/rename/delete
```

## Extending

- **Add a new block type**: add an entry to `SLASH_ITEMS` in `src/extensions/SlashCommand.ts`
- **Add real-time sync**: subscribe to `supabase.channel()` in `pageStore.ts` and call `updatePage` on remote changes
- **Add auth**: wrap `App.tsx` with Supabase auth and gate `loadPages` behind a valid session
- **Add drag-and-drop**: install `@tiptap/extension-drag-handle` and wire to `@dnd-kit/sortable` in the sidebar
