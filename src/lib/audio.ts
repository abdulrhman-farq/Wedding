import { config } from '../config'

/**
 * A single shared, looping background-music element. Browsers block autoplay
 * with sound until a user gesture, so playback is kicked off from the cover's
 * "Start" tap. A tiny subscribe store keeps toggle buttons in sync.
 */

let el: HTMLAudioElement | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function getEl(): HTMLAudioElement {
  if (!el) {
    el = new Audio(config.music.src)
    el.loop = true
    el.preload = 'auto'
    el.volume = config.music.volume
    el.addEventListener('play', emit)
    el.addEventListener('pause', emit)
  }
  return el
}

export const music = {
  /** Start playback (call from a user gesture). Resolves whether or not it succeeds. */
  async play() {
    if (!config.features.backgroundMusic) return
    try {
      await getEl().play()
    } catch {
      /* autoplay blocked — the toggle button will let the user start it */
      emit()
    }
  },
  pause() {
    getEl().pause()
  },
  async toggle() {
    const a = getEl()
    if (a.paused) {
      try {
        await a.play()
      } catch {
        /* ignore */
      }
    } else {
      a.pause()
    }
  },
  isPlaying() {
    return !!el && !el.paused
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
