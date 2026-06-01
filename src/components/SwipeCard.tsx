import { forwardRef, useImperativeHandle } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import type { MediaItem, SwipeDir } from '../types'
import { Card } from './Card'
import { buzz } from '../lib/haptics'

export interface SwipeCardHandle {
  fling: (dir: SwipeDir) => void
}

interface SwipeCardProps {
  item: MediaItem
  total: number
  onCommit: (dir: SwipeDir) => void
  onTap: (item: MediaItem) => void
}

const ROT_MAX = 15
const VELOCITY = 0.45

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(function SwipeCard(
  { item, total, onCommit, onTap },
  ref,
) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotate = useTransform(x, [-window.innerWidth, window.innerWidth], [-ROT_MAX * 2, ROT_MAX * 2])
  const loveOpacity = useTransform(x, [0, 110], [0, 1])
  const skipOpacity = useTransform(x, [0, -110], [0, 1])
  const superOpacity = useTransform(y, [0, -110], [0, 1])

  const flyOff = (dir: SwipeDir) => {
    const w = window.innerWidth
    const h = window.innerHeight
    buzz(dir === 'up' ? [10, 30, 10] : 14)
    const opts = { type: 'spring' as const, stiffness: 260, damping: 28 }
    if (dir === 'up') {
      animate(y, -h * 1.3, { ...opts, onComplete: () => onCommit(dir) })
    } else {
      const tx = dir === 'right' ? w * 1.4 : -w * 1.4
      animate(y, 40, opts)
      animate(x, tx, { ...opts, onComplete: () => onCommit(dir) })
    }
  }

  useImperativeHandle(ref, () => ({ fling: flyOff }))

  const springBack = () => {
    const opts = { type: 'spring' as const, stiffness: 340, damping: 30 }
    animate(x, 0, opts)
    animate(y, 0, opts)
  }

  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], tap }) => {
      if (tap) {
        onTap(item)
        return
      }
      const w = window.innerWidth
      const h = window.innerHeight

      if (active) {
        x.set(mx)
        y.set(my)
        return
      }

      const horizCommit = Math.abs(mx) > w * 0.26 || vx > VELOCITY
      const upCommit = (-my > h * 0.2 || vy > VELOCITY) && dy < 0 && Math.abs(my) > Math.abs(mx)

      if (upCommit) {
        flyOff('up')
      } else if (horizCommit && Math.abs(mx) > 60) {
        flyOff(dx > 0 ? 'right' : 'left')
      } else {
        springBack()
      }
    },
    { filterTaps: true, pointer: { touch: true } },
  )

  const gestureProps = bind() as unknown as React.ComponentProps<typeof motion.div>

  return (
    <motion.div
      {...gestureProps}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, y, rotate, willChange: 'transform' }}
    >
      <Card item={item} total={total} />

      {/* LOVE stamp (right) */}
      <motion.div
        style={{ opacity: loveOpacity }}
        className="pointer-events-none absolute left-6 top-10 -rotate-12 rounded-xl border-4 border-emerald-bright px-4 py-1.5"
      >
        <span className="font-display text-3xl text-emerald-bright drop-shadow">أحب ❤</span>
      </motion.div>

      {/* SKIP stamp (left) */}
      <motion.div
        style={{ opacity: skipOpacity }}
        className="pointer-events-none absolute right-6 top-10 rotate-12 rounded-xl border-4 border-rose px-4 py-1.5"
      >
        <span className="font-display text-3xl text-rose drop-shadow">تخطّي ✕</span>
      </motion.div>

      {/* SUPER stamp (up) */}
      <motion.div
        style={{ opacity: superOpacity }}
        className="pointer-events-none absolute inset-x-0 top-20 flex justify-center"
      >
        <span className="rounded-xl border-4 border-gold-bright px-5 py-1.5 font-display text-3xl text-gold-bright drop-shadow">
          مميّز ⭐
        </span>
      </motion.div>
    </motion.div>
  )
})
