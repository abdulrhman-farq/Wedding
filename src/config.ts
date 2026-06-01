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
    /** Global "most-loved moments" leaderboard backed by Supabase. Off by default. */
    supabaseLeaderboard: false,
    /** Gold-sparkle confetti burst on a Love swipe (respects prefers-reduced-motion). */
    confetti: true,
    /** Soft, mutable background music toggle (off by default). */
    backgroundMusic: false,
    /** Light haptics on commit where supported. */
    haptics: true,
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
    table: 'wedding_loves',
  },
} as const

export type Config = typeof config
