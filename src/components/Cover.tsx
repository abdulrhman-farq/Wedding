import { config } from '../config'

export function Cover({ onStart }: { onStart: () => void }) {
  const { couple, event, copy } = config
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-7 text-center">
      <p className="mb-3 font-ui text-[0.7rem] uppercase tracking-[0.5em] text-gold">2026 · {event.place.en}</p>
      <p className="mb-7 font-display text-lg text-muted">بسم الله الرحمن الرحيم</p>

      <h1 className="gold-text font-display text-5xl leading-[1.1] sm:text-6xl">
        {config.couple.families.ar}
      </h1>

      <div className="my-7 flex items-center gap-4 text-gold-bright">
        <span className="h-px w-12 bg-line" />
        <span className="font-display text-2xl">{couple.groom.ar} & {couple.bride.ar}</span>
        <span className="h-px w-12 bg-line" />
      </div>

      <p className="font-latin text-xl italic text-muted">
        {couple.groom.en} &amp; {couple.bride.en}
      </p>
      <p className="mt-2 font-ui text-sm text-muted">
        {event.dateLabel.ar} · {event.place.ar}
      </p>

      <div className="mt-10 max-w-xs">
        <p className="font-arabic text-lg text-ink">{copy.invite.ar}</p>
        <p className="font-latin text-base text-muted">· {copy.invite.en} ·</p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 rounded-full bg-gradient-to-b from-gold-bright to-gold px-12 py-3.5 font-ui text-lg font-bold text-[#1a140b] shadow-[0_10px_30px_-8px_rgba(201,164,90,0.7)] ring-1 ring-gold-bright/60 transition-transform active:scale-95"
      >
        {copy.start.ar} · {copy.start.en}
      </button>
    </div>
  )
}
