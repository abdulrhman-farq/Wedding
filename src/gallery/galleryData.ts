import { MEDIA } from '../data/files'
import type { MediaItem } from '../types'

export interface PhotoGroup {
  id: string
  dateISO: string
  titleAr: string
  titleEn: string
  items: MediaItem[]
}

/**
 * The deck is ordered: [0..159] embedded wedding-night clips + photos,
 * [160..183] studio session, [184..490] wedding-day photos. Google Photos shows
 * newest first, so we surface studio → wedding day → wedding night.
 */
export const GROUPS: PhotoGroup[] = [
  {
    id: 'studio',
    dateISO: '2026-05-30',
    titleAr: 'جلسة الاستديو',
    titleEn: 'Studio session',
    items: MEDIA.slice(160, 184),
  },
  {
    id: 'wedding',
    dateISO: '2026-05-29',
    titleAr: 'يوم الزفاف',
    titleEn: 'Wedding day',
    items: MEDIA.slice(184, 491),
  },
  {
    id: 'night',
    dateISO: '2026-05-28',
    titleAr: 'ليلة الزفاف',
    titleEn: 'Wedding night',
    items: MEDIA.slice(0, 160),
  },
]

export interface Album {
  id: string
  titleAr: string
  titleEn: string
  cover: MediaItem
  items: MediaItem[]
}

const allVideos = MEDIA.filter((m) => m.isVideo)

export const ALBUMS: Album[] = [
  ...GROUPS.map((g) => ({
    id: g.id,
    titleAr: g.titleAr,
    titleEn: g.titleEn,
    cover: g.items[0],
    items: g.items,
  })),
  {
    id: 'videos',
    titleAr: 'المقاطع',
    titleEn: 'Videos',
    cover: allVideos[0],
    items: allVideos,
  },
]

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

export function arabicDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).replace(/\d/g, (n) => AR_DIGITS[Number(n)])
  const year = String(d.getFullYear()).replace(/\d/g, (n) => AR_DIGITS[Number(n)])
  return `${day} ${AR_MONTHS[d.getMonth()]} ${year}`
}
