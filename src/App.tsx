import { useMemo, useState } from 'react'
import { MEDIA } from './data/files'
import { useDeck } from './hooks/useDeck'
import type { MediaItem } from './types'
import { config } from './config'
import { Cover } from './components/Cover'
import { Deck } from './components/Deck'
import { EndScreen } from './components/EndScreen'
import { Favorites } from './components/Favorites'
import { Detail } from './components/Detail'

type Screen = 'cover' | 'deck' | 'favorites'

export default function App() {
  const deck = useDeck(MEDIA)
  const [screen, setScreen] = useState<Screen>('cover')
  const [detail, setDetail] = useState<MediaItem | null>(null)

  const lovedItems = useMemo(
    () => deck.loves.map((id) => MEDIA.find((m) => m.id === id)).filter((m): m is MediaItem => !!m),
    [deck.loves],
  )

  const share = async () => {
    const data = {
      title: config.couple.families.ar,
      text: `${config.couple.families.ar} · ${config.copy.invite.ar} · ${config.copy.invite.en}`,
      url: location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
        return
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text}\n${data.url}`)}`, '_blank', 'noopener')
  }

  return (
    <main className="relative h-full w-full overflow-hidden">
      {screen === 'cover' && <Cover onStart={() => setScreen('deck')} />}

      {screen === 'deck' && !deck.isDone && (
        <Deck
          media={MEDIA}
          cursor={deck.cursor}
          total={deck.total}
          canRewind={deck.canRewind}
          onCommit={deck.commit}
          onRewind={deck.rewind}
          onTap={setDetail}
          detailOpen={!!detail}
        />
      )}

      {screen === 'deck' && deck.isDone && (
        <EndScreen
          lovedCount={deck.loves.length}
          onViewFavorites={() => setScreen('favorites')}
          onRestart={deck.restart}
          onShare={share}
        />
      )}

      {screen === 'favorites' && (
        <Favorites
          items={lovedItems}
          supers={deck.supers}
          onBack={() => setScreen('deck')}
          onOpen={setDetail}
        />
      )}

      {detail && <Detail item={detail} onClose={() => setDetail(null)} />}
    </main>
  )
}
