import { useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { config } from '../config'
import { addTag, fetchAllTags, fetchTags, removeTag, subscribeTags, type Tag } from '../lib/tags'
import { buzz } from '../lib/haptics'
import {
  bestMatch,
  detectForItem,
  faceAtPoint,
  warmUpFaceModels,
  type DetectedFace,
  type KnownFace,
} from '../lib/face'

interface TagLayerProps {
  item: MediaItem
  /** When true, taps add a new tag and pins show a remove control. */
  active: boolean
}

interface Pending {
  x: number
  y: number
  descriptor?: number[] | null
}

interface Suggestion {
  cx: number
  cy: number
  name: string
  descriptor: number[]
}

const TAGGED_NEAR = 0.06

export function TagLayer({ item, active }: TagLayerProps) {
  const itemId = item.id
  const [tags, setTags] = useState<Tag[]>([])
  const [pending, setPending] = useState<Pending | null>(null)
  const [name, setName] = useState('')
  const [faces, setFaces] = useState<DetectedFace[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [detecting, setDetecting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // live tags for this moment
  useEffect(() => {
    let alive = true
    void fetchTags(itemId).then((t) => alive && setTags(t))
    const unsub = subscribeTags(itemId, () => {
      void fetchTags(itemId).then((t) => alive && setTags(t))
    })
    return () => {
      alive = false
      unsub()
    }
  }, [itemId])

  // run face detection + name suggestions when tag mode opens
  useEffect(() => {
    if (!active || !config.features.faceSuggestions) return
    let alive = true
    setDetecting(true)
    ;(async () => {
      await warmUpFaceModels()
      const [detected, allTags] = await Promise.all([detectForItem(item), fetchAllTags()])
      if (!alive) return
      setFaces(detected)
      const known: KnownFace[] = allTags
        .filter((t) => Array.isArray(t.descriptor) && t.descriptor!.length > 0)
        .map((t) => ({ name: t.name, descriptor: t.descriptor as number[] }))
      const sugg: Suggestion[] = []
      for (const f of detected) {
        const m = bestMatch(f.descriptor, known)
        if (m) sugg.push({ cx: f.cx, cy: f.cy, name: m.name, descriptor: f.descriptor })
      }
      setSuggestions(sugg)
      setDetecting(false)
    })()
    return () => {
      alive = false
    }
  }, [active, item])

  useEffect(() => {
    if (pending) inputRef.current?.focus()
  }, [pending])

  const alreadyTagged = (x: number, y: number) =>
    tags.some((t) => Math.hypot(t.x - x, t.y - y) < TAGGED_NEAR)

  const visibleSuggestions = suggestions.filter((s) => !alreadyTagged(s.cx, s.cy))

  const onLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    let x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    let y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    // snap to a detected face (and grab its signature) if the tap is on one
    const face = faceAtPoint(faces, x, y)
    if (face) {
      x = face.cx
      y = face.cy
    }
    setName('')
    setPending({ x, y, descriptor: face?.descriptor ?? null })
  }

  const persist = async (x: number, y: number, label: string, descriptor?: number[] | null) => {
    const optimistic: Tag = { id: `tmp-${Date.now()}`, item_id: itemId, x, y, name: label, descriptor }
    setTags((t) => [...t, optimistic])
    buzz(12)
    const saved = await addTag(itemId, x, y, label, descriptor)
    setTags((t) => (saved ? t.map((x) => (x.id === optimistic.id ? saved : x)) : t.filter((x) => x.id !== optimistic.id)))
  }

  const commit = async () => {
    if (!pending) return
    const clean = name.trim()
    const p = pending
    setPending(null)
    setName('')
    if (!clean) return
    await persist(p.x, p.y, clean, p.descriptor)
  }

  const acceptSuggestion = async (s: Suggestion) => {
    setSuggestions((list) => list.filter((x) => x !== s))
    await persist(s.cx, s.cy, s.name, s.descriptor)
  }

  const dismissSuggestion = (s: Suggestion) => {
    setSuggestions((list) => list.filter((x) => x !== s))
  }

  const remove = async (tag: Tag, e: React.MouseEvent) => {
    e.stopPropagation()
    setTags((t) => t.filter((x) => x.id !== tag.id))
    await removeTag(tag)
  }

  return (
    <div
      onClick={onLayerClick}
      className={`absolute inset-0 ${active ? 'cursor-crosshair' : 'pointer-events-none'}`}
    >
      {/* confirmed tags */}
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${tag.x * 100}%`, top: `${tag.y * 100}%` }}
        >
          <div className="relative flex flex-col items-center">
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-[#1a140b] bg-gold-bright shadow-[0_0_10px_rgba(233,212,154,0.8)]" />
            <span className="mt-1 max-w-[40vw] truncate whitespace-nowrap rounded-full bg-black/70 px-2.5 py-0.5 font-ui text-[0.72rem] text-gold-bright ring-1 ring-line backdrop-blur-sm">
              {tag.name}
            </span>
            {active && (
              <button
                type="button"
                aria-label="حذف · Remove"
                onClick={(e) => remove(tag, e)}
                className="pointer-events-auto absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[0.6rem] font-bold text-[#1a140b]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}

      {/* suggested names from face recognition */}
      {active &&
        visibleSuggestions.map((s, idx) => (
          <div
            key={`sg-${idx}`}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.cx * 100}%`, top: `${s.cy * 100}%` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <span className="block h-9 w-9 rounded-full border-2 border-dashed border-gold-bright/90" />
              <div className="mt-1 flex items-center gap-1 rounded-full bg-black/80 py-0.5 ps-2.5 pe-1 ring-1 ring-gold/50 backdrop-blur-sm">
                <span className="max-w-[34vw] truncate font-ui text-[0.72rem] text-gold-bright">
                  {s.name}؟
                </span>
                <button
                  type="button"
                  onClick={() => void acceptSuggestion(s)}
                  aria-label="تأكيد"
                  className="grid h-5 w-5 place-items-center rounded-full bg-gold-bright text-[0.6rem] font-bold text-[#1a140b]"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => dismissSuggestion(s)}
                  aria-label="تجاهل"
                  className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[0.6rem] text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* detecting indicator */}
      {active && detecting && (
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
          <span className="rounded-full bg-black/70 px-3 py-1 font-ui text-[0.7rem] text-gold-bright ring-1 ring-line">
            جاري التعرّف على الوجوه…
          </span>
        </div>
      )}

      {/* manual name input */}
      {pending && (
        <div
          className="absolute z-20 -translate-x-1/2"
          style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mx-auto block h-3.5 w-3.5 rounded-full border-2 border-[#1a140b] bg-gold-bright" />
          <div className="mt-1 flex items-center gap-1 rounded-full bg-black/80 p-1 ring-1 ring-gold/50 backdrop-blur-sm">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void commit()
                if (e.key === 'Escape') setPending(null)
              }}
              maxLength={60}
              placeholder="الاسم · Name"
              className="w-32 bg-transparent px-2 py-0.5 font-ui text-sm text-ink outline-none placeholder:text-muted/70"
            />
            <button
              type="button"
              onClick={() => void commit()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-bright text-[#1a140b]"
              aria-label="حفظ · Save"
            >
              ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
