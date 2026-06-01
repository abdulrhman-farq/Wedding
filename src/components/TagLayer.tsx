import { useEffect, useRef, useState } from 'react'
import { addTag, fetchTags, removeTag, subscribeTags, type Tag } from '../lib/tags'
import { buzz } from '../lib/haptics'

interface TagLayerProps {
  itemId: string
  /** When true, taps add a new tag and pins show a remove control. */
  active: boolean
}

interface Pending {
  x: number
  y: number
}

export function TagLayer({ itemId, active }: TagLayerProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [pending, setPending] = useState<Pending | null>(null)
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // initial load + live sync
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

  useEffect(() => {
    if (pending) inputRef.current?.focus()
  }, [pending])

  const onLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    setName('')
    setPending({ x, y })
  }

  const commit = async () => {
    if (!pending) return
    const clean = name.trim()
    if (!clean) {
      setPending(null)
      return
    }
    const optimistic: Tag = {
      id: `tmp-${Date.now()}`,
      item_id: itemId,
      x: pending.x,
      y: pending.y,
      name: clean,
    }
    setTags((t) => [...t, optimistic])
    setPending(null)
    setName('')
    buzz(12)
    const saved = await addTag(itemId, optimistic.x, optimistic.y, clean)
    if (saved) {
      setTags((t) => t.map((x) => (x.id === optimistic.id ? saved : x)))
    } else {
      // failed — drop the optimistic pin
      setTags((t) => t.filter((x) => x.id !== optimistic.id))
    }
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
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${tag.x * 100}%`, top: `${tag.y * 100}%` }}
        >
          {/* pin */}
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

      {/* pending tag input */}
      {pending && (
        <div
          className="absolute z-10 -translate-x-1/2"
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
