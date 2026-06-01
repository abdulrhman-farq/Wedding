import { useEffect, useRef, useState } from 'react'
import type { MediaItem, SwipeDir } from '../types'
import { Card } from './Card'
import { SwipeCard, type SwipeCardHandle } from './SwipeCard'
import { Controls } from './Controls'
import { Progress } from './Progress'
import { Confetti } from './Confetti'

interface DeckProps {
  media: MediaItem[]
  cursor: number
  total: number
  canRewind: boolean
  onCommit: (dir: SwipeDir) => void
  onRewind: () => void
  onTap: (item: MediaItem) => void
  detailOpen: boolean
}

export function Deck({ media, cursor, total, canRewind, onCommit, onRewind, onTap, detailOpen }: DeckProps) {
  const topRef = useRef<SwipeCardHandle>(null)
  const [fireKey, setFireKey] = useState(0)

  const top = media[cursor]
  const behind = media.slice(cursor + 1, cursor + 3)

  const handleCommit = (dir: SwipeDir) => {
    if (dir === 'right' || dir === 'up') setFireKey((k) => k + 1)
    onCommit(dir)
  }

  const fling = (dir: SwipeDir) => topRef.current?.fling(dir)

  // keyboard controls (desktop)
  useEffect(() => {
    if (detailOpen) return
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          fling('left')
          break
        case 'ArrowRight':
          fling('right')
          break
        case 'ArrowUp':
          fling('up')
          break
        case 'Backspace':
          e.preventDefault()
          onRewind()
          break
        case ' ':
          e.preventDefault()
          if (top) onTap(top)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailOpen, top, onRewind, onTap])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-5 pb-2 pt-[calc(env(safe-area-inset-top)+14px)]">
        <Progress current={cursor} total={total} />
      </div>

      {/* card stack */}
      <div className="relative flex-1 px-5 py-3">
        <div className="relative mx-auto h-full w-full max-w-md">
          <Confetti fireKey={fireKey} />

          {behind
            .slice()
            .reverse()
            .map((item) => {
              const depth = item.index - cursor // 1 or 2
              const scale = 1 - depth * 0.05
              const ty = depth * 14
              return (
                <div
                  key={item.id}
                  className="absolute inset-0"
                  style={{
                    transform: `translateY(${ty}px) scale(${scale})`,
                    transformOrigin: 'top center',
                    opacity: depth === 2 ? 0.7 : 0.9,
                    willChange: 'transform',
                  }}
                >
                  <Card item={item} total={total} />
                </div>
              )
            })}

          {top && (
            <SwipeCard
              key={cursor}
              ref={topRef}
              item={top}
              total={total}
              onCommit={handleCommit}
              onTap={onTap}
            />
          )}
        </div>
      </div>

      {/* hint + controls */}
      <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-1">
        <p className="mb-3 text-center font-arabic text-xs text-muted">
          اسحب يمين للحب · يسار للتخطّي · فوق للمميّز
        </p>
        <Controls
          onRewind={onRewind}
          onSkip={() => fling('left')}
          onSuper={() => fling('up')}
          onLove={() => fling('right')}
          canRewind={canRewind}
          disabled={!top}
        />
      </div>
    </div>
  )
}
