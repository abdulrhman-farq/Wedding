import type { MediaItem } from '../types'
import { toArabicNumerals } from '../lib/format'

interface CardProps {
  item: MediaItem
  total: number
}

/** Presentational wedding card: full-bleed poster, gold hairline, scrim, caption. */
export function Card({ item, total }: CardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-panel shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-line">
      <img
        src={item.poster}
        alt={item.name}
        draggable={false}
        decoding="async"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full select-none bg-bg2 object-cover"
      />

      {/* gold hairline border */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-gold/40" />

      {/* top badges */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-black/45 px-3 py-1 text-[0.72rem] font-medium tracking-wide text-gold-bright backdrop-blur-sm ring-1 ring-line">
          {item.isVideo ? 'فيديو · VIDEO' : 'صورة · PHOTO'}
        </span>
        <span className="rounded-full bg-black/45 px-3 py-1 text-[0.72rem] font-medium text-muted backdrop-blur-sm ring-1 ring-line">
          {toArabicNumerals(item.index + 1)} / {toArabicNumerals(total)}
        </span>
      </div>

      {/* center play glyph for videos */}
      {item.isVideo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm ring-1 ring-gold/60">
            <svg viewBox="0 0 24 24" className="ms-1 h-7 w-7 fill-gold-bright">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* bottom scrim + caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-12">
        <p className="font-display text-2xl leading-tight text-ink">
          لحظة {toArabicNumerals(item.index + 1)}
        </p>
        <p className="font-latin text-sm text-muted">Moment {item.index + 1} of {total}</p>
      </div>
    </div>
  )
}
