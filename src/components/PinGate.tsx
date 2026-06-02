import { useState } from 'react'
import { config } from '../config'

const PIN = config.access.pin
const KEYS = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '', '٠', '⌫']
const AR2EN: Record<string, string> = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' }

export function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)

  const press = (k: string) => {
    if (k === '') return
    if (k === '⌫') {
      setErr(false)
      setPin((p) => p.slice(0, -1))
      return
    }
    setErr(false)
    const next = (pin + AR2EN[k]).slice(0, PIN.length)
    setPin(next)
    if (next.length === PIN.length) {
      if (next === PIN) {
        try {
          localStorage.setItem('nm_unlocked', '1')
        } catch {
          /* ignore */
        }
        setTimeout(onUnlock, 160)
      } else {
        setErr(true)
        setTimeout(() => setPin(''), 450)
      }
    }
  }

  const dot = (filled: boolean): React.CSSProperties => ({
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '1.5px solid var(--gold)',
    background: filled ? 'var(--gold-bright)' : 'transparent',
    boxShadow: filled ? '0 0 10px var(--gold-bright)' : 'none',
    transition: 'all .15s',
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 24,
        textAlign: 'center',
        color: 'var(--ink)',
      }}
    >
      <div>
        <p style={{ fontFamily: "'Aref Ruqaa', serif", fontSize: 13, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', margin: 0 }}>
          النقيدان و المحيسن
        </p>
        <h1 className="gold-text" style={{ fontFamily: "'Aref Ruqaa', serif", fontSize: 34, margin: '10px 0 4px' }}>
          أدخل الرمز
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: 'var(--muted)', margin: 0 }}>Enter access PIN</p>
      </div>

      {/* dots */}
      <div
        style={{ display: 'flex', gap: 16 }}
        className={err ? 'pin-shake' : undefined}
      >
        {Array.from({ length: PIN.length }).map((_, i) => (
          <span key={i} style={dot(i < pin.length)} />
        ))}
      </div>

      {/* keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 14 }}>
        {KEYS.map((k, i) => (
          <button
            key={i}
            onClick={() => press(k)}
            disabled={k === ''}
            style={{
              height: 72,
              borderRadius: '50%',
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: 26,
              color: 'var(--ink)',
              background: k === '' ? 'transparent' : 'var(--panel)',
              border: k === '' ? 'none' : '1px solid var(--line)',
              opacity: k === '' ? 0 : 1,
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: err ? 'var(--rose)' : 'var(--muted)', minHeight: 16, margin: 0 }}>
        {err ? 'رمز غير صحيح · Wrong PIN' : 'هذا المحتوى خاص'}
      </p>
    </div>
  )
}
