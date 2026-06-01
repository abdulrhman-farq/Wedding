import { config } from '../config'

const LOVES_KEY = 'nm_loves_v1'
const SUPERS_KEY = 'nm_supers_v1'

function load(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function save(key: string, ids: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    /* storage unavailable (private mode) — stay in-memory */
  }
}

export const favoritesStore = {
  loadLoves: () => load(LOVES_KEY),
  loadSupers: () => load(SUPERS_KEY),
  saveLoves: (ids: string[]) => save(LOVES_KEY, ids),
  saveSupers: (ids: string[]) => save(SUPERS_KEY, ids),
}

/**
 * Optional global "most-loved" leaderboard. Uses Supabase REST directly (no SDK
 * dependency) and is fully gated behind config.features.supabaseLeaderboard.
 */
export async function recordLoveGlobally(itemId: string, name: string): Promise<void> {
  const { supabaseLeaderboard } = config.features
  const { url, anonKey, lovesTable } = config.supabase
  if (!supabaseLeaderboard || !url || !anonKey) return
  try {
    await fetch(`${url}/rest/v1/${lovesTable}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ item_id: itemId, name, loved_at: new Date().toISOString() }),
    })
  } catch {
    /* leaderboard is best-effort; never block the UX */
  }
}

/** Build a plain-text export of the loved moments for the "export" action. */
export function exportFavorites(ids: string[], names: Record<string, string>): string {
  const lines = ['النقيدان و المحيسن — اللحظات المفضّلة / Loved moments', '']
  ids.forEach((id, i) => lines.push(`${i + 1}. ${names[id] ?? id}`))
  return lines.join('\n')
}
