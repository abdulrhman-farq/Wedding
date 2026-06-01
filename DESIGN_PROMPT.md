# Design Prompt — "النقيدان و المحيسن" Wedding Web App

> Paste this into Claude (Claude Code / Claude.ai) to design and build the full
> website — every screen, every component, every state. Fill any `[…]` you want
> to change; defaults are sensible. Arabic-first, RTL, gold-on-dark luxury.

---

## ROLE

You are a **senior product designer + front-end engineer** who ships
award-quality, 60fps, native-feeling mobile web apps. You have a refined eye for
**luxury Arabic typography**, restraint, and motion. You design the full system
(tokens → components → screens → states), then implement it pixel-faithfully. You
make tasteful decisions and only ask when truly blocked.

## PRODUCT

A delightful, share-worthy **wedding memories web app** for the families
**النقيدان و المحيسن**. The hero experience is a **Tinder-style swipe deck** of
the night's photos and video clips; guests can **love / skip / super** each
moment, **tag people by name** (synced live to everyone), and revisit their
favourites. Bilingual **Arabic-first / RTL**, installable PWA, mobile-first.

- **Couple:** عبدالرحمن & رويدا — Abdulrhman & Ruwaida
- **Families:** النقيدان و المحيسن (Al-Nuqaidan & Al-Muhaisen)
- **Date / place:** ٢٨–٢٩ مايو ٢٠٢٦ · الرياض (28–29 May 2026, Riyadh)
- **Tone:** intimate, elegant, celebratory; gold leaf on deep dark; cinematic.

## BRAND & DESIGN SYSTEM (use exactly)

**Color tokens**
```
--bg:           #100d09   /* near-black warm base            */
--bg2:          #15110b   /* secondary base / image backdrop */
--panel:        #1b1610   /* cards, sheets, controls         */
--ink:          #f3ead7   /* primary text on dark            */
--muted:        #bfae8e   /* secondary text                  */
--gold:         #cba45a   /* primary accent                  */
--gold-bright:  #e9d49a   /* highlights, active accent       */
--gold-deep:    #8c6f3b   /* gradient shadow end             */
--emerald:      #1f5641   /* love / positive                 */
--emerald-bright:#3f8d6c
--rose:         #c98b7a   /* skip / negative                 */
--line:         rgba(201,164,90,.28)  /* hairline borders    */
```
- **Gold-leaf gradient** for display headings:
  `linear-gradient(100deg, gold-deep, gold-bright 45%, #fff8e6 50%, gold-bright 55%, gold-deep)` clipped to text.
- Subtle **film-grain overlay** (fractal-noise SVG, opacity ~0.045, overlay blend) fixed over everything.
- Soft ambient radial glows (emerald top-center, gold top-right) on the base.

**Typography** (Google Fonts)
- **Aref Ruqaa** — display / names / big Arabic headings.
- **Amiri** — Arabic body / captions.
- **Cormorant Garamond** — Latin/English accents (italic for elegance).
- **Tajawal** — UI labels, buttons, numbers (use **Arabic-Indic numerals** ٠١٢٣ for counts).

**Shape & depth**
- Cards: radius `28px`, thin **gold hairline** (`ring-1 ring-gold/40`), soft deep shadow `0 30px 60px -20px rgba(0,0,0,.8)`, bottom gradient scrim for legibility.
- Buttons/controls: pill or circular, `panel/80` + backdrop-blur + `ring-1 ring-line`, gold icon/text; press scale `active:scale-90/95`.
- Touch targets ≥ **56px**. Respect **safe-area insets** (notch / home bar). No horizontal page scroll.

**Motion**
- Spring physics for the deck (drag-follow, ±15° rotation, velocity fling, spring-back).
- Micro-interactions on every tap; gold-sparkle confetti on Love.
- Honor `prefers-reduced-motion` (disable confetti + heavy transitions).

**RTL rule:** mirror all **text and layout**, but keep **gestures universal** —
**right = love, left = skip** physically, even in RTL. Never mirror gesture meaning.

## SCREENS & COMPONENTS (design all, with every state)

