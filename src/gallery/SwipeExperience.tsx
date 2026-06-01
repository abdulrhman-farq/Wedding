import { useMemo, useState } from 'react'
import { MEDIA } from '../data/files'
import { useDeck } from '../hooks/useDeck'
import type { MediaItem } from '../types'
import { config } from '../config'
import { Deck } from '../components/Deck'
import { EndScreen } from '../components/EndScreen'
import { Favorites } from '../components/Favorites'
import { Detail } from '../components/Detail'
import { Icon } from './Icon'
import { MusicToggle } from './MusicToggle'

/** The original Tinder-style deck, presented as one tab of the app. */
export function SwipeExperience({ onExit }: { onExit: () => void }) {
  const deck = useDeck(MEDIA)
  const [favorites, setFavorites] = useState(false)
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
      {/* exit to gallery */}
      {!favorites && (
        <button
          onClick={onExit}
          aria-label="إلى المعرض · To gallery"
          className="absolute start-4 top-[calc(env(safe-area-inset-top)+12px)] z-30 grid h-10 w-10 place-items-center rounded-full bg-panel/80 text-gold-bright ring-1 ring-line backdrop-blur"
        >
          <Icon name="photos" size={20} />
        </button>
      )}

      {!favorites && !deck.isDone && (
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

      {!favorites && deck.isDone && (
        <EndScreen
          lovedCount={deck.loves.length}
          onViewFavorites={() => setFavorites(true)}
          onRestart={deck.restart}
          onShare={share}
        />
      )}

      {favorites && (
        <Favorites
          items={lovedItems}
          supers={deck.supers}
          onBack={() => setFavorites(false)}
          onOpen={setDetail}
        />
      )}

      {!favorites && <MusicToggle className="absolute end-4 top-[calc(env(safe-area-inset-top)+12px)] z-30 !h-10 !w-10" />}

      {detail && <Detail item={detail} onClose={() => setDetail(null)} />}
    </main>
  )
}
