import { useMemo, useState } from 'react'
import type { MediaItem } from '../types'
import { GROUPS } from '../gallery/galleryData'
import { BottomNav, type Tab } from '../gallery/BottomNav'
import { PhotosView } from '../gallery/PhotosView'
import { SearchView } from '../gallery/SearchView'
import { LibraryView } from '../gallery/LibraryView'
import { PhotoViewer } from '../gallery/PhotoViewer'
import { Presentation } from '../gallery/Presentation'
import { MusicToggle } from '../gallery/MusicToggle'
import { SwipeExperience } from '../gallery/SwipeExperience'

interface WeddingAppProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenOccasions: () => void
}

/** The Wedding occasion: full memories gallery + swipe deck + slideshow. */
export function WeddingApp({ theme, onToggleTheme, onOpenOccasions }: WeddingAppProps) {
  const [tab, setTab] = useState<Tab>('photos')
  const [viewer, setViewer] = useState<{ list: MediaItem[]; index: number } | null>(null)
  const [presenting, setPresenting] = useState(false)

  const slideshow = useMemo(() => GROUPS.flatMap((g) => g.items).filter((m) => !m.isVideo), [])
  const openViewer = (list: MediaItem[], index: number) => setViewer({ list, index })

  if (tab === 'swipe') return <SwipeExperience onExit={() => setTab('photos')} />

  return (
    <>
      {tab === 'photos' && (
        <PhotosView
          groups={GROUPS}
          onOpen={openViewer}
          onSearchFocus={() => setTab('search')}
          onToggleTheme={onToggleTheme}
          theme={theme}
          onOpenOccasions={onOpenOccasions}
        />
      )}
      {tab === 'search' && <SearchView onOpen={openViewer} onToggleTheme={onToggleTheme} theme={theme} />}
      {tab === 'library' && (
        <LibraryView onOpen={openViewer} onToggleTheme={onToggleTheme} theme={theme} onPresent={() => setPresenting(true)} />
      )}

      <BottomNav active={tab} onChange={setTab} />
      <MusicToggle className="absolute bottom-24 end-4 z-40" />

      {viewer && <PhotoViewer list={viewer.list} index={viewer.index} onClose={() => setViewer(null)} />}
      {presenting && <Presentation photos={slideshow} onClose={() => setPresenting(false)} />}
    </>
  )
}
