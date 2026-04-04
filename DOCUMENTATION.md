# The Butterfly Challenge — Complete Project Documentation

> **Domain:** thebutterflychallenge.com  
> **Repository:** github.com/[PRIVATE]/Butterfly_Awarness  
> **Last Updated:** April 4, 2026

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
- Country and city participation leaderboards
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
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| vite-plugin-singlefile | 2.3.0 | Bundles entire app into single HTML |

### Backend (Supabase)
| Service | Purpose |
|---|---|
| PostgreSQL Database | hand_raises, email_reminders, profiles, shares, challenge_submissions |
| Authentication | Google OAuth, email/password |
| Storage | challenge-submissions bucket for UGC uploads |
| Edge Functions | send-email function (Deno runtime) |
| Realtime | Live leaderboard updates, community feed |

- **Project URL:** `https://YOUR_PROJECT_REF.supabase.co`
- **Project Ref:** `YOUR_PROJECT_REF`

### Analytics
| Service | Purpose |
|---|---|
| Mixpanel | Event tracking, user analytics |
| API Host | `https://api-eu.mixpanel.com` (EU data residency) |
| Persistence | localStorage |

### Email
| Service | Purpose |
|---|---|
| Resend | Transactional email delivery |
| From Address | `Butterfly Challenge <hello@thebutterflychallenge.com>` |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting + CDN |
| GitHub | Source control (main branch) |

### Key Libraries
| Library | Version | Purpose |
|---|---|---|
| globe.gl | ^2.45.1 | 3D WebGL interactive globe |
| canvas-confetti | ^1.9.4 | Confetti celebration effects |
| lucide-react | ^1.6.0 | SVG icon system |
| mixpanel-browser | ^2.77.0 | Analytics SDK |
| @supabase/supabase-js | ^2.101.0 | Supabase client |

---

## 3. Database Schema

### `hand_raises`
Tracks every "I Did It" button click.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| session_id | text | NOT NULL | Anonymous session ID from localStorage |
| user_id | uuid | REFERENCES auth.users(id), NULLABLE | Logged-in user ID |
| country_code | text | NULLABLE | 2-letter country code (from navigator.language) |
| city | text | NULLABLE | City name (from ipapi.co geolocation) |
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
| country_code | text | NULLABLE | Country code (backfilled from navigator.language) |

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
| created_at | timestamptz | DEFAULT now() | Upload timestamp |

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

### Storage Bucket: `challenge-submissions`
- **Access:** Public (for approved submissions)
- **Max upload size:** 10MB (enforced client-side)
- **File path pattern:** `{user_id|anon}/{timestamp}.{ext}`

---

## 4. Authentication

### Providers
1. **Google OAuth** — via Supabase Auth with `signInWithOAuth({ provider: 'google' })`
2. **Email/Password** — via Supabase Auth with `signUp()` / `signInWithPassword()`

### Google OAuth Flow
1. User clicks "Continue with Google" in auth modal
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })`
3. Redirects to Google consent screen
4. Google redirects back with hash fragment (`#access_token=...`)
5. Supabase JS auto-detects hash, stores session in localStorage
6. `onAuthStateChange` fires → `setCurrentUser(session.user)`

### Email/Password Registration
1. User fills email + password (min 8 chars for register, 6 for login)
2. Client-side validation: email regex, password length, honeypot check
3. `supabase.auth.signUp({ email, password, options: { data: { display_name, country_code } } })`
4. Confirmation email sent by Supabase (if enabled in dashboard)
5. User metadata stored: `display_name`, `country_code`

### Session Management
- Sessions stored in `localStorage` (key: `sb-YOUR_PROJECT_REF-auth-token`)
- Auto-refreshed via refresh token
- `getSession()` called on page load to restore session
- `onAuthStateChange()` listener for real-time auth state updates
- Cleanup: subscription unsubscribed on component unmount

### Redirect URLs (configure in Supabase Dashboard)
- `http://localhost:5173` (development)
- `https://thebutterflychallenge.com` (production)

---

## 5. Features (Detailed)

### 5.1 Hero Section
- Full-width hero with background image
- Animated counter showing real-time hand raises
- "Butterfly Month · May 2026" badge
- "Learn more" CTA → scrolls to How It Works
- "Watch the Tutorial" → opens video modal

### 5.2 How It Works (4 Steps)
Horizontal scroll carousel with snap behavior:
1. **Open camera** — Step 01 with image card
2. **The gesture** — Step 02, hands on heart
3. **Say it** — Step 03, "I got you, [name]"
4. **Tag 3** — Step 04, nominate 3 people
- Mobile: "Record & Share Your Challenge" CTA button (opens UGC modal)

