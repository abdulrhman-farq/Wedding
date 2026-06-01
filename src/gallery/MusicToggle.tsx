import { useSyncExternalStore } from 'react'
import { config } from '../config'
import { music } from '../lib/audio'
import { Icon } from './Icon'

/** Small floating button to mute/unmute the looping background song. */
export function MusicToggle({ className = '' }: { className?: string }) {
  const playing = useSyncExternalStore(
    (cb) => music.subscribe(cb),
    () => music.isPlaying(),
    () => false,
  )

  if (!config.features.backgroundMusic) return null

  return (
    <button
      onClick={() => void music.toggle()}
      aria-label={playing ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
      aria-pressed={playing}
      className={`grid h-12 w-12 place-items-center rounded-full bg-[var(--m-surface,#1b1610)] text-[var(--m-primary,#cba45a)] shadow-lg ring-1 ring-[var(--m-outline,rgba(201,164,90,.28))] backdrop-blur transition-transform active:scale-90 ${className}`}
    >
      <Icon name={playing ? 'music' : 'musicOff'} size={22} />
    </button>
  )
}
