import { useEffect, useState } from 'react'
import { config } from '../config'

interface Burst {
  id: number
  pieces: { tx: number; ty: number; rot: number; color: string; delay: number }[]
}

const GOLD = ['#cba45a', '#e9d49a', '#fff8e6', '#8c6f3b', '#3f8d6c']

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function makeBurst(id: number): Burst {
  const pieces = Array.from({ length: 26 }, () => {
    const angle = Math.random() * Math.PI * 2
    const dist = 90 + Math.random() * 160
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist + 120, // bias downward (gravity)
      rot: (Math.random() * 720 - 360),
      color: GOLD[Math.floor(Math.random() * GOLD.length)],
      delay: Math.random() * 80,
    }
  })
  return { id, pieces }
}

/** Gold-sparkle burst fired whenever `fireKey` increments. */
export function Confetti({ fireKey }: { fireKey: number }) {
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    if (fireKey === 0 || !config.features.confetti || prefersReducedMotion()) return
    const burst = makeBurst(fireKey)
    setBursts((b) => [...b, burst])
    const t = setTimeout(() => {
      setBursts((b) => b.filter((x) => x.id !== burst.id))
    }, 1100)
    return () => clearTimeout(t)
  }, [fireKey])

  if (bursts.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {bursts.map((burst) =>
        burst.pieces.map((p, i) => (
          <span
            key={`${burst.id}-${i}`}
            className="confetti-piece"
            style={
              {
                background: p.color,
                boxShadow: `0 0 6px ${p.color}`,
                animationDelay: `${p.delay}ms`,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
              } as React.CSSProperties
            }
          />
        )),
      )}
    </div>
  )
}
