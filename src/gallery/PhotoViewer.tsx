import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { TagLayer } from '../components/TagLayer'
import { Icon } from './Icon'

interface PhotoViewerProps {
  list: MediaItem[]
  index: number
  onClose: () => void
}

export function PhotoViewer({ list, index, onClose }: PhotoViewerProps) {
  const [i, setI] = useState(index)
  const [tagging, setTagging] = useState(false)
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const item = list[i]
  const taggingEnabled = config.features.peopleTagging

  const reset = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }

  const go = (dir: -1 | 1) => {
    setI((c) => {
      const n = c + dir
      if (n < 0 || n >= list.length) return c
      setTagging(false)
      reset()
      return n
    })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(-1) // RTL: right = previous
      if (e.key === 'ArrowLeft') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length])

  const zoomable = !tagging
  const bind = useGesture(
    {
      onPinch: ({ offset: [s] }) => {
        if (!zoomable) return
        scale.set(Math.max(1, Math.min(4, s)))
      },
      onDrag: ({ offset: [dx, dy], movement: [mx], pinching, last, tap }) => {
        if (tap || pinching) return
        if (scale.get() > 1) {
          y.set(dy)
          x.set(dx)
          return
        }
        // pan at base scale = navigate between photos
        if (last) {
          if (mx < -60) go(1)
          else if (mx > 60) go(-1)
          x.set(0)
        } else {
          x.set(mx)
        }
      },
      onDoubleClick: () => {
        if (!zoomable) return
        if (scale.get() > 1.2) reset()
        else scale.set(2.5)
      },
    },
    { drag: { from: () => [x.get(), y.get()], filterTaps: true }, pinch: { from: () => [scale.get(), 0] } },
  )

  const share = async () => {
    const text = `لحظة · moment — النقيدان و المحيسن\n${location.href}`
    if (navigator.share) {
      try {
        await navigator.share({ text, url: location.href })
        return
      } catch {
        /* cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = item.full ?? item.poster
    a.download = item.name.replace(/\.[^.]+$/, '') + '.jpg'
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center gap-1 bg-gradient-to-b from-black/70 to-transparent px-2 pt-[calc(env(safe-area-inset-top)+8px)] pb-4 text-white">
        <button onClick={onClose} aria-label="إغلاق" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="back" />
        </button>
        <span className="flex-1 text-center text-sm tabular-nums text-white/90">
          {i + 1} / {list.length}
        </span>
        {taggingEnabled && (
          <button
            onClick={() => {
              setTagging((t) => !t)
              reset()
            }}
            aria-label="وسم"
            className={`grid h-11 w-11 place-items-center rounded-full ${tagging ? 'bg-[var(--m-primary,#1a73e8)] text-white' : 'active:bg-white/15'}`}
          >
            <Icon name="tag" />
          </button>
        )}
        <button onClick={share} aria-label="مشاركة" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="share" />
        </button>
        <button onClick={download} aria-label="تنزيل" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="download" />
        </button>
      </header>

      {/* stage */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <motion.div
          key={item.id}
          {...(bind() as unknown as React.ComponentProps<typeof motion.div>)}
          className="relative inline-block touch-none"
          style={{ scale, x, y }}
        >
          <img
            src={item.full ?? item.poster}
            alt={item.name}
            draggable={false}
            decoding="async"
            referrerPolicy="no-referrer"
            className="block max-h-[100dvh] max-w-[100vw] select-none object-contain"
          />
          {taggingEnabled && <TagLayer itemId={item.id} active={tagging} />}
        </motion.div>
      </div>

      {/* desktop nav arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="السابق"
        className="absolute end-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:grid"
      >
        <Icon name="chevronRight" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="التالي"
        className="absolute start-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 sm:grid"
      >
        <Icon name="chevronLeft" />
      </button>

      {/* footer: caption + video → Drive */}
      <footer className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-6 text-center text-white">
        {tagging ? (
          <p className="text-xs text-white/90">انقر على الصورة لإضافة اسم · Tap to name someone</p>
        ) : item.isVideo ? (
          <a
            href={item.driveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm"
          >
            <Icon name="play" size={16} /> تشغيل في Drive · Play in Drive
          </a>
        ) : (
          <p className="text-xs text-white/70">{item.name}</p>
        )}
      </footer>
    </div>
  )
}
