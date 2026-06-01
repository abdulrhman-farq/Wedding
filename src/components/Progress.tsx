import { toArabicNumerals } from '../lib/format'

interface ProgressProps {
  current: number
  total: number
}

export function Progress({ current, total }: ProgressProps) {
  const pct = Math.min(100, (current / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-latin text-sm tabular-nums text-muted">
        {toArabicNumerals(current)} / {toArabicNumerals(total)}
      </span>
    </div>
  )
}
