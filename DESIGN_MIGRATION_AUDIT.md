# Design Migration Audit — Pre-Implementation Safety Check

**Reference design:** `./butterfly-challenge.html` (3.9 MB, 2898 lines)
**Target codebase:** React 19 + Vite + Tailwind v4 + TypeScript (mostly JSX)
**Scope:** Read-only audit. No files have been modified.

---

## EXECUTIVE SUMMARY — Critical Finding About the Reference File

`butterfly-challenge.html` is **NOT a fresh HTML markup to clone.** It is a self-contained **"runtime skin"**:

- A `<style>` block (lines 1–1486) full of CSS overrides that target the existing JSX-rendered DOM via inline-style attribute selectors (e.g. `section[style*="rgb(210, 245, 231)"]`, `h2[style*="3.2rem"]`).
- A bundled React app embedded as a long line inside `<body>` (line 1498).
- A second `<script>` block (lines 1592–~2897) that runs `MutationObserver`s to **rebuild the hero**, **swap images**, **inject a "Watch the tutorial" button + modal**, **replace the Globe canvas with a cobe WebGL globe**, **swap step images for videos in SignBuilder**, **tag pages with `data-page="story|science|alliance|live"`**, etc.

The migration task is therefore to **bake these overlay changes directly into the JSX components** — not to rewrite the page from a fresh template. All current logic, hooks, and Supabase calls remain valid; what changes is layout, typography, colors, decorative imagery, and a few new behaviours (tutorial modal, cobe globe).

External assets the overlay references and the React project does not yet contain: `gett11.webp`, `gett222.webp`, `gett33.webp`, `gett44.webp`, `dsd.webp`, `allia.webp`, `cer.webp`, `han.webp`, `crecr.webp`, `wcd.webp`, plus step-tutorial videos. These are listed but never imported in `src/constants/index.js`.

---

## 1. PROJECT STRUCTURE MAP

### Entry & root
| File | Purpose |
|---|---|
| [src/main.tsx](src/main.tsx) | Vite entry. Boots Sentry, wraps `<App>` in `ErrorBoundary` + `QueryClientProvider`, mounts Vercel `Analytics`. |
| [src/App.jsx](src/App.jsx) | Top-level app. Holds nearly all global state (auth, UGC recording, popup flags), runs all global Supabase effects (`useEffect` at lines 284–336), routes via `usePathRouter` and lazy-loads pages. |
| [src/index.css](src/index.css) | Imports Tailwind v4 (`@import "tailwindcss"`). Defines only `.skip-to-main`. Everything else is inline styles. |

### Constants / data / utils
| File | Purpose |
|---|---|
| [src/constants/index.js](src/constants/index.js) | Design tokens (`TEAL = "#0A7B77"`, `g` palette, `ff` font), image path constants, shared style objects (`sec`, `wrap`, `label`, `h2s`, `gradH`), `SHOW_APR30_EVENT` feature flag, `HAND_RAISE_BOOST = 350`. |
| [src/data/index.js](src/data/index.js) | Static arrays — `CAPS`, `ROLES`, `ALLIANCES`, `TRUST`, `CRISIS`, `FAQS`, `CDATA` (geo lookup), `SEED` (fake hand-raise feed), `TL_EVENTS`, `HL_CARDS`, `SUPPORT_COUNTRIES`. |
| [src/data/syntheticHands.js](src/data/syntheticHands.js) | Synthetic seed data for leaderboards (referenced by `App.jsx` and `useLiveHands`). |
| [src/utils/track.js](src/utils/track.js) | Mixpanel init + `track()` wrapper. |
| [src/utils/supabase.js](src/utils/supabase.js) | `supabase` client, `getCountryCode`, `getLocationData` (ipinfo.io), `saveHandRaise`, `saveEmail` (calls `send-email` Edge Function). |
| [src/utils/helpers.js](src/utils/helpers.js) | `relT` (relative time), `rLL` (city → lat/lng), `uid`. |
| [src/i18n/index.js](src/i18n/index.js) | i18next init for en/es/fr/ar; `mapCountryToLang`; RTL handling. |
| [src/i18n/locales/{en,es,fr,ar}.json](src/i18n/locales/) | Translation strings. |

### Hooks
| File | Purpose |
|---|---|
| [src/hooks/useToast.js](src/hooks/useToast.js) | Show/auto-hide toast. |
| [src/hooks/useReveal.js](src/hooks/useReveal.js) | `IntersectionObserver`-driven fade-up. |
| [src/hooks/usePathRouter.js](src/hooks/usePathRouter.js) | Tiny client-side router on `window.location.pathname`. |
| [src/hooks/useLiveHands.js](src/hooks/useLiveHands.js) | Loads recent `hand_raises` rows + subscribes to realtime INSERT for the live feed. |

### Pages
| File | Purpose |
|---|---|
| [src/pages/HomePage.jsx](src/pages/HomePage.jsx) | Composes Hero, `HighlightCarousel`, Community, `SignBuilder`, `StepTabs`, `Chain`, optional Event teaser, `LiveFeed`, `FAQ`, CTA. |
| [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) | Story narrative. Hero + 4 image sections + dark "challenge" section + optional `VisualTimeline` + CTA. |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) | Hero stats, 3 image+text sections (brain / hands / scan), pull-quote, disclaimer, CTA. |
| [src/pages/AlliancePage.jsx](src/pages/AlliancePage.jsx) | Hero, Roles grid, Alliances grid, Trust block, dark Culture stats section, Org cards, CTA. |
| [src/pages/LivePage.jsx](src/pages/LivePage.jsx) | Optional event hero + countdown, optional schedule + `TimelineViz`, `LiveFeed`, CTA. |

### Components — **shared / non-UI primitive**
| File | Purpose |
|---|---|
| [src/components/Nav.jsx](src/components/Nav.jsx) | Sticky nav. Logo, route links, Take-the-Challenge CTA, Sign-in/User-menu, Get-Support, Safe-Exit, mobile fullscreen menu. **Touches auth via props (`onSignIn`, `onSignOut`).** |
| [src/components/Footer.jsx](src/components/Footer.jsx) | Multi-column footer; "Many flags. One butterfly." block; socials; legal links; "Get Support Now" button. |
| [src/components/JoinC.jsx](src/components/JoinC.jsx) | 3-step "Join the Challenge" wizard (UI only). |
| [src/components/ShareC.jsx](src/components/ShareC.jsx) | Share grid + caption copy + email reminder input. **Calls `onShare` (saves to Supabase) and `onEmailSubmit`.** |
| [src/components/ReminderC.jsx](src/components/ReminderC.jsx) | Email reminder form. **Calls `onEmailSubmit`.** |
| [src/components/AuthPopup.jsx](src/components/AuthPopup.jsx) | Sign-in/Sign-up popup. **Pure presentational** — Supabase auth lives in `App.jsx`. |
| [src/components/UgcPopup.jsx](src/components/UgcPopup.jsx) | UGC recording flow (mode-select / camera / preview / consent / success). **Receives all camera/recorder refs as props.** |
| [src/components/SupportPanel.jsx](src/components/SupportPanel.jsx) | Crisis lines panel; country select; `findahelpline.com` link. |
| [src/components/SignBuilder.jsx](src/components/SignBuilder.jsx) | 3-step interactive Butterfly Sign tutorial (image only, no video). |
| [src/components/StepTabs.jsx](src/components/StepTabs.jsx) | "How It Works" 3-tab content. UI only; receives `onJoin`. |
| [src/components/Chain.jsx](src/components/Chain.jsx) | "Butterfly effect" interactive growth animation, ends with confetti-style 1B reveal. |
| [src/components/Globe.jsx](src/components/Globe.jsx) | Custom canvas-2D globe with land mask, dot starfield, slerped great-circle arcs. ~330 lines. |
| [src/components/LiveFeed.jsx](src/components/LiveFeed.jsx) | Wraps `Globe` + recent entries column + leaderboard columns (countries/cities/participants). |
| [src/components/CountdownTimer.jsx](src/components/CountdownTimer.jsx) | Counts down to `2026-04-30T19:00:00-04:00`. |
| [src/components/VisualTimeline.jsx](src/components/VisualTimeline.jsx) | Vertical accordion timeline (Apr 30 → Sep). |
| [src/components/TimelineViz.jsx](src/components/TimelineViz.jsx) | Horizontal-card timeline used on LivePage; clicks open popup. |
| [src/components/FAQ.jsx](src/components/FAQ.jsx) | Accordion FAQ; tracks `faq_opened`. |
| [src/components/HighlightCarousel.jsx](src/components/HighlightCarousel.jsx) | Scroll-snap horizontal cards. |
| [src/components/WorkingProgress.jsx](src/components/WorkingProgress.jsx) | "Coming soon" coverall (currently disabled in `App.jsx:633`). |
| [src/components/LanguageSwitcher.jsx](src/components/LanguageSwitcher.jsx) | Language flag dropdown; persists to `localStorage.bc_lang`; tracks `language_changed`. |
| [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) | Reports to Sentry + Mixpanel. |

