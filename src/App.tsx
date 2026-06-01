import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './gallery/gallery.css'
import { Cover } from './components/Cover'
import { useTheme } from './gallery/useTheme'
import { music } from './lib/audio'
import { SEED_OCCASIONS, type Occasion, type OccasionKind } from './occasions/occasions'
import { OccasionDrawer } from './occasions/OccasionDrawer'

// Heavy parts (gallery, framer-motion, supabase, the ~5 MB embedded photo data) are
// split out so the cover paints instantly; they load lazily in the background.
const WeddingApp = lazy(() => import('./occasions/WeddingApp').then((m) => ({ default: m.WeddingApp })))
const HoneymoonApp = lazy(() =>
  import('./occasions/honeymoon/HoneymoonApp').then((m) => ({ default: m.HoneymoonApp })),
)

const ACCENTS = [
  'linear-gradient(135deg,#c98b7a,#8c6f3b)',
  'linear-gradient(135deg,#3f8d6c,#1f5641)',
  'linear-gradient(135deg,#1A73E8,#6a5acd)',
  'linear-gradient(135deg,#e9a23b,#c0392b)',
]

function Loader() {
  return (
    <div className="nm-loader">
      <span className="nm-spin" />
    </div>
  )
}

export default function App() {
  const [entered, setEntered] = useState(false)
  const { theme, toggle } = useTheme()
  const [occasions, setOccasions] = useState<Occasion[]>(SEED_OCCASIONS)
  const [currentId, setCurrentId] = useState('wedding')
  const [drawer, setDrawer] = useState(false)

  const current = occasions.find((o) => o.id === currentId) ?? occasions[0]

  // Warm the gallery chunk in the background while the cover is shown,
  // so tapping ابدأ is instant.
  useEffect(() => {
    const t = setTimeout(() => void import('./occasions/WeddingApp'), 300)
    return () => clearTimeout(t)
  }, [])

  // Background music belongs to the Wedding occasion only — pause it elsewhere.
  const wasPlaying = useRef(false)
  useEffect(() => {
    if (current.id === 'wedding') {
      if (wasPlaying.current) {
        void music.play()
        wasPlaying.current = false
      }
    } else if (music.isPlaying()) {
      wasPlaying.current = true
      music.pause()
    }
  }, [current.id])

  const addOccasion = (name: string, kind: OccasionKind) => {
    const id = `occ-${Date.now()}`
    const occ: Occasion = {
      id,
      name,
      kind,
      subtitle: kind === 'travel' ? 'رحلة جديدة' : 'مناسبة جديدة',
      accent: ACCENTS[occasions.length % ACCENTS.length],
      glyph: kind === 'travel' ? '🧳' : '✨',
    }
    setOccasions((o) => [...o, occ])
    setCurrentId(id)
    setDrawer(false)
  }

  if (!entered) {
    return (
      <Cover
        onStart={() => {
          setEntered(true)
          void music.play() // user gesture → start looping song
        }}
      />
    )
  }

  return (
    <div className="mtl mtl-active relative h-full w-full overflow-hidden" data-theme={theme}>
      <Suspense fallback={<Loader />}>
        {current.kind === 'travel' ? (
          <HoneymoonApp occasionId={current.id} theme={theme} onToggleTheme={toggle} onOpenOccasions={() => setDrawer(true)} />
        ) : current.id === 'wedding' ? (
          <WeddingApp theme={theme} onToggleTheme={toggle} onOpenOccasions={() => setDrawer(true)} />
        ) : (
          <EmptyOccasion name={current.name} onToggleTheme={toggle} onOpenOccasions={() => setDrawer(true)} />
        )}
      </Suspense>

      <OccasionDrawer
        open={drawer}
        occasions={occasions}
        currentId={currentId}
        theme={theme}
        onSelect={setCurrentId}
        onClose={() => setDrawer(false)}
        onAdd={addOccasion}
        onToggleTheme={toggle}
      />
    </div>
  )
}

function EmptyOccasion({
  name,
  onOpenOccasions,
  onToggleTheme,
}: {
  name: string
  onToggleTheme: () => void
  onOpenOccasions: () => void
}) {
  return (
    <div className="app">
      <header className="hd">
        <div className="searchbar">
          <span className="mi" />
          <input placeholder={name} readOnly />
          <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
            <span />
          </button>
          <button className="avatar" onClick={onOpenOccasions} aria-label="المناسبات">
            ✨
          </button>
        </div>
      </header>
      <div className="search-empty" style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 30, color: 'var(--on-surface-2)' }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--on-surface)' }}>{name}</p>
          <p style={{ fontSize: 14 }}>لا يوجد محتوى بعد — أضف صوراً أو وثائق لهذه المناسبة.</p>
        </div>
      </div>
    </div>
  )
}
