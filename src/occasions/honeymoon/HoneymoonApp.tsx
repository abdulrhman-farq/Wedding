import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../gallery/Icon'
import { toArabicNumerals } from '../../lib/format'
import { TRIP, TRAVEL_DOCS, type TravelDoc } from '../travelData'
import {
  addPhoto,
  listPhotos,
  loadDocOverrides,
  removePhoto,
  saveDoc,
  type DocOverride,
  type OccPhoto,
} from '../../lib/trip'

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

interface HoneymoonAppProps {
  occasionId: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenOccasions: () => void
}

type HTab = 'trip' | 'photos' | 'docs'

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))
}

export function HoneymoonApp({ occasionId, theme, onToggleTheme, onOpenOccasions }: HoneymoonAppProps) {
  const [tab, setTab] = useState<HTab>('trip')
  const [overrides, setOverrides] = useState<Record<string, DocOverride>>({})
  const [photos, setPhotos] = useState<OccPhoto[]>([])
  const [doc, setDoc] = useState<TravelDoc | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<DocOverride>({})
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [lightbox, setLightbox] = useState<OccPhoto | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let alive = true
    void loadDocOverrides(occasionId).then((o) => alive && setOverrides(o))
    void listPhotos(occasionId).then((p) => alive && setPhotos(p))
    return () => {
      alive = false
    }
  }, [occasionId])

  const countdown = daysUntil(TRIP.startISO)

  const merge = (d: TravelDoc): TravelDoc => {
    const o = overrides[d.id]
    if (!o) return d
    return {
      ...d,
      fields: o.fields ?? d.fields,
      lines: o.lines ?? d.lines,
      checklist: o.checklist ?? d.checklist,
    }
  }

  const openDoc = (d: TravelDoc) => {
    setDoc(merge(d))
    setEditing(false)
  }

  const startEdit = () => {
    if (!doc) return
    setDraft({ fields: doc.fields, lines: doc.lines, checklist: doc.checklist })
    setEditing(true)
  }

  const saveEdit = async () => {
    if (!doc) return
    const clean: DocOverride = {
      fields: draft.fields?.filter((f) => f.label.trim() || f.value.trim()),
      lines: draft.lines?.map((l) => l).filter((l) => l.trim()),
      checklist: draft.checklist?.filter((c) => c.trim()),
    }
    setOverrides((o) => ({ ...o, [doc.id]: clean }))
    setDoc(merge({ ...doc, ...clean }))
    setEditing(false)
    await saveDoc(occasionId, doc.id, clean)
  }

  const onPickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const f of Array.from(files)) {
      const saved = await addPhoto(occasionId, f)
      if (saved) setPhotos((p) => [saved, ...p])
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const deletePhoto = async (p: OccPhoto) => {
    setPhotos((list) => list.filter((x) => x.id !== p.id))
    setLightbox(null)
    await removePhoto(p)
  }

  const Header = (
    <header className="hd">
      <div className="searchbar">
        <span className="mi">
          <Icon name="search" size={22} />
        </span>
        <input placeholder="ابحث في الرحلة" />
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
        ['docs', 'الوثائق', 'document'],
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

          <div className="sec-title">المعلومات والوثائق · اضغط للتعديل</div>
          <div className="doc-grid">
            {TRAVEL_DOCS.map((d) => {
              const m = merge(d)
              return (
                <button className="doc-card" key={d.id} onClick={() => openDoc(d)}>
                  <span className="di">
                    <Icon name={DOC_ICON[d.icon]} size={22} />
                  </span>
                  <span className="dt">{m.title}</span>
                  <span className="ds">{m.subtitle}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'photos' && (
        <div className="panel mtl-scroll">
          <button
            className="lib-row"
            onClick={() => fileRef.current?.click()}
            style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 14, marginBottom: 14 }}
          >
            <span className="lib-ic" style={{ background: 'var(--blue-tint)', color: 'var(--blue)' }}>
              <Icon name={uploading ? 'clock' : 'plus'} size={22} />
            </span>
            <div style={{ flex: 1 }}>
              <div className="t">{uploading ? 'جارٍ الرفع…' : 'إضافة صور'}</div>
              <div className="s">من معرض جهازك · تُحفظ وتُشارك</div>
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => void onPickFiles(e.target.files)}
          />

          {photos.length === 0 ? (
            <div className="search-empty">
              <Icon name="photos" size={34} />
              <p>لا توجد صور بعد — أضف صورك من رحلتك.</p>
            </div>
          ) : (
            <div className="grid d-comfortable">
              {photos.map((p) => (
                <div key={p.id} className="tile" onClick={() => setLightbox(p)}>
                  <div className="media">
                    <img src={p.url} alt={p.name ?? ''} loading="lazy" decoding="async" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'docs' && (
        <div className="panel mtl-scroll">
          <div className="sec-title">الوثائق</div>
          {TRAVEL_DOCS.map((d) => {
            const m = merge(d)
            return (
              <button className="lib-row" key={d.id} onClick={() => openDoc(d)}>
                <span className="lib-ic" style={{ background: 'var(--blue-tint)', color: 'var(--blue)' }}>
                  <Icon name={DOC_ICON[d.icon]} size={22} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="t">{m.title}</div>
                  <div className="s">{m.subtitle}</div>
                </div>
                <Icon name="chevronLeft" size={20} />
              </button>
            )
          })}
        </div>
      )}

      {Nav}

      {/* document sheet (view + edit) */}
      {doc && (
        <div className="sheet-bg" onClick={() => setDoc(null)}>
          <div className="sheet mtl-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="grab" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ flex: 1 }}>{doc.title}</h3>
              {editing ? (
                <button className="selall" onClick={() => void saveEdit()} style={{ color: 'var(--blue)', fontWeight: 600 }}>
                  حفظ
                </button>
              ) : (
                <button className="selall" onClick={startEdit} style={{ color: 'var(--blue)', fontWeight: 600 }}>
                  تعديل
                </button>
              )}
            </div>
            <p className="sub">{doc.subtitle}</p>

            {!editing && (
              <>
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
              </>
            )}

            {editing && <DocEditor doc={doc} draft={draft} setDraft={setDraft} />}
          </div>
        </div>
      )}

      {/* photo lightbox */}
      {lightbox && (
        <div className="pv" onClick={() => setLightbox(null)}>
          <div className="pv-top" onClick={(e) => e.stopPropagation()}>
            <button className="selbar-btn" onClick={() => setLightbox(null)} aria-label="إغلاق">
              <Icon name="back" size={24} />
            </button>
            <div style={{ flex: 1 }} />
            <button className="selbar-btn" onClick={() => void deletePhoto(lightbox)} aria-label="حذف">
              <Icon name="close" size={22} />
            </button>
          </div>
          <div className="pv-stage">
            <img src={lightbox.url} alt="" style={{ maxHeight: '82dvh', maxWidth: '94vw', objectFit: 'contain', borderRadius: 10 }} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- inline editor for a document ---------- */
function DocEditor({
  doc,
  draft,
  setDraft,
}: {
  doc: TravelDoc
  draft: DocOverride
  setDraft: (d: DocOverride) => void
}) {
  const inputStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
    border: '1px solid var(--outline)',
    borderRadius: 8,
    padding: '8px 10px',
    color: 'var(--on-surface)',
    fontSize: 14,
    outline: 'none',
    width: '100%',
  }
  const rowBtn: React.CSSProperties = { color: 'var(--on-surface-2)', padding: '0 6px', fontSize: 18 }
  const addBtn: React.CSSProperties = {
    color: 'var(--blue)',
    fontWeight: 600,
    fontSize: 14,
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }

  return (
    <div style={{ paddingTop: 6 }}>
      {doc.fields !== undefined && (
        <>
          {(draft.fields ?? []).map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: '0 0 38%' }}
                value={f.label}
                placeholder="العنوان"
                onChange={(e) => {
                  const next = [...(draft.fields ?? [])]
                  next[i] = { ...next[i], label: e.target.value }
                  setDraft({ ...draft, fields: next })
                }}
              />
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={f.value}
                placeholder="القيمة"
                onChange={(e) => {
                  const next = [...(draft.fields ?? [])]
                  next[i] = { ...next[i], value: e.target.value }
                  setDraft({ ...draft, fields: next })
                }}
              />
              <button style={rowBtn} onClick={() => setDraft({ ...draft, fields: (draft.fields ?? []).filter((_, j) => j !== i) })}>
                ✕
              </button>
            </div>
          ))}
          <button style={addBtn} onClick={() => setDraft({ ...draft, fields: [...(draft.fields ?? []), { label: '', value: '' }] })}>
            <Icon name="plus" size={16} /> إضافة معلومة
          </button>
        </>
      )}

      {doc.lines !== undefined && (
        <>
          {(draft.lines ?? []).map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input
                style={inputStyle}
                value={l}
                placeholder="بند"
                onChange={(e) => {
                  const next = [...(draft.lines ?? [])]
                  next[i] = e.target.value
                  setDraft({ ...draft, lines: next })
                }}
              />
              <button style={rowBtn} onClick={() => setDraft({ ...draft, lines: (draft.lines ?? []).filter((_, j) => j !== i) })}>
                ✕
              </button>
            </div>
          ))}
          <button style={addBtn} onClick={() => setDraft({ ...draft, lines: [...(draft.lines ?? []), ''] })}>
            <Icon name="plus" size={16} /> إضافة بند
          </button>
        </>
      )}

      {doc.checklist !== undefined && (
        <>
          {(draft.checklist ?? []).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input
                style={inputStyle}
                value={c}
                placeholder="عنصر"
                onChange={(e) => {
                  const next = [...(draft.checklist ?? [])]
                  next[i] = e.target.value
                  setDraft({ ...draft, checklist: next })
                }}
              />
              <button style={rowBtn} onClick={() => setDraft({ ...draft, checklist: (draft.checklist ?? []).filter((_, j) => j !== i) })}>
                ✕
              </button>
            </div>
          ))}
          <button style={addBtn} onClick={() => setDraft({ ...draft, checklist: [...(draft.checklist ?? []), ''] })}>
            <Icon name="plus" size={16} /> إضافة عنصر
          </button>
        </>
      )}
    </div>
  )
}
