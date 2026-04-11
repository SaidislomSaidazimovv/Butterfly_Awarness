# The Butterfly Challenge — Complete Project Documentation

> **Domain:** thebutterflychallenge.com
> **Repository:** github.com/[PRIVATE]/Butterfly_Awarness
> **Last Updated:** April 5, 2026

---

## 1. Project Overview

### Mission
The Butterfly Challenge is a viral social media campaign designed to normalize mental health check-ins through a simple gesture. Users cross their hands over their heart in a butterfly shape, say "I got you" to someone they care about, record a 60-second video, and tag 3 people — creating a chain of connection that links to professional crisis resources.

### Purpose
- Create a globally recognized hand gesture ("The Butterfly") as a signal of care
- Drive awareness of the 988 Suicide & Crisis Lifeline
- Build a viral chain challenge (60 seconds, 3 names, 24 hours)
- Connect participants to professional support through the Butterfly Protocol

### Target Audience
- Gen Z and Millennials on TikTok, Instagram, and X
- Schools, workplaces, and organizations seeking wellness programs
- Mental health advocates and influencers
- Anyone who wants to show someone they care

### Key Metrics
- Real-time hand raise counter (from Supabase `hand_raises` table)
- Country and city participation leaderboards (server-side RPC aggregation)
- Top participants by shares
- Community video submissions

### Organization
- **Founded by:** One Humanity Foundation, 501(c)(3)
- **Crisis Partner:** 988 Suicide & Crisis Lifeline

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.3 | UI framework |
| TypeScript | 5.9.3 | Type safety (strict, 0 `any` types) |
| Vite | 7.2.4 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| React Query | 5.96.2 | Server state caching (staleTime 10-60s) |

### Backend (Supabase)
| Service | Purpose |
|---|---|
| PostgreSQL Database | hand_raises, email_reminders, profiles, shares, challenge_submissions, rate_limits |
| Authentication | Google OAuth, email/password, password reset |
| Storage | challenge-submissions bucket for UGC uploads |
| Edge Functions | send-email function (Deno runtime) with IP rate limiting |
| Realtime | Live leaderboard updates, community feed |
| RPC Functions | rate_limited_share, rate_limited_submission, get_country_leaderboard, get_city_leaderboard, get_top_participants |

### Monitoring & Analytics
| Service | Purpose |
|---|---|
| Sentry | Production error monitoring (10% trace sampling) |
| Mixpanel | Event tracking, user analytics (EU endpoint) |
| Vercel Analytics | Web vitals, page views |

### Email
| Service | Purpose |
|---|---|
| Resend | Transactional email delivery |
| From Address | `Butterfly Challenge <hello@thebutterflychallenge.com>` |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting + CDN + security headers |
| GitHub | Source control (main branch, auto-deploy) |

### Key Libraries
| Library | Version | Purpose |
|---|---|---|
| @sentry/react | ^10.47.0 | Error monitoring SDK |
| @vercel/analytics | ^2.0.1 | Web analytics |
| @tanstack/react-query | ^5.96.2 | Server state management |
| globe.gl | ^2.45.1 | 3D WebGL interactive globe |
| canvas-confetti | ^1.9.4 | Confetti celebration effects |
| lucide-react | ^1.6.0 | SVG icon system |
| mixpanel-browser | ^2.77.0 | Analytics SDK |
| @supabase/supabase-js | ^2.101.0 | Supabase client |

---

## 3. Project Structure

```
Butterfly_Awarness/
  index.html                  # Entry HTML with OG tags, PWA meta, skip-to-main link
  vercel.json                 # SPA rewrites + CSP/security headers
  vite.config.ts              # React + Tailwind plugins
  package.json                # Dependencies
  .env                        # Environment variables (not committed)
  .env.example                # Template for required env vars
  .gitignore                  # node_modules, dist, .env excluded
  public/
    manifest.json             # PWA manifest (standalone display)
    robots.txt                # Allow all + sitemap reference
    favicon.png               # App icon
    images/
      og-image.jpg            # OG image (87KB, 1200x630)
    videos/
      *.mp4                   # Influencer videos (~13MB total, served by Vercel CDN)
  src/
    main.tsx                  # Entry point: Sentry init, Vercel Analytics, StrictMode
    index.css                 # Tailwind import + skip-to-main CSS
    App.tsx                   # Main app component (~3,500 lines)
    components/
      ErrorBoundary.tsx       # React error boundary (Sentry + Mixpanel reporting)
      HeroSection.tsx         # Hero with counter (ARIA live region)
      LeaderboardSection.tsx  # Country/City/Participants leaderboards
      FooterSection.tsx       # Footer with social links, resources
      BottomSafetyBar.tsx     # Fixed bottom bar with 988 + Safe Exit
  supabase/
    functions/
      send-email/
        index.ts              # Edge Function: email sending with rate limiting
        deno.json             # Deno config
    migrations/
      20260405_rate_limiting.sql  # Rate limits table + RPC functions
```

