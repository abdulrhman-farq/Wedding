import { useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { TagLayer } from './TagLayer'

interface DetailProps {
  item: MediaItem
  onClose: () => void
}

export function Detail({ item, onClose }: DetailProps) {
  const [playing, setPlaying] = useState(false)
  const [tagging, setTagging] = useState(false)
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const taggingEnabled = config.features.peopleTagging
  const still = item.full ?? item.poster
  const zoomable = !item.isVideo && !tagging

  const resetZoom = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }

  const toggleTagging = () => {
    setTagging((t) => {
      const next = !t
      if (next) {
        setPlaying(false)
        resetZoom()
      }
      return next
    })
  }

  const bind = useGesture(
    {
      onPinch: ({ offset: [s] }) => {
        if (!zoomable) return
        scale.set(Math.max(1, Math.min(4, s)))
      },
      onDrag: ({ offset: [dx, dy], pinching }) => {
        if (!zoomable || pinching || scale.get() <= 1) return
        x.set(dx)
        y.set(dy)
      },
      onDoubleClick: () => {
        if (!zoomable) return
        if (scale.get() > 1.2) resetZoom()
        else scale.set(2.5)
      },
    },
    { drag: { from: () => [x.get(), y.get()] }, pinch: { from: () => [scale.get(), 0] } },
  )

  const showVideoPlayer = item.isVideo && playing && !tagging
  const showTagLayer = taggingEnabled && !showVideoPlayer

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/92 backdrop-blur-md">
      {/* toolbar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 pt-[calc(env(safe-area-inset-top)+12px)]">
        <button
          type="button"
          aria-label="إغلاق · Close"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-panel/80 text-gold-bright ring-1 ring-line"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
          </svg>
        </button>

        {taggingEnabled && (
          <button
            type="button"
            onClick={toggleTagging}
            className={`flex items-center gap-2 rounded-full px-4 py-2 font-ui text-sm ring-1 transition-colors ${
              tagging
                ? 'bg-gold-bright text-[#1a140b] ring-gold-bright'
                : 'bg-panel/80 text-gold-bright ring-line'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
            </svg>
            {tagging ? 'تم · Done' : 'وسم · Tag'}
          </button>
        )}
      </div>

      {/* stage */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-3">
        {showVideoPlayer ? (
          <iframe
            title={item.name}
            src={`https://drive.google.com/file/d/${item.driveId}/preview`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="aspect-[9/16] max-h-[80vh] w-full max-w-md rounded-2xl ring-1 ring-line"
          />
        ) : (
          <motion.div
            {...(zoomable ? (bind() as unknown as React.ComponentProps<typeof motion.div>) : {})}
            className="relative inline-block touch-none"
            style={zoomable ? { scale, x, y } : undefined}
          >
            <img
              src={still}
              alt={item.name}
              draggable={false}
              decoding="async"
              referrerPolicy="no-referrer"
              className="block max-h-[82vh] max-w-[94vw] select-none rounded-2xl bg-bg2 object-contain ring-1 ring-line"
            />

            {/* play overlay for videos (not while tagging) */}
            {item.isVideo && !tagging && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="تشغيل · Play"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/45 ring-1 ring-gold/60 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" className="ms-1 h-9 w-9 fill-gold-bright">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}

            {showTagLayer && <TagLayer itemId={item.id} active={tagging} />}
          </motion.div>
        )}
      </div>

      {/* footer hint */}
      <div className="pb-[calc(env(safe-area-inset-bottom)+16px)] pt-1 text-center">
        {tagging ? (
          <p className="font-arabic text-xs text-gold-bright">انقر على الصورة لإضافة اسم · Tap the photo to name someone</p>
        ) : item.isVideo ? (
          <a
            href={item.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="font-ui text-xs text-muted underline decoration-gold/40 underline-offset-4"
          >
            فتح في Drive · Open in Drive
          </a>
        ) : (
          <p className="font-ui text-xs text-muted">قرّب بإصبعين أو نقرتين · Pinch or double-tap to zoom</p>
        )}
      </div>
    </div>
  )
}
