interface ControlsProps {
  onRewind: () => void
  onSkip: () => void
  onSuper: () => void
  onLove: () => void
  canRewind: boolean
  disabled: boolean
}

interface BtnProps {
  onClick: () => void
  label: string
  size: 'sm' | 'lg'
  tone: 'gold' | 'rose' | 'emerald' | 'muted'
  disabled?: boolean
  children: React.ReactNode
}

const toneRing: Record<BtnProps['tone'], string> = {
  gold: 'ring-gold/60 text-gold-bright',
  rose: 'ring-rose/60 text-rose',
  emerald: 'ring-emerald-bright/70 text-emerald-bright',
  muted: 'ring-line text-muted',
}

function Btn({ onClick, label, size, tone, disabled, children }: BtnProps) {
  const dim = size === 'lg' ? 'h-[68px] w-[68px]' : 'h-14 w-14'
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex ${dim} items-center justify-center rounded-full bg-panel/80 ring-1 backdrop-blur-sm transition-transform duration-150 active:scale-90 disabled:opacity-35 disabled:active:scale-100 ${toneRing[tone]}`}
    >
      {children}
    </button>
  )
}

export function Controls({ onRewind, onSkip, onSuper, onLove, canRewind, disabled }: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Btn onClick={onRewind} label="تراجع · Rewind" size="sm" tone="gold" disabled={!canRewind || disabled}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" />
        </svg>
      </Btn>

      <Btn onClick={onSkip} label="تخطّي · Skip" size="lg" tone="rose" disabled={disabled}>
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
        </svg>
      </Btn>

      <Btn onClick={onSuper} label="مميّز · Super" size="sm" tone="gold" disabled={disabled}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      </Btn>

      <Btn onClick={onLove} label="أحب · Love" size="lg" tone="emerald" disabled={disabled}>
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M12 21s-7.5-4.9-10-9.5C.5 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4l2.5 3 2.5-3C15.3 6.2 16.7 5 18.7 5 22 5 23.5 8.4 22 11.5 19.5 16.1 12 21 12 21z" />
        </svg>
      </Btn>
    </div>
  )
}
