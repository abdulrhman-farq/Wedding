import { useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import type { MediaItem } from '../types'

interface DetailProps {
  item: MediaItem
  onClose: () => void
}

export function Detail({ item, onClose }: DetailProps) {
  const [playing, setPlaying] = useState(false)
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const bind = useGesture(
    {
      onPinch: ({ offset: [s] }) => {
        scale.set(Math.max(1, Math.min(4, s)))
      },
      onDrag: ({ offset: [dx, dy], pinching }) => {
        if (pinching || scale.get() <= 1) return
        x.set(dx)
        y.set(dy)
      },
      onDoubleClick: () => {
        const zoomed = scale.get() > 1.2
        scale.set(zoomed ? 1 : 2.5)
        x.set(0)
        y.set(0)
      },
    },
    { drag: { from: () => [x.get(), y.get()] }, pinch: { from: () => [scale.get(), 0] } },
  )

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/92 backdrop-blur-md">
      <button
        type="button"
        aria-label="إغلاق · Close"
        onClick={onClose}
        className="absolute start-4 top-[calc(env(safe-area-inset-top)+16px)] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-panel/80 text-gold-bright ring-1 ring-line"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
        </svg>
      </button>

      {item.isVideo ? (
        <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center p-4">
          {playing ? (
            <iframe
              title={item.name}
              src={`https://drive.google.com/file/d/${item.driveId}/preview`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="aspect-[9/16] max-h-[78vh] w-full rounded-2xl ring-1 ring-line"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="relative aspect-[9/16] max-h-[70vh] w-full overflow-hidden rounded-2xl ring-1 ring-gold/40"
            >
              <img src={item.poster} alt={item.name} className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/45 ring-1 ring-gold/60 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" className="ms-1 h-9 w-9 fill-gold-bright">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
          <a
            href={item.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 rounded-full px-5 py-2 font-ui text-sm text-muted underline decoration-gold/40 underline-offset-4"
          >
            فتح في Drive · Open in Drive
          </a>
        </div>
      ) : (
        <motion.div
          {...(bind() as unknown as React.ComponentProps<typeof motion.div>)}
          className="flex h-full w-full touch-none items-center justify-center overflow-hidden p-2"
          style={{ scale, x, y }}
        >
          <img
            src={item.full ?? item.poster}
            alt={item.name}
            draggable={false}
            className="max-h-[88vh] max-w-full select-none rounded-2xl object-contain ring-1 ring-line"
          />
        </motion.div>
      )}
    </div>
  )
}
