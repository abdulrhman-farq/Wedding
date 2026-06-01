import { useMemo, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { toArabicNumerals } from '../lib/format'
import { arabicDate, type PhotoGroup } from './galleryData'
import { Icon } from './Icon'

export type Density = 'compact' | 'comfortable' | 'large'

const DENSITY_ICON: Record<Density, Parameters<typeof Icon>[0]['name']> = {
  compact: 'gridCompact',
  comfortable: 'gridComfortable',
  large: 'gridLarge',
}
const DENSITIES: Density[] = ['compact', 'comfortable', 'large']

interface PhotosViewProps {
  groups: PhotoGroup[]
  title?: string
  onOpen: (list: MediaItem[], index: number) => void
  onSearchFocus?: () => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
  onBack?: () => void
  onOpenOccasions?: () => void
}

export function PhotosView({
  groups,
  title,
  onOpen,
  onSearchFocus,
  onToggleTheme,
  theme,
  onBack,
  onOpenOccasions,
}: PhotosViewProps) {
  const [density, setDensity] = useState<Density>('comfortable')
  const [selecting, setSelecting] = useState(false)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const toastT = useRef<number | null>(null)
  const pressTimer = useRef<number | null>(null)

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const indexOf = useMemo(() => new Map(flat.map((m, i) => [m.id, i])), [flat])
  const total = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups])

  const flash = (msg: string) => {
    setToast(msg)
    if (toastT.current) window.clearTimeout(toastT.current)
    toastT.current = window.setTimeout(() => setToast(null), 2400)
  }

  const clearSel = () => {
    setSelecting(false)
    setSel(new Set())
  }
  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      if (n.size === 0) setSelecting(false)
      return n
    })
  const selectAll = (g: PhotoGroup, on: boolean) =>
    setSel((s) => {
      const n = new Set(s)
      g.items.forEach((it) => (on ? n.add(it.id) : n.delete(it.id)))
      if (n.size === 0) setSelecting(false)
      return n
    })

  const onTileDown = (id: string) => {
    pressTimer.current = window.setTimeout(() => {
      setSelecting(true)
      toggle(id)
      if (navigator.vibrate) navigator.vibrate(8)
    }, 380)
  }
  const cancelPress = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current)
    pressTimer.current = null
  }

  const handleClick = (item: MediaItem) => {
    if (selecting) toggle(item.id)
    else onOpen(flat, indexOf.get(item.id) ?? 0)
  }

  const selectedItems = () => flat.filter((m) => sel.has(m.id))
  const shareSelected = async () => {
    const items = selectedItems()
    const n = items.length
    const text = `${toArabicNumerals(n)} ذكرى — النقيدان و المحيسن\n${location.href}`
    if (navigator.share) {
      try {
        await navigator.share({ text, url: location.href })
      } catch {
        /* cancelled */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    }
    flash(`تمت مشاركة ${toArabicNumerals(n)} ${n === 1 ? 'عنصر' : 'عناصر'}`)
    clearSel()
  }
  const downloadSelected = () => {
    const items = selectedItems()
    items.forEach((item, i) =>
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = item.full ?? item.poster
        a.download = item.name.replace(/\.[^.]+$/, '') + '.jpg'
        a.click()
      }, i * 250),
    )
    flash(`تنزيل ${toArabicNumerals(items.length)} ${items.length === 1 ? 'عنصر' : 'عناصر'}`)
    clearSel()
  }

  return (
    <div className={`app ${selecting ? 'selecting' : ''}`}>
      {/* selection bar */}
      <div className={`selbar ${selecting ? 'on' : ''}`}>
        <button className="selbar-btn" onClick={clearSel} aria-label="إلغاء">
          <Icon name="close" size={24} />
        </button>
        <span className="count">{toArabicNumerals(sel.size)}</span>
        <button className="selbar-btn" onClick={() => void shareSelected()} aria-label="مشاركة">
          <Icon name="share" size={22} />
        </button>
        <button className="selbar-btn" onClick={downloadSelected} aria-label="تنزيل">
          <Icon name="download" size={22} />
        </button>
      </div>

      {/* header */}
      {!selecting && (
        <header className="hd">
          <div className="searchbar">
            <span className="mi">
              <Icon name="search" size={22} />
            </span>
            <input
              readOnly={!!onSearchFocus}
              onFocus={onSearchFocus}
              placeholder="ابحث في الصور"
            />
            <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
            </button>
            <button className="avatar" onClick={onOpenOccasions} aria-label="المناسبات">
              {config.couple.groom.ar[0]}
            </button>
          </div>
          <div className="toolbar">
            <span className="toolbar-title">
              {title ?? 'ذكريات الزفاف'} · {toArabicNumerals(total)} لحظة
            </span>
            <div className="seg" role="tablist" aria-label="كثافة العرض">
              {DENSITIES.map((d) => (
                <button
                  key={d}
                  className={density === d ? 'on' : ''}
                  aria-selected={density === d}
                  onClick={() => setDensity(d)}
                >
                  <Icon name={DENSITY_ICON[d]} size={18} />
                </button>
              ))}
            </div>
          </div>
          {onBack && (
            <button
              className="hd-icon"
              onClick={onBack}
              aria-label="رجوع"
              style={{ position: 'absolute', insetInlineStart: 8, top: 'calc(env(safe-area-inset-top) + 12px)' }}
            >
              <Icon name="back" size={22} />
            </button>
          )}
        </header>
      )}

      {/* feed */}
      <div className="feed mtl-scroll">
        {groups.map((g) => {
          const allSel = g.items.length > 0 && g.items.every((it) => sel.has(it.id))
          return (
            <section className="group" key={g.id}>
              <div className="date-head">
                <h2>{g.titleAr}</h2>
                <span className="cnt">{toArabicNumerals(g.items.length)}</span>
                {g.dateISO && <span className="cnt">· {arabicDate(g.dateISO)}</span>}
                {selecting && (
                  <button className="selall" onClick={() => selectAll(g, !allSel)}>
                    {allSel ? 'إلغاء' : 'تحديد الكل'}
                  </button>
                )}
              </div>
              <div className={`grid d-${density}`}>
                {g.items.map((item) => {
                  const isSel = sel.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`tile ${isSel ? 'sel' : ''}`}
                      role="button"
                      aria-pressed={isSel}
                      onClick={() => handleClick(item)}
                      onPointerDown={() => onTileDown(item.id)}
                      onPointerUp={cancelPress}
                      onPointerMove={cancelPress}
                      onPointerLeave={cancelPress}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ contentVisibility: 'auto', containIntrinsicSize: '120px' }}
                    >
                      <div className="media">
                        <img
                          src={item.poster}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                        {isSel && <div className="scrim-sel" />}
                      </div>
                      <span className="check">
                        <Icon name="check" size={14} />
                      </span>
                      {item.isVideo && (
                        <span className="vchip">
                          <Icon name="play" size={14} />
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {toast && <div className="gtoast">{toast}</div>}
    </div>
  )
}