---

## 4. Database Schema

### `hand_raises`
Tracks every "I Did It" button click.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| session_id | text | NOT NULL | Anonymous session ID from localStorage |
| user_id | uuid | REFERENCES auth.users(id), NULLABLE | Logged-in user ID |
| country_code | text | NULLABLE | 2-letter country code |
| city | text | NULLABLE | City name (from ipinfo.io geolocation) |
| referred_by | text | NULLABLE | Referrer's user_id or session_id |
| created_at | timestamptz | DEFAULT now() | Timestamp |

**Indexes:** `hand_raises_user_id_idx` on `user_id`

### `email_reminders`
Stores email addresses for May 1 Butterfly Month reminders.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| email | text | UNIQUE, NOT NULL | Email address |
| sent_confirmation | boolean | DEFAULT false | Whether confirmation email was sent |
| sent_reminder | boolean | DEFAULT false | Whether May 1 reminder was sent |
| created_at | timestamptz | DEFAULT now() | Signup timestamp |

### `profiles`
User profile data, populated by trigger on auth.users insert.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, REFERENCES auth.users(id) | User ID |
| display_name | text | NULLABLE | User's display name |
| country_code | text | NULLABLE | Country code |

**Trigger:** `handle_new_user()` copies `raw_user_meta_data->>'display_name'` and `raw_user_meta_data->>'country_code'` from auth.users on INSERT.

### `challenge_submissions`
UGC (user-generated content) — recorded videos and uploaded images.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | REFERENCES auth.users(id), NULLABLE | Uploader |
| file_url | text | NOT NULL | Public URL in Supabase Storage |
| file_type | text | NOT NULL, DEFAULT 'image' | 'image' or 'video' |
| display_name | text | NULLABLE | Uploader's display name |
| consent | boolean | DEFAULT true | User agreed to public sharing |
| is_approved | boolean | DEFAULT false | Moderation approval status |
| created_at | timestamptz | DEFAULT now() | Upload timestamp |

**Note:** Only submissions with `is_approved = true` are shown in the community feed.

### `shares`
Tracks every share action by logged-in users.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | uuid | REFERENCES auth.users(id) | Who shared |
| platform | text | NOT NULL | 'tiktok', 'instagram', 'whatsapp', 'twitter', 'copy', 'native' |
| display_name | text | NULLABLE | Sharer's display name at time of share |
| avatar_url | text | NULLABLE | Sharer's avatar URL at time of share |
| created_at | timestamptz | DEFAULT now() | Share timestamp |

### `rate_limits`
Tracks API requests for Edge Function rate limiting.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| ip | text | NOT NULL | Client IP address |
| action | text | NOT NULL | Action type (e.g., 'send_email') |
| created_at | timestamptz | DEFAULT now() | Request timestamp |

**Index:** `idx_rate_limits_lookup` on `(ip, action, created_at DESC)`
**RLS:** Enabled with no public policies — only service role (Edge Function) can read/write.

### RPC Functions

| Function | Purpose | Rate Limit |
|---|---|---|
| `rate_limited_share` | Insert into shares with rate check | 10 shares per user per minute |
| `rate_limited_submission` | Insert into challenge_submissions with rate check | 3 submissions per user per 10 minutes |
| `get_country_leaderboard` | Server-side country aggregation | N/A |
| `get_city_leaderboard` | Server-side city aggregation | N/A |
| `get_top_participants` | Server-side top sharers aggregation | N/A |
| `cleanup_rate_limits` | Delete rate_limit rows older than 1 hour | Scheduled via pg_cron hourly |

### Storage Bucket: `challenge-submissions`
- **Access:** Public (for approved submissions)
- **Max upload size:** 10MB (enforced client-side)
- **File path pattern:** `{user_id|anon}/{timestamp}.{ext}`

---

## 5. Authentication

