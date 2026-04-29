# Butterfly Challenge — Website

The campaign site for **thebutterflychallenge.com**, a global movement asking 1 billion people to make a 60-second gesture for mental health.

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Language:** TypeScript + JavaScript
- **Styling:** Tailwind CSS v4 (with inline-style design tokens)
- **Backend:** Supabase (Auth, Postgres, Realtime, Edge Functions, Storage)
- **Data:** TanStack Query (React Query)
- **i18n:** i18next + react-i18next (English, Spanish, French, Arabic)
- **Email:** Resend, sent via a Supabase Edge Function
- **Analytics:** Mixpanel (EU endpoint), Sentry, Vercel Analytics
- **Deployment:** Vercel

## Features

- Auto-detect language from IP country across 60+ nations, with manual override stored in `localStorage`
- Right-to-left support for Arabic (`<html dir="rtl">` flips on language change)
- Real-time hand count, globe markers, and Top Countries / Cities / Participants leaderboards via Supabase Realtime
- Warm-start with 350 synthetic hand raises across 60 countries on first paint
- Path-based SPA routing with Vercel rewrites (no React Router)
- React.lazy + Suspense for per-page code splitting
- 3-per-email reminder limit enforced both client-side and via Supabase Edge Function rate limit
- WCAG AA contrast across all text and interactive elements
- Year-long immutable CDN cache for `/images/*` and `/assets/*`
- Hero image preloaded with `<link rel="preload" fetchpriority="high">`
- canvas-confetti celebration when a user clicks "I did it"
- Custom Canvas 2D globe (no external WebGL library)
- Domain forward from `thebutterflychallenge.com` to `butterflychallenge.net` configured in `vercel.json`

## Sections

- **Nav** — Sticky header with story / science / alliance / live links, language switcher, sign-in
- **Hero** — Tagline, primary CTAs (Join the Challenge / I did it), live hand-count pill
- **Highlights Carousel** — Four campaign messages on a horizontal scroll track
- **Community Feed** — User-submitted videos and images via Supabase Storage
- **The Sign** — Three-step interactive tutorial for the Butterfly Sign gesture
- **How It Works** — Tabbed three-step explainer (Take the Challenge, Show the Love, Lift 3 More)
- **Butterfly Effect** — Animated 1 → 1,000,000,000 chain reaction
- **Event Teaser** — Founding event card with countdown timer
- **Live Feed** — Canvas globe, recent hand raises, and three leaderboards
- **FAQ** — Six common questions with expandable answers
- **CTA** — Final call to action and reminder email opt-in
- **Footer** — "One humanity. Many flags. One butterfly." flag-butterfly grid, contact info, social links
- **Story Page** — The origin of the butterfly hug from 1998 to today
- **Science Page** — The neuroscience of bilateral stimulation and EMDR
- **Alliance Page** — Role cards, alliance partners, trust + governance, organisation onboarding
- **Live Page** — Founding event schedule, timeline, and the live feed

## Getting Started

```
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```
npm run build
```

## License

This project is for the Butterfly Challenge campaign. All assets and copy belong to One Humanity Foundation.
