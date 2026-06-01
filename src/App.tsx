import { useState } from 'react'
import './gallery/gallery.css'
import type { MediaItem } from './types'
import { Cover } from './components/Cover'
import { GROUPS } from './gallery/galleryData'
import { useTheme } from './gallery/useTheme'
import { BottomNav, type Tab } from './gallery/BottomNav'
import { PhotosView } from './gallery/PhotosView'
import { SearchView } from './gallery/SearchView'
import { LibraryView } from './gallery/LibraryView'
import { PhotoViewer } from './gallery/PhotoViewer'
import { SwipeExperience } from './gallery/SwipeExperience'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [tab, setTab] = useState<Tab>('photos')
  const { theme, toggle } = useTheme()
  const [viewer, setViewer] = useState<{ list: MediaItem[]; index: number } | null>(null)

  const openViewer = (list: MediaItem[], index: number) => setViewer({ list, index })

  if (!entered) return <Cover onStart={() => setEntered(true)} />

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
      {tab === 'library' && <LibraryView onOpen={openViewer} onToggleTheme={toggle} theme={theme} />}

      <BottomNav active={tab} onChange={setTab} />

      {viewer && (
        <PhotoViewer list={viewer.list} index={viewer.index} onClose={() => setViewer(null)} />
      )}
    </div>
  )
}