### Providers
1. **Google OAuth** — via Supabase Auth with `signInWithOAuth({ provider: 'google' })`
2. **Email/Password** — via Supabase Auth with `signUp()` / `signInWithPassword()`
3. **Password Reset** — via `supabase.auth.resetPasswordForEmail()` with Mixpanel tracking

### Google OAuth Flow
1. User clicks "Continue with Google" in auth modal
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`
3. Redirects to Google consent screen
4. Google redirects back with hash fragment (`#access_token=...`)
5. Supabase JS auto-detects hash, stores session in localStorage
6. `onAuthStateChange` fires -> `setCurrentUser(session.user)`

### Email/Password Registration
1. User fills email + password (min 8 chars for register, 6 for login)
2. Client-side validation: email regex, password length, honeypot check
3. `supabase.auth.signUp({ email, password, options: { data: { display_name, country_code } } })`
4. Confirmation email sent by Supabase (if enabled in dashboard)
5. User metadata stored: `display_name`, `country_code`

### Password Reset
1. User clicks "Forgot password?" on login form
2. `supabase.auth.resetPasswordForEmail(email)` called
3. Success/error state shown inline in auth modal
4. Tracked in Mixpanel: `password_reset_requested` or `app_error`

### Session Management
- Sessions stored in `localStorage` (key: `sb-{PROJECT_REF}-auth-token`)
- Auto-refreshed via refresh token
- `getSession()` called on page load to restore session
- `onAuthStateChange()` listener for real-time auth state updates
- Cleanup: subscription unsubscribed on component unmount

### Redirect URLs (configure in Supabase Dashboard)
- `http://localhost:5173` (development)
- `https://thebutterflychallenge.com` (production)

---

## 6. Features (Detailed)

### 6.1 Hero Section
- Extracted component: `src/components/HeroSection.tsx`
- React.memo wrapped with 6 props
- Full-width hero with background image
- Animated counter showing real-time hand raises
- **ARIA live region** on counter: `aria-live="polite"`, `aria-atomic="true"`, screen reader label
- "Butterfly Month - May 2026" badge
- "Learn more" CTA -> scrolls to How It Works
- "Watch the Tutorial" -> opens video modal

### 6.2 How It Works (4 Steps)
Horizontal scroll carousel with snap behavior:
1. **Open camera** — Step 01 with image card
2. **The gesture** — Step 02, hands on heart
3. **Say it** — Step 03, "I got you, [name]"
4. **Tag 3** — Step 04, nominate 3 people
- Mobile: "Record & Share Your Challenge" CTA button (opens UGC modal)
- All images: `loading="lazy"` for performance

### 6.3 People Are Showing Up (Video Wall)
- Auto-scrolling horizontal carousel of influencer videos
- Videos served from `/videos/` directory via Vercel CDN (not inlined)
- CSS `slide-infinite` animation at 40s per cycle
- Pauses on hover
- Stats bar: 23 countries, 147K+ people, "The wave is growing"

### 6.4 From The Community (UGC)
- Auto-scrolling horizontal carousel of community submissions
- CSS `community-scroll` animation at 30s per cycle
- 3+ items: carousel with duplication for seamless loop
- 1-2 items: static centered layout (no duplication)
- Videos autoplay muted with loop
- Empty state: "Be the first to share your butterfly moment!"
- Realtime subscription refreshes on new INSERT
- Only shows submissions where `is_approved = true`

### 6.5 I Did It Button
- Circular button with three states:
  - **Not clicked:** Blue smartphone icon + "I DID IT" + pulse animation
  - **Clicked (anonymous):** Green checkmark + "YOU DID IT"
  - **Clicked (logged in):** Green checkmark + "YOU DID IT" + date
- Persists in localStorage (`bc_did_it`)
- On click: confetti effect, counter increment, hand raise saved to DB
- Duplicate prevention: checks by `user_id` (logged in) or `session_id` (anonymous)
- IP geolocation fetched via ipinfo.io for city data before DB insert
- Referral tracking: stores `referred_by` from `?ref=` URL parameter

### 6.6 Share Functionality
Opens share drawer modal with:
- **Native Share** (mobile only, logged-in only): Web Share API
- **TikTok:** Opens platform guide modal
- **Instagram:** Opens platform guide modal
- **WhatsApp:** Pre-filled message with `wa.me` link
- **X (Twitter):** Pre-filled tweet via `twitter.com/intent/tweet`
- **Copy Link:** Copies referral-tracked URL to clipboard
- **Pre-written caption** with copy button
- **Email reminder** inline form (in share drawer)
- All share clicks: rate-limited via `rate_limited_share` RPC + tracked in Mixpanel
- Referral URLs: `https://thebutterflychallenge.com?ref={USER_ID}`

