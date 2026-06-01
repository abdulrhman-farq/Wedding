import { config } from '../config'

/** Light haptic feedback on commit, where supported and enabled. */
export function buzz(pattern: number | number[] = 12): void {
  if (!config.features.haptics) return
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* no-op */
    }
  }
}
