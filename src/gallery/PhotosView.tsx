import { useMemo, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { arabicDate, type PhotoGroup } from './galleryData'
import { Icon } from './Icon'

export type Density = 'compact' | 'comfortable' | 'large'

const COLS: Record<Density, number> = { compact: 5, comfortable: 3, large: 1 }
const DENSITY_ORDER: Density[] = ['comfortable', 'compact', 'large']

interface PhotosViewProps {
  groups: PhotoGroup[]
  title?: string
  onOpen: (list: MediaItem[], index: number) => void
  onSearchFocus?: () => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
  onBack?: () => void
}

export function PhotosView({
  groups,
  title,
  onOpen,
  onSearchFocus,
  onToggleTheme,
  theme,
  onBack,
}: PhotosViewProps) {
  const [density, setDensity] = useState<Density>('comfortable')
  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const pressTimer = useRef<number | null>(null)

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const indexOf = useMemo(() => new Map(flat.map((m, i) => [m.id, i])), [flat])

  const cycleDensity = () =>
    setDensity((d) => DENSITY_ORDER[(DENSITY_ORDER.indexOf(d) + 1) % DENSITY_ORDER.length])

  const clearSelection = () => {
    setSelecting(false)
    setSelected(new Set())
  }

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (next.size === 0) setSelecting(false)
      return next
    })
  }

  const onTileDown = (id: string) => {
    pressTimer.current = window.setTimeout(() => {
      setSelecting(true)
      toggle(id)
    }, 420)
  }
  const cancelPress = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current)
    pressTimer.current = null
  }

  const handleTileClick = (item: MediaItem) => {
    if (selecting) {
      toggle(item.id)
    } else {
      onOpen(flat, indexOf.get(item.id) ?? 0)
    }
  }

  const selectedItems = () => flat.filter((m) => selected.has(m.id))

  const shareSelected = async () => {
    const items = selectedItems()
    const text = `${items.length} ذكرى · moments — النقيدان و المحيسن\n${location.href}`
    if (navigator.share) {
      try {
        await navigator.share({ text, url: location.href })
        return
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const downloadSelected = () => {
    selectedItems().forEach((item, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = item.full ?? item.poster
        a.download = item.name.replace(/\.[^.]+$/, '') + '.jpg'
        a.click()
      }, i * 250)
    })
  }

  return (
    <div className="flex h-full flex-col bg-[var(--m-bg)]">
      {/* ===== top app bar / action bar ===== */}
      <header className="sticky top-0 z-20 bg-[var(--m-bg)] px-3 pb-2 pt-[calc(env(safe-area-inset-top)+10px)]">
        {selecting ? (
          <div className="mtl-pop flex items-center gap-1 rounded-full">
            <button onClick={clearSelection} aria-label="إلغاء" className="grid h-11 w-11 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
              <Icon name="close" />
            </button>
            <span className="flex-1 text-lg font-medium text-[var(--m-on)]">
              {selected.size} محدد
            </span>
            <button onClick={shareSelected} aria-label="مشاركة" className="grid h-11 w-11 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
              <Icon name="share" />
            </button>
            <button onClick={downloadSelected} aria-label="تنزيل" className="grid h-11 w-11 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
              <Icon name="download" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} aria-label="رجوع" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
                <Icon name="back" />
              </button>
            )}
            {title ? (
              <h1 className="flex-1 truncate text-[22px] font-normal text-[var(--m-on)]">{title}</h1>
            ) : (
              <button
                onClick={onSearchFocus}
                className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[var(--m-surface-2)] px-4 text-start text-[var(--m-on-2)]"
              >
                <Icon name="search" />
                <span className="text-[15px]">ابحث في ذكرياتنا · Search</span>
              </button>
            )}
            <button onClick={cycleDensity} aria-label="كثافة العرض" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
              <Icon name="grid" />
            </button>
            <button onClick={onToggleTheme} aria-label="الوضع" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        )}
      </header>

      {/* ===== scrollable grid ===== */}
      <div className="mtl-scroll flex-1 overflow-y-auto px-1 pb-28">
        {groups.map((g) => (
          <section key={g.id}>
            <div className="sticky top-0 z-10 bg-[var(--m-bg)]/95 px-3 py-3 backdrop-blur">
              <h2 className="text-[15px] font-medium text-[var(--m-on)]">
                {g.titleAr} · {g.titleEn}
              </h2>
              <p className="text-[12px] text-[var(--m-on-2)]">{arabicDate(g.dateISO)}</p>
            </div>
            <div
              className="grid gap-[3px] px-1"
              style={{ gridTemplateColumns: `repeat(${COLS[density]}, minmax(0,1fr))` }}
            >
              {g.items.map((item) => {
                const isSel = selected.has(item.id)
                return (
                  <button
                    key={item.id}
                    onPointerDown={() => onTileDown(item.id)}
                    onPointerUp={cancelPress}
                    onPointerLeave={cancelPress}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => handleTileClick(item)}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--m-surface-2)] transition-transform active:scale-[0.97]"
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}
                  >
                    <img
                      src={item.poster}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover transition-transform ${isSel ? 'scale-90 rounded-lg' : ''}`}
                    />
                    {item.isVideo && !isSel && (
                      <span className="pointer-events-none absolute bottom-1.5 end-1.5 grid h-5 w-5 place-items-center rounded-full bg-black/45 text-white">
                        <Icon name="play" size={14} />
                      </span>
                    )}
                    {(selecting || isSel) && (
                      <span
                        className={`absolute start-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 ${
                          isSel
                            ? 'border-[var(--m-primary)] bg-[var(--m-primary)] text-[var(--m-on-primary)]'
                            : 'border-white/90 bg-black/20'
                        }`}
                      >
                        {isSel && <Icon name="check" size={15} />}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
