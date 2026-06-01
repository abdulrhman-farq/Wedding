import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MediaItem } from '../types'
import { config } from '../config'
import { music } from '../lib/audio'
import { Icon } from './Icon'
import { MusicToggle } from './MusicToggle'

const SLIDE_MS = 5000

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface PresentationProps {
  photos: MediaItem[]
  startIndex?: number
  onClose: () => void
}

export function Presentation({ photos, startIndex = 0, onClose }: PresentationProps) {
  const [index, setIndex] = useState(startIndex)
  const [playing, setPlaying] = useState(true)
  const reduce = reducedMotion()
  const item = photos[index]

  // make sure the song is going (the user gesture was the "Present" tap)
  useEffect(() => {
    void music.play()
  }, [])

  // auto-advance, looping forever
  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % photos.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [index, playing, photos.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowRight') setIndex((i) => (i - 1 + photos.length) % photos.length)
      if (e.key === ' ') {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photos.length, onClose])

  const next = () => setIndex((i) => (i + 1) % photos.length)
  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)

  return (
    <div className="fixed inset-0 z-50 select-none overflow-hidden bg-black">
      {/* slides */}
      <AnimatePresence>
        <motion.div
          key={item.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
        >
          {/* blurred fill so portrait photos don't leave plain black bars */}
          <motion.img
            src={item.poster}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
            initial={{ scale: reduce ? 1.1 : 1.1 }}
            animate={{ scale: reduce ? 1.1 : 1.22, transition: { duration: SLIDE_MS / 1000 + 1.2, ease: 'linear' } }}
          />
          {/* the full photo, always entirely visible (fit to screen) */}
          <img
            src={item.full ?? item.poster}
            alt=""
            draggable={false}
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* vignette + scrims for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,transparent_55%,rgba(0,0,0,.55))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 to-transparent" />

      {/* tap zones: left/right thirds navigate, center toggles play */}
      <button aria-label="السابق" onClick={prev} className="absolute inset-y-0 start-0 z-10 w-1/3" />
      <button
        aria-label="إيقاف/تشغيل"
        onClick={() => setPlaying((p) => !p)}
        className="absolute inset-y-0 left-1/3 right-1/3 z-10"
      />
      <button aria-label="التالي" onClick={next} className="absolute inset-y-0 end-0 z-10 w-1/3" />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+10px)] text-white">
        <span className="font-display text-lg gold-text">{config.couple.families.ar}</span>
        <button onClick={onClose} aria-label="إنهاء العرض" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="close" />
        </button>
      </header>

      {/* progress segment for the current slide */}
      <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+2px)] z-20 px-4">
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/20">
          {playing && (
            <motion.div
              key={index}
              className="h-full bg-[var(--color-gold-bright,#e9d49a)]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
              style={{ background: '#e9d49a' }}
            />
          )}
        </div>
      </div>

      {/* bottom controls */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-5 pb-[calc(env(safe-area-inset-bottom)+18px)] text-white">
        <button onClick={prev} aria-label="السابق" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="chevronRight" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'إيقاف' : 'تشغيل'}
          className="grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 active:scale-90"
        >
          <Icon name={playing ? 'pause' : 'play'} size={26} />
        </button>
        <button onClick={next} aria-label="التالي" className="grid h-11 w-11 place-items-center rounded-full active:bg-white/15">
          <Icon name="chevronLeft" />
        </button>
        <MusicToggle className="!h-11 !w-11 !bg-white/15 !text-white !ring-white/30" />
      </footer>

      <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 text-[11px] tabular-nums text-white/60">
        {index + 1} / {photos.length}
      </span>
    </div>
  )
}
