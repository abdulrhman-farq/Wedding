import { useCallback, useEffect, useState } from 'react'
import type { MediaItem, SwipeDir, SwipeRecord } from '../types'
import { favoritesStore, recordLoveGlobally } from '../lib/favorites'

export interface DeckState {
  /** Index of the current top card (can equal total when finished). */
  cursor: number
  loves: string[]
  supers: string[]
  history: SwipeRecord[]
  isDone: boolean
}

export function useDeck(media: MediaItem[]) {
  const total = media.length
  const [cursor, setCursor] = useState(0)
  const [loves, setLoves] = useState<string[]>(() => favoritesStore.loadLoves())
  const [supers, setSupers] = useState<string[]>(() => favoritesStore.loadSupers())
  const [history, setHistory] = useState<SwipeRecord[]>([])

  useEffect(() => favoritesStore.saveLoves(loves), [loves])
  useEffect(() => favoritesStore.saveSupers(supers), [supers])

  const commit = useCallback(
    (dir: SwipeDir) => {
      const item = media[cursor]
      if (!item) return
      setHistory((h) => [...h, { item, dir }])
      if (dir === 'right') {
        setLoves((l) => (l.includes(item.id) ? l : [...l, item.id]))
        void recordLoveGlobally(item.id, item.name)
      } else if (dir === 'up') {
        setSupers((s) => (s.includes(item.id) ? s : [...s, item.id]))
        setLoves((l) => (l.includes(item.id) ? l : [...l, item.id]))
        void recordLoveGlobally(item.id, item.name)
      }
      setCursor((c) => Math.min(c + 1, total))
    },
    [cursor, media, total],
  )

  const rewind = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h
      const last = h[h.length - 1]
      setCursor((c) => Math.max(c - 1, 0))
      if (last.dir === 'right' || last.dir === 'up') {
        setLoves((l) => l.filter((id) => id !== last.item.id))
      }
      if (last.dir === 'up') {
        setSupers((s) => s.filter((id) => id !== last.item.id))
      }
      return h.slice(0, -1)
    })
  }, [])

  const restart = useCallback(() => {
    setCursor(0)
    setHistory([])
  }, [])

  const clearFavorites = useCallback(() => {
    setLoves([])
    setSupers([])
  }, [])

  return {
    cursor,
    loves,
    supers,
    history,
    isDone: cursor >= total,
    total,
    commit,
    rewind,
    restart,
    clearFavorites,
    canRewind: history.length > 0,
  }
}