### 1. Cover / Landing
- Crest line (uppercase, wide-tracked gold), **بسم الله الرحمن الرحيم**, the
  families' name in gold-leaf Aref Ruqaa, couple names (AR + EN italic),
  date · place, a one-line bilingual invite ("اسحب لتتصفّح ذكرياتنا · Swipe
  through our memories"), and a glowing **"ابدأ · Start"** button.
- Optional falling gold sparkles. Entrance: staggered rise/fade.

### 2. Swipe Deck (core)
- **Card stack**: top card + 2–3 peeking behind (scale `-0.05`/depth, translateY
  `+14px`/depth, slight opacity falloff) for depth.
- **Card**: full-bleed media poster; top-start badge **فيديو · VIDEO / صورة ·
  PHOTO**; top-end counter `٤٢ / ٤٩١`; centered **gold play glyph** for videos;
  bottom scrim with caption **لحظة ٤٢** + `Moment 42 of 491`.
- **Gestures**: drag follows finger, rotates by horizontal offset; next card
  surfaces/scales up. Right = ❤ أحب, Left = ✕ تخطّي, Up = ⭐ مميّز. Fast flick
  past velocity threshold commits with small distance; else springs back.
- **Drag stamps**: ❤ "أحب" (emerald) fades in on right, ✕ "تخطّي" (rose) on left,
  ⭐ "مميّز" (gold) on up — opacity tied to drag distance.
- **Controls row**: Rewind (↩) · Skip (✕) · Super (⭐) · Love (❤), large gold
  circular buttons with press animation + light haptic on commit.
- **Keyboard** (desktop): ← skip, → love, ↑ super, Backspace rewind, Space open.
- **Progress**: slim gold bar + Arabic-Indic `current / total`.
- States: idle, dragging, committing/flying-off, spring-back, empty (→ End).

### 3. Detail / Lightbox (opens on tap)
- Photos: **pinch + double-tap zoom/pan** on high-res; tags scale with zoom.
- Videos: **inline play** (Drive preview) with poster + gold play button;
  "فتح في Drive · Open in Drive" fallback.
- **Tag mode toggle** ("وسم · Tag"): tap the image to drop a pin → inline name
  input (AR placeholder "الاسم · Name") → save. Pins show name labels for
  everyone; remove (✕) in tag mode. Footer hint changes per mode.
- Close (top-start), safe-area aware, dim/blur backdrop.

### 4. End Screen
- "شفت كل اللحظات · You've seen them all," big gold count of loved moments,
  buttons: **عرض المفضّلة (View favourites)**, **مشاركة (Share)**, **إعادة (Restart)**.

### 5. Favourites
- Header (back, title المفضّلة, count). Elegant **3–4 col grid** of loved posters;
  ⭐ marker for supers; ▶ marker for videos; per-tile **Save/Download** affordance.
- Footer: **واتساب · WhatsApp** share + **نسخ الرابط · Copy link** (with "تم النسخ ✓").
- Empty state: graceful bilingual message ("لا توجد لحظات مفضّلة بعد").

### Global / shared
- Top app chrome where relevant, toasts (copied / saved / synced), loading
  shimmers for remote images, offline indicator, install-PWA hint.
- Error/empty/loading state for **every** data-driven surface.

## DATA & BEHAVIOR

- **Deck data**: ~491 moments = 160 embedded (5 photos + 155 video clips, base64,
  offline) + 331 Drive photos (studio + wedding) streamed from public Drive image
  URLs (`drive.google.com/thumbnail?id=…&sz=w1200` card / `w2400` detail,
  `referrerPolicy="no-referrer"`). Only render the top ~3 cards; lazy/eager load
  smartly for 60fps.
- **Favourites**: local (localStorage + in-memory, exportable).
- **People tags**: stored in Supabase (`wedding_tags`: id, item_id, x, y, name,
  created_at; normalized 0..1 coords) with **Realtime** sync to all guests; public
  RLS read/insert/delete; graceful local fallback when offline/unconfigured.
- Centralize couple/event details + feature flags in one `config.ts`.

## TECH

React 19 + Vite + TypeScript + Tailwind v4; **framer-motion** + `@use-gesture/react`
for gesture physics; `vite-plugin-pwa` (installable/offline shell);
`@supabase/supabase-js` for tag sync. Hand-crafted visuals (no UI kit).

## CONSTRAINTS

1. 60fps drag/fling on a mid-range phone (transforms only, no layout thrash).
2. Mobile-first; safe-area insets; no horizontal scroll; fast on 4G.
3. Bilingual AR/EN + correct RTL; gestures stay universal.
4. Keep the gold-on-dark luxury identity and the four specified fonts.
5. Accessibility: focus states, `aria-label`s on icon buttons, reduced-motion,
   sufficient contrast on scrims.

## DELIVERABLES

1. A **design system page** (tokens, type scale, buttons, badges, cards, inputs,
   stamps, pins) — the component library.
2. **Hi-fi designs for all 5 screens** above, each with **default / loading /
   empty / error / active** states, mobile + desktop, **RTL-correct**.
3. A short rationale of key decisions and any trade-offs.
4. (If building) production-ready, typed components matching the system, clean
   `npm run build`.

## WORKING STYLE

State a brief plan + assumptions, then design/build the full system without
waiting unless genuinely blocked. Prioritize typographic elegance, motion
quality, and RTL correctness over feature count. Show the component library
first, then assemble screens from it.
