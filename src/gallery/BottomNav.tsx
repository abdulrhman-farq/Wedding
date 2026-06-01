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
    <nav className="nav">
      {ITEMS.map((it) => (
        <button
          key={it.id}
          className={`nav-item ${active === it.id ? 'active' : ''}`}
          onClick={() => onChange(it.id)}
          aria-current={active === it.id}
        >
          <span className="pill">
            <Icon name={it.icon} size={24} />
          </span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
