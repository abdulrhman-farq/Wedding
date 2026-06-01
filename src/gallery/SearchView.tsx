import { useEffect, useMemo, useState } from 'react'
import type { MediaItem } from '../types'
import { MEDIA } from '../data/files'
import { GROUPS } from './galleryData'
import { fetchAllTags, type Tag } from '../lib/tags'
import { PhotosView } from './PhotosView'
import { Icon } from './Icon'
import { toArabicNumerals } from '../lib/format'

interface SearchViewProps {
  onOpen: (list: MediaItem[], index: number) => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
}

interface Person {
  name: string
  items: MediaItem[]
}
interface Filter {
  label: string
  items: MediaItem[]
}

const byId = new Map(MEDIA.map((m) => [m.id, m]))

const CATEGORIES: { ar: string; items: () => MediaItem[] }[] = [
  { ar: 'صور', items: () => MEDIA.filter((m) => !m.isVideo) },
  { ar: 'فيديو', items: () => MEDIA.filter((m) => m.isVideo) },
  { ar: 'جلسة الاستديو', items: () => GROUPS.find((g) => g.id === 'studio')!.items },
  { ar: 'يوم الزفاف', items: () => GROUPS.find((g) => g.id === 'wedding')!.items },
]

export function SearchView({ onOpen, onToggleTheme, theme }: SearchViewProps) {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [filter, setFilter] = useState<Filter | null>(null)

  useEffect(() => {
    let alive = true
    void fetchAllTags().then((t) => alive && setTags(t))
    return () => {
      alive = false
    }
  }, [])

  const people = useMemo<Person[]>(() => {
    const map = new Map<string, Set<string>>()
    for (const t of tags) {
      const name = t.name.trim()
      if (!name) continue
      if (!map.has(name)) map.set(name, new Set())
      map.get(name)!.add(t.item_id)
    }
    return Array.from(map.entries())
      .map(([name, ids]) => ({
        name,
        items: Array.from(ids).map((id) => byId.get(id)).filter((m): m is MediaItem => !!m),
      }))
      .filter((p) => p.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length)
  }, [tags])

  const shownPeople = query.trim() ? people.filter((p) => p.name.includes(query.trim())) : people

  if (filter) {
    return (
      <PhotosView
        groups={[{ id: 'result', dateISO: '', titleAr: filter.label, titleEn: '', items: filter.items }]}
        title={filter.label}
        onOpen={onOpen}
        onToggleTheme={onToggleTheme}
        theme={theme}
        onBack={() => setFilter(null)}
      />
    )
  }

  return (
    <div className="app">
      <header className="hd">
        <div className="searchbar">
          <span className="mi">
            <Icon name="search" size={22} />
          </span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن أشخاص أو لحظات"
          />
          <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
          </button>
        </div>
      </header>

      <div className="panel mtl-scroll">
        <div className="sec-title">
          الأشخاص <span style={{ color: 'var(--on-surface-3)', fontWeight: 400, fontSize: 13 }}>· من حضر</span>
        </div>
        {people.length === 0 ? (
          <p style={{ color: 'var(--on-surface-2)', fontSize: 14, lineHeight: 1.7, margin: '0 4px' }}>
            لا يوجد أشخاص موسومون بعد. افتح أي صورة واضغط «وسم» لتسمية الأشخاص — وستظهر هنا للجميع.
          </p>
        ) : (
          <div className="chips">
            {shownPeople.map((p) => (
              <button className="facechip" key={p.name} onClick={() => setFilter({ label: p.name, items: p.items })}>
                <span className="face">
                  <img src={p.items[0].poster} alt={p.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="sec-title">اللحظات</div>
        <div className="albgrid">
          {CATEGORIES.map((c) => {
            const items = c.items()
            return (
              <button className="album" key={c.ar} style={{ textAlign: 'start' }} onClick={() => setFilter({ label: c.ar, items })}>
                <div className="cover">
                  <img src={items[0].poster} alt={c.ar} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(0,0,0,.55),transparent 60%)' }} />
                  <b style={{ position: 'absolute', insetInlineStart: 12, bottom: 10, color: '#fff', fontSize: 16, fontWeight: 500 }}>
                    {c.ar}
                  </b>
                </div>
                <div className="meta">
                  <span>{toArabicNumerals(items.length)} عنصر</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
