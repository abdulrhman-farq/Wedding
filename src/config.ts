/**
 * Central configuration for the couple, the event, and feature flags.
 * Everything tunable about the experience lives here.
 */

export const config = {
  couple: {
    groom: { ar: 'عبدالرحمن', en: 'Abdulrhman' },
    bride: { ar: 'رويدا', en: 'Ruwaida' },
    // Family names shown as the brand / title
    families: { ar: 'النقيدان و المحيسن', en: 'Al-Nuqaidan & Al-Muhaisen' },
  },

  event: {
    dateLabel: { ar: '٢٨–٢٩ مايو ٢٠٢٦', en: '28–29 May 2026' },
    place: { ar: 'الرياض', en: 'Riyadh' },
  },

  copy: {
    invite: {
      ar: 'اسحب لتتصفّح ذكرياتنا',
      en: 'Swipe through our memories',
    },
    start: { ar: 'ابدأ', en: 'Start' },
  },

  features: {
    /**
     * Tag people in any moment and sync the names live to every guest
     * (backed by Supabase). On by default.
     */
    peopleTagging: true,
    /** Global "most-loved moments" leaderboard backed by Supabase. Off by default. */
    supabaseLeaderboard: false,
    /** Gold-sparkle confetti burst on a Love swipe (respects prefers-reduced-motion). */
    confetti: true,
    /** Soft, looping background music that starts on the cover's Start tap. */
    backgroundMusic: true,
    /** Light haptics on commit where supported. */
    haptics: true,
  },

  music: {
    src: '/song.mp3',
    volume: 0.55,
  },

  supabase: {
    // Publishable keys are public by design (protected by Row Level Security).
    // Env vars take precedence so the project can be re-pointed without a code change.
    url: import.meta.env.VITE_SUPABASE_URL ?? 'https://nbbfmssnlvgfemdizwxh.supabase.co',
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_79CFOHXx8Wvr6uZzzXyPhw_NNS0yoyT',
    lovesTable: 'wedding_loves',
    tagsTable: 'wedding_tags',
  },
} as const

export type Config = typeof config
