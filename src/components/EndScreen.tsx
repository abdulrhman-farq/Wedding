import { config } from '../config'
import { toArabicNumerals } from '../lib/format'

interface EndScreenProps {
  lovedCount: number
  onViewFavorites: () => void
  onRestart: () => void
  onShare: () => void
}

export function EndScreen({ lovedCount, onViewFavorites, onRestart, onShare }: EndScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
      <p className="mb-2 font-ui text-[0.7rem] uppercase tracking-[0.5em] text-gold">{config.couple.families.en}</p>
      <h2 className="gold-text font-display text-4xl leading-tight">شفت كل اللحظات</h2>
      <p className="mt-2 font-latin text-xl italic text-muted">You’ve seen them all</p>

      <div className="my-9 flex flex-col items-center">
        <span className="font-display text-6xl text-gold-bright">{toArabicNumerals(lovedCount)}</span>
        <span className="mt-1 font-arabic text-base text-muted">لحظة أحببتها · moments you loved</span>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={onViewFavorites}
          className="rounded-full bg-gradient-to-b from-gold-bright to-gold px-8 py-3.5 font-ui font-bold text-[#1a140b] ring-1 ring-gold-bright/60 transition-transform active:scale-95"
        >
          عرض المفضّلة · View favourites
        </button>
        <button
          type="button"
          onClick={onShare}
          className="rounded-full bg-panel/80 px-8 py-3 font-ui text-ink ring-1 ring-line transition-transform active:scale-95"
        >
          مشاركة · Share
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full px-8 py-3 font-ui text-muted underline decoration-gold/40 underline-offset-4"
        >
          إعادة · Restart
        </button>
      </div>
    </div>
  )
}
