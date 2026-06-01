/** Raw record shape as embedded in the original wedding-gallery.html FILES array. */
export interface RawFile {
  /** Google Drive file ID — used only for the video playback fallback. */
  i: string
  /** Original file name, e.g. "IMG_9852.MOV". */
  n: string
  /** 1 = video, 0 = photo. */
  v: 0 | 1
  /** Base64 JPEG poster / thumbnail (photos only now; videos stream from Drive). */
  g?: string
  /** Photos only: higher-res base64 for the full / detail view. */
  f?: string
}

export interface MediaItem {
  id: string
  driveId: string
  name: string
  isVideo: boolean
  /** Small image for grid thumbnails (fast). */
  thumb: string
  /** Medium image for full-screen deck cards. */
  poster: string
  /** Ready-to-use data URI for the high-res photo (photos only). */
  full?: string
  /** Drive playback / view fallback URL (videos). */
  driveUrl: string
  /** True when poster/full are remote Drive URLs (vs embedded base64). */
  remote: boolean
  /** 0-based position in the deck. */
  index: number
}

export type SwipeDir = 'left' | 'right' | 'up'

export interface SwipeRecord {
  item: MediaItem
  dir: SwipeDir
}