### 6.7 Email Reminder
Two entry points:
1. Inline form in share drawer
2. Standalone modal ("Remind Me May 1" in final CTA section)

Flow:
1. Email inserted into `email_reminders` table
2. Edge Function called to send confirmation email via Resend (rate-limited: 3/IP/10min)
3. Duplicate detection: error code 23505, message contains "duplicate"/"unique"/"conflict", or HTTP 409
4. Already-subscribed users see success state (not error)
5. Logged-in users have email auto-filled

### 6.8 The Wave, Live (Globe + Leaderboard)
- **3D Globe:** globe.gl WebGL globe with typed interfaces (no `any` types)
  - Dynamically imported: `await import('globe.gl')` (1.8MB lazy chunk)
  - Respects `prefers-reduced-motion` — skips rendering if enabled
  - Proper cleanup: `_destructor()`, resize handler, arc interval
- **Leaderboards:** Extracted component `src/components/LeaderboardSection.tsx`
  - React.memo wrapped with 8 props
  - Top Countries: server-side `get_country_leaderboard` RPC
  - Top Cities: server-side `get_city_leaderboard` RPC
  - Top Participants: server-side `get_top_participants` RPC
  - Mobile: tab toggle between Country/City/Participants
- React Query caching with staleTime 10-60s

### 6.9 UGC Camera Recording
Mobile-first camera recording experience:
1. **Mode selection:** Auto (3-second countdown) or Manual (tap to record)
2. **Camera:** Front-facing via `getUserMedia`, mirrored preview
3. **Recording:** MediaRecorder API, max 30 seconds, timer display
4. **Preview:** Play back recorded video, Retake/Use This buttons
5. **Consent:** Checkbox + "Share It" upload button
6. **Upload:** Supabase Storage -> rate-limited `rate_limited_submission` RPC (3/user/10min)
7. **Fallback:** File input picker if camera unavailable

### 6.10 FAQ Accordion
6 questions with smooth open/close animation:
1. Do I have to talk about my mental health?
2. What if I feel awkward on camera?
3. What if someone I tag doesn't respond?
4. What if someone I tagged seems to be struggling?
5. Does this actually help anyone?
6. How do I do the Butterfly gesture?

- Chevron rotation animation (0.25s)
- Answer slide-in animation (faqOpen keyframe)
- Only one item open at a time

### 6.11 Crisis Support Modal
- US resources: 988 Suicide & Crisis Lifeline (call/text), Crisis Text Line (741741)
- International: 24 country-specific crisis hotlines via dropdown selector
- Privacy note: "All conversations are confidential"
- Accessible from: navbar "Get Support", bottom bar "988", footer
- Focus trap enabled for keyboard accessibility

### 6.12 Safe Exit
- Immediately navigates to `https://www.google.com`
- Available in: navbar (desktop), hamburger menu, bottom safety bar (mobile)

### 6.13 Auth Modal
- Google "Continue with Google" button with colored G logo
- "or" divider
- Name field (register only, optional)
- Email + password fields
- **Forgot password?** link (login mode only) -> sends reset email
- Email regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
- Password: min 6 chars (login), min 8 chars (register)
- Honeypot hidden field for bot protection
- Toggle between Login/Register modes
- Focus trap enabled for keyboard accessibility

### 6.14 User Dropdown
- Avatar photo (Google) or initial letter circle
- Display name + email
- "My Stats" button -> opens stats modal
- "Sign out" button (red)
- Click-outside to close
- Dropdown open animation (0.15s)

### 6.15 My Stats Modal
Shows when user has raised hand:
- Joined date (from `hand_raises.created_at`)
- Global hand count (live counter)
- Countries participating (leaderboard count)
- "You're part of something bigger."

Not raised hand:
- "You haven't taken the challenge yet!"
- "Take it now ->" button

### 6.16 Final CTA Section
- Background image with dark overlay
- "One person starts. 3 more continue." -> "A billion hands rise."
- "Take the Challenge" button (white)
- "Remind Me May 1" button (ghost, opens email reminder modal)

### 6.17 Footer
- Extracted component: `src/components/FooterSection.tsx`
- React.memo wrapped with 1 prop: `onCrisisOpen`
- 4-column grid (brand, resources, organizations, crisis help)
- Social links: TikTok, Share, X, YouTube
- Crisis card: "US: Call or Text 988" + "Get Support Now"
- Bottom: Privacy, Terms, Accessibility, About + disclaimer

