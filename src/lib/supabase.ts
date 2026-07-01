import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
)

/* ── Pages ─────────────────────────────────────────────── */

export async function fetchPages(userId: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function upsertPage(page: {
  id: string
  title: string
  content: object
  emoji?: string
  parent_id?: string | null
  user_id: string
  updated_at: string
}) {
  const { error } = await supabase.from('pages').upsert(page)
  if (error) throw error
}

export async function deletePage(id: string) {
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) throw error
}

/*
  ── Supabase SQL schema (run in Supabase SQL editor) ──────

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
*/