### 5.3 People Are Showing Up (Video Wall)
- Auto-scrolling horizontal carousel of influencer videos
- 5 videos × 2 (duplicated for seamless loop)
- CSS `slide-infinite` animation at 40s per cycle
- Pauses on hover
- Stats bar: 23 countries, 147K+ people, "The wave is growing"

### 5.4 From The Community (UGC)
- Auto-scrolling horizontal carousel of community submissions
- CSS `community-scroll` animation at 30s per cycle
- Cards: `w-48 md:w-56 lg:w-64 xl:w-72` responsive sizing
- Videos autoplay muted with loop
- Empty state: "Be the first to share your butterfly moment! 🦋"
- Realtime subscription refreshes on new INSERT

### 5.5 I Did It Button
- Circular button with three states:
  - **Not clicked:** Blue smartphone icon + "I DID IT" + pulse animation
  - **Clicked (anonymous):** Green checkmark + "YOU DID IT"
  - **Clicked (logged in):** Green checkmark + "YOU DID IT" + date (e.g., "March 30, 2026")
- Persists in localStorage (`bc_did_it`)
- On click: confetti effect, counter increment, hand raise saved to DB
- Duplicate prevention: checks by `user_id` (logged in) or `session_id` (anonymous)
- IP geolocation fetched for city data before DB insert

### 5.6 Share Functionality
Opens share drawer modal with:
- **Native Share** (mobile only, logged-in only): Web Share API
- **TikTok:** Opens tiktok.com/upload
- **Instagram:** Opens instagram.com
- **WhatsApp:** Pre-filled message with `wa.me` link
- **X (Twitter):** Pre-filled tweet via `twitter.com/intent/tweet`
- **Copy Link:** Copies `butterflychallenge.org` to clipboard
- **Pre-written caption** with copy button
- **Email reminder** inline form (in share drawer)
- All share clicks tracked in Mixpanel + saved to `shares` table

### 5.7 Email Reminder
Two entry points:
1. Inline form in share drawer
2. Standalone modal ("Remind Me May 1" in final CTA section)

Flow:
1. Email inserted into `email_reminders` table
2. Edge Function called to send confirmation email via Resend
3. Duplicate detection: error code 23505, message contains "duplicate"/"unique"/"conflict", or HTTP 409
4. Already-subscribed users see success state (not error)
5. Logged-in users have email auto-filled

### 5.8 The Wave, Live (Globe + Leaderboard)
- **3D Globe:** globe.gl WebGL globe with country dots
- **Top Countries:** Aggregated from `hand_raises.country_code`
- **Top Cities:** Aggregated from `hand_raises.city`
- **Top Participants:** Aggregated from `shares` table (logged-in users only)
- Realtime subscription: refreshes on new `hand_raises` INSERT
- Leaderboard grid: 2 columns (logged out) / 3 columns (logged in)

### 5.9 UGC Camera Recording
Mobile-first camera recording experience:
1. **Mode selection:** Auto (3-second countdown) or Manual (tap to record)
2. **Camera:** Front-facing via `getUserMedia`, mirrored preview
3. **Recording:** MediaRecorder API, max 30 seconds, timer display
4. **Preview:** Play back recorded video, Retake/Use This buttons
5. **Consent:** Checkbox + "Share It 🦋" upload button
6. **Upload:** Supabase Storage → challenge_submissions table insert
7. **Fallback:** File input picker if camera unavailable

### 5.10 FAQ Accordion
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

### 5.11 Crisis Support Modal
- US resources: 988 Suicide & Crisis Lifeline (call/text), Crisis Text Line (741741)
- International: country selector dropdown
- Privacy note: "All conversations are confidential"
- Accessible from: navbar "Get Support", bottom bar "988", footer

### 5.12 Safe Exit
- Immediately navigates to `https://www.google.com`
- Available in: navbar (desktop), hamburger menu, bottom safety bar (mobile)

### 5.13 Auth Modal
- Google "Continue with Google" button with colored G logo
- "or" divider
- Name field (register only, optional)
- Email + password fields
- Email regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
- Password: min 6 chars (login), min 8 chars (register)
- Honeypot hidden field for bot protection
- Toggle between Login/Register modes

### 5.14 User Dropdown
- Avatar photo (Google) or initial letter circle
- Display name + email
- "My Stats" button → opens stats modal
- "Sign out" button (red)
- Click-outside to close
- Dropdown open animation (0.15s)

### 5.15 My Stats Modal
Shows when user has raised hand:
- Joined date (from `hand_raises.created_at`)
- Global hand count (live counter)
- Countries participating (leaderboard count)
- "You're part of something bigger. 🦋"

Not raised hand:
- "You haven't taken the challenge yet!"
- "Take it now →" button

