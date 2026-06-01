import { Icon } from './Icon'

export type Tab = 'photos' | 'search' | 'library' | 'swipe'

const ITEMS: { id: Tab; icon: Parameters<typeof Icon>[0]['name']; label: string }[] = [
  { id: 'photos', icon: 'photos', label: 'الصور' },
  { id: 'search', icon: 'search', label: 'بحث' },
  { id: 'library', icon: 'library', label: 'المكتبة' },
  { id: 'swipe', icon: 'heart', label: 'تصفّح' },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--m-outline)] bg-[var(--m-surface)] pb-[env(safe-area-inset-bottom)]">
      {ITEMS.map((it) => {
        const on = active === it.id
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5"
            aria-label={it.label}
            aria-current={on}
          >
            <span
              className={`grid h-8 w-16 place-items-center rounded-full transition-colors ${
                on ? 'bg-[var(--m-primary-container)] text-[var(--m-primary)]' : 'text-[var(--m-on-2)]'
              }`}
            >
              <Icon name={it.icon} size={22} />
            </span>
            <span
              className={`text-[11px] ${on ? 'font-medium text-[var(--m-on)]' : 'text-[var(--m-on-2)]'}`}
            >
              {it.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
