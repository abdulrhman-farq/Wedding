import { useState } from 'react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { toArabicNumerals } from '../lib/format'

interface FavoritesProps {
  items: MediaItem[]
  supers: string[]
  onBack: () => void
  onOpen: (item: MediaItem) => void
}

function shareText(): string {
  return `${config.couple.families.ar} · ${config.couple.groom.ar} & ${config.couple.bride.ar}\n${config.copy.invite.ar} · ${config.copy.invite.en}\n${location.href}`
}

export function Favorites({ items, supers, onBack, onOpen }: FavoritesProps) {
  const [copied, setCopied] = useState(false)

  const download = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const a = document.createElement('a')
    a.href = item.full ?? item.poster
    a.download = item.name.replace(/\.[^.]+$/, '') + '.jpg'
    a.click()
  }

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText())}`, '_blank', 'noopener')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between px-5 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
        <button
          type="button"
          aria-label="رجوع · Back"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-panel/80 text-gold-bright ring-1 ring-line"
        >
          {/* chevron pointing to the inline-end (start of reading in RTL) */}
          <svg viewBox="0 0 24 24" className="h-6 w-6 rotate-180 fill-current rtl:rotate-0">
            <path d="M9.4 18 8 16.6 12.6 12 8 7.4 9.4 6l6 6z" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="font-display text-2xl text-gold-bright">المفضّلة</h2>
          <p className="font-latin text-xs text-muted">{toArabicNumerals(items.length)} loved moments</p>
        </div>
        <div className="w-10" />
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="font-arabic text-lg text-muted">
            لا توجد لحظات مفضّلة بعد
            <br />
            <span className="font-latin text-sm">No favourites yet — swipe right to love a moment.</span>
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item)}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-line"
              >
                <img src={item.poster} alt={item.name} className="h-full w-full object-cover" />
                {supers.includes(item.id) && (
                  <span className="absolute start-1.5 top-1.5 text-gold-bright drop-shadow">⭐</span>
                )}
                {item.isVideo && (
                  <span className="absolute bottom-1.5 end-1.5 rounded bg-black/55 px-1 text-[0.6rem] text-gold-bright">▶</span>
                )}
                <span
                  onClick={(e) => download(item, e)}
                  className="absolute bottom-1.5 start-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-gold-bright opacity-0 ring-1 ring-line transition-opacity group-hover:opacity-100"
                  aria-label="حفظ · Save"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 16l-5-5 1.4-1.4L11 12.2V4h2v8.2l2.6-2.6L17 11zM5 18h14v2H5z" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <footer className="flex items-center justify-center gap-3 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
        <button
          type="button"
          onClick={whatsapp}
          className="flex-1 rounded-full bg-emerald px-5 py-3 font-ui text-sm font-medium text-ink ring-1 ring-emerald-bright/50 transition-transform active:scale-95"
        >
          واتساب · WhatsApp
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="flex-1 rounded-full bg-panel/80 px-5 py-3 font-ui text-sm text-ink ring-1 ring-line transition-transform active:scale-95"
        >
          {copied ? 'تم النسخ ✓' : 'نسخ الرابط · Copy link'}
        </button>
      </footer>
    </div>
  )
}