### 5.16 Final CTA Section
- Background image with dark overlay
- "One person starts. 3 more continue." → "A billion hands rise."
- "Take the Challenge" button (white)
- "Remind Me May 1" button (ghost, opens email reminder modal)

### 5.17 Footer
- 4-column grid (brand, resources, organizations, crisis help)
- Social links: TikTok, Share, X, YouTube
- Crisis card: "US: Call or Text 988" + "Get Support Now"
- Bottom: Privacy, Terms, Accessibility, About + disclaimer
- Max-width: 1280px (matches navbar)

### 5.18 Bottom Safety Bar
- Fixed at bottom of viewport
- Left: Heart icon + "Need help? You're not alone."
- Right: "988" call button
- Mobile: Safe Exit button (left side)

---

## 6. Integrations

### 6.1 Supabase Edge Function: `send-email`
- **Runtime:** Deno (Supabase Edge Functions)
- **Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email`
- **Auth:** FUNCTION_SECRET in request body (deployed with `--no-verify-jwt`)
- **CORS:** Full CORS headers on all responses

**Actions:**
| Action | Trigger | Email Subject |
|---|---|---|
| `confirmation` | User subscribes to reminder | "You're in — Butterfly Challenge reminder set 🦋" |
| `reminder` | pg_cron on May 1 | "Today is Butterfly Month — take the challenge 🦋" |

**Environment Variables:**
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend email API key |
| `SUPABASE_URL` | Auto-injected by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected by Supabase |
| `FUNCTION_SECRET` | Request authentication secret |

### 6.2 Resend Email Service
- **From:** `Butterfly Challenge <hello@thebutterflychallenge.com>`
- **API:** `https://api.resend.com/emails`
- **Templates:** Inline HTML with butterfly branding, green accent (#00b18d)

### 6.3 pg_cron Scheduled Job
- **Schedule:** Runs on May 1, 2026
- **Action:** Queries `email_reminders` where `sent_reminder = false`, calls Edge Function for each

### 6.4 ipapi.co (IP Geolocation)
- **Endpoint:** `https://ipapi.co/json/`
- **Data used:** `country_code`, `city`
- **Called:** On every "I Did It" click (before DB insert)
- **Fallback:** `navigator.language` country code if API fails
- **Limit:** 1,000 requests/day (free tier)

### 6.5 Mixpanel EU
- **Token:** `YOUR_MIXPANEL_TOKEN`
- **API Host:** `https://api-eu.mixpanel.com`
- **Config:** `debug: false`, `track_pageview: true`, `persistence: 'localStorage'`, `ignore_dnt: true`

---

## 7. Deployment

### Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Single catch-all rewrite for SPA routing.

### Build Process
```bash
npm run build
# Executes: node node_modules/vite/bin/vite.js build
# Output: dist/index.html (single file, ~23MB with inlined assets)
```

`vite-plugin-singlefile` inlines all JavaScript, CSS, images, and videos as base64 into a single `index.html` file.

### Environment Setup
1. Clone repository
2. `npm install`
3. `npm run dev` → `http://localhost:5173`
4. Supabase credentials are hardcoded in `src/App.tsx` (anon key is safe for client-side)

### GitHub Repository
- **URL:** `https://github.com/[PRIVATE]/Butterfly_Awarness`
- **Branch:** `main`
- **Auto-deploy:** Vercel watches `main` branch

---

## 8. Analytics Events

All events tracked via Mixpanel:

| # | Event Name | Trigger | Properties |
|---|---|---|---|
| 1 | *(auto)* `$mp_web_page_view` | Page load | Automatic |
| 2 | `crisis_modal_opened` | "Get Support" clicked | — |
| 3 | `share_modal_opened` | Share drawer opens | — |
| 4 | `leaderboard_viewed` | Leaderboard section 50% in viewport (once) | — |
| 5 | `auth_modal_opened` | Sign In / Sign Up clicked | `{ mode: 'login' \| 'register' }` |
| 6 | `google_signin_attempted` | "Continue with Google" clicked | — |
| 7 | `user_registered` | Successful email signup | `{ method: 'email' }` |
| 8 | `user_signed_in` | Successful email login | `{ method: 'email' }` |
| 9 | `did_it_clicked` | "I Did It" button first click | — |
| 10 | `share_completed` | Any share button clicked | `{ platform: 'tiktok' \| 'instagram' \| 'whatsapp' \| 'twitter' \| 'copy' \| 'native_share' }` |
| 11 | `email_reminder_subscribed` | Email saved to DB | — |
| 12 | `email_reminder_opened` | "Remind Me May 1" clicked | — |
| 13 | `faq_opened` | FAQ item expanded | `{ question: '...' }` (first 50 chars) |
| 14 | `ugc_cta_clicked` | "Record & Share" button clicked | — |
| 15 | `ugc_submitted` | UGC video/image uploaded | `{ file_type: 'image' \| 'video' }` |
| 16 | `community_video_played` | Community video starts playing | — |

---

## 9. Security

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
- SELECT: Anyone can view

**shares:**
- INSERT: Anyone can insert
- SELECT: Anyone can view

**Storage (challenge-submissions bucket):**
- INSERT: Anyone can upload
- SELECT: Anyone can view

### Supabase Secrets
| Secret | Location | Purpose |
|---|---|---|
| Anon Key | Client-side (`src/App.tsx`) | Safe — designed for browser use, RLS enforces access |
| Service Role Key | Edge Function env only | Admin access — never exposed to client |
| RESEND_API_KEY | Edge Function env | Email sending |
| FUNCTION_SECRET | Edge Function env + client body | Guards Edge Function from casual abuse |

### Edge Function Authentication
- Deployed with `--no-verify-jwt` (no Supabase gateway JWT check)
- Protected by `FUNCTION_SECRET` in request body
- Secret value: `YOUR_FUNCTION_SECRET` (hardcoded in client — visible to anyone who inspects source, acceptable for this use case)

### Client-Side Protections
- Email regex validation
- Password minimum length (6 login, 8 register)
- Honeypot hidden field for bot detection
- Duplicate hand raise prevention (DB check before insert)

---

## 10. Known Limitations & Future Improvements

### Current Limitations
| Issue | Severity | Detail |
|---|---|---|
| ipapi.co 1,000/day limit | Medium | City data missing after limit; country falls back to navigator.language |
| Bundle size 23MB | Medium | vite-plugin-singlefile inlines ~13MB of video as base64 |
| Instagram sharing | Low | No pre-fill support — just opens instagram.com homepage |
| TikTok sharing | Low | Opens upload page — can't pre-fill content |
| Share tracking | Low | Tracks intent (button click), not actual delivery |
| FUNCTION_SECRET visible | Low | Hardcoded in client source — guards against casual abuse only |
| No email verification | Low | Depends on Supabase dashboard setting |
| Leaderboard client-side aggregation | Low | Full table scan for country/city counts — works for small-medium scale |

### Planned Improvements
- Move videos to CDN (reduce bundle from 23MB to ~2MB)
- Add moderation queue for community submissions
- Server-side leaderboard aggregation (Supabase RPC function)
- Add more OAuth providers (Apple, GitHub)
- Email verification flow
- Progressive Web App (PWA) support
- Dark mode
- Multi-language support (i18n)
- Admin dashboard for content moderation
- A/B testing via Mixpanel feature flags

---

## 11. Maintenance Guide

### Moderating Community Submissions
1. Go to Supabase Dashboard → Table Editor → `challenge_submissions`
2. Review submissions by `created_at` (newest first)
3. To remove: delete the row and the file from Storage → `challenge-submissions` bucket
4. All submissions are currently visible — no approval flow yet

### Updating Leaderboard Data
Leaderboard is real-time from DB. No manual updates needed.
- Countries: aggregated from `hand_raises.country_code`
- Cities: aggregated from `hand_raises.city`
- Participants: aggregated from `shares.user_id`

To reset: truncate the respective table in Supabase SQL Editor.

### Monitoring Edge Function Logs
1. Supabase Dashboard → Edge Functions → `send-email`
2. View invocation logs, errors, and response times
3. Check Resend dashboard for email delivery status

### pg_cron Schedule
The May 1 reminder cron job is configured in Supabase SQL Editor:
```sql
SELECT cron.schedule(
  'send-may-1-reminders',
  '0 9 1 5 *',  -- 9 AM UTC on May 1
  $$
  SELECT net.http_post(
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email',
    jsonb_build_object('action', 'reminder', 'email', email, 'secret', 'YOUR_FUNCTION_SECRET'),
    jsonb_build_object('Content-Type', 'application/json')
  )
  FROM email_reminders
  WHERE sent_reminder = false;
  $$
);
```

### Adding New FAQ Items
Edit `faqData` array in `src/App.tsx` (around line 180):
```typescript
{
  question: "Your new question?",
  answer: "Your answer text here."
}
```

### Updating Crisis Resources
Edit the Crisis Modal JSX in `src/App.tsx` (search for "Crisis Modal"). Country-specific resources are in the `<select>` dropdown and crisis link cards.

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
- **Headings:** text-5xl → 2xl:text-9xl (responsive with xl/2xl breakpoints)
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

*This documentation is auto-generated and maintained alongside the codebase. For questions, refer to the GitHub repository or contact the development team.*
