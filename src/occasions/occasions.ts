/** A life event the app organizes media + info for. */
export type OccasionKind = 'memories' | 'travel'

export interface Occasion {
  id: string
  name: string
  kind: OccasionKind
  subtitle?: string
  /** ISO date the occasion starts / happened. */
  dateISO?: string
  /** Accent gradient for its drawer chip / cover. */
  accent: string
  /** Emoji used as a lightweight cover glyph. */
  glyph: string
}

/** Seed occasions. The Wedding is the real, fully-featured gallery. */
export const SEED_OCCASIONS: Occasion[] = [
  {
    id: 'wedding',
    name: 'الزفاف',
    kind: 'memories',
    subtitle: 'النقيدان و المحيسن',
    dateISO: '2026-05-28',
    accent: 'linear-gradient(135deg,#cba45a,#8c6f3b)',
    glyph: '💍',
  },
  {
    id: 'honeymoon',
    name: 'شهر العسل',
    kind: 'travel',
    subtitle: 'بالي · Bali',
    dateISO: '2026-06-02',
    accent: 'linear-gradient(135deg,#1A73E8,#3f8d6c)',
    glyph: '🌴',
  },
]