### Components — **UI primitives** (`src/components/ui/`)
| File | Purpose |
|---|---|
| [src/components/ui/Btn.jsx](src/components/ui/Btn.jsx) | Pill button, primary (TEAL) / secondary (white-bordered). |
| [src/components/ui/Popup.jsx](src/components/ui/Popup.jsx) | Modal w/ focus trap, body-scroll lock, ESC/Tab handling, fade+scale enter. |
| [src/components/ui/Reveal.jsx](src/components/ui/Reveal.jsx) | `useReveal` wrapper with optional delay. |
| [src/components/ui/Toast.jsx](src/components/ui/Toast.jsx) | Bottom-floating toast. |
| [src/components/ui/Link.jsx](src/components/ui/Link.jsx) | Inline link with chevron. |
| [src/components/ui/InstagramIcon.jsx](src/components/ui/InstagramIcon.jsx) / [BF.jsx](src/components/ui/BF.jsx) | SVG icons. |

### Routes / page mapping
- Path-based router via [src/hooks/usePathRouter.js](src/hooks/usePathRouter.js); switch in [src/App.jsx:633-640](src/App.jsx#L633-L640):
  - `/` → `HomePage`
  - `/story` → `StoryPage` *(lazy)*
  - `/science` → `SciencePage` *(lazy)*
  - `/alliance` → `AlliancePage` *(lazy)*
  - `/live` → `LivePage` *(lazy)*

---

## 2. BACKEND & LOGIC INVENTORY — **DO NOT BREAK**

### Supabase calls (all live in `App.jsx` and `utils/supabase.js`, `useLiveHands`)

#### Auth — [src/App.jsx](src/App.jsx)
- L215  `supabase.auth.resetPasswordForEmail(authEmail, { redirectTo: ... })`
- L229  `supabase.auth.signInWithOAuth({ provider: 'google', ... })`
- L251  `supabase.auth.signUp({ email, password, options: { data: { display_name, country_code } } })`
- L261  `supabase.auth.signInWithPassword({ email, password })`
- L277  `supabase.auth.signOut()`
- L292  `supabase.auth.getSession()`
- L302  `supabase.auth.onAuthStateChange(...)` (subscription unsubscribed on cleanup L331)

#### `from(...)` queries — [src/App.jsx](src/App.jsx)
- L96-99   `supabase.from('hand_raises').select('*', { count: 'exact', head: true })` *(handRaisesCount query)*
- L141-145 `supabase.from('challenge_submissions').select(...).eq('is_approved', true).order(...).limit(6)` *(communitySubmissions query)*
- L166-170 `supabase.from('hand_raises').select('created_at').eq('user_id', userId).single()` *(loadUserHandRaiseDate)*
- L184     `supabase.from('profiles').select('country_code').eq('id', user.id).single()` *(backfillCountryCode)*
- L187     `supabase.from('profiles').update({ country_code: cc }).eq('id', user.id)`

#### `from(...)` queries — [src/utils/supabase.js](src/utils/supabase.js)
- L39, L42  `supabase.from('hand_raises').select('id').eq('user_id'|'session_id', ...).single()`
- L45-51    `supabase.from('hand_raises').insert({ session_id, user_id, country_code, city, referred_by })`
- L61-64    `supabase.from('email_reminders').select('id', { count: 'exact', head: true }).eq('email', email)`
- L70       `supabase.from('email_reminders').insert({ email })`

#### `from(...)` queries — [src/hooks/useLiveHands.js](src/hooks/useLiveHands.js)
- L24-29 `supabase.from('hand_raises').select('city, country_code, created_at').order(...).limit(50)`

#### RPC calls
- [src/App.jsx:109-111](src/App.jsx#L109-L111) `supabase.rpc('get_country_leaderboard' | 'get_city_leaderboard' | 'get_top_participants')` — used in `leaderboard` query.
- [src/App.jsx:152](src/App.jsx#L152) `supabase.rpc('get_top_participants')` — `loadTopParticipants`.
- [src/App.jsx:469-475](src/App.jsx#L469-L475) `supabase.rpc('rate_limited_submission', { p_user_id, p_file_url, p_file_type, p_consent, p_display_name })` — UGC upload.
- [src/App.jsx:533-538](src/App.jsx#L533-L538) `supabase.rpc('rate_limited_share', { p_user_id, p_platform, p_display_name, p_avatar_url })` — `saveShareAction`.

#### Storage
- [src/App.jsx:459-461](src/App.jsx#L459-L461) `supabase.storage.from('challenge-submissions').upload(path, recordedBlob)`
- [src/App.jsx:464-466](src/App.jsx#L464-L466) `supabase.storage.from('challenge-submissions').getPublicUrl(path)`

#### Realtime channels — [src/App.jsx:313-328](src/App.jsx#L313-L328) and [src/hooks/useLiveHands.js:36-44](src/hooks/useLiveHands.js#L36-L44)
- `hand_raises_changes` (INSERT on `hand_raises`) → invalidates `leaderboard` + `handRaisesCount` queries.
- `ugc_submissions_changes` (`*` on `challenge_submissions`) → invalidates `communitySubmissions`.
- `hand_raises_feed` (INSERT on `hand_raises`) → prepends row to live feed entries.

#### Edge Function call
- [src/utils/supabase.js:80-84](src/utils/supabase.js#L80-L84) `fetch(${VITE_SUPABASE_URL}/functions/v1/send-email, ...)` with `secret: VITE_FUNCTION_SECRET`.

### Custom hooks (all in [src/hooks/](src/hooks/))
| Hook | Manages |
|---|---|
| `useToast` | Toast string + 2s auto-clear timer. |
| `useReveal` | DOM ref → fade up on intersection. |
| `usePathRouter` | `page` string + `navigate(p)` (uses `history.pushState` + custom `popstate`). |
| `useLiveHands` | Live-feed `entries` array (seed + DB rows + realtime INSERTs). |

### Context providers
- **Only `QueryClientProvider`** ([src/main.tsx:23](src/main.tsx#L23)). No app-level React Context exists; global state is held in `App.jsx` via `useState` and passed down as props.

### Forms + submit handlers
| Form | Submit handler | Validation |
|---|---|---|
| Auth (sign-in / sign-up) — [AuthPopup.jsx](src/components/AuthPopup.jsx) | `handleAuthSubmit` ([App.jsx:240-272](src/App.jsx#L240-L272)) | Email regex, 6+ chars (login) / 8+ chars (register). |
| Password reset — `AuthPopup.jsx` | `handlePasswordReset` ([App.jsx:212-224](src/App.jsx#L212-L224)) | Non-empty email. |
| Email reminder — [ReminderC.jsx](src/components/ReminderC.jsx) | `onEmailSubmit` → `handleEmailSubmit` ([App.jsx:547-559](src/App.jsx#L547-L559)) → `saveEmail` (utils). | Includes `@` and `.`. Server-side cap: `EMAIL_REMINDER_LIMIT = 3`. |
| Share modal email reminder — [ShareC.jsx](src/components/ShareC.jsx) | Same `onEmailSubmit`. | Same. |
| UGC consent + upload — [UgcPopup.jsx](src/components/UgcPopup.jsx) | `handleUgcUpload` ([App.jsx:452-489](src/App.jsx#L452-L489)) | Requires `recordedBlob` + `ugcConsent`; file size ≤ 10 MB ([App.jsx:446](src/App.jsx#L446)). |
| Crisis country select — [SupportPanel.jsx](src/components/SupportPanel.jsx) | None (read-only display). | n/a |
| Hidden file `<input type="file">` — `UgcPopup.jsx` | `handleUgcFileSelect` ([App.jsx:443-450](src/App.jsx#L443-L450)) | 10 MB cap. |

### Effects with side-effects (all in `App.jsx`)
- **L27-42** Auto-detect language from `getLocationData()` if not stored.
- **L284-336** Mount-time effect: read `?ref=`, get session, auth state subscription, two realtime channels, plus `stopCamera` cleanup.
- **L561-563** Tracking effects for share / crisis / reminder modal opens.

### Other side-effecting handlers worth noting
- `handleIDidIt` ([App.jsx:505-528](src/App.jsx#L505-L528)) — fires `confetti`, calls `saveHandRaise`, sets `localStorage.bc_did_it`.
- `startCamera`, `startRecording`, `stopRecording`, `stopCamera`, `startAutoCountdown`, `selectMode` ([App.jsx:347-428](src/App.jsx#L347-L428)) — `MediaRecorder` lifecycle.
- `handleGoogleSignIn`, `handleSignOut` — described above.

---

## 3. STYLING SYSTEM INVENTORY

### Approach
- **Tailwind v4** is installed (`@import "tailwindcss"` in `index.css`) — but **almost never used** in the JSX. Only [src/index.css](src/index.css) defines `.skip-to-main`. All component styling is **inline `style={{...}}` objects**, with shared values pulled from `src/constants/index.js`.
- A **single big inline `<style>` block** lives in [src/App.jsx:567-590](src/App.jsx#L567-L590) defining global keyframes (`fadeUp`, `popIn`, `ping`, `pulse`, `toastIn`), hover utility classes (`.hov-lift`, `.card-btn`), and scrollbar styling (`#32C189` thumb).

### Global CSS / tokens
| Token | Value | Defined |
|---|---|---|
| `TEAL` | `#0A7B77` | [constants/index.js:3](src/constants/index.js#L3) |
| `ff` (font-family) | `system-ui,-apple-system,'Segoe UI',sans-serif` | [constants/index.js:4](src/constants/index.js#L4) |
| `g.bg` | `#f5f5f7` | [constants/index.js:12](src/constants/index.js#L12) |
| `g.t1` (primary text) | `#1d1d1f` | same |
| `g.t2` | `#6e6e73` | same |
| `g.t3` | `#6b6b70` | same |
| `g.t4` | `#7c7c82` | same |
| `g.bdr` (border) | `#d2d2d7` | same |
| `g.link` | `#007D65` | same |
| `sec(bg)` | `padding: "100px 24px"; textAlign:center` | [constants/index.js:67](src/constants/index.js#L67) |
| `wrap` | `maxWidth: 680, margin: "0 auto"` | [constants/index.js:68](src/constants/index.js#L68) |
| `label` | `fontSize:14; fontWeight:400; color:g.t3; marginBottom:6` | [constants/index.js:69](src/constants/index.js#L69) |
| `h2s` | `fontSize: clamp(2rem,5.5vw,3.2rem); fontWeight:600; letterSpacing:-0.04em; lineHeight:1.08; color:g.t1` | [constants/index.js:70](src/constants/index.js#L70) |
| `gradH` | h2s + linear-gradient `#00B18D → #0EA5A0 → #06b6d4 → #2ecc71` | [constants/index.js:71](src/constants/index.js#L71) |

### Animation libraries
- **`canvas-confetti`** — used only in `handleIDidIt`.
- No Framer Motion, no GSAP. All transitions are CSS (`cubic-bezier(.16,1,.3,1)`).

### Fonts
- **Default UI**: `system-ui,-apple-system,'Segoe UI',sans-serif` (`ff`).
- **WorkingProgress only**: imports `JetBrains Mono` from Google Fonts (currently inactive).
- (HTML reference adds `Parkinsans` + `SF Pro` — neither imported in JSX yet.)

### Current color palette extracted from JSX/constants
- Primary teal: `#0A7B77`
- Accent gradient: `#00B18D`, `#0EA5A0`, `#06b6d4`, `#2ecc71`
- Confetti: `#0072BC` `#E8A838` `#32C189` `#FFFFFF` ([App.jsx:522](src/App.jsx#L522))
- Text: `#1d1d1f` (primary), `#6e6e73` / `#6b6b70` / `#7c7c82` (secondary→quaternary)
- Borders: `#d2d2d7` (g.bdr), `#e8e8ed` (cards)
- Backgrounds: `#fff`, `#f5f5f7` (g.bg), `#0D1117` (event teaser dark), `#fafafa`+`#e8e8ed` (Globe gradient)
- Hero gradients: `linear-gradient(180deg, #C3FFEF 0%, #ffffff 30%)` (home), `#E0F7FF→#fff` (science)
- Errors: `#ef4444`
- Highlight card "color" hints (unused for bg currently): `#065f46`, `#0c4a6e`, `#78350f`, `#3b0764`

---

## 4. HTML REFERENCE ANALYSIS — `butterfly-challenge.html`

### File structure
- **Lines 1–9** `<head>` + `<title>` + Parkinsans Google Font preconnect.
- **Lines 10–1486** `<style>` — ~1450 lines of CSS overrides on the JSX-rendered DOM (see component map below).
- **Line 1488** `<body>`.
- **Line 1490–1497** small `<script>` (likely loader).
- **Line 1498** Bundled React app (single very long line).
- **Line 1592 → end** Skin runtime: `MutationObserver`s that set `data-page="..."`, rebuild the hero, replace the Globe with a **cobe** WebGL globe + arcs overlay, swap step images for `<video>`s in SignBuilder, inject "Watch the tutorial" link + modal, set `data-section="culture-dark|evidence"`, swap select images.

### Color palette (extracted from CSS)
- **Text**: `#000000` (forced — replaces the JSX `#06364A`/navy-blue text)
- **Accent teal**: `#0EA5A0` (slightly lighter than current `#0A7B77`)
- **Background neutrals**: `#FFFFFF`, `#f5f5f7`
- **Highlight card 3 bg**: `#DFF9E7` (mint)
- **Highlight card 4 bg**: `#FAF1DA` (cream)
- **"Next step" button**: orange `#FF8B33`
- **Decorative blob colors** (currently inline SVG): `#A6E0C8`, `#FFD9B8`, `#FFE9C7`
- **Pre-replace navy**: `#06364A` / `rgb(6,54,74)` — to be removed.
- **Pre-replace cream**: `rgb(253, 247, 232)` — to be replaced with `#fff` or `#f5f5f7`.

### Typography
- **Body / everything**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", "Helvetica Neue", Helvetica, Arial, sans-serif !important` — overrides JSX inline `Parkinsans`/`ff` everywhere via `body, body *, body button, ...`.
- **Section labels** (was 14px / 400): **24px / 600 / `#000`** desktop, 18px mobile.
- **Section h2** (was `clamp(2rem, 5.5vw, 3.2rem)`): bumped to `clamp(2rem, 5.5vw, 4.2rem)`.
- **"60 seconds" CTA h2** (was `clamp(2rem, 6vw, 3.4rem)`): bumped to `clamp(2rem, 5.5vw, 4.2rem)`.
- **Description paragraphs**: 19px desktop unchanged; 14px on mobile.
- **Story/Science/Alliance/Live page hero h1**: bumped to `clamp(3.4rem, 7vw, 6.2rem)`.
- **Story page hero sub**: 28px desktop / 20px mobile (was 20px).
- **FAQ heading**: bumped to `clamp(2rem, 5.5vw, 4.2rem)`. FAQ question button 20px / 22px padding. Answer 17px, left-aligned.

### Layout structure per section (mapping done in §5)
- **Hero (`HomePage`)** — fully **rebuilt at runtime** (not just restyled). The skin replaces the React-rendered hero with a custom layout: pill / h1 / sub / action button / hero image / counter, each a separate fade-up step.
- **Highlights carousel** — bigger cards (1200×680), card 1 is full-bg image with white text, cards 2–4 are 2-column grids (image + text), card 3 is mirrored (text left, image right). Mobile reverts to single-column stacked layout, cards 2 and 4 flip image-bottom/text-top.
- **Sign Builder** — bigger card (max-width 1196px), image fills right half full-height, video-swap support per step, completed-state spans bigger.
- **How It Works (StepTabs)** — 2-column desktop grid (image left full-height, content right), pill-shaped tab bar on top spanning both columns, "Watch the tutorial" link injected below section description, "Next step" button orange `#FF8B33`.
- **Butterfly Effect (Chain section)** — `padding: 250px 24px`, decorative `crecr.webp` injected behind the card, Chain card light-gray (`#f5f5f7`), 300px tall, vertically centered content.
- **Live (Globe section)** — `padding: 250px 24px`, original canvas Globe hidden and replaced with a **cobe WebGL globe** (`[data-globe-cobe="1"]`, max 520px desktop / 320px mobile), wider container (1080px), bigger cities-list text (16px / 13px).
- **FAQ** — `padding: 0 0 250px 0`; full-bleed `cer.webp` injected at top; container widened to 800px; heading bigger; left-aligned answers.
- **Footer** — light-gray `#f5f5f7` (was cream); 4th column ("Foundation") hidden so the grid becomes 4 columns.
- **Story page** — hero gradient removed; min-height 50dvh; bigger h1/sub. Origin image full-bleed. CTA section uses full-width `han.webp` at top via `data-story-cta="1"`.
- **Science page** — hero gradient removed; brain section becomes 2-column (image left); evidence section becomes 2-column (text left, image right); stat-card subtext 14px.
- **Alliance page** — hero gradient removed; full-width `allia.webp` pinned to top via `data-alliance-top="1"`; dark "culture" section gets `data-section="culture-dark"` and forces all text white.
- **Live page** — hero replaced with full-cover `dsd.webp` background, all text white. CTA pattern matches Story (`data-live-cta="1"` + full-bleed `han.webp`).

### Animation/transition styles
- `heroFadeUp` 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) staggered 0.05s/0.15s/0.25s/0.35s/0.4s/0.55s.
- Tab transitions `.25s cubic-bezier(0.4, 0, 0.2, 1)` (background + color only).
- Tutorial modal fade `0.25s`.
- All others reuse the existing `fadeUp`, `ping`, `popIn` keyframes already in `App.jsx`.

### Component patterns introduced by the skin
1. **Pill-shaped tab bars** (StepTabs) with `border-radius: 999px`, padding `6px`, gap `6px`.
2. **2-column section grids** with image on one side, text on the other (Brain, Evidence, Highlights cards 2/3/4, StepTabs).
3. **Full-bleed top images** (`width: 100vw; margin-left/right: calc(50% - 50vw)`) used across Story origin, Story CTA, Live CTA, FAQ top, Alliance top.
4. **Tagged section attributes** for stable selectors (`data-page="..."`, `data-section="..."`, `data-be-bg`, `data-faq-top`, `data-watch-tutorial`, etc.).
5. **Tutorial video modal** — generic full-screen modal with close button, opened from the "Watch the tutorial" link.
6. **cobe WebGL globe** (`https://github.com/shuding/cobe`) replacing the custom 2D canvas globe.
7. **Per-step videos** in SignBuilder swapped in for the active step (`data-sb-video`, `data-sb-active`).

### Section list (per skin)
| # | Skin section name | Selector hint |
|---|---|---|
| 1 | Hero — Lift a billion hands | `section[data-hero-rebuilt="1"]` |
| 2 | Highlights "Get the highlights." | `section[style*="rgb(210, 245, 231)"]` |
| 3 | Community / "Add your story" | (untagged in skin — minor styling only) |
| 4 | The Butterfly Sign | `section[style*="rgb(253, 247, 232)"]` (precedes `#how-it-works`) |
| 5 | How It Works | `section#how-it-works` |
| 6 | The Butterfly Effect (Chain) | `section:has(> div > div[style*="max-width: 420px"])` |
| 7 | Event teaser | (skin doesn't restyle — currently `SHOW_APR30_EVENT=false`) |
| 8 | Live (Globe + leaderboard) | `section:has(canvas[style*="aspect-ratio"])` |
| 9 | FAQ "Questions." | `section#faq` |
| 10 | "60 seconds." CTA | `h2[style*="3.4rem"]` parent section |
| 11 | One humanity / many flags | `section:has(img[alt*="national flag"])` |
| 12 | Footer | `footer[style*="rgb(253, 247, 232)"]` |
| 13 | Story hero | `section[data-page="story"]` |
| 14 | Story Origin | `section:has(img[alt*="Lucina Artigas"])` |
| 15 | Story Spread | `img[alt*="butterfly hug spreading globally"]` |
| 16 | Story Tipping | `img[alt*="butterfly hug demonstrated on a global stage"]` |
| 17 | Story Challenge (dark) | (existing dark section — minor) |
| 18 | Story Timeline | `h2[style*="2.4rem"]` |
| 19 | Story CTA | `section[data-story-cta="1"]` |
| 20 | Science hero + stats | `section[data-page="science"]` |
| 21 | Science Brain (Clinical Foundation) | `section:has(img[alt*="butterfly hug gesture with calming ripples"])` |
| 22 | Science How Brain Works | `section:has(img[alt*="Brain hemispheres"])` |
| 23 | Science Evidence | `section:has(img[alt*="Brain scan showing prefrontal cortex activation"])` / `[data-section="evidence"]` |
| 24 | Alliance hero | `section[data-page="alliance"]` + `[data-alliance-top="1"]` |
| 25 | Alliance Culture (dark) | `section[data-section="culture-dark"]` |
| 26 | Live hero | `section[data-page="live"]` |
| 27 | Live CTA | `section[data-live-cta="1"]` |

### Image assets the skin references that don't yet exist in the project
`gett11.webp`, `gett222.webp`, `gett33.webp`, `gett44.webp`, `dsd.webp`, `allia.webp`, `cer.webp`, `han.webp`, `crecr.webp`, `wcd.webp` — plus per-step videos for SignBuilder. None referenced in [src/constants/index.js](src/constants/index.js).

---

## 5. COMPONENT-TO-HTML MAPPING

| JSX (file) | Skin section | Mapping kind |
|---|---|---|
| [src/components/Nav.jsx](src/components/Nav.jsx) | (no targeted overrides) | **Preserve as-is** (only inherits the global `font-family: SF Pro` + `color:#000` rules) |
| [src/components/Footer.jsx](src/components/Footer.jsx) | "Footer" (line 512) | Restyle: bg `#f5f5f7`, drop the 4th grid column |
| [src/pages/HomePage.jsx](src/pages/HomePage.jsx) — Hero | "Hero — Lift a billion hands" | **REBUILD** — currently a single image+headline; skin rebuilds with pill / h1 / sub / action / image / counter |
| [src/components/HighlightCarousel.jsx](src/components/HighlightCarousel.jsx) | "Get the highlights." | Layout overhaul: card1 full-bg image, cards 2–4 two-column grid (img+text), card 3 mirrored, mobile single-column |
| [src/pages/HomePage.jsx](src/pages/HomePage.jsx) — Community section | (untagged) | **Preserve as-is**; only typography updates |
| [src/components/SignBuilder.jsx](src/components/SignBuilder.jsx) | "The Butterfly Sign" | Layout overhaul: 1196px max-width card; image right half full-height; per-step videos swap; bigger completed-spans |
| [src/components/StepTabs.jsx](src/components/StepTabs.jsx) | "How It Works" | Layout overhaul: 2-column grid + pill tab-bar + "Watch tutorial" link injection + orange "Next step" button |
| [src/components/Chain.jsx](src/components/Chain.jsx) | "The Butterfly Effect" | Restyle: light-gray `#f5f5f7` card; fixed 300px height; centered content. Decorative `crecr.webp` is layout-level, not Chain itself. |
| [src/components/CountdownTimer.jsx](src/components/CountdownTimer.jsx) | (skin doesn't restyle; gated by `SHOW_APR30_EVENT=false`) | **Preserve as-is** |
| [src/components/LiveFeed.jsx](src/components/LiveFeed.jsx) + [Globe.jsx](src/components/Globe.jsx) | "Live" | Big restyle + Globe **replaced by cobe**: new wrapper element, original canvas hidden |
| [src/components/FAQ.jsx](src/components/FAQ.jsx) + HomePage `#faq` section | "Questions." | Restyle + full-bleed `cer.webp` at top + bigger heading/Q/A + left-aligned answers |
| [src/pages/HomePage.jsx](src/pages/HomePage.jsx) — final CTA | "60 seconds." | Restyle: bigger h2 |
| [src/components/Footer.jsx](src/components/Footer.jsx) — flags block | "Many flags. One butterfly." | Restyle: section bg `#f5f5f7`, bigger flags image |
| [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) — hero | "Story hero" | Strip gradient; 50dvh; bigger h1/sub |
| [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) — Origin/Spread/Tipping | Story Origin/Spread/Tipping | Full-bleed images; remove border-radius |
| [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) — CTA | "Story CTA" | Full-bleed `han.webp` at top via `data-story-cta="1"` |
| [src/components/VisualTimeline.jsx](src/components/VisualTimeline.jsx) | "Story Timeline" | Heading-size bump only (gated by `SHOW_APR30_EVENT`) |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) — hero | "Science hero" | Strip gradient; 70dvh; bigger h1; stat-cards subtext 14px |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) — Brain | "Clinical Foundation" + "How Brain Works" | Full-bleed image; 2-column grid |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) — EMDR/Hands | (no specific override) | Restyle only |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) — Brain scan / "Evidence" | "Evidence" section | 2-column mirrored grid (text left, image right) |
| [src/pages/AlliancePage.jsx](src/pages/AlliancePage.jsx) — hero | "Alliance hero" | Strip gradient; full-bleed `allia.webp` at top via `data-alliance-top="1"` |
| [src/pages/AlliancePage.jsx](src/pages/AlliancePage.jsx) — Culture dark | "Built by people who've moved culture" | Tag with `data-section="culture-dark"` and force white text |
| [src/pages/LivePage.jsx](src/pages/LivePage.jsx) — hero | "Live hero" | Replace gradient with `dsd.webp` cover; force white text |
| [src/pages/LivePage.jsx](src/pages/LivePage.jsx) — CTA | "Live CTA" | Full-bleed `han.webp` at top via `data-live-cta="1"` |
| [src/components/TimelineViz.jsx](src/components/TimelineViz.jsx) | (no override; gated by `SHOW_APR30_EVENT`) | **Preserve** |

### Components with NO HTML/skin counterpart (preserve as-is)
- [src/components/AuthPopup.jsx](src/components/AuthPopup.jsx)
- [src/components/UgcPopup.jsx](src/components/UgcPopup.jsx)
- [src/components/JoinC.jsx](src/components/JoinC.jsx)
- [src/components/ShareC.jsx](src/components/ShareC.jsx)
- [src/components/ReminderC.jsx](src/components/ReminderC.jsx)
- [src/components/SupportPanel.jsx](src/components/SupportPanel.jsx)
- [src/components/LanguageSwitcher.jsx](src/components/LanguageSwitcher.jsx)
- [src/components/WorkingProgress.jsx](src/components/WorkingProgress.jsx)
- [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx)
- [src/components/CountdownTimer.jsx](src/components/CountdownTimer.jsx)
- [src/components/TimelineViz.jsx](src/components/TimelineViz.jsx)
- [src/components/VisualTimeline.jsx](src/components/VisualTimeline.jsx) (heading bump only)
- [src/components/ui/](src/components/ui/) (`Btn`, `Popup`, `Reveal`, `Toast`, `Link`, `InstagramIcon`, `BF`)

### Skin features with NO existing JSX counterpart (must be ADDED)
1. **"Watch the tutorial" link + modal** in How It Works section.
2. **cobe WebGL globe** replacement for `Globe.jsx` (or keep `Globe.jsx` and add a feature flag).
3. **Per-step videos in SignBuilder** (currently only static images).
4. **Decorative full-bleed background images** (`crecr.webp`, `cer.webp`, `han.webp`, `allia.webp`, `dsd.webp`).
5. **Image swaps**: card backgrounds (`gett11/22/33/44.webp`), `wcd.webp` for "People doing the Butterfly Sign".
6. **Tagging utility** to attach `data-page`/`data-section` (or — better — pass them as props from pages).

---

## 6. RISK ASSESSMENT

| Component | Risk | Reason | Safe to change |
|---|---|---|---|
| [src/App.jsx](src/App.jsx) | **HIGH** | Holds all global state, every Supabase call, all auth + UGC + realtime subscriptions, route switch. Lines L93-148 (queries), L284-336 (effects), L240-272 (auth submit), L452-489 (UGC upload), L505-528 (handIDidIt) must not change. | Only the inline `<style>` block (L567-590) and the JSX tree (Nav/Footer/sections) — touching only inline `style`/className. Do **not** edit any handler. |
| [src/components/Nav.jsx](src/components/Nav.jsx) | **MEDIUM** | All UI, but receives `currentUser`, `onSignIn`, `onSignOut` and renders them. | Restyle wrapper / className freely. Do **not** touch the auth render branches (L58-77, L84-102, L150-165) or `LanguageSwitcher` integration. |
| [src/components/Footer.jsx](src/components/Footer.jsx) | LOW | Pure presentational. | Free redesign. |
| [src/components/AuthPopup.jsx](src/components/AuthPopup.jsx) | **MEDIUM** | All state lives in App.jsx; this is a controlled form. | Restyle freely — but **do not** add/rename props or reorder onClick handlers. |
| [src/components/UgcPopup.jsx](src/components/UgcPopup.jsx) | **HIGH** | Camera + MediaRecorder lifecycle. `liveVideoRef` is wired into `cameraStreamRef`/`MediaRecorder` in App.jsx. | Restyle the inner step UIs. **Do not** alter `<video ref={liveVideoRef} ...>` (L35), `onSelectMode` invocations, or the file `<input>` `onChange={onFileSelect}` (L26, L68). Don't rename `recordingStep` enum values. |
| [src/components/JoinC.jsx](src/components/JoinC.jsx) | LOW | UI wizard. | Free redesign. |
| [src/components/ShareC.jsx](src/components/ShareC.jsx) | LOW | Buttons only call `window.open` and `cp(...)`/`onShare(platform)`. Email submit is a sub-form. | Free redesign — but keep the `'copy'/'twitter'/'whatsapp'/'telegram'/'facebook'/'email'` strings sent to `onShare` (used as Mixpanel `share_completed.platform` and `rate_limited_share.p_platform`). |
| [src/components/ReminderC.jsx](src/components/ReminderC.jsx) | LOW | One controlled email field calling `onEmailSubmit`. | Free redesign. |
| [src/components/SupportPanel.jsx](src/components/SupportPanel.jsx) | LOW | Static content + crisis-line links. | Free redesign. |
| [src/components/SignBuilder.jsx](src/components/SignBuilder.jsx) | LOW–MEDIUM | All in-component state. To support per-step videos the skin uses a JS-injected `<video>`; the safer JSX way is to add a `videoSrc` per step and render `<video>` natively. | Free redesign of layout. Adding video means new constants (no backend impact). |
| [src/components/StepTabs.jsx](src/components/StepTabs.jsx) | LOW | Local state only. | Free redesign. Adding the "Watch tutorial" link → introduce a small modal (or reuse `Popup`). |
| [src/components/Chain.jsx](src/components/Chain.jsx) | LOW | Local state + setTimeouts. | Free redesign of card. |
| [src/components/Globe.jsx](src/components/Globe.jsx) | **MEDIUM** | If we replace it with cobe, we depend on `entries` data shape `{lat, lng, id, country, city, createdAt}` from `useLiveHands`. The replacement must preserve the same prop interface. | Internal canvas logic can be replaced wholesale, but **keep the `{ entries }` prop contract**. If we keep current `Globe.jsx` and add a flag, low risk. |
| [src/components/LiveFeed.jsx](src/components/LiveFeed.jsx) | LOW | Pure presentational; reads `entries`, `handCount`, `leaderboardData`. | Free redesign of layout/typography. |
| [src/components/FAQ.jsx](src/components/FAQ.jsx) | LOW | Local accordion state; calls `track('faq_opened', ...)`. | Free redesign — keep `track('faq_opened', { question })` call. |
| [src/components/HighlightCarousel.jsx](src/components/HighlightCarousel.jsx) | LOW | Local scroll-state. | Free redesign — but card data (`HL_CARDS`) and i18n keys `highlights.cardN.title/sub` are existing contracts. |
| [src/components/CountdownTimer.jsx](src/components/CountdownTimer.jsx) | LOW | Self-contained timer. | Preserve. |
| [src/components/VisualTimeline.jsx](src/components/VisualTimeline.jsx) / [TimelineViz.jsx](src/components/TimelineViz.jsx) | LOW | Local state; hidden when `SHOW_APR30_EVENT=false`. | Heading bump only required. |
| [src/pages/HomePage.jsx](src/pages/HomePage.jsx) | **MEDIUM** | Hero rebuild + many sections. Holds the `data-section`/`data-page` tags we need to add at the page level (not as a runtime mutation). | Restyle freely; **preserve all `onJoin`/`onShare`/`onRemind`/`onDidIt`/`onUgcOpen` invocations** and the `SHOW_APR30_EVENT` gate. |
| [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) | LOW | Static content + `navigate`. | Add `data-page="story"` on hero `<section>`; restyle layouts. |
| [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) | LOW | Static content. | Add `data-page="science"`, `data-section="evidence"`; restyle. |
| [src/pages/AlliancePage.jsx](src/pages/AlliancePage.jsx) | LOW | Calls `setRP`/`setAP`/`onTrust`/`navigate` (passed-in callbacks). | Add `data-page="alliance"`, `data-section="culture-dark"`; full-bleed `allia.webp`. |
| [src/pages/LivePage.jsx](src/pages/LivePage.jsx) | LOW | Static + `setTlPopup`/`onShare`. | Add `data-page="live"` and `data-live-cta="1"`. |
| [src/components/ui/Btn.jsx](src/components/ui/Btn.jsx) / [Popup.jsx](src/components/ui/Popup.jsx) / [Reveal.jsx](src/components/ui/Reveal.jsx) / [Toast.jsx](src/components/ui/Toast.jsx) / [Link.jsx](src/components/ui/Link.jsx) | LOW | Primitives. | Free; changes propagate everywhere — verify visually. |
| [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) / [WorkingProgress.jsx](src/components/WorkingProgress.jsx) / [LanguageSwitcher.jsx](src/components/LanguageSwitcher.jsx) | LOW | No skin overrides target them. | Preserve. |

---

## 7. MIGRATION PLAN — Prioritized (Read-Only; Implementation Pending)

### Tier 1 — Foundation (no logic touched)
1. **Tokens & globals** in [src/constants/index.js](src/constants/index.js):
   - Update `ff` to `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`.
   - Optionally introduce a new dark-text token `g.t1 = "#000000"` (or keep `#1d1d1f` and override per-section).
   - Bump `h2s` clamp upper bound from `3.2rem` → `4.2rem`.
   - Bump `label` to `fontSize: 24, fontWeight: 600, color: "#000"` (with mobile media-query override; consider a small CSS rule in [src/index.css](src/index.css) for the mobile breakpoint).
2. **Asset constants** — add new `webp` paths to [src/constants/index.js](src/constants/index.js) once the assets are dropped into `public/` (`gett11/22/33/44`, `dsd`, `allia`, `cer`, `han`, `crecr`, `wcd`, plus step videos).
3. **Page-level tagging** — replace skin's runtime `data-page="..."` injection with literal `data-page` attributes on hero `<section>`s in StoryPage / SciencePage / AlliancePage / LivePage. Same for `data-section="culture-dark"` and `data-section="evidence"`.

### Tier 2 — Pure-UI redesigns (safe to change freely)
- [src/components/Footer.jsx](src/components/Footer.jsx) — bg `#f5f5f7`, drop "Foundation" column, restyle.
- [src/components/HighlightCarousel.jsx](src/components/HighlightCarousel.jsx) — card 1 full-bg, cards 2–4 2-column grid, card 3 mirrored, mobile stacking.
- [src/components/Chain.jsx](src/components/Chain.jsx) — light-gray card, 300px tall, vertical centering. Add decorative `crecr.webp` at the section level (in [HomePage.jsx](src/pages/HomePage.jsx)).
- [src/components/FAQ.jsx](src/components/FAQ.jsx) — bigger Q/A typography; left-aligned answers; container widening done in [HomePage.jsx](src/pages/HomePage.jsx) where `<FAQ/>` is rendered. Add full-bleed `cer.webp` at top of the FAQ section in HomePage.
- [src/components/HighlightCarousel.jsx](src/components/HighlightCarousel.jsx) heading typography.
- [src/components/CountdownTimer.jsx](src/components/CountdownTimer.jsx) / [VisualTimeline.jsx](src/components/VisualTimeline.jsx) / [TimelineViz.jsx](src/components/TimelineViz.jsx) — heading bumps only; gated.
- [src/pages/StoryPage.jsx](src/pages/StoryPage.jsx) — strip gradient, bigger h1/sub, full-bleed Origin image, `data-story-cta="1"` + `han.webp`.
- [src/pages/SciencePage.jsx](src/pages/SciencePage.jsx) — strip gradient, 2-column Brain & Evidence, stat-card subtext bump.
- [src/pages/AlliancePage.jsx](src/pages/AlliancePage.jsx) — strip gradient, full-bleed `allia.webp`, tag `data-section="culture-dark"`.
- [src/pages/LivePage.jsx](src/pages/LivePage.jsx) — `dsd.webp` hero, white text, `data-live-cta="1"`.

### Tier 3 — Mixed (keep inner logic; redesign wrapper only)
- [src/components/Nav.jsx](src/components/Nav.jsx) — restyle wrappers; preserve auth branches L58-77, L84-102, L150-165.
- [src/components/SignBuilder.jsx](src/components/SignBuilder.jsx) — new layout (1196px, image right half full-height). Adding per-step `videoSrc` is a small additive change; keep `useState` step machine intact.
- [src/components/StepTabs.jsx](src/components/StepTabs.jsx) — pill tab bar, 2-column grid layout, orange "Next step" button. Add a "Watch tutorial" Btn that opens a `Popup` containing the tutorial video.
- [src/components/LiveFeed.jsx](src/components/LiveFeed.jsx) — restyle layout/typography; keep `entries`, `handCount`, `leaderboardData`, `onShare` props intact.
- [src/pages/HomePage.jsx](src/pages/HomePage.jsx) — **rebuild Hero** as: pill / h1 / sub / action `<Btn>` / hero image / counter pill. Preserve `onJoin`, `onDidIt`, `showPlusOne`, the `aria-live` region, and `confetti` trigger via `onDidIt`. Keep `SHOW_APR30_EVENT` gate.

### Tier 4 — High-risk surgical changes
- [src/App.jsx](src/App.jsx):
  - **Touch only L566-590** (the inline `<style>` block) and the JSX tree at L592-650 (Toast, Popups, `<Nav>`, page switch, `<Footer>`, bottom support bar).
  - Preserve all of L24-563 (state, queries, effects, handlers).
  - The fixed bottom support bar at L644-649 is **not** in the skin → keep as is unless explicit guidance.
- [src/components/AuthPopup.jsx](src/components/AuthPopup.jsx) / [UgcPopup.jsx](src/components/UgcPopup.jsx) — restyle within current prop contract; UGC is **highest-risk** because of camera/recorder ref wiring (App.jsx ↔ Popup). Do not change `liveVideoRef` JSX, the `onSelectMode`/`onFileSelect`/`onUpload` invocations, or the `recordingStep` enum (`'mode-select' | 'camera' | 'preview' | 'consent' | 'success'`).
- [src/components/Globe.jsx](src/components/Globe.jsx) — if migrating to cobe, do it as a new `<CobeGlobe>` and toggle via a flag. Either way, **preserve `{ entries }` prop shape**: `{ id, country, city, lat, lng, createdAt }`.

### Lines to be especially careful with (don't touch in a styling pass)
- [src/App.jsx:93-148](src/App.jsx#L93-L148) — `useQuery` queries.
- [src/App.jsx:284-336](src/App.jsx#L284-L336) — auth + realtime mount effect.
- [src/App.jsx:212-272](src/App.jsx#L212-L272) — auth submit/reset/Google sign-in.
- [src/App.jsx:452-489](src/App.jsx#L452-L489) — UGC upload (Storage + RPC).
- [src/App.jsx:505-545](src/App.jsx#L505-L545) — `handleIDidIt`, `saveShareAction`.
- [src/utils/supabase.js](src/utils/supabase.js) — entire file (DB schema awareness).
- [src/hooks/useLiveHands.js](src/hooks/useLiveHands.js) — DB query + realtime channel.

---

## 8. ADDENDUM — Full extraction of the JS skin layer

The first pass under-specified what `MutationObserver`s in the skin do at runtime. The full trace, line-referenced to `butterfly-challenge.html`:

### 8.1 Hero — exact rebuilt structure (lines 1592–1782)
The skin **deletes** the React-rendered hero `innerHTML` and replaces it. New structure:

| Element | Inline values |
|---|---|
| `<section>` | `position:relative; min-height:90dvh; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; text-align:center; background:#fff; padding-top:72px; padding-bottom:48px;` |
| Pill | `<span data-hero-pill>` text **"Global Mental Health Movement"** (28px, 600, color `rgb(81,81,81)`, padding `8px 18px`, radius 999) |
| H1 | `<h1 data-hero-h1>` text **"Lift a billion hands."** — `font-size: 6.5rem; font-weight: 550; line-height: 1; letter-spacing: -0.055em; color: #000; margin: 6px 0 22px` |
| Sub line 1 | `<p data-hero-sub>` **"A 60-second gesture for mental health."** — `clamp(18px,1.5vw,22px); color: rgb(134,134,139); 500; line-height:1.4` |
| Sub line 2 | `<p data-hero-sub>` **"Feel it. Do it. Share it."** — same size, `color:#000; 600` |
| Action button | `<button data-hero-action="join">` text **"Join the Challenge"** — orange `rgb(255,139,51)`, white text, 17px, padding `15px 32px`, radius 980 |
| Counter pill | `<span data-hero-counter>` **"365 hands raised"** — **hardcoded literal**, with orange `7px` dot. Padding `7px 16px`, color `#000`, 14px / 600 |
| Image | `<picture>` with mobile `<source srcset="cer.webp">` and desktop `<img src="exw.webp" alt="People making the Butterfly Sign">` (`width:100%; margin-top:-50px`) |

**Critical behavioural change:** the rebuilt hero contains **only one button**. The "I did it" button is **dropped**. The skin's button-handler code references `action === 'didit'` but no element has that attribute. So `handleIDidIt` (with `confetti` + `saveHandRaise` + ref tracking + `bc_did_it` localStorage) **no longer fires from the hero.** It's still bound to `onDidIt` in the JSX but the new hero has no UI to call it.

**Decision required:** keep `onDidIt` somewhere else (e.g., as a secondary nav button or in StepTabs), or accept losing the celebration flow.

The skin **steals the React `onClick` closure** off the original button via the `__reactProps$` fiber (lines 1660-1682) so the JSX-level `onJoin` still fires. When migrating natively this isn't needed — wire `onJoin` directly.

The hardcoded copy ("Global Mental Health Movement", "Lift a billion hands.", "A 60-second gesture…", "Feel it. Do it. Share it.", "365 hands raised", "Join the Challenge") **does not pass through i18n**. Migrating natively, decide whether to add new i18n keys or accept hardcoded English. The handCount value (`365`) is also hardcoded — to keep the live count, the migration must wire `handCount + HAND_RAISE_BOOST` (currently passed to `<HomePage>`) into the counter.

### 8.2 Image-swap map — complete (every JS-driven src override)

| Section | Match (alt text regex) | New `src` | Skin lines |
|---|---|---|---|
| SignBuilder still | `/butterfly sign/i` (initial) | `ece.webp` | 1798, 1907-1913 |
| SignBuilder step 1 | `/hands on heart/i` | swap `<img>` → `<video src="Video 1.mp4">` | 1799-1803 |
| SignBuilder step 2 | `/wrists crossed/i` | `<video src="Video 1_1.mp4">` | 1801 |
| SignBuilder step 3 | `/open like wings/i` | `<video src="Video 1_2.mp4">` | 1802 |
| StepTabs step 1 | `/butterfly sign/i` (`alt` of step image) | `how1.webp` | 1940-1944 |
| StepTabs step 2 | `/their name/i` | `how2.webp` | 1942 |
| StepTabs step 3 | `/pass it forward\|3 people/i` | `how3.webp` | 1943 |
| Tutorial modal video | injected on watch click | `rrt.mp4` | 1965-1976 |
| HighlightCarousel card 1 bg | first card | `gett11.webp` (CSS) | 207-214 |
| HighlightCarousel card 2 bg | second card | `gett222.webp` | 260 |
| HighlightCarousel card 3 bg | third card | `gett33.webp` | 261 |
| HighlightCarousel card 4 bg | fourth card | `gett44.webp` | 262 |
| Alliance hero top | injected | `allia.webp` | 2710-2717 |
| Live hero bg | full-cover | `dsd.webp` (CSS) | 575-583 |
| Butterfly Effect bg | injected | `crecr.webp` | 2452-2462 |
| FAQ top | injected | `han.webp` *(NB: skin uses `han.webp` here, despite earlier comments referencing `cer.webp`; the actual line 2509 reads `img.src = 'han.webp'`)* | 2503-2511 |
| Story CTA top | injected | `han.webp` | 2820-2825 |
| Live CTA top | injected | `han.webp` | 2836-2840 |
| Hero CTA section image | `alt="People doing the Butterfly Sign"` | `wcd.webp` | 2479-2485 |
| Story Origin image | `/lucina artigas\|hurricane pauline/i` | `story.webp` | 2680 |
| Story Tipping image | `/butterfly hug demonstrated on a global stage/i` | `prince-harry-therapy-56.webp` | 2681 |
| Science Brain image | `/brain hemispheres/i` | `brai.webp` | 2682 |
| Science Clinical Foundation image | `/butterfly hug gesture with calming ripples/i` | `white_background.webp` | 2683 |
| Science Evidence image | `/brain scan showing prefrontal cortex activation/i` | `head.webp` | 2684 |
| JoinC step 1 | `/make the sign/i` | `step-1.webp` | 2609-2613 |
| JoinC step 2 | `/say the message/i` | `step-2.webp` | 2611 |
| JoinC step 3 | `/lift 3 more/i` | `step-3.webp` | 2612 |

**Total external assets needed**:
- WebP: `exw.webp`, `cer.webp`, `wcd.webp`, `gett11.webp`, `gett222.webp`, `gett33.webp`, `gett44.webp`, `dsd.webp`, `allia.webp`, `crecr.webp`, `han.webp`, `ece.webp`, `how1.webp`, `how2.webp`, `how3.webp`, `story.webp`, `prince-harry-therapy-56.webp`, `brai.webp`, `white_background.webp`, `head.webp`, `step-1.webp`, `step-2.webp`, `step-3.webp` — **23 images**.
- Video: `rrt.mp4`, `Video 1.mp4`, `Video 1_1.mp4`, `Video 1_2.mp4` — **4 videos**.

### 8.3 Tutorial modal — exact markup (lines 1965-2007)
```html
<div data-tutorial-modal>
  <div data-tutorial-content>
    <button data-tutorial-close aria-label="Close">×</button>
    <video src="rrt.mp4" controls playsinline></video>
  </div>
</div>
```
- Open trigger: `<button data-watch-tutorial>` injected after the StepTabs description paragraph; markup `<span>Watch the tutorial</span><svg viewBox="0 0 16 16">…play triangle…</svg>` (lines 2021-2024).
- Behaviors: open → seek to 0 + play; click backdrop or close button → pause + close; ESC closes (lines 1978-1988, 1991-2007).

### 8.4 cobe WebGL globe — exact config (lines 2050-2438)

- ES module: `import('https://esm.sh/cobe@0.6.3')` — must be added as a dependency or via CDN.
- Wrapper: `<div data-globe-cobe>` with `position:relative; max-width:520px; aspect-ratio:1; cursor:grab; touch-action:none`.
- `createGlobe(canvas, config)` config:
  ```js
  {
    devicePixelRatio: dpr,
    width:  size * dpr,
    height: size * dpr,
    phi: 0,
    theta: 0.32,           // initial tilt
    dark: 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor:   [0.96, 0.96, 0.97],
    markerColor: [255/255, 139/255, 51/255],   // orange #FF8B33
    glowColor:   [1, 1, 1],
    markers: GL_ORANGE.map(c => ({ location: [c.lat, c.lng], size: 0.06 })),
    onRender: state => { if (!drag) phi += 0.003; state.phi = phi; state.theta = theta; }
  }
  ```
- Hardcoded marker cities (`GL_ORANGE`, lines 2152-2168, 15 cities): NY, London, São Paulo, Tokyo, Mumbai, Nairobi, Sydney, Berlin, Paris, Bangkok, Buenos Aires, Moscow, Beijing, Cairo, Dubai. **Note:** these markers are static — they do **not** read from `entries` in `useLiveHands`. The current `Globe.jsx` plots live `entries`. Migrating to cobe naively would **lose realtime location markers**. Two options: (a) accept fixed 15 cities for the visual, (b) pass `entries` from `useLiveHands` and rebuild markers on every render with the same orange color.
- Arcs overlay canvas: drawn at `R = displaySize * 0.45`, slerped great-circle, parabolic lift `1 + 0.15*sin(t·π)`, pulse cycle `4000ms`, color `rgba(14,165,160, …)` (teal). Pairs: consecutive markers + loop-back. **Coordinate convention is cobe's** (`x=east, y=up, z=front`) — different from current `Globe.jsx`, which is why the arcs in the existing canvas globe wouldn't align if reused as-is.
- Drag-to-rotate via pointer events on the wrapper (`x → phi`, `y → theta`, `0.005` rad/px).
- Fallback if cobe import fails: 2D dot-globe using `glDots` (similar style to the current `Globe.jsx`).

### 8.5 Page-hero `data-page` tagging — text matches (lines 2689-2694)

Tagging is done by matching the **first `<h1>` text** in each `<section>`:

| `data-page` value | `<h1>` regex | Current i18n source |
|---|---|---|
| `story` | `/where it came from/i` | `t('story.heroTitle')` |
| `science` | `/why it works/i` | `t('science.heroTitle')` |
| `alliance` | `/a billion hands need more than a challenge/i` | `t('alliancePage.heroTitle')` |
| `live` | `/april 30.*queen miami beach\|queen miami beach/i` | `t('livePage.heroTitle')` |

For the native migration, **drop the regex matching and put `data-page="..."` directly on the hero `<section>` in each page component**. (Important: the locale strings must still match — if the `t('...heroTitle')` text drifts, the skin's regex would break, but inline `data-page` won't.)

Other JS-applied attributes to bake into JSX:
- `data-section="culture-dark"` on the AlliancePage dark stats section (line 2725).
- `data-section="evidence"` on the SciencePage brain-scan section (line 2746).
- `data-story-cta="1"` + injected `<img data-story-cta-img src="han.webp">` on the StoryPage final CTA section (lines 2820-2825).
- `data-live-cta="1"` + injected `<img data-live-cta-img src="han.webp">` on the LivePage final CTA section (lines 2836-2840).
- `data-alliance-top="1"` on the injected `<img src="allia.webp">` at the top of AlliancePage hero (lines 2713-2717).
- `data-faq-top="1"` on the injected `<img src="han.webp">` at the top of the FAQ section (lines 2508-2511).
- `data-be-bg="1"` on the injected `<img src="crecr.webp">` in the Butterfly Effect section (lines 2459-2462).

### 8.6 Copy / behaviour changes

- **Nav: rename "Get Support" → "Need Help?"** (lines 2645-2659). Heart icon kept; only the text node mutates. → In native migration, change [Nav.jsx:53](src/components/Nav.jsx#L53) and [Nav.jsx:144](src/components/Nav.jsx#L144) translation strings (`t('nav.getSupport')`) and the Footer button copy (`t('footer.getSupportNow')` may also want review).

### 8.7 StoryPage — sections **hidden** by the skin

These get `style="display:none"`:

| Hidden | How (lines 2790-2810) |
|---|---|
| Section whose `<h2>` matches `/april 2026.*the challenge/i` | "This Moment" / Challenge section |
| Timeline item whose `<span>` text equals `Apr 30` | First entry of `VisualTimeline` |

Both are already gated in the codebase by `SHOW_APR30_EVENT` (currently `false`). When `false`, these sections aren't rendered at all — so this skin behavior is a no-op in current state. **Action:** when the team eventually flips `SHOW_APR30_EVENT=true`, also remove the "April 2026" section and the `Apr 30` timeline entry, OR keep `SHOW_APR30_EVENT` permanently `false` for non-event copies of the design. Recommend: add a separate `SHOW_LIVE_EVENT_TIMELINE` flag if needed.

### 8.8 Chain (Butterfly Effect) — render ALL butterflies (lines 2530-2584)

Current [Chain.jsx:103-106](src/components/Chain.jsx#L103-L106) caps the visible butterflies at 40 and shows a `+N` span. The skin **uncaps it** — appends `target - 40` extra `<img>` elements and hides the `+N` span. So at level 5 (target 81) the user sees 81 actual butterfly images.

There's also a click-capture cleanup (lines 2591-2601) that removes injected butterflies before React re-renders into the counting state — to avoid a flash where 81 butterflies stretch across the new container.

**Native equivalent:** in [Chain.jsx](src/components/Chain.jsx), drop the `Math.min(s.emoji, 40)` cap and the `+N` span — render the full count directly. (Performance note: 243 11px images is fine; if levels add more, add virtualization.)

### 8.9 Implications for the migration plan

The plan's **Tier 1–4** grouping still holds. Adjustments:

1. **Tier 1 (Foundation)** — add to scope:
   - Add asset constants for all 23 webp + 4 mp4 files in `src/constants/index.js`.
   - Decide on cobe: install `cobe` npm package or load via CDN. Add `'cobe': '^0.6.3'` to `package.json` if going native.
   - Decide whether to introduce `t('home.heroPill')`, `t('home.heroH1')`, `t('home.heroSubA')`, `t('home.heroSubB')`, `t('home.heroCta')`, `t('home.heroCounter')` i18n keys (adds ~6 keys × 4 locales = 24 strings).
   - Decide whether the hero counter shows live `handCount` (recommended) or hardcoded `365`.
   - Decide what to do with the dropped "I did it" button — relocate (preserves `confetti` + `saveHandRaise` flow), or accept losing the celebration UI.

2. **Tier 3 (Mixed)** — `Chain.jsx` moves from "free redesign" to "small logic change": uncap butterfly images, drop `+N` span.

3. **Tier 3 (Mixed)** — `SignBuilder.jsx` needs per-step `videoSrc` per step + a `<video>` slot with `autoPlay muted playsInline preload="auto"` and **no `loop`** (skin explicitly notes "each step plays once and holds on the final frame"). The "still" state uses `ece.webp`.

4. **Tier 3 (Mixed)** — `Nav.jsx`: change `t('nav.getSupport')` to translate to "Need Help?" across en/es/fr/ar.

5. **Tier 4 (High-risk)** — the cobe migration of `Globe.jsx` is **two decisions**:
   - **Markers**: hardcoded 15 cities (visual match) vs. live `entries` (preserves data tie-in). If the latter, project `entries` lat/lng → cobe markers, but keep the `useLiveHands` data flow untouched.
   - **Arcs**: keep the cobe-style arcs overlay (correct math is in `drawArcPulse`, lines 2208-2272). The current `Globe.jsx` arc math uses a different coordinate system and won't align with cobe markers without rewriting.

6. **Tier 4 (High-risk)** — Hero rebuild: replace [HomePage.jsx:48-179](src/pages/HomePage.jsx#L48-L179) with the new structure. **Preserve** `aria-live="polite"` semantics for the counter region. **Wire** the counter to `handCount` (or omit it). Re-attach `onJoin` to the new "Join the Challenge" button. Decide on `onDidIt` (drop / relocate).

### 8.10 Net answer to "will it look the same?"

After implementing Tier 1 + 2 + 3 + 4 with the additions above:

- **Layout, typography, colors, padding, image placement** — yes, will match.
- **Hero copy + counter wording** — only matches if you copy the literal English (or accept the hardcoded counter "365 hands raised" → switch to live count).
- **cobe globe** — will match if cobe is installed; otherwise the dot-globe fallback in current `Globe.jsx` is close but not identical.
- **Tutorial modal + per-step videos** — match iff the 4 mp4 files are added to `public/`.
- **Background/decorative images** — match iff all 23 webps are added to `public/`.
- **"I did it" button** — the skin removes it; the native migration must consciously decide whether to keep the celebration flow elsewhere.

In short: **with the assets and decisions in §8.9 made, the migration will reproduce the design.** Without them, expect missing images, no tutorial video, no cobe globe, and possibly a divergent hero counter.

---

## DELIVERABLE STATUS

- ✅ No files modified.
- ✅ Audit only.
- ✅ JS skin layer fully extracted (§8).
- Next step (when authorized): start with **Tier 1** (constants + asset paths + page-level data-attribute tagging + decisions in §8.9), then **Tier 2** (pure-UI), then **Tier 3** (mixed including Chain uncap, Nav copy, SignBuilder video map), then **Tier 4** (hero rebuild + cobe globe).