### 6.18 Bottom Safety Bar
- Extracted component: `src/components/BottomSafetyBar.tsx`
- React.memo wrapped with 2 props: `onSafeExit`, `onCrisisOpen`
- Fixed at bottom of viewport
- Left: Heart icon + "Need help? You're not alone."
- Right: "988" call button
- Mobile: Safe Exit button (left side)

---

## 7. Integrations

### 7.1 Supabase Edge Function: `send-email`
- **Runtime:** Deno (Supabase Edge Functions)
- **Endpoint:** `https://{PROJECT_REF}.supabase.co/functions/v1/send-email`
- **Auth:** FUNCTION_SECRET in request body (deployed with `--no-verify-jwt`)
- **CORS:** Restricted to allowed origins: `thebutterflychallenge.com`, `www.thebutterflychallenge.com`, `localhost:5173`
- **Rate Limiting:** IP-based, max 3 requests per IP per 10 minutes (429 response if exceeded)

**Actions:**
| Action | Trigger | Email Subject |
|---|---|---|
| `confirmation` | User subscribes to reminder | "You're in — Butterfly Challenge reminder set" |
| `reminder` | pg_cron on May 1 | "Today is Butterfly Month — take the challenge" |

**Environment Variables (Edge Function):**
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend email API key |
| `SUPABASE_URL` | Auto-injected by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected by Supabase |
| `FUNCTION_SECRET` | Request authentication secret |

