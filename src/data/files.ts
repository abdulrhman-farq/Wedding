import type { MediaItem, RawFile } from '../types'
import raw from './files.json'
import drivePhotos from './drivePhotos.json'

const JPEG = 'data:image/jpeg;base64,'

const rawFiles = raw as RawFile[]
const driveFiles = drivePhotos as { i: string; n: string }[]

/** Public Google Drive image URL at a given pixel width. */
// Google's image CDN serves public Drive files directly (no drive.google.com redirect) → much faster.
const driveImg = (id: string, w: number) => `https://lh3.googleusercontent.com/d/${id}=w${w}`

/**
 * The original 160 moments: 155 video clips (posters streamed from Drive) and
 * 5 photos (kept embedded as base64 — they're raw DNG, so more reliable inline).
 */
const embedded: MediaItem[] = rawFiles.map((r, index) => {
  const isVideo = r.v === 1
  const base = isVideo ? '' : JPEG + (r.g ?? '')
  return {
    id: r.i || `item-${index}`,
    driveId: r.i,
    name: r.n,
    isVideo,
    thumb: isVideo ? driveImg(r.i, 400) : base,
    poster: isVideo ? driveImg(r.i, 1080) : base,
    full: isVideo ? undefined : r.f ? JPEG + r.f : base || undefined,
    driveUrl: `https://drive.google.com/file/d/${r.i}/view`,
    remote: isVideo,
    index,
  }
})

/**
 * The 331 high-res photos from the shared Drive folder (studio + wedding),
 * streamed on demand from Drive's public image URLs.
 */
const drive: MediaItem[] = driveFiles.map((r, i) => ({
  id: r.i,
  driveId: r.i,
  name: r.n,
  isVideo: false,
  thumb: driveImg(r.i, 400),
  poster: driveImg(r.i, 1080),
  full: driveImg(r.i, 1600),
  driveUrl: `https://drive.google.com/file/d/${r.i}/view`,
  remote: true,
  index: embedded.length + i,
}))

export const MEDIA: MediaItem[] = [...embedded, ...drive]

export const TOTAL = MEDIA.length
