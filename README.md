# النقيدان و المحيسن · Wedding Swipe Deck

A Tinder-style, swipe-through deck of our wedding moments — gold-leaf-on-dark
luxury, bilingual Arabic-first / RTL, mobile-first, installable & offline.

**Couple:** عبدالرحمن & رويدا — families **النقيدان و المحيسن**
**Date / place:** ٢٨–٢٩ مايو ٢٠٢٦ · الرياض (28–29 May 2026, Riyadh)

All 160 moments (5 photos + 155 video clips) are embedded as base64 directly in
the bundle (extracted from the original `wedding-gallery.html`), so the app loads
instantly and works fully offline.

## Features

- **Swipe deck** — drag-follow, ±15° rotation, velocity-based fling, spring-back;
  a stack with cards peeking behind for depth.
  - **Right = ❤ أحب (Love)**, **Left = ✕ تخطّي (Skip)**, **Up = ⭐ مميّز (Super)**.
  - Animated stamps while dragging, gold-sparkle confetti on a Love
    (respects `prefers-reduced-motion`), light haptics on commit.
- **Controls** — Rewind / Skip / Super / Love buttons (≥56px), full keyboard
  support (← skip, → love, ↑ super, Backspace rewind, Space open), slim gold
  progress bar with Arabic-Indic counter.
- **Detail view** — photos pinch / double-tap zoom (high-res); videos play inline
  via Drive preview with an "Open in Drive" fallback.
- **Tag people 🆕** — open any moment, tap **وسم · Tag**, then tap the photo to
  name someone. Names are stored in Supabase and **sync live to every guest**
  (works on photos *and* video posters). Falls back to local-only when Supabase
  isn't configured.
- **End & Favourites** — "you've seen them all" with a loved-count, a favourites
  grid (each opens detail), Save/Download, WhatsApp share, copy link.
- **PWA** — installable, offline, safe-area aware, no horizontal scroll.

## Tech stack

React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · framer-motion +
`@use-gesture/react` (gesture physics) · `vite-plugin-pwa` · Supabase
(`@supabase/supabase-js`) for live tag sync.

> Note: framer-motion is used instead of react-spring because react-spring v9 has
> not yet shipped React 19 JSX types; framer-motion supports React 19 cleanly.

## Run / build

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Configuration

Everything tunable lives in [`src/config.ts`](src/config.ts): couple/event
details, copy, and feature flags (`peopleTagging`, `confetti`, `haptics`,
`backgroundMusic`, `supabaseLeaderboard`).

### Supabase (people-tagging sync)

A dedicated project `naqidan-muhaisen-wedding` is pre-wired via the baked-in
publishable key in `src/config.ts`. To point at a different project, set env vars
(see `.env.example`):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Table `public.wedding_tags` (`id, item_id, x, y, name, created_at`) with RLS:
public **select / insert / delete**, and Realtime enabled for live updates.

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod --yes   # project: naqidan-muhaisen-wedding
```

`vercel.json` already contains the SPA rewrite. If you'd rather use the
dashboard: go to **vercel.com/new**, import this repo, keep the auto-detected
Vite settings (build `npm run build`, output `dist`), and deploy. If you point at
a different Supabase project, add the two `VITE_SUPABASE_*` vars under the
project's Environment Variables.

## Changelog / decisions

- **Data**: extracted the 160-record `FILES` array from `wedding-gallery.html`
  into `src/data/files.json` (≈5 MB base64) and imported it locally for offline
  use. PWA precache limit raised to fit the bundle.
- **`[CONFIRM]` favourites**: local (`localStorage` + in-memory, exportable);
  Supabase "most-loved" leaderboard left behind a flag, off by default.
- **`[CONFIRM]` project slug**: `naqidan-muhaisen-wedding`.
- **Animation lib**: switched react-spring → framer-motion for React 19 type
  compatibility (kept `@use-gesture/react` for the drag/fling physics).
- **People-tagging** (added on request): new Supabase project + `wedding_tags`
  table, live Realtime sync, taggable on all moments.
- **Media refresh** (on request): appended **331 high-res photos** (studio session
  + wedding) from the shared Drive folder after the original 160 moments
  (≈491 total). These stream from Drive's public image URLs
  (`drive.google.com/thumbnail?id=…&sz=w1200/2400`) since embedding hundreds of
  multi-MB photos offline isn't viable — the PWA shell and the original 160 stay
  offline, but the Drive photos need a connection. Image IDs live in
  `src/data/drivePhotos.json`; the folder is shared "anyone with the link."
- **Trade-off**: tag **delete** is open to anyone (a guest can remove a mis-tag).
  Flagged by the Supabase advisor as permissive; acceptable for a shared guest
  experience. Lock it down later by dropping the delete policy (tags become
  permanent) or scoping deletes to recently-created rows.
