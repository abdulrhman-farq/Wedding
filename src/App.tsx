import { useMemo, useState } from 'react'
import './gallery/gallery.css'
import type { MediaItem } from './types'
import { Cover } from './components/Cover'
import { GROUPS } from './gallery/galleryData'
import { useTheme } from './gallery/useTheme'
import { music } from './lib/audio'
import { BottomNav, type Tab } from './gallery/BottomNav'
import { PhotosView } from './gallery/PhotosView'
import { SearchView } from './gallery/SearchView'
import { LibraryView } from './gallery/LibraryView'
import { PhotoViewer } from './gallery/PhotoViewer'
import { Presentation } from './gallery/Presentation'
import { MusicToggle } from './gallery/MusicToggle'
import { SwipeExperience } from './gallery/SwipeExperience'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [tab, setTab] = useState<Tab>('photos')
  const { theme, toggle } = useTheme()
  const [viewer, setViewer] = useState<{ list: MediaItem[]; index: number } | null>(null)
  const [presenting, setPresenting] = useState(false)

  // photos-only deck for the slideshow (studio → wedding day → wedding night)
  const slideshow = useMemo(() => GROUPS.flatMap((g) => g.items).filter((m) => !m.isVideo), [])

  const openViewer = (list: MediaItem[], index: number) => setViewer({ list, index })

  const start = () => {
    setEntered(true)
    void music.play() // user gesture → start the looping song
  }

  if (!entered) return <Cover onStart={start} />

  if (tab === 'swipe') return <SwipeExperience onExit={() => setTab('photos')} />

  return (
    <div className="mtl mtl-active relative h-full w-full overflow-hidden" data-theme={theme}>
      {tab === 'photos' && (
        <PhotosView
          groups={GROUPS}
          onOpen={openViewer}
          onSearchFocus={() => setTab('search')}
          onToggleTheme={toggle}
          theme={theme}
        />
      )}
      {tab === 'search' && <SearchView onOpen={openViewer} onToggleTheme={toggle} theme={theme} />}
      {tab === 'library' && (
        <LibraryView onOpen={openViewer} onToggleTheme={toggle} theme={theme} onPresent={() => setPresenting(true)} />
      )}

      <BottomNav active={tab} onChange={setTab} />

      <MusicToggle className="absolute bottom-24 end-4 z-40" />

      {viewer && (
        <PhotoViewer list={viewer.list} index={viewer.index} onClose={() => setViewer(null)} />
      )}

      {presenting && (
        <Presentation photos={slideshow} onClose={() => setPresenting(false)} />
      )}
    </div>
  )
}
