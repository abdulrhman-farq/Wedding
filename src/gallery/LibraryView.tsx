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
  onPresent: () => void
}

export function LibraryView({ onOpen, onToggleTheme, theme, onPresent }: LibraryViewProps) {
  const [album, setAlbum] = useState<Album | null>(null)

  if (album) {
    return (
      <PhotosView
        groups={[{ id: album.id, dateISO: '', titleAr: album.titleAr, titleEn: album.titleEn, items: album.items }]}
        title={album.titleAr}
        onOpen={onOpen}
        onToggleTheme={onToggleTheme}
        theme={theme}
        onBack={() => setAlbum(null)}
      />
    )
  }

  return (
    <div className="app">
      <header className="hd">
        <div className="toolbar" style={{ padding: '4px 6px' }}>
          <span style={{ fontSize: 22, fontWeight: 400, color: 'var(--on-surface)' }}>المكتبة</span>
          <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
          </button>
        </div>
      </header>

      <div className="panel mtl-scroll">
        <button className="lib-row" onClick={onPresent}>
          <span className="lib-ic" style={{ background: 'var(--blue-tint)', color: 'var(--blue)' }}>
            <Icon name="slideshow" size={22} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="t">العرض التقديمي</div>
            <div className="s">كل الصور مع الموسيقى</div>
          </div>
          <Icon name="play" size={20} />
        </button>

        <div className="sec-title">الألبومات</div>
        <div className="albgrid">
          {ALBUMS.map((a) => (
            <button className="album" key={a.id} style={{ textAlign: 'start' }} onClick={() => setAlbum(a)}>
              <div className="cover">
                <img src={a.cover.poster} alt={a.titleAr} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                {a.id === 'videos' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.25)', color: '#fff' }}>
                    <Icon name="play" size={34} />
                  </div>
                )}
              </div>
              <div className="meta">
                <b>{a.titleAr}</b>
                <span>{toArabicNumerals(a.items.length)} عنصر</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
