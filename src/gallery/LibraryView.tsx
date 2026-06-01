import { useState } from 'react'
import type { MediaItem } from '../types'
import { ALBUMS, type Album } from './galleryData'
import { PhotosView } from './PhotosView'
import { Icon } from './Icon'
import { toArabicNumerals } from '../lib/format'

interface LibraryViewProps {
  onOpen: (list: MediaItem[], index: number) => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
}

export function LibraryView({ onOpen, onToggleTheme, theme }: LibraryViewProps) {
  const [album, setAlbum] = useState<Album | null>(null)

  if (album) {
    return (
      <PhotosView
        groups={[{ id: album.id, dateISO: '', titleAr: album.titleAr, titleEn: album.titleEn, items: album.items }]}
        title={`${album.titleAr} · ${album.titleEn}`}
        onOpen={onOpen}
        onToggleTheme={onToggleTheme}
        theme={theme}
        onBack={() => setAlbum(null)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col bg-[var(--m-bg)]">
      <header className="flex items-center justify-between px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
        <h1 className="text-[22px] font-normal text-[var(--m-on)]">المكتبة · Library</h1>
        <button onClick={onToggleTheme} aria-label="الوضع" className="grid h-11 w-11 place-items-center rounded-full text-[var(--m-on)] active:bg-[var(--m-surface-2)]">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
      </header>

      <div className="mtl-scroll flex-1 overflow-y-auto px-4 pb-28">
        <h2 className="mb-3 text-[15px] font-medium text-[var(--m-on)]">الألبومات · Albums</h2>
        <div className="grid grid-cols-2 gap-4">
          {ALBUMS.map((a) => (
            <button key={a.id} onClick={() => setAlbum(a)} className="text-start">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--m-surface-2)]">
                <img
                  src={a.cover.poster}
                  alt={a.titleEn}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {a.id === 'videos' && (
                  <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                    <Icon name="play" size={34} />
                  </span>
                )}
              </div>
              <p className="mt-2 truncate text-[15px] font-medium text-[var(--m-on)]">{a.titleAr}</p>
              <p className="text-[13px] text-[var(--m-on-2)]">{toArabicNumerals(a.items.length)} عنصر</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
