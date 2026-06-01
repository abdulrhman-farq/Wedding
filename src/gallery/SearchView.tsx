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

const CATEGORIES: { id: string; ar: string; en: string; items: () => MediaItem[] }[] = [
  { id: 'photos', ar: 'صور', en: 'Photos', items: () => MEDIA.filter((m) => !m.isVideo) },
  { id: 'videos', ar: 'فيديو', en: 'Videos', items: () => MEDIA.filter((m) => m.isVideo) },
  { id: 'studio', ar: 'الاستديو', en: 'Studio', items: () => GROUPS.find((g) => g.id === 'studio')!.items },
  { id: 'wedding', ar: 'يوم الزفاف', en: 'Wedding day', items: () => GROUPS.find((g) => g.id === 'wedding')!.items },
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

  const shownPeople = query.trim()
    ? people.filter((p) => p.name.includes(query.trim()))
    : people

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
    <div className="flex h-full flex-col bg-[var(--m-bg)]">
      <header className="px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
        <div className="flex h-12 items-center gap-3 rounded-full bg-[var(--m-surface-2)] px-4 text-[var(--m-on)]">
          <Icon name="search" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن شخص · Search people"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--m-on-2)]"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="مسح" className="text-[var(--m-on-2)]">
              <Icon name="close" size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="mtl-scroll flex-1 overflow-y-auto px-4 pb-28">
        {/* categories */}
        <h2 className="mb-3 text-[15px] font-medium text-[var(--m-on)]">التصنيفات · Categories</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter({ label: `${c.ar} · ${c.en}`, items: c.items() })}
              className="rounded-full border border-[var(--m-outline)] px-4 py-2 text-[14px] text-[var(--m-on)] active:bg-[var(--m-surface-2)]"
            >
              {c.ar} · {c.en}
            </button>
          ))}
        </div>

        {/* people */}
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-medium text-[var(--m-on)]">
          <Icon name="people" size={18} /> الأشخاص · People
        </h2>
        {people.length === 0 ? (
          <p className="text-[14px] leading-relaxed text-[var(--m-on-2)]">
            لا يوجد أشخاص موسومون بعد.
            <br />
            افتح أي صورة واضغط <span className="font-medium">وسم</span> لتسمية الأشخاص — وستظهر هنا للجميع.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {shownPeople.map((p) => (
              <button
                key={p.name}
                onClick={() => setFilter({ label: p.name, items: p.items })}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="relative h-16 w-16 overflow-hidden rounded-full bg-[var(--m-surface-2)] ring-1 ring-[var(--m-outline)]">
                  <img
                    src={p.items[0].poster}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="max-w-[72px] truncate text-[12px] text-[var(--m-on)]">{p.name}</span>
                <span className="text-[11px] text-[var(--m-on-2)]">{toArabicNumerals(p.items.length)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
