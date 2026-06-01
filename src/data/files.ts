import type { MediaItem, RawFile } from '../types'
import raw from './files.json'

const JPEG = 'data:image/jpeg;base64,'

const rawFiles = raw as RawFile[]

/**
 * The wedding deck: 160 moments (5 photos + 155 video clips), all embedded as
 * base64 so the app loads instantly and works fully offline.
 */
export const MEDIA: MediaItem[] = rawFiles.map((r, index) => ({
  id: r.i || `item-${index}`,
  driveId: r.i,
  name: r.n,
  isVideo: r.v === 1,
  poster: JPEG + r.g,
  full: r.f ? JPEG + r.f : undefined,
  driveUrl: `https://drive.google.com/file/d/${r.i}/view`,
  index,
}))

export const TOTAL = MEDIA.length
