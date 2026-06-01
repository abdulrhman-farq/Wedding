import { supabase } from './supabase'

export interface DocOverride {
  fields?: { label: string; value: string }[]
  lines?: string[]
  checklist?: string[]
}

export interface OccPhoto {
  id: string
  url: string
  name?: string | null
}

const BUCKET = 'occasion-media'

/** Load any saved edits for a trip's document cards. */
export async function loadDocOverrides(occasionId: string): Promise<Record<string, DocOverride>> {
  if (!supabase) return {}
  const { data, error } = await supabase
    .from('trip_docs')
    .select('doc_id,payload')
    .eq('occasion_id', occasionId)
  if (error || !data) return {}
  const map: Record<string, DocOverride> = {}
  for (const r of data) map[r.doc_id as string] = (r.payload ?? {}) as DocOverride
  return map
}

/** Save edits for one document card. */
export async function saveDoc(occasionId: string, docId: string, payload: DocOverride): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('trip_docs')
    .upsert(
      { occasion_id: occasionId, doc_id: docId, payload, updated_at: new Date().toISOString() },
      { onConflict: 'occasion_id,doc_id' },
    )
  return !error
}

export async function listPhotos(occasionId: string): Promise<OccPhoto[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('occasion_photos')
    .select('id,url,name')
    .eq('occasion_id', occasionId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as OccPhoto[]
}

/** Upload an image file to storage and record it for the occasion. */
export async function addPhoto(occasionId: string, file: File): Promise<OccPhoto | null> {
  if (!supabase) return null
  const safe = file.name.replace(/[^\w.]+/g, '_').slice(-60)
  const path = `${occasionId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`
  const up = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || 'image/jpeg',
  })
  if (up.error) return null
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const { data, error } = await supabase
    .from('occasion_photos')
    .insert({ occasion_id: occasionId, url: pub.publicUrl, name: file.name })
    .select('id,url,name')
    .single()
  if (error || !data) return null
  return data as OccPhoto
}

export async function removePhoto(photo: OccPhoto): Promise<void> {
  if (!supabase) return
  await supabase.from('occasion_photos').delete().eq('id', photo.id)
}
