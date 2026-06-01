import { useState } from 'react'
import { Icon } from '../../gallery/Icon'
import { toArabicNumerals } from '../../lib/format'
import { TRIP, TRAVEL_DOCS, type TravelDoc } from '../travelData'

const DOC_ICON: Record<TravelDoc['icon'], Parameters<typeof Icon>[0]['name']> = {
  flight: 'plane',
  hotel: 'bed',
  passport: 'idcard',
  visa: 'document',
  itinerary: 'route',
  emergency: 'sos',
  packing: 'suitcase',
  notes: 'note',
}

const PHOTO_SEEDS = ['bali1', 'ubud', 'rice', 'temple', 'beach', 'villa', 'sunset', 'waterfall', 'nusa', 'spa', 'market', 'pool']

interface HoneymoonAppProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenOccasions: () => void
}

type HTab = 'trip' | 'photos' | 'library'

function daysUntil(iso: string): number {
  const now = new Date()
  const d = new Date(iso)
  return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86400000))
}

export function HoneymoonApp({ theme, onToggleTheme, onOpenOccasions }: HoneymoonAppProps) {
  const [tab, setTab] = useState<HTab>('trip')
  const [doc, setDoc] = useState<TravelDoc | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [lightbox, setLightbox] = useState<string | null>(null)

  const countdown = daysUntil(TRIP.startISO)

  const Header = (
    <header className="hd">
      <div className="searchbar">
        <span className="mi">
          <Icon name="search" size={22} />
        </span>
        <input placeholder="ابحث في الرحلة والوثائق" />
        <button className="hd-icon" onClick={onToggleTheme} aria-label="السمة">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
        </button>
        <button className="avatar" onClick={onOpenOccasions} aria-label="المناسبات">
          ع
        </button>
      </div>
    </header>
  )

  const Nav = (
    <nav className="nav">
      {([
        ['trip', 'الرحلة', 'route'],
        ['photos', 'الصور', 'photos'],
        ['library', 'الوثائق', 'document'],
      ] as [HTab, string, Parameters<typeof Icon>[0]['name']][]).map(([k, label, ic]) => (
        <button key={k} className={`nav-item ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
          <span className="pill">
            <Icon name={ic} size={24} />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <div className="app">
      {Header}

      {tab === 'trip' && (
        <div className="panel mtl-scroll">
          <div className="trip-hero">
            <div className="dest">{TRIP.destinationAr}</div>
            <div className="sub">
              {TRIP.destinationEn} · {toArabicNumerals(TRIP.nights)} ليالٍ
            </div>
            <span className="count-pill">
              <Icon name="clock" size={18} />
              {countdown === 0 ? 'بدأت الرحلة 🎉' : `باقٍ ${toArabicNumerals(countdown)} يوم`}
            </span>
          </div>

          <div className="sec-title">المعلومات والوثائق</div>
          <div className="doc-grid">
            {TRAVEL_DOCS.map((d) => (
              <button className="doc-card" key={d.id} onClick={() => setDoc(d)}>
                <span className="di">
                  <Icon name={DOC_ICON[d.icon]} size={22} />
                </span>
                <span className="dt">{d.title}</span>
                <span className="ds">{d.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'photos' && (
        <div className="feed mtl-scroll">
          <div className="group">
            <div className="date-head">
              <h2>صور تجريبية</h2>
              <span className="cnt">{toArabicNumerals(PHOTO_SEEDS.length)}</span>
              <span className="cnt">· تُضاف صورك بعد الرحلة</span>
            </div>
            <div className="grid d-comfortable">
              {PHOTO_SEEDS.map((s) => {
                const url = `https://picsum.photos/seed/${s}/500/500`
                return (
                  <div key={s} className="tile" onClick={() => setLightbox(`https://picsum.photos/seed/${s}/1200/1600`)}>
                    <div className="media">
                      <img src={url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'library' && (
        <div className="panel mtl-scroll">
          <div className="sec-title">الوثائق</div>
          {TRAVEL_DOCS.map((d) => (
            <button className="lib-row" key={d.id} onClick={() => setDoc(d)}>
              <span className="lib-ic" style={{ background: 'var(--blue-tint)', color: 'var(--blue)' }}>
                <Icon name={DOC_ICON[d.icon]} size={22} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="t">{d.title}</div>
                <div className="s">{d.subtitle}</div>
              </div>
              <Icon name="chevronLeft" size={20} />
            </button>
          ))}
        </div>
      )}

      {Nav}

      {/* document sheet */}
      {doc && (
        <div className="sheet-bg" onClick={() => setDoc(null)}>
          <div className="sheet mtl-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="grab" />
            <h3>{doc.title}</h3>
            <p className="sub">{doc.subtitle}</p>
            {doc.fields?.map((f, i) => (
              <div className="kv" key={i}>
                <span className="k">{f.label}</span>
                <span className="v">{f.value}</span>
              </div>
            ))}
            {doc.lines?.map((l, i) => (
              <div className="line" key={i}>
                {l}
              </div>
            ))}
            {doc.checklist?.map((c, i) => {
              const key = `${doc.id}-${i}`
              const on = checked.has(key)
              return (
                <button
                  key={i}
                  className={`ck ${on ? 'on' : ''}`}
                  onClick={() =>
                    setChecked((s) => {
                      const n = new Set(s)
                      n.has(key) ? n.delete(key) : n.add(key)
                      return n
                    })
                  }
                >
                  <span className="box">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="lbl">{c}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* simple photo lightbox */}
      {lightbox && (
        <div className="pv" onClick={() => setLightbox(null)}>
          <div className="pv-top">
            <button className="selbar-btn" aria-label="إغلاق">
              <Icon name="back" size={24} />
            </button>
          </div>
          <div className="pv-stage">
            <img src={lightbox} alt="" referrerPolicy="no-referrer" style={{ maxHeight: '82dvh', maxWidth: '94vw', objectFit: 'contain', borderRadius: 10 }} />
          </div>
        </div>
      )}
    </div>
  )
}
