import { useState } from 'react'
import type { Occasion, OccasionKind } from './occasions'
import { Icon } from '../gallery/Icon'

interface DrawerProps {
  open: boolean
  occasions: Occasion[]
  currentId: string
  theme: 'light' | 'dark'
  onSelect: (id: string) => void
  onClose: () => void
  onAdd: (name: string, kind: OccasionKind) => void
  onToggleTheme: () => void
}

export function OccasionDrawer({
  open,
  occasions,
  currentId,
  theme,
  onSelect,
  onClose,
  onAdd,
  onToggleTheme,
}: DrawerProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<OccasionKind>('memories')

  const submit = () => {
    if (!name.trim()) return
    onAdd(name.trim(), kind)
    setName('')
    setKind('memories')
    setAdding(false)
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'var(--scrim)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .25s var(--ease)',
        }}
      />
      <aside
        style={{
          position: 'fixed',
          insetBlock: 0,
          left: 0,
          zIndex: 61,
          width: 'min(86vw, 320px)',
          background: 'var(--surface)',
          color: 'var(--on-surface)',
          boxShadow: 'var(--elev-3)',
          transform: open ? 'none' : 'translateX(-100%)',
          transition: 'transform .28s var(--ease-emph)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 12px' }}>
          <span style={{ flex: 1, fontSize: 20, fontWeight: 600 }}>المناسبات</span>
          <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
          </button>
          <button className="hd-icon" onClick={onClose} aria-label="إغلاق">
            <Icon name="close" size={22} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0 10px' }} className="mtl-scroll">
          {occasions.map((o) => {
            const active = o.id === currentId
            return (
              <button
                key={o.id}
                onClick={() => {
                  onSelect(o.id)
                  onClose()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  width: '100%',
                  textAlign: 'start',
                  padding: '12px',
                  borderRadius: 14,
                  marginBottom: 4,
                  background: active ? 'var(--blue-tint)' : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flex: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 22,
                    background: o.accent,
                  }}
                >
                  {o.glyph}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: active ? 'var(--blue)' : 'var(--on-surface)' }}>
                    {o.name}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--on-surface-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.subtitle} {o.kind === 'travel' ? '· رحلة' : '· ذكريات'}
                  </span>
                </span>
              </button>
            )
          })}

          {/* add occasion */}
          {adding ? (
            <div style={{ padding: 12, borderRadius: 14, background: 'var(--surface-2)', marginTop: 6 }}>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="اسم المناسبة"
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--outline)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: 'var(--on-surface)',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
                {(['memories', 'travel'] as OccasionKind[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      background: kind === k ? 'var(--blue)' : 'var(--surface-3)',
                      color: kind === k ? '#fff' : 'var(--on-surface-2)',
                    }}
                  >
                    {k === 'memories' ? 'ذكريات' : 'رحلة'}
                  </button>
                ))}
              </div>
              <button
                onClick={submit}
                style={{ width: '100%', padding: '10px', borderRadius: 999, background: 'var(--blue)', color: '#fff', fontWeight: 600 }}
              >
                إضافة
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'start', padding: 12, borderRadius: 14, marginTop: 6, color: 'var(--blue)' }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 12, flex: 'none', display: 'grid', placeItems: 'center', border: '2px dashed var(--outline)' }}>
                <Icon name="plus" size={22} />
              </span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>مناسبة جديدة</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