### 7.2 Resend Email Service
- **From:** `Butterfly Challenge <hello@thebutterflychallenge.com>`
- **API:** `https://api.resend.com/emails`
- **Templates:** Inline HTML with butterfly branding, green accent (#00b18d)
- **Rate limited:** Via Edge Function IP check (3 emails per IP per 10 min)

### 7.3 pg_cron Scheduled Jobs
1. **May 1 Reminder:** Sends reminder email to all subscribers
2. **Rate Limits Cleanup:** Hourly deletion of rate_limit rows older than 1 hour

```sql
-- May 1 reminder
SELECT cron.schedule(
  'send-may-1-reminders',
  '0 9 1 5 *',  -- 9 AM UTC on May 1
  $$
  SELECT net.http_post(
    'https://{PROJECT_REF}.supabase.co/functions/v1/send-email',
    jsonb_build_object('action', 'reminder', 'email', email, 'secret', '{FUNCTION_SECRET}'),
    jsonb_build_object('Content-Type', 'application/json')
  )
  FROM email_reminders
  WHERE sent_reminder = false;
  $$
);

-- Rate limits cleanup (hourly)
SELECT cron.schedule('cleanup-rate-limits', '0 * * * *', 'SELECT cleanup_rate_limits()');
```

### 7.4 ipinfo.io (IP Geolocation)
- **Endpoint:** `https://ipinfo.io/json?token={IPINFO_TOKEN}`
- **Data used:** `country`, `city`
- **Called:** On every "I Did It" click (before DB insert)
- **Fallback:** `navigator.language` country code if API fails
- **Token:** Stored in `.env` as `VITE_IPINFO_TOKEN`

### 7.5 Sentry Error Monitoring
- **SDK:** `@sentry/react` ^10.47.0
- **Init:** `src/main.tsx` with DSN from `VITE_SENTRY_DSN` env var
- **Environment:** `import.meta.env.MODE` (production/development)
- **Enabled:** Production only (`import.meta.env.PROD`)
- **Trace Sampling:** 10% (`tracesSampleRate: 0.1`)
- **ErrorBoundary:** `src/components/ErrorBoundary.tsx` reports to both Sentry and Mixpanel
- **Catch blocks:** 8+ catch blocks report errors to Mixpanel with source, message, timestamp

### 7.6 Mixpanel EU
- **API Host:** `https://api-eu.mixpanel.com` (EU data residency)
- **Config:** `debug: false`, `track_pageview: true`, `persistence: 'localStorage'`, `ignore_dnt: true`
- **Token:** Stored in `.env` as `VITE_MIXPANEL_TOKEN`

### 7.7 Vercel Analytics
- **SDK:** `@vercel/analytics` ^2.0.1
- **Init:** `<Analytics />` component in `src/main.tsx`
- **Requirement:** Must be enabled in Vercel Dashboard

---

## 8. Deployment

### Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.mxpnl.com https://cdn4.mxpnl.com https://browser.sentry-cdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mixpanel.com https://ipinfo.io https://*.sentry.io; frame-ancestors 'none';" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Build Process
```bash
npm run build
# Executes: node node_modules/vite/bin/vite.js build
# Output:
#   dist/index.html           (~2.7 KB)
#   dist/assets/index-*.js    (~1,053 KB, 313 KB gzipped)
#   dist/assets/globe.gl-*.js (~1,806 KB, 513 KB gzipped — lazy loaded)
#   dist/assets/index-*.css   (~43 KB, 8 KB gzipped)
#   dist/assets/*.{png,webp,jpg,svg}  (static images)
# Build time: ~25 seconds
```

### Environment Variables (`.env`)
```
VITE_SUPABASE_URL=https://{PROJECT_REF}.supabase.co
VITE_SUPABASE_ANON_KEY={anon_key}
VITE_MIXPANEL_TOKEN={mixpanel_token}
VITE_FUNCTION_SECRET={function_secret}
VITE_IPINFO_TOKEN={ipinfo_token}
VITE_SENTRY_DSN={sentry_dsn}
```

All variables must also be set in **Vercel Dashboard > Settings > Environment Variables** for production builds.

### Environment Setup
1. Clone repository
2. Copy `.env.example` to `.env` and fill in values
3. `npm install`
4. `npm run dev` -> `http://localhost:5173`

### GitHub Repository
- **URL:** `https://github.com/[PRIVATE]/Butterfly_Awarness`
- **Branch:** `main`
- **Auto-deploy:** Vercel watches `main` branch
- **Git ignores:** `node_modules/`, `dist/`, `.env`, `.env.local`

---

## 9. Analytics Events

All events tracked via Mixpanel:

| # | Event Name | Trigger | Properties |
|---|---|---|---|
| 1 | *(auto)* `$mp_web_page_view` | Page load | Automatic |
| 2 | `crisis_modal_opened` | "Get Support" clicked | -- |
| 3 | `share_modal_opened` | Share drawer opens | -- |
| 4 | `leaderboard_viewed` | Leaderboard section 50% in viewport (once) | -- |
| 5 | `auth_modal_opened` | Sign In / Sign Up clicked | `{ mode: 'login' \| 'register' }` |
| 6 | `google_signin_attempted` | "Continue with Google" clicked | -- |
| 7 | `user_registered` | Successful email signup | `{ method: 'email' }` |
| 8 | `user_signed_in` | Successful email login | `{ method: 'email' }` |
| 9 | `did_it_clicked` | "I Did It" button first click | -- |
| 10 | `share_completed` | Any share button clicked | `{ platform: '...' }` |
| 11 | `email_reminder_subscribed` | Email saved to DB | -- |
| 12 | `email_reminder_opened` | "Remind Me May 1" clicked | -- |
| 13 | `faq_opened` | FAQ item expanded | `{ question: '...' }` (first 50 chars) |
| 14 | `ugc_cta_clicked` | "Record & Share" button clicked | -- |
| 15 | `ugc_submitted` | UGC video/image uploaded | `{ file_type: 'image' \| 'video' }` |
| 16 | `community_video_played` | Community video starts playing | -- |
| 17 | `password_reset_requested` | Forgot password submitted | -- |
| 18 | `app_error` | Any caught error | `{ source, message, timestamp }` |

---

## 10. Security

### Security Headers (Vercel)
| Header | Value | Purpose |
|---|---|---|
| Content-Security-Policy | See vercel.json | Restricts script/style/connect sources |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information |

### Rate Limiting
| Target | Method | Limit | Response |
|---|---|---|---|
| Edge Function (send-email) | IP-based via `rate_limits` table | 3 per IP per 10 min | 429 Too Many Requests |
| Shares insert | User-based via `rate_limited_share` RPC | 10 per user per minute | JSON `{ success: false }` |
| Submissions insert | User-based via `rate_limited_submission` RPC | 3 per user per 10 min | JSON `{ success: false }` |

### Row Level Security (RLS)
All tables have RLS enabled. Policies:

**hand_raises:**
- INSERT: Anyone can insert (anonymous + authenticated)
- SELECT: Anyone can read (for leaderboard aggregation)

**email_reminders:**
- INSERT: Anyone can insert
- SELECT: Restricted (service role only for Edge Function)

**challenge_submissions:**
- INSERT: Anyone can insert
- SELECT: Anyone can view (filtered by `is_approved = true` in app)

**shares:**
- INSERT: Anyone can insert
- SELECT: Anyone can view

**rate_limits:**
- No public policies — service role only (Edge Function)

**Storage (challenge-submissions bucket):**
- INSERT: Anyone can upload
- SELECT: Anyone can view

### Environment Variables
| Secret | Location | Purpose |
|---|---|---|
| Supabase Anon Key | `.env` -> `VITE_SUPABASE_ANON_KEY` | Client-side (safe, RLS enforces access) |
| Supabase Service Role Key | Edge Function env only | Admin access — never exposed to client |
| RESEND_API_KEY | Edge Function env | Email sending |
| FUNCTION_SECRET | `.env` + Edge Function env | Guards Edge Function from casual abuse |
| IPINFO_TOKEN | `.env` -> `VITE_IPINFO_TOKEN` | IP geolocation |
| SENTRY_DSN | `.env` -> `VITE_SENTRY_DSN` | Error monitoring |
| MIXPANEL_TOKEN | `.env` -> `VITE_MIXPANEL_TOKEN` | Analytics |

### Client-Side Protections
- Email regex validation
- Password minimum length (6 login, 8 register)
- Honeypot hidden field for bot detection
- Duplicate hand raise prevention (DB check before insert)

---

## 11. Accessibility

| Feature | Implementation |
|---|---|
| Skip-to-main link | `index.html` first element in `<body>`, CSS in `index.css`, targets `<main id="main-content">` |
| ARIA live region | Hero counter: `aria-live="polite"`, `aria-atomic="true"`, descriptive `aria-label` |
| Focus traps | 8 modals: auth, crisis, share, UGC, stats, email reminder, platform guide, tutorial |
| ARIA labels | 15+ interactive elements with `aria-label` attributes |
| Keyboard navigation | Tab cycling in modals, Escape to close |
| Semantic HTML | Proper heading hierarchy, `<main>`, `<nav>`, `<footer>` |
| Image lazy loading | `loading="lazy"` on 9 image tags |
| Reduced motion | Globe.gl respects `prefers-reduced-motion: reduce` |

---

## 12. Performance

| Optimization | Detail |
|---|---|
| Code splitting | globe.gl dynamically imported (~1.8MB lazy chunk, loaded on scroll) |
| React Query | Server state caching with staleTime 10-60s, gcTime 5min |
| React.memo | 4 extracted components wrapped (HeroSection, LeaderboardSection, FooterSection, BottomSafetyBar) |
| useMemo/useCallback | Derived state and event handlers memoized |
| Image lazy loading | `loading="lazy"` on all below-fold images |
| OG image | Compressed from 820KB to 87KB (1200x630) |
| Videos on CDN | Moved from inline base64 to `/public/videos/` served by Vercel CDN |
| Server-side aggregation | Leaderboards via Supabase RPC functions (not client-side) |
| Bundle size | Main: 1,053 KB (313 KB gzip) + Globe: 1,806 KB (513 KB gzip, lazy) |

---

## 13. Error Handling

| Layer | Implementation |
|---|---|
| ErrorBoundary | `src/components/ErrorBoundary.tsx` — catches render errors, reports to Sentry + Mixpanel, shows fallback UI with reload button |
| Sentry | Production-only, 10% trace sampling, DSN from env var |
| Mixpanel error tracking | 8+ catch blocks report `app_error` with source, message, timestamp |
| Geolocation fallback | If ipinfo.io fails, falls back to `navigator.language` for country code |
| Camera fallback | If `getUserMedia` unavailable, shows file input picker |
| UGC rate limit feedback | User sees alert if submission rate limit exceeded |

---

## 14. Component Architecture

### Extracted Components (React.memo wrapped)
| Component | File | Props | Purpose |
|---|---|---|---|
| HeroSection | `src/components/HeroSection.tsx` | 6 props | Hero with counter + CTAs |
| LeaderboardSection | `src/components/LeaderboardSection.tsx` | 8 props | Country/City/Participants leaderboards |
| FooterSection | `src/components/FooterSection.tsx` | 1 prop | Footer with resources |
| BottomSafetyBar | `src/components/BottomSafetyBar.tsx` | 2 props | Fixed bottom 988 bar |
| ErrorBoundary | `src/components/ErrorBoundary.tsx` | children | Error boundary with reporting |

### Type Interfaces (src/App.tsx)
| Interface | Purpose |
|---|---|
| FAQItem | FAQ question/answer structure |
| LeaderboardItem | Generic leaderboard entry |
| CommunitySubmission | UGC submission with file_url, display_name, etc. |
| CountryLeaderboardRow | Country code + hand raise count |
| CityLeaderboardRow | City name + hand raise count |
| TopParticipantRow | User display_name + avatar + share count |
| SupabaseUser | Supabase auth user with metadata |
| GlobeInstance | Globe.gl internal cleanup methods |
| GlobeMaterial | Globe.gl material properties (opacity, shininess) |
| GlobeContainerElement | Extended HTMLDivElement with arc interval + resize handler |

---

## 15. Known Limitations & Future Improvements

### Current Limitations
| Issue | Severity | Detail |
|---|---|---|
| Monolithic App.tsx | Medium | ~3,500 lines — hooks, utils, and state should be extracted |
| No automated tests | Medium | No jest, vitest, or testing-library configured |
| Video compression | Medium | UGC uploads can be large; no client-side compression |
| Instagram/TikTok sharing | Low | Platform limitations — opens guide modal instead of pre-filling |
| Share tracking | Low | Tracks intent (button click), not actual delivery |
| No admin moderation UI | Medium | Submissions reviewed manually in Supabase dashboard |
| No CI/CD pipeline | Low | No GitHub Actions or pre-deploy checks |

### Planned Improvements
- Extract hooks and utils from App.tsx (code quality)
- Admin moderation UI for community submissions
- Automated test suite (Vitest + Testing Library)
- Client-side video compression before upload
- Add more OAuth providers (Apple, GitHub)
- Dark mode
- Multi-language support (i18n)
- CI/CD pipeline with GitHub Actions
- Service worker for offline support

---

## 16. Maintenance Guide

### Moderating Community Submissions
1. Go to Supabase Dashboard -> Table Editor -> `challenge_submissions`
2. Review submissions by `created_at` (newest first)
3. Set `is_approved = true` to show in community feed
4. To remove: set `is_approved = false` or delete the row + file from Storage

### Monitoring Errors
1. **Sentry Dashboard:** View production errors, stack traces, user impact
2. **Mixpanel:** Filter by `app_error` event for client-side errors with source context

### Monitoring Edge Function
1. Supabase Dashboard -> Edge Functions -> `send-email`
2. View invocation logs, errors, and response times
3. Check Resend dashboard for email delivery status
4. Check `rate_limits` table for abuse patterns

### Updating Crisis Resources
Edit the crisis hotlines data in `src/App.tsx` (search for `crisisLines`). Contains 24 international hotlines.

### Adding New FAQ Items
Edit `faqData` array in `src/App.tsx`:
```typescript
{
  question: "Your new question?",
  answer: "Your answer text here."
}
```

### Deploying Edge Function Updates
```bash
npx supabase functions deploy send-email --project-ref {PROJECT_REF}
```

### Running SQL Migrations
Open Supabase Dashboard -> SQL Editor, paste the migration file contents, and run.

---

## Design System

### Colors
| Name | Hex | Usage |
|---|---|---|
| accent | `#00b18d` | Primary brand green, CTAs, links |
| text | `#111111` | Headings, body text |
| muted | `#4D4D4D` | Secondary text |
| caption | `#6E6E73` | Captions, labels |
| surface | `#F5F5F7` | Card backgrounds |
| hair | `#E5E5EA` | Borders, dividers |
| bg | `#FFFFFF` | Page background |
| success | `#32C189` | Success states |
| danger | `#FF3B30` | Error states, sign out |
| warm | `#E8A838` | City leaderboard accent |
| accentLight | `#E8F4FD` | Light accent backgrounds |

### Typography
- **Font:** Inter (system-ui fallback)
- **Headings:** text-5xl to 2xl:text-9xl (responsive)
- **Body:** text-sm to text-base

### Breakpoints
| Prefix | Width | Usage |
|---|---|---|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop (nav shows here) |
| xl | 1280px | Large desktop |
| 2xl | 1536px | 4K displays |

### Icons
All icons from `lucide-react`: Heart, ChevronDown, ChevronRight, ChevronLeft, X, ExternalLink, Phone, MessageCircle, Globe, Share2, Copy, Check, CheckCircle, MapPin, Award, Users, Shield, Play, ArrowRight, BarChart2, Menu, Clock, GraduationCap, Briefcase, Tag, Smartphone, Camera, Upload.

---

*Documentation maintained alongside the codebase. Last verified: April 5, 2026.*
