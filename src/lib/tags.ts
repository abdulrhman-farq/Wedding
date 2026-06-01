import { supabase } from './supabase'
import { config } from '../config'

export interface Tag {
  id: string
  item_id: string
  /** Normalized position on the still image, 0..1. */
  x: number
  y: number
  name: string
  created_at?: string
}

const TABLE = config.supabase.tagsTable
const localKey = (itemId: string) => `nm_tags_${itemId}`

/** Local fallback used only when Supabase is not configured (still works offline). */
function loadLocal(itemId: string): Tag[] {
  try {
    const raw = localStorage.getItem(localKey(itemId))
    return raw ? (JSON.parse(raw) as Tag[]) : []
  } catch {
    return []
  }
}

function saveLocal(itemId: string, tags: Tag[]): void {
  try {
    localStorage.setItem(localKey(itemId), JSON.stringify(tags))
  } catch {
    /* ignore */
  }
}

export async function fetchTags(itemId: string): Promise<Tag[]> {
  if (!supabase) return loadLocal(itemId)
  const { data, error } = await supabase
    .from(TABLE)
    .select('id,item_id,x,y,name,created_at')
    .eq('item_id', itemId)
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return data as Tag[]
}

export async function addTag(
  itemId: string,
  x: number,
  y: number,
  name: string,
): Promise<Tag | null> {
  const clean = name.trim().slice(0, 60)
  if (!clean) return null

  if (!supabase) {
    const tag: Tag = {
      id: crypto.randomUUID(),
      item_id: itemId,
      x,
      y,
      name: clean,
      created_at: new Date().toISOString(),
    }
    saveLocal(itemId, [...loadLocal(itemId), tag])
    return tag
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ item_id: itemId, x, y, name: clean })
    .select('id,item_id,x,y,name,created_at')
    .single()
  if (error || !data) return null
  return data as Tag
}

export async function removeTag(tag: Tag): Promise<void> {
  if (!supabase) {
    saveLocal(
      tag.item_id,
      loadLocal(tag.item_id).filter((t) => t.id !== tag.id),
    )
    return
  }
  await supabase.from(TABLE).delete().eq('id', tag.id)
}

/**
 * Subscribe to live tag changes for one moment. The callback fires on any
 * insert/delete so the caller can re-render. Returns an unsubscribe function.
 */
export function subscribeTags(itemId: string, onChange: () => void): () => void {
  const client = supabase
  if (!client) return () => {}
  const channel = client
    .channel(`tags:${itemId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE, filter: `item_id=eq.${itemId}` },
      () => onChange(),
    )
    .subscribe()
  return () => {
    void client.removeChannel(channel)
  }
}
