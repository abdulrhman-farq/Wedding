import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useGesture } from '@use-gesture/react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { TagLayer } from '../components/TagLayer'
import { Icon } from './Icon'
import { toArabicNumerals } from '../lib/format'

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
      if (e.key === 'ArrowRight') go(-1)
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
        if (zoomable) scale.set(Math.max(1, Math.min(4, s)))
      },
      onDrag: ({ movement: [mx], pinching, last, tap, offset: [dx, dy] }) => {
        if (tap || pinching) return
        if (scale.get() > 1) {
          x.set(dx)
          y.set(dy)
          return
        }
        if (last) {
          if (mx < -60) go(1)
          else if (mx > 60) go(-1)
          x.set(0)
        } else x.set(mx)
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
    const text = `لحظة — النقيدان و المحيسن\n${location.href}`
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
    <div className="pv">
      <div className="pv-top">
        <button className="selbar-btn" onClick={onClose} aria-label="رجوع">
          <Icon name="back" size={24} />
        </button>
        <div className="pv-title">
          <b>لحظة {toArabicNumerals(item.index + 1)}</b>
          <span>
            {item.isVideo ? 'فيديو' : 'صورة'} · {toArabicNumerals(i + 1)} / {toArabicNumerals(list.length)}
          </span>
        </div>
        {taggingEnabled && (
          <button
            className="selbar-btn"
            onClick={() => {
              setTagging((t) => !t)
              reset()
            }}
            aria-label="وسم"
            style={tagging ? { color: 'var(--blue)' } : undefined}
          >
            <Icon name="tag" size={22} />
          </button>
        )}
      </div>

      <div className="pv-stage" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* blurred fill */}
        <img
          src={item.thumb}
          alt=""
          aria-hidden
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.1)',
            filter: 'blur(28px)',
            opacity: 0.4,
          }}
        />
        <motion.div
          key={item.id}
          {...(bind() as unknown as React.ComponentProps<typeof motion.div>)}
          className="relative inline-block touch-none"
          style={{ scale, x, y, zIndex: 1 }}
        >
          <img
            src={item.full ?? item.poster}
            alt={item.name}
            draggable={false}
            decoding="async"
            referrerPolicy="no-referrer"
            style={{ display: 'block', maxHeight: '78dvh', maxWidth: '94vw', objectFit: 'contain', borderRadius: 10 }}
          />
          {taggingEnabled && <TagLayer item={item} active={tagging} />}
        </motion.div>
      </div>

      <div className="pv-actions">
        <button onClick={share}>
          <Icon name="share" size={22} />
          <span>مشاركة</span>
        </button>
        <button onClick={download}>
          <Icon name="download" size={22} />
          <span>تنزيل</span>
        </button>
        {item.isVideo ? (
          <button onClick={() => window.open(item.driveUrl, '_blank', 'noopener')}>
            <Icon name="play" size={22} />
            <span>تشغيل</span>
          </button>
        ) : (
          taggingEnabled && (
            <button onClick={() => setTagging((t) => !t)}>
              <Icon name="tag" size={22} />
              <span>وسم</span>
            </button>
          )
        )}
      </div>
    </div>
  )
}
