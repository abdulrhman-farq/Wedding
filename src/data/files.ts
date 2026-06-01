import type { MediaItem, RawFile } from '../types'
import raw from './files.json'
import drivePhotos from './drivePhotos.json'

const JPEG = 'data:image/jpeg;base64,'

const rawFiles = raw as RawFile[]
const driveFiles = drivePhotos as { i: string; n: string }[]

/** Public Google Drive image URL at a given pixel width (folder shared "anyone with link"). */
const driveImg = (id: string, w: number) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`

/**
 * The original 160 moments (5 photos + 155 video clips), embedded as base64 so
 * they load instantly and work offline.
 */
const embedded: MediaItem[] = rawFiles.map((r, index) => ({
  id: r.i || `item-${index}`,
  driveId: r.i,
  name: r.n,
  isVideo: r.v === 1,
  poster: JPEG + r.g,
  full: r.f ? JPEG + r.f : undefined,
  driveUrl: `https://drive.google.com/file/d/${r.i}/view`,
  remote: false,
  index,
}))

/**
 * The 331 high-res photos from the shared Drive folder (studio session + wedding),
 * streamed on demand from Drive's public image URLs.
 */
const drive: MediaItem[] = driveFiles.map((r, i) => ({
  id: r.i,
  driveId: r.i,
  name: r.n,
  isVideo: false,
  poster: driveImg(r.i, 1200),
  full: driveImg(r.i, 2400),
  driveUrl: `https://drive.google.com/file/d/${r.i}/view`,
  remote: true,
  index: embedded.length + i,
}))

export const MEDIA: MediaItem[] = [...embedded, ...drive]

export const TOTAL = MEDIA.length
