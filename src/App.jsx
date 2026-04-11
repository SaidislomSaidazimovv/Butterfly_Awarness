import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, Copy, Check, ChevronRight, ChevronDown, Share2, MapPin, ExternalLink, Mail, MessageCircle, Send, Film, ArrowRight, Clock, Phone, Heart, Globe2 } from "lucide-react";

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
import { createClient } from '@supabase/supabase-js';
import mixpanel from 'mixpanel-browser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';

/* ── Backend Init ── */
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY
);

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: false,
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
  api_host: 'https://api-eu.mixpanel.com'
});

function track(event, props) {
  try { mixpanel.track(event, props || {}); } catch(e) {}
}

/* ── Backend Helpers ── */
function getCountryCode() {
  try {
    const lang = navigator.language || navigator.languages?.[0] || '';
    const parts = lang.split('-');
    if (parts.length > 1) return parts[parts.length - 1].toUpperCase();
    return null;
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'getCountryCode', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    return null;
  }
}

async function getLocationData() {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`);
    const data = await res.json();
    return { country: data.country || null, city: data.city || null };
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'getLocationData', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    return { country: getCountryCode(), city: null };
  }
}

async function saveHandRaise(userId, city) {
  try {
    const sessionId = localStorage.getItem('bc_session') || crypto.randomUUID();
    localStorage.setItem('bc_session', sessionId);
    if (userId) {
      const { data: existing } = await supabase.from('hand_raises').select('id').eq('user_id', userId).single();
      if (existing) return;
    } else {
      const { data: existing } = await supabase.from('hand_raises').select('id').eq('session_id', sessionId).single();
      if (existing) return;
    }
    await supabase.from('hand_raises').insert({
      session_id: sessionId,
      user_id: userId || null,
      country_code: getCountryCode(),
      city: city || null,
      referred_by: localStorage.getItem('bc_ref') || null
    });
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'saveHandRaise', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
  }
}

async function saveEmail(email) {
  try {
    const { error } = await supabase.from('email_reminders').insert({ email });
    if (error) {
      const msg = error.message || error.details || '';
      const code = error.code || '';
      if (code === '23505' || msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists') || msg.includes('conflict')) {
        return { success: false, message: "You're already subscribed!" };
      }
      return { success: false, message: 'Something went wrong.' };
    }
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ action: 'confirmation', email, secret: import.meta.env.VITE_FUNCTION_SECRET })
      });
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'sendConfirmationEmail', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
    return { success: true };
  } catch { return { success: false, message: 'Something went wrong.' }; }
}


// TODO: Move base64 images to /public/images/ to reduce bundle from 3.9MB to ~20KB
const TEAL = "#0EA5A0";
const ff = "system-ui,-apple-system,'Segoe UI',sans-serif";
const URL_ = "https://butterflychallenge.org";
const STXT = "I'm doing the #ButterflyChallenge. I see you. I care. You're not alone.";
const SCRIPT = "I see you. I care. You're not alone.";
const HERO_IMG = "/images/extracted/hero.webp"
const SIGN_WOMAN1 = "/images/extracted/sign-woman-1.webp"
const SIGN_WOMAN2 = "/images/extracted/sign-woman-2.webp"
const SIGN_WOMAN3 = "/images/extracted/sign-woman-3.webp"
const SIGN_HANDS = "/images/extracted/sign-hands.webp"
const STEP_DFD1 = "/images/extracted/step-1.webp"
const STEP_DFD2 = "/images/extracted/step-2.webp"
const STEP_DFD3 = "/images/extracted/step-3.webp"
const ICON_CREATORS = "/images/extracted/icon-creators.svg"
const ICON_CELEBRITIES = "/images/extracted/icon-celebrities.svg"
const ICON_ATHLETES = "/images/extracted/icon-athletes.svg"
const ICON_MUSIC = "/images/extracted/icon-music.svg"
const ICON_DANCE = "/images/extracted/icon-dance.svg"
const ICON_FILM = "/images/extracted/icon-film.svg"
const ICON_FASHION = "/images/extracted/icon-fashion.svg"
const ICON_ART = "/images/extracted/icon-art.svg"
const ICON_FAITH = "/images/extracted/icon-faith.svg"
const ICON_GAMING = "/images/extracted/icon-gaming.svg"
const ICON_PODCAST = "/images/extracted/icon-podcast.svg"
const ICON_EVERYONE = "/images/extracted/icon-everyone.svg"
const AL_PLATFORMS = "/images/extracted/al-platforms.svg"
const AL_CARE = "/images/extracted/al-care.svg"
const AL_MEDIA = "/images/extracted/al-media.svg"
const AL_BUSINESS = "/images/extracted/al-business.svg"
const AL_EDUCATION = "/images/extracted/al-education.svg"
const AL_CONNECTIVITY = "/images/extracted/al-connectivity.svg"
const ICON_BUTTERFLY = "/images/extracted/icon-butterfly.svg"
const EVENT_BG = "/images/extracted/event-bg.webp"
const TRUST_IMG = "/images/extracted/trust.webp"
const CTA_IMG = "/images/extracted/cta.webp"
const JOIN_STEP1 = "/images/extracted/join-step-1.webp"
const JOIN_STEP2 = "/images/extracted/join-step-2.webp"
const JOIN_STEP3 = "/images/extracted/join-step-3.webp"
const CULTURE_BG = "/images/extracted/culture-bg.webp"
const LOGO_DARK = "/images/extracted/logo-dark.svg"
const STAT_LEADERS = "/images/extracted/stat-leaders.svg"
const STAT_REACH = "/images/extracted/stat-reach.svg"
const STAT_RAISED = "/images/extracted/stat-raised.svg"
const ORG_SCHOOL = "/images/extracted/org-school.svg"
const ORG_TEAMS = "/images/extracted/org-teams.svg"
const ORG_BRANDS = "/images/extracted/org-brands.svg"
const HL_IMG1 = "/images/extracted/highlight-1.webp"
const HL_IMG2 = "/images/extracted/highlight-2.webp"
const HL_IMG3 = "/images/extracted/highlight-3.webp"
const HL_IMG4 = "/images/extracted/highlight-4.webp"
const g = { bg: "#f5f5f7", t1: "#1d1d1f", t2: "#6e6e73", t3: "#86868b", t4: "#aeaeb2", bdr: "#d2d2d7", link: "#00B18D" };

const CAPS = [
  { id: "a", text: "I'm doing the #ButterflyChallenge. [Name], I see you. I care. You're not alone. Lifting 3 more: @__ @__ @__" },
  { id: "b", text: "A 60‑second check‑in. [Name], I got you. #ButterflyChallenge Lifting 3: @__ @__ @__" },
  { id: "c", text: "If you're carrying something in silence: I see you. I care. You're not alone. #ButterflyChallenge" },
];
const ROLES = [
  { icon: ICON_CREATORS, name: "Creators", word: "Ignition", line: "You have the reach.", detail: "When a creator makes the sign, their audience doesn't see a campaign. They see someone they trust showing up. We're inviting a founding group to help ignite this into culture. One video. Three nominations. Forever." },
  { icon: ICON_CELEBRITIES, name: "Celebrities", word: "Consequence", line: "A voice the world trusts.", detail: "When a celebrity makes the sign, the world doesn't see a promotion. It sees a person saying something true. Not ambassadors — people who chose to show up when it mattered." },
  { icon: ICON_ATHLETES, name: "Athletes", word: "Strength", line: "Showing up is strength.", detail: "When an athlete makes the sign, people see courage. Sport is where humanity processes its hardest emotions. The stadium is where people feel together." },
  { icon: ICON_MUSIC, name: "Music", word: "Sound", line: "Before language, there's sound.", detail: "Music reaches where words stop. 1 billion people carry something in silence. That silence has never had a sound. Until now." },
  { icon: ICON_DANCE, name: "Dance", word: "Motion", line: "A body before a word.", detail: "Dance turns emotion into motion. Every movement that lived in the body outlasted every movement that lived only in the mind." },
  { icon: ICON_FILM, name: "Film", word: "Story", line: "A story before memory.", detail: "Film shapes how the world sees culture. April 30. Miami. The story begins there. One story told honestly." },
  { icon: ICON_FASHION, name: "Fashion", word: "Statement", line: "A statement before a speech.", detail: "What people wear is what people mean. When fashion carries the butterfly, the movement is being worn into the world." },
  { icon: ICON_ART, name: "Art", word: "Image", line: "An image before explanation.", detail: "Art makes the invisible impossible to ignore. The first works don't decorate the movement — they define how the world remembers it." },
  { icon: ICON_FAITH, name: "Faith", word: "Trust", line: "Trust before reach.", detail: "Faith and community go where no campaign can — into homes, families, grief, ordinary life. A signal anyone can make." },
  { icon: ICON_GAMING, name: "Gaming", word: "World", line: "3.6 billion players.", detail: "Gaming is belonging. Teams, squads, shared missions. The butterfly is a signal waiting to become a mission." },
  { icon: ICON_PODCAST, name: "Podcast", word: "Voice", line: "Too personal for the feed.", detail: "The most powerful thing a host can do is not explain the movement — it's to say: I made the sign. I thought of someone I love." },
  { icon: ICON_EVERYONE, name: "Everyone", word: "Humanity", line: "You need one person.", detail: "You don't need followers or a camera. You need one name in your mind and sixty seconds of courage." },
];
const ALLIANCES = [
  { icon: AL_PLATFORMS, name: "Platforms", line: "How a movement travels.", brief: "TikTok, YouTube, Meta, Instagram, X. Feature the challenge, enable sign filters, nomination mechanics. BOS Help Button before launch.", tint: "invert(37%) sepia(78%) saturate(2476%) hue-rotate(203deg) brightness(101%)" },
  { icon: AL_CARE, name: "Care", line: "Joining people already showing up.", brief: "Mental health orgs, NGOs, foundations. Verified on the Human Routing Map. The movement points toward care — never replaces it.", tint: "invert(30%) sepia(95%) saturate(3000%) hue-rotate(340deg) brightness(95%)" },
  { icon: AL_MEDIA, name: "Media", line: "How a movement is witnessed.", brief: "Broadcasters, publishers, press. IASP safe messaging in every piece of coverage. April 30 access.", tint: "invert(55%) sepia(95%) saturate(2000%) hue-rotate(10deg) brightness(100%)" },
  { icon: AL_BUSINESS, name: "Business", line: "How it becomes culture.", brief: "Brands, employers, CSR teams. Butterfly Month in your calendar. No emotional washing.", tint: "invert(20%) sepia(80%) saturate(3000%) hue-rotate(260deg) brightness(90%)" },
  { icon: AL_EDUCATION, name: "Education", line: "The next generation.", brief: "Schools, universities, youth orgs. No student encounters the challenge without a pathway to real support.", tint: "invert(45%) sepia(90%) saturate(1800%) hue-rotate(130deg) brightness(92%)" },
  { icon: AL_CONNECTIVITY, name: "Connectivity", line: "Every hand.", brief: "Telcos, SMS, device ecosystems. The person with no data can still find help. Always.", tint: "invert(45%) sepia(80%) saturate(2000%) hue-rotate(165deg) brightness(95%)" },
];
const TRUST = [{ m: "🏛", t: "501(c)(3) Nonprofit", d: "Independent governance. Auditable from Day 1." }, { m: "🛡", t: "Safety Officer", d: "Unilateral veto. Cannot be overruled." }, { m: "📡", t: "Radical Transparency", d: "Weekly: Money In → Out → Programs → Outcomes." }, { m: "⚖️", t: "Editorial Independence", d: "No sponsor has editorial control. Ever." }, { m: "🌍", t: "Dignity-First", d: "Non-diagnostic. IASP safe messaging." }, { m: "✅", t: "Free Forever", d: "Open to everyone, everywhere." }];
const CRISIS = [{ c: "US & Canada", n: "988", s: "24/7" }, { c: "UK", n: "116 123", s: "Samaritans" }, { c: "Australia", n: "13 11 14", s: "Lifeline" }, { c: "France", n: "3114", s: "24/7" }, { c: "Germany", n: "0800 111 0 111", s: "24/7" }, { c: "India", n: "+91 9999 666 555", s: "24/7" }];
const FAQS = [{ q: "What is the Butterfly Challenge?", a: "A 60-second act of connection. Make the sign, say the message, challenge 3 others. Free forever." }, { q: "Why a butterfly?", a: "The most universal symbol of transformation. Already recognized in ASL. No translation needed." }, { q: "Do I need to donate?", a: "No. The challenge is free for everyone, everywhere, forever." }, { q: "Is this therapy?", a: "No. It's a signal. Crisis resources are on this page." }, { q: "What is Butterfly Month?", a: "May, every year. The globally recognized month for mental health." }, { q: "Who is behind this?", a: "ONE HUMANITY Foundation — U.S. 501(c)(3). 100% to mental health." }];
const CDATA = { "United States": { lat: 39.8, lng: -98.5, cities: { "New York": [40.71, -74.01] } }, "United Kingdom": { lat: 55.4, lng: -3.4, cities: { "London": [51.51, -0.13] } }, "Canada": { lat: 56, lng: -106, cities: {} }, "Germany": { lat: 51, lng: 10.5, cities: { "Berlin": [52.52, 13.41] } }, "Brazil": { lat: -14, lng: -52, cities: { "São Paulo": [-23.55, -46.63] } }, "India": { lat: 20.6, lng: 79, cities: { "Mumbai": [19.08, 72.88] } }, "Japan": { lat: 36, lng: 138, cities: { "Tokyo": [35.68, 139.69] } }, "Australia": { lat: -25, lng: 134, cities: { "Sydney": [-33.87, 151.21] } }, "South Africa": { lat: -31, lng: 23, cities: {} }, "Kenya": { lat: 0, lng: 38, cities: { "Nairobi": [-1.29, 36.82] } }, "Mexico": { lat: 24, lng: -103, cities: {} }, "Uzbekistan": { lat: 41, lng: 65, cities: {} }, "Other": { lat: 0, lng: 0, cities: {} } };
const SEED = [{ id: "s1", country: "United States", city: "New York", lat: 40.71, lng: -74.01, createdAt: Date.now() - 12e4 }, { id: "s2", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13, createdAt: Date.now() - 3e5 }, { id: "s3", country: "Brazil", city: "São Paulo", lat: -23.55, lng: -46.63, createdAt: Date.now() - 6e5 }, { id: "s4", country: "Japan", city: "Tokyo", lat: 35.68, lng: 139.69, createdAt: Date.now() - 9e5 }, { id: "s5", country: "India", city: "Mumbai", lat: 19.08, lng: 72.88, createdAt: Date.now() - 18e5 }, { id: "s6", country: "Kenya", city: "Nairobi", lat: -1.29, lng: 36.82, createdAt: Date.now() - 36e5 }, { id: "s7", country: "Australia", city: "Sydney", lat: -33.87, lng: 151.21, createdAt: Date.now() - 54e5 }, { id: "s8", country: "Germany", city: "Berlin", lat: 52.52, lng: 13.41, createdAt: Date.now() - 72e5 }];

function relT(ts) { const d = Math.floor((Date.now() - ts) / 1000); if (d < 60) return "now"; if (d < 3600) return Math.floor(d / 60) + "m"; if (d < 86400) return Math.floor(d / 3600) + "h"; return Math.floor(d / 86400) + "d"; }
function rLL(co, ci) { const c = CDATA[co]; if (!c) return [0, 0]; if (ci && c.cities[ci]) return c.cities[ci]; for (const [k, v] of Object.entries(c.cities)) if (k.toLowerCase().includes((ci || "").toLowerCase())) return v; return [c.lat + (Math.random() - .5) * 4, c.lng + (Math.random() - .5) * 4]; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function useLH() {
  const [e, sE] = useState(SEED);
  const add = useCallback(({ country, city }) => { const [lat, lng] = rLL(country, city); sE(p => [{ id: uid(), country, city: city || "", lat, lng, createdAt: Date.now() }, ...p]); }, []);
  useEffect(() => {
    supabase
      .from('hand_raises')
      .select('city, country_code, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const dbEntries = data.map(r => {
          const [lat, lng] = rLL(r.country_code || 'US', r.city || '');
          return { id: uid(), country: r.country_code || 'US', city: r.city || '', lat, lng, createdAt: new Date(r.created_at).getTime() };
        });
        sE(prev => [...dbEntries, ...prev]);
      });
  }, []);
  return { entries: e, addEntry: add };
}

const SCI_IMG_BRAIN = "/images/extracted/sci-brain.webp"
const SCI_IMG_HANDS = "/images/extracted/sci-hands.webp"
const SCI_IMG_SCAN = "/images/extracted/sci-scan.webp"
const STORY_IMG_ORIGIN = "/images/extracted/story-origin.webp"
const STORY_IMG_STAGE = "/images/extracted/story-stage.webp"

function useToast() { const [t, sT] = useState(null); const r = useRef(); const show = useCallback(m => { clearTimeout(r.current); sT(m); r.current = setTimeout(() => sT(null), 2e3); }, []); return { toast: t, show }; }

/* Scroll reveal hook */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return <div ref={ref} style={{ opacity: 0, transform: "translateY(20px)", transition: `opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`, ...style }}>{children}</div>;
}

/* ─ Components ─ */
function Toast({ message }) {
  if (!message) return null;
  return <div style={{ position: "fixed", bottom: 96, left: "50%", zIndex: 300, animation: "toastIn .35s cubic-bezier(.16,1,.3,1)" }}>
    <div style={{ transform: "translateX(-50%)", background: g.t1, color: "#fff", padding: "10px 22px", borderRadius: 99, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, fontFamily: ff, boxShadow: "0 4px 20px rgba(0,0,0,.15)" }}><Check size={13} />{message}</div>
  </div>;
}

function Popup({ open, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) { setVisible(true); setAnimating(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(false))); document.body.style.overflow = "hidden"; }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!visible) return null;
  const entering = open && !animating;
  const opa = entering ? 1 : 0;
  const scale = entering ? 1 : 0.96;
  const tY = entering ? 0 : 12;
  const ease = "cubic-bezier(.16,1,.3,1)";

  return <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${entering ? 0.18 : 0})`, backdropFilter: `blur(${entering ? 40 : 0}px)`, WebkitBackdropFilter: `blur(${entering ? 40 : 0}px)`, transition: `background .3s ${ease}, backdrop-filter .3s ${ease}, -webkit-backdrop-filter .3s ${ease}` }} />
    <div style={{
      position: "absolute", top: "50%", left: "50%", width: "min(90vw,480px)", maxHeight: "84vh", overflowY: "auto",
      background: "#fff", borderRadius: 20, boxShadow: `0 8px 80px rgba(0,0,0,${entering ? 0.12 : 0}), 0 0 0 0.5px rgba(0,0,0,.06)`,
      opacity: opa, transform: `translate(-50%,-50%) scale(${scale}) translateY(${tY}px)`,
      transition: `opacity .3s ${ease}, transform .35s ${ease}, box-shadow .3s ${ease}`,
    }}>
      <button onClick={onClose} autoFocus aria-label="Close" style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,.06)", border: "none", width: 30, height: 30, borderRadius: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: g.t3, zIndex: 1, transition: "background .2s" }}><X size={15} /></button>
      <div style={{ padding: "32px 30px 28px" }}>{children}</div>
    </div>
  </div>;
}

function Btn({ children, primary, onClick, icon, disabled, style }) {
  return <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "14px 28px", borderRadius: 980, fontSize: 17, fontWeight: 400, fontFamily: ff, border: primary ? "none" : "1px solid " + g.bdr, background: primary ? "#00B18D" : "#fff", color: primary ? "#fff" : g.t1, cursor: disabled ? "default" : "pointer", opacity: disabled ? .35 : 1, transition: "all .25s cubic-bezier(.16,1,.3,1)", outline: "none", ...style }}>{icon}{children}</button>;
}

function Link({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 16, fontWeight: 400, color: g.link, cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 3, transition: "gap .2s" }}>{children} <span style={{ fontSize: 18, transition: "transform .2s" }}>›</span></button>;
}

function BF({ size = 140 }) { return <svg width={size} height={size * .78} viewBox="0 0 300 236" fill="none"><path d="M150 128C124 112 68 82 26 57 9 46 5 28 17 15 29 2 52 5 79 21 111 41 138 84 150 128Z" fill={TEAL} opacity=".82" /><path d="M150 128C176 112 232 82 274 57 291 46 295 28 283 15 271 2 248 5 221 21 189 41 162 84 150 128Z" fill={TEAL} opacity=".82" /><path d="M150 128C128 143 84 174 70 200 60 217 69 230 85 230 103 230 129 212 145 188 152 176 154 152 150 128Z" fill={TEAL} opacity=".38" /><path d="M150 128C172 143 216 174 230 200 240 217 231 230 215 230 197 230 171 212 155 188 148 176 146 152 150 128Z" fill={TEAL} opacity=".38" /><ellipse cx="150" cy="130" rx="3.5" ry="24" fill="#07706C" /></svg>; }

function Globe({ entries }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const dragRef = useRef(null);
  const velRef = useRef(0);
  const SIZE = 600;
  const R = 240;

  // Accurate land mask — longitude ranges per latitude band (every 4°)
  const LAND_BANDS = useMemo(() => {
    const raw = [
      [72,[[-170,-140],[-130,-60],[15,180]]],
      [68,[[-168,-142],[-136,-58],[14,180]]],
      [64,[[-168,-140],[-140,-55],[-24,-13],[6,180]]],
      [60,[[-165,-140],[-140,-54],[-24,-13],[4,180]]],
      [56,[[-162,-148],[-136,-52],[-8,-1],[6,180]]],
      [52,[[-132,-52],[-11,2],[4,180]]],
      [48,[[-126,-52],[-6,145]]],
      [44,[[-124,-66],[-10,148]]],
      [40,[[-124,-74],[-10,80],[84,145]]],
      [36,[[-122,-75],[-10,45],[48,78],[96,146]]],
      [32,[[-120,-78],[-8,36],[38,70],[72,88],[98,135]]],
      [28,[[-118,-80],[-16,56],[68,95],[98,122],[128,142]]],
      [24,[[-114,-86],[-18,56],[70,94],[98,122]]],
      [20,[[-106,-86],[-18,52],[72,92],[96,122]]],
      [16,[[-92,-82],[-18,52],[74,85],[96,126]]],
      [12,[[-86,-82],[-16,52],[75,81],[98,128]]],
      [8,[[-80,-60],[-14,50],[98,132]]],
      [4,[[-80,-50],[-10,46],[98,142]]],
      [0,[[-80,-48],[-10,42],[100,142]]],
      [-4,[[-80,-38],[8,42],[104,142]]],
      [-8,[[-78,-34],[12,42],[106,142]]],
      [-12,[[-76,-36],[16,50],[118,140]]],
      [-16,[[-74,-38],[20,50],[122,148]]],
      [-20,[[-72,-40],[24,48],[116,152]]],
      [-24,[[-70,-40],[26,50],[114,154]]],
      [-28,[[-68,-48],[18,34],[114,154]]],
      [-32,[[-72,-52],[-66,-56],[18,32],[115,153]]],
      [-36,[[-74,-70],[-65,-56],[18,30],[116,152]]],
      [-40,[[-74,-72],[-68,-62],[140,148],[172,178]]],
      [-44,[[-76,-72],[-70,-64],[144,148],[168,178]]],
      [-48,[[-76,-72]]],
      [-52,[[-72,-68]]],
    ];
    return raw;
  }, []);

  const isLand = useCallback((lat, lng) => {
    // Find the two closest bands and interpolate
    let best = null, bestDist = 999;
    for (const band of LAND_BANDS) {
      const d = Math.abs(lat - band[0]);
      if (d < bestDist) { bestDist = d; best = band; }
    }
    if (!best || bestDist > 6) return false;
    const ranges = best[1];
    for (const [lo, hi] of ranges) {
      if (lng >= lo && lng <= hi) return true;
    }
    return false;
  }, [LAND_BANDS]);

  // Pre-generate sphere dots
  const sphereDots = useMemo(() => {
    const dots = [];
    const N = 8000;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < N; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / N);
      const phi = 2 * Math.PI * i / goldenRatio;
      const lat = 90 - (theta * 180 / Math.PI);
      const lng = (phi * 180 / Math.PI) % 360 - 180;
      const land = isLand(lat, lng);
      dots.push({ lat, lng, theta, phi, land });
    }
    return dots;
  }, [isLand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = SIZE;
    canvas.height = SIZE;

    let reduced = false;
    try { reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) {}

    let animId;
    const cx = SIZE / 2, cy = SIZE / 2;
    const toR = d => d * Math.PI / 180;

    const draw = () => {
      // Auto-rotate
      if (!dragRef.current) {
        phiRef.current += reduced ? 0 : 0.003;
        phiRef.current += velRef.current;
        velRef.current *= 0.95;
      }

      const phi = phiRef.current;
      const theta = thetaRef.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Globe glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.4);
      glow.addColorStop(0, "rgba(14,165,160,0.04)");
      glow.addColorStop(1, "rgba(14,165,160,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Globe background
      const bg = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
      bg.addColorStop(0, "#fafafa");
      bg.addColorStop(1, "#e8e8ed");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Project and draw dots
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (const dot of sphereDots) {
        const la = toR(dot.lat);
        const lo = toR(dot.lng);

        const x0 = Math.cos(la) * Math.cos(lo);
        const y0 = Math.cos(la) * Math.sin(lo);
        const z0 = Math.sin(la);

        const x1 = x0 * cosPhi + y0 * sinPhi;
        const y1 = -x0 * sinPhi + y0 * cosPhi;
        const z1 = z0;

        const x2 = x1;
        const y2 = y1 * cosTheta - z1 * sinTheta;
        const z2 = y1 * sinTheta + z1 * cosTheta;

        if (z2 < 0.02) continue;

        const px = cx + x2 * R;
        const py = cy - y2 * R;

        if (dot.land) {
          const size = 0.6 + z2 * 1.0;
          const alpha = 0.15 + z2 * 0.65;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,160,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // Draw entry markers
      const projected = [];
      for (const entry of entries) {
        const la = toR(entry.lat);
        const lo = toR(entry.lng);

        const x0 = Math.cos(la) * Math.cos(lo);
        const y0 = Math.cos(la) * Math.sin(lo);
        const z0 = Math.sin(la);

        const x1 = x0 * cosPhi + y0 * sinPhi;
        const y1 = -x0 * sinPhi + y0 * cosPhi;
        const x2 = x1;
        const y2 = y1 * cosTheta - z0 * sinTheta;
        const z2 = y1 * sinTheta + z0 * cosTheta;

        projected.push({ px: cx + x2 * R, py: cy - y2 * R, z2, x0, y0, z0: z0 });

        if (z2 < 0.1) continue;

        const px = cx + x2 * R;
        const py = cy - y2 * R;

        // Glow
        const mg = ctx.createRadialGradient(px, py, 0, px, py, 12);
        mg.addColorStop(0, `rgba(14,165,160,${0.4 * z2})`);
        mg.addColorStop(1, "rgba(14,165,160,0)");
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = TEAL;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Animated arcs between entry pairs
      const now = Date.now();
      const arcPairs = [];
      for (let i = 0; i < entries.length - 1 && i < 6; i++) {
        arcPairs.push([i, i + 1]);
      }
      // Also connect last to first for a loop
      if (entries.length > 2) arcPairs.push([entries.length - 1, 0]);

      for (const [ai, bi] of arcPairs) {
        const a = entries[ai], b = entries[bi];
        const la1 = toR(a.lat), lo1 = toR(a.lng);
        const la2 = toR(b.lat), lo2 = toR(b.lng);

        // Cartesian positions on unit sphere
        const ax = Math.cos(la1) * Math.cos(lo1), ay = Math.cos(la1) * Math.sin(lo1), az = Math.sin(la1);
        const bx = Math.cos(la2) * Math.cos(lo2), by = Math.cos(la2) * Math.sin(lo2), bz = Math.sin(la2);

        // Great circle interpolation with height
        const dot = ax * bx + ay * by + az * bz;
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
        const arcHeight = 0.15 + angle * 0.25; // higher arcs for longer distances

        // Pulse animation: progress cycles 0→1 over 3 seconds per arc, offset by pair index
        const pulse = ((now + ai * 700) % 3000) / 3000;
        const pulseWidth = 0.25;

        const STEPS = 32;
        let prevPt = null;
        for (let s = 0; s <= STEPS; s++) {
          const t = s / STEPS;

          // Slerp between the two points
          const sinA = Math.sin(angle);
          let ix, iy, iz;
          if (sinA < 0.001) {
            ix = ax + (bx - ax) * t;
            iy = ay + (by - ay) * t;
            iz = az + (bz - az) * t;
          } else {
            const w1 = Math.sin((1 - t) * angle) / sinA;
            const w2 = Math.sin(t * angle) / sinA;
            ix = ax * w1 + bx * w2;
            iy = ay * w1 + by * w2;
            iz = az * w1 + bz * w2;
          }

          // Normalize and add height (parabolic)
          const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
          const h = 1 + arcHeight * 4 * t * (1 - t); // parabolic rise
          ix = ix / len * h;
          iy = iy / len * h;
          iz = iz / len * h;

          // Rotate same as globe
          const rx1 = ix * cosPhi + iy * sinPhi;
          const ry1 = -ix * sinPhi + iy * cosPhi;
          const rx2 = rx1;
          const ry2 = ry1 * cosTheta - iz * sinTheta;
          const rz2 = ry1 * sinTheta + iz * cosTheta;

          if (rz2 < 0.05) { prevPt = null; continue; }

          const px = cx + rx2 * R;
          const py = cy - ry2 * R;

          if (prevPt) {
            // Pulse brightness — brighter near the pulse position
            const dist = Math.abs(t - pulse);
            const wrap = Math.min(dist, 1 - dist);
            const brightness = Math.max(0, 1 - wrap / pulseWidth);
            const alpha = (0.06 + brightness * 0.35) * rz2;

            ctx.beginPath();
            ctx.moveTo(prevPt.x, prevPt.y);
            ctx.lineTo(px, py);
            ctx.strokeStyle = `rgba(14,165,160,${alpha.toFixed(2)})`;
            ctx.lineWidth = 0.8 + brightness * 1.5;
            ctx.stroke();
          }
          prevPt = { x: px, y: py };
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [entries, sphereDots]);

  // Pointer interaction
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, phi: phiRef.current, theta: thetaRef.current };
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    phiRef.current = dragRef.current.phi + dx * 0.005;
    thetaRef.current = dragRef.current.theta + dy * 0.005;
    velRef.current = dx * 0.0001;
  };
  const onPointerUp = () => { dragRef.current = null; };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-label="Interactive globe showing participant locations"
      role="img"
      style={{
        width: "100%", maxWidth: 320, aspectRatio: "1", cursor: "grab",
        touchAction: "none",
      }}
    />
  );
}

function Chain({ onJoin }) {
  const [lv, sL] = useState(0);
  const [counting, setCounting] = useState(false);
  const [counter, setCounter] = useState(0);
  const [done, setDone] = useState(false);
  const cRef = useRef(null);

  const steps = [
    { n: 1, label: "You", msg: "One person. One gesture.", emoji: 1 },
    { n: 3, label: "3", msg: "You lift 3 people.", emoji: 3 },
    { n: 9, label: "9", msg: "They each lift 3 more.", emoji: 9 },
    { n: 27, label: "27", msg: "It's already spreading.", emoji: 27 },
    { n: 81, label: "81", msg: "Four generations deep.", emoji: 40 },
    { n: 243, label: "243", msg: "Five generations. Now watch.", emoji: 40 },
  ];

  const advance = () => {
    if (lv < 5) {
      sL(lv + 1);
    } else if (!counting && !done) {
      // Trigger the dramatic fast-count to 1 billion
      setCounting(true);
      setCounter(243);
      const targets = [729, 2187, 6561, 19683, 59049, 177147, 531441, 1594323, 4782969, 14348907, 43046721, 129140163, 387420489, 1000000000];
      let i = 0;
      const tick = () => {
        if (i < targets.length) {
          setCounter(targets[i]);
          i++;
          cRef.current = setTimeout(tick, i < 8 ? 120 : i < 12 ? 180 : 280);
        } else {
          setCounting(false);
          setDone(true);
        }
      };
      cRef.current = setTimeout(tick, 200);
    }
  };

  const reset = () => {
    clearTimeout(cRef.current);
    sL(0); setCounting(false); setCounter(0); setDone(false);
  };

  useEffect(() => { return () => clearTimeout(cRef.current); }, []);

  const fmt = (n) => {
    if (n >= 1e9) return "1,000,000,000";
    if (n >= 1e6) return Math.floor(n / 1e6).toLocaleString() + "M";
    if (n >= 1e3) return Math.floor(n / 1e3).toLocaleString() + "K";
    return n.toLocaleString();
  };

  // DONE state — the big reveal
  if (done) {
    return (
      <div style={{ textAlign: "center", animation: "fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
        <img src={ICON_BUTTERFLY} alt="" style={{ width: 56, height: 56, marginBottom: 8, display: "block", marginLeft: "auto", marginRight: "auto" }} />
        <p style={{
          fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1,
          background: "linear-gradient(90deg," + TEAL + ",#2ecc71,#06b6d4)", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6
        }}>1,000,000,000</p>
        <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, marginBottom: 4 }}>One billion hands.</p>
        <p style={{ fontSize: 15, color: g.t3, marginBottom: 20, lineHeight: 1.5 }}>
          20 generations. Starting with one person.<br />Starting with you.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary onClick={onJoin} style={{ fontSize: 15, padding: "12px 24px" }}>Be that person</Btn>
          <Btn onClick={reset} style={{ fontSize: 13, padding: "10px 18px", color: g.t3, borderColor: g.bdr }}>Watch again</Btn>
        </div>
      </div>
    );
  }

  // COUNTING state — fast rolling numbers
  if (counting) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 4 }}>{Array.from({length:10}).map((_,i)=><img key={i} src={ICON_BUTTERFLY} alt="" style={{ width: 12, height: 12 }} />)}</div>
        <p style={{
          fontSize: 44, fontWeight: 700, color: TEAL, letterSpacing: "-.03em",
          fontVariantNumeric: "tabular-nums", transition: "all .1s", fontFamily: "monospace, " + ff
        }}>{fmt(counter)}</p>
        <p style={{ fontSize: 13, color: g.t3, animation: "fadeUp .3s ease" }}>
          {counter < 1e4 ? "Growing..." : counter < 1e6 ? "Still going..." : counter < 1e8 ? "Almost there..." : "..."}
        </p>
      </div>
    );
  }

  // STEP state — interactive butterfly grid
  const s = steps[lv];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", minHeight: 48, alignItems: "center", padding: "8px 0" }}>
        {Array.from({ length: Math.min(s.emoji, 40) }).map((_, i) => (
          <img key={i} src={ICON_BUTTERFLY} alt="" style={{ width: s.emoji > 27 ? 11 : 20, height: s.emoji > 27 ? 11 : 20, animation: `popIn .3s cubic-bezier(.16,1,.3,1) ${i * 15}ms both` }} />
        ))}
        {s.emoji > 40 && <span style={{ fontSize: 11, color: g.t3, marginLeft: 4 }}>+{s.n - 40}</span>}
      </div>
      <p style={{ fontSize: 36, fontWeight: 600, color: g.t1, letterSpacing: "-.03em" }}>{s.label}</p>
      <p style={{ fontSize: 14, color: g.t3, marginBottom: 16 }}>{s.msg}</p>
      <Btn primary onClick={advance} style={{ fontSize: 14, padding: "10px 22px" }}>
        {lv === 0 ? "Lift 3" : lv < 5 ? "Next generation" : "Keep going →"}
      </Btn>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 14 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i <= lv ? g.t1 : g.bdr, transition: "background .3s" }} />
        ))}
        <div style={{ width: 5, height: 5, borderRadius: 3, background: g.bdr }} />
      </div>
    </div>
  );
}

function Countdown() {
  const target = new Date("2026-04-30T19:00:00-04:00").getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 864e5);
  const hrs = Math.floor((diff % 864e5) / 36e5);
  const mins = Math.floor((diff % 36e5) / 6e4);
  const secs = Math.floor((diff % 6e4) / 1e3);
  const isPast = diff === 0;

  const unit = (val, label) => (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <p style={{
        fontSize: 36, fontWeight: 600, letterSpacing: "-.03em", color: g.t1,
        fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: 4,
        transition: "all .3s cubic-bezier(.16,1,.3,1)"
      }}>{String(val).padStart(2, "0")}</p>
      <p style={{ fontSize: 11, color: g.t4, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</p>
    </div>
  );

  const sep = () => (
    <span style={{ fontSize: 28, fontWeight: 300, color: g.bdr, alignSelf: "flex-start", marginTop: 2 }}>:</span>
  );

  if (isPast) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28, padding: "16px 0" }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: "#34c759", animation: "pulse 2s ease infinite" }} />
        <span style={{ fontSize: 16, fontWeight: 600, color: g.t1 }}>The movement has started.</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 12,
        padding: "20px 0"
      }}>
        {unit(days, "days")}{sep()}{unit(hrs, "hours")}{sep()}{unit(mins, "min")}{sep()}{unit(secs, "sec")}
      </div>
      <p style={{ fontSize: 12, color: g.t4, textAlign: "center" }}>until the founding moment</p>
    </div>
  );
}

function VisualTimeline() {
  const [active, setActive] = useState(null);
  const items = [
    { d: "Apr 30", t: "One Night For One Humanity", s: "The founding event. Hero Act revealed live. Queen Miami Beach.", live: true },
    { d: "May 1", t: "Butterfly Month begins", s: "The challenge goes global. Creators activate worldwide." },
    { d: "May–Jun", t: "Culture surfaces activate", s: "Formula 1 · Music festivals · Film · Fashion weeks · Sports." },
    { d: "Jul 19", t: "FIFA World Cup Final", s: "MetLife Stadium. 5 billion people watching. The sign goes everywhere." },
    { d: "Sep", t: "UN General Assembly", s: "Butterfly Week. Institutional mandate. The movement becomes permanent." },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      {items.map((item, i) => {
        const isOpen = active === i;
        return (
          <button key={i} onClick={() => setActive(isOpen ? null : i)} style={{
            display: "flex", gap: 16, width: "100%", padding: "16px 0",
            borderBottom: i < items.length - 1 ? "1px solid #e8e8ed" : "none",
            background: "none", border: "none", borderBottomStyle: i < items.length - 1 ? "solid" : "none",
            borderBottomWidth: 1, borderBottomColor: "#e8e8ed",
            cursor: "pointer", fontFamily: ff, textAlign: "left",
            transition: "all .2s"
          }}>
            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, minWidth: 16 }}>
              <div style={{
                width: item.live ? 10 : 8, height: item.live ? 10 : 8, borderRadius: "50%",
                background: item.live ? TEAL : isOpen ? g.t1 : g.bdr,
                transition: "all .3s cubic-bezier(.16,1,.3,1)",
                boxShadow: item.live ? "0 0 0 3px " + TEAL + "30" : "none",
                animation: item.live ? "pulse 2s ease infinite" : "none"
              }} />
              {i < items.length - 1 && (
                <div style={{ width: 1.5, flex: 1, marginTop: 6, background: isOpen ? g.t1 + "30" : "#e8e8ed", transition: "background .3s", minHeight: 20 }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.live ? TEAL : g.t3, marginRight: 10 }}>{item.d}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: g.t1 }}>{item.t}</span>
                </div>
                <ChevronDown size={14} style={{
                  color: g.t4, flexShrink: 0,
                  transition: "transform .35s cubic-bezier(.16,1,.3,1)",
                  transform: isOpen ? "rotate(180deg)" : "none"
                }} />
              </div>
              <div style={{
                overflow: "hidden",
                maxHeight: isOpen ? 80 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease",
                marginTop: isOpen ? 8 : 0
              }}>
                <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.55 }}>{item.s}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FAQ() {
  const [o, sO] = useState(null);
  return <div>{FAQS.map((f, i) => <div key={i}>
    <button onClick={() => { const next = o === i ? null : i; sO(next); if (next !== null) track('faq_opened', { question: f.q?.substring(0, 50) }); }} style={{ width: "100%", textAlign: "left", padding: "16px 0", background: "none", border: "none", borderBottom: "1px solid " + g.bg, cursor: "pointer", fontFamily: ff, fontSize: 16, fontWeight: 600, color: g.t1, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color .2s" }}>
      {f.q}<ChevronDown size={16} style={{ color: g.t3, transition: "transform .35s cubic-bezier(.16,1,.3,1)", transform: o === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 16 }} />
    </button>
    <div style={{ overflow: "hidden", maxHeight: o === i ? 200 : 0, opacity: o === i ? 1 : 0, transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease" }}>
      <p style={{ padding: "6px 0 18px", fontSize: 15, color: g.t2, lineHeight: 1.6 }}>{f.a}</p>
    </div>
  </div>)}</div>;
}


function ShareC({ addEntry, cp, onShare, onEmailSubmit }) {
  const [sL, sSL] = useState(false); const [co, sCO] = useState(""); const [ci, sCI] = useState(""); const [dn, sDN] = useState(false); const [cpd, sCPD] = useState(null);
  const [remEmail, setRemEmail] = useState(""); const [remSent, setRemSent] = useState(false);
  const remValid = remEmail.includes("@") && remEmail.includes(".");
  const sh = [{ l: "Copy link", i: <Copy size={13} />, a: () => { cp(URL_); if (onShare) onShare('copy'); } }, { l: "𝕏", i: <span style={{ fontWeight: 800, fontSize: 12 }}>𝕏</span>, a: () => { window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(STXT)); if (onShare) onShare('twitter'); } }, { l: "WhatsApp", i: <MessageCircle size={13} />, a: () => { window.open("https://wa.me/?text=" + encodeURIComponent(STXT + " " + URL_)); if (onShare) onShare('whatsapp'); } }, { l: "Telegram", i: <Send size={13} />, a: () => { window.open("https://t.me/share/url?url=" + encodeURIComponent(URL_)); if (onShare) onShare('telegram'); } }, { l: "Facebook", i: <ExternalLink size={13} />, a: () => { window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(URL_)); if (onShare) onShare('facebook'); } }, { l: "Email", i: <Mail size={13} />, a: () => { window.open("mailto:?subject=Butterfly%20Challenge&body=" + encodeURIComponent(STXT)); if (onShare) onShare('email'); } }];
  return <div style={{ fontFamily: ff }}><p style={{ color: g.t3, fontSize: 14, marginBottom: 16 }}>Share in 10 seconds.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>{sh.map(s => <button key={s.l} onClick={s.a} className="hov-lift" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 4px", borderRadius: 12, border: "1px solid #e8e8ed", background: "#fff", cursor: "pointer", color: g.t1, fontSize: 11, fontWeight: 500, fontFamily: ff, transition: "all .2s cubic-bezier(.16,1,.3,1)" }}>{s.i}<span>{s.l}</span></button>)}</div><p style={{ fontSize: 12, color: g.t3, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}><Instagram size={11} /><Film size={11} />Copy a caption for Instagram & TikTok.</p><div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>{CAPS.map(t => <div key={t.id} style={{ border: "1px solid #e8e8ed", borderRadius: 12, padding: 11, transition: "border-color .2s" }}><p style={{ fontSize: 13, color: g.t2, lineHeight: 1.5, marginBottom: 6 }}>{t.text}</p><button onClick={() => { navigator.clipboard.writeText(t.text).then(() => { sCPD(t.id); track('share_caption_copied'); setTimeout(() => sCPD(null), 1500); }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: cpd === t.id ? TEAL : g.t3, display: "flex", alignItems: "center", gap: 3, padding: 0, fontFamily: ff, transition: "color .2s" }}>{cpd === t.id ? <><Check size={10} />Copied</> : <><Copy size={10} />Copy</>}</button></div>)}</div><div style={{ borderTop: "1px solid " + g.bg, paddingTop: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 500, color: g.t2, marginBottom: 12 }}><Clock size={13} />Get a reminder for May 1</div><div style={{ display: "flex", gap: 6, marginBottom: 14 }}><input type="email" placeholder="your@email.com" value={remEmail} onChange={e => setRemEmail(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e8e8ed", fontSize: 13, fontFamily: ff, outline: "none", transition: "border-color .2s" }} /><Btn primary onClick={async () => { if (remValid && onEmailSubmit) { const r = await onEmailSubmit(remEmail); if (r.success) setRemSent(true); } else if (remValid) { setRemSent(true); } }} disabled={!remValid} style={{ padding: "8px 14px", fontSize: 12 }}>Remind Me</Btn></div>{remSent && <p style={{ color: TEAL, fontSize: 12, fontWeight: 500, marginBottom: 12 }}><Check size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />You're on the list!</p>}</div><div style={{ borderTop: "1px solid " + g.bg, paddingTop: 14 }}><button onClick={() => sSL(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: g.t2, display: "flex", alignItems: "center", gap: 4, padding: 0, marginBottom: 10, fontFamily: ff }}><MapPin size={12} />Add to live map<ChevronDown size={12} style={{ transition: "transform .35s cubic-bezier(.16,1,.3,1)", transform: sL ? "rotate(180deg)" : "none" }} /></button><div style={{ overflow: "hidden", maxHeight: sL && !dn ? 200 : 0, opacity: sL && !dn ? 1 : 0, transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s" }}><div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 4 }}><select value={co} onChange={e => sCO(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, background: "#fff", outline: "none", transition: "border-color .2s" }}><option value="">Country</option>{Object.keys(CDATA).map(c => <option key={c} value={c}>{c}</option>)}</select><input type="text" placeholder="City" value={ci} onChange={e => sCI(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, outline: "none", boxSizing: "border-box", transition: "border-color .2s" }} /><Btn primary onClick={() => { if (co) { addEntry({ country: co, city: ci }); sDN(true); } }} disabled={!co} style={{ width: "100%", fontSize: 14, padding: "10px 20px" }}>Add</Btn></div></div>{dn && <p style={{ color: TEAL, fontSize: 14, fontWeight: 500, animation: "fadeUp .4s cubic-bezier(.16,1,.3,1)" }}><Check size={14} style={{ verticalAlign: "middle" }} /> Added.</p>}</div></div>;
}

function JoinC({ onDone }) {
  const [s, sS] = useState(0);
  const st = [{ e: JOIN_STEP1, t: "Make the sign", d: "Hands on heart. Open like wings." }, { e: JOIN_STEP2, t: "Say the message", d: "\"" + SCRIPT + "\"" }, { e: JOIN_STEP3, t: "Lift 3 more", d: "Tag 3 people. 24 hours." }];
  return <div style={{ fontFamily: ff }}><div style={{ display: "flex", gap: 4, margin: "6px 0 20px" }}>{st.map((_, i) => <div key={i} style={{ height: 2.5, flex: 1, borderRadius: 2, background: i <= s ? g.t1 : "#e8e8ed", transition: "background .35s cubic-bezier(.16,1,.3,1)" }} />)}</div><div key={s} style={{ textAlign: "center", padding: "12px 0 22px", animation: "fadeUp .4s cubic-bezier(.16,1,.3,1)" }}><img src={st[s].e} alt={st[s].t} style={{ width: 160, height: 160, objectFit: "contain", display: "block", margin: "0 auto 8px" }} /><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: g.t3, marginBottom: 6 }}>Step {s + 1}</p><h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{st[s].t}</h3><p style={{ fontSize: 16, color: g.t2 }}>{st[s].d}</p></div><div style={{ display: "flex", gap: 8 }}>{s > 0 && <Btn onClick={() => sS(x => x - 1)} style={{ flex: 1, fontSize: 15 }}>Back</Btn>}{s < 2 ? <Btn primary onClick={() => sS(x => x + 1)} style={{ flex: 1, fontSize: 15 }} icon={<ChevronRight size={15} />}>Next</Btn> : <Btn primary onClick={onDone} style={{ flex: 1, fontSize: 15 }} icon={<Share2 size={14} />}>Done — share</Btn>}</div></div>;
}

/* ── Countdown Timer ── */
function CountdownTimer() {
  const target = new Date("2026-04-30T19:00:00-04:00").getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 864e5);
  const hrs = Math.floor((diff % 864e5) / 36e5);
  const mins = Math.floor((diff % 36e5) / 6e4);
  const secs = Math.floor((diff % 6e4) / 1e3);
  const past = diff === 0;

  const unit = (val, label) => (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <p style={{ fontSize: 32, fontWeight: 600, color: past ? g.t4 : TEAL, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", transition: "color .3s" }}>
        {String(val).padStart(2, "0")}
      </p>
      <p style={{ fontSize: 11, color: g.t4, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{label}</p>
    </div>
  );

  const sep = <span style={{ fontSize: 24, fontWeight: 300, color: g.bdr, alignSelf: "flex-start", paddingTop: 6 }}>:</span>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 6, marginBottom: 28 }}>
      {past ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: TEAL }}>It's happening now.</p>
        </div>
      ) : (
        <>{unit(days, "Days")}{sep}{unit(hrs, "Hours")}{sep}{unit(mins, "Min")}{sep}{unit(secs, "Sec")}</>
      )}
    </div>
  );
}

/* ── Timeline ── */
const TL_EVENTS = [
  { d: "Apr 30", t: "One Night For One Humanity", s: "Queen Miami Beach · Founding event", detail: "The night that starts everything. The Hero Act is revealed live. The founding partners are recognized. The Butterfly Challenge launches the next morning. Miami Grand Prix Weekend — the world is already watching.", status: "next" },
  { d: "May 1", t: "Butterfly Month begins", s: "Challenge goes global", detail: "May 1 is Day One. The challenge goes live worldwide. Creators activate. Every platform, every language, every country. The butterfly starts to fly.", status: "future" },
  { d: "May–Jun", t: "Culture surfaces activate", s: "Sport · Music · Film · Fashion", detail: "The butterfly sign enters stadiums, concert stages, runways, film sets. Every cultural surface that agreed to carry the signal activates during this window.", status: "future" },
  { d: "Jul 19", t: "FIFA World Cup Final", s: "MetLife Stadium · 5 billion watching", detail: "The biggest single-audience moment in human history. If the butterfly sign is visible here, 5 billion people see it in the same second. That's the goal.", status: "future" },
  { d: "Sep 2026", t: "UN General Assembly", s: "Butterfly Week · Institutional mandate", detail: "The movement goes institutional. Butterfly Week at the United Nations. The ask: formally recognize May as Global Mental Health Awareness Month with the butterfly as the international symbol.", status: "future" },
];

function TimelineViz({ onEventClick }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      {/* Vertical line */}
      <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 1.5, background: "linear-gradient(to bottom, " + TEAL + ", " + g.bdr + ")", borderRadius: 1 }} />

      {TL_EVENTS.map((ev, i) => (
        <button key={i} onClick={() => onEventClick(ev)} className="card-btn" style={{
          display: "flex", gap: 14, padding: "16px 16px 16px 20px", marginBottom: i < TL_EVENTS.length - 1 ? 6 : 0,
          background: "#fff", borderRadius: 14, border: "none", width: "100%", textAlign: "left",
          cursor: "pointer", fontFamily: ff, position: "relative"
        }}>
          {/* Dot on the line */}
          <div style={{
            position: "absolute", left: -24, top: 22, width: 10, height: 10, borderRadius: 5,
            background: ev.status === "next" ? TEAL : "#fff",
            border: ev.status === "next" ? "none" : "2px solid " + g.bdr,
            boxShadow: ev.status === "next" ? "0 0 0 4px " + TEAL + "22" : "none",
            transition: "all .3s"
          }} />
          {ev.status === "next" && <div style={{ position: "absolute", left: -24, top: 22, width: 10, height: 10, borderRadius: 5, background: TEAL, animation: "ping 2s cubic-bezier(0,0,.2,1) infinite" }} />}

          <div style={{ minWidth: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: ev.status === "next" ? TEAL : g.t3 }}>{ev.d}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 2 }}>{ev.t}</p>
            <p style={{ fontSize: 13, color: g.t4 }}>{ev.s}</p>
          </div>
          <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0, alignSelf: "center" }} />
        </button>
      ))}
    </div>
  );
}

/* ── Highlight Carousel (Apple full-bleed scroll) ── */
const HL_CARDS = [
  { img: HL_IMG1, title: "Nearly 1 billion people live with a mental health condition.", sub: "WHO, 2025", color: "#065f46" },
  { img: HL_IMG2, title: "There's never been a universal gesture that says: I see you and I care.", sub: "Until now.", color: "#0c4a6e" },
  { img: HL_IMG3, title: "May is Butterfly Month. The globally recognized month for mental health.", sub: "Starting 2026.", color: "#78350f" },
  { img: HL_IMG4, title: "One becomes three becomes nine becomes a billion.", sub: "Lift 3 More.", color: "#3b0764" },
];

function HighlightCarousel() {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const CARD_W = 430;
  const CARD_H = 420;
  const GAP = 20;
  const GRID_MAX = 980;

  const checkBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkBounds, { passive: true });
    checkBounds();
    window.addEventListener("resize", checkBounds, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkBounds);
      window.removeEventListener("resize", checkBounds);
    };
  }, [checkBounds]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  return (
    <section style={{ background: g.bg, paddingTop: 120, paddingBottom: 120, overflow: "hidden" }}>
      {/* Title + arrows on same row — constrained to grid */}
      <div style={{ maxWidth: GRID_MAX, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 600, letterSpacing: "-.04em", color: g.t1, lineHeight: 1.1 }}>
            Get the highlights.
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingBottom: 4 }}>
          {[{ dir: -1, ok: canPrev, ch: "‹", label: "Previous" }, { dir: 1, ok: canNext, ch: "›", label: "Next" }].map(a => (
            <button key={a.dir} onClick={() => scrollBy(a.dir)} disabled={!a.ok} aria-label={a.label} style={{
              width: 40, height: 40, borderRadius: 20,
              border: "1px solid " + (a.ok ? g.bdr : "#e8e8ed"),
              background: a.ok ? "#fff" : "transparent",
              color: a.ok ? g.t2 : "#d2d2d7",
              cursor: a.ok ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .25s cubic-bezier(.16,1,.3,1)",
              fontSize: 22, fontWeight: 300, fontFamily: ff,
            }}>{a.ch}</button>
          ))}
        </div>
      </div>

      {/* Scrollable track — bleeds right */}
      <div
        ref={trackRef}
        className="hs"
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          paddingLeft: "max(1.25rem, calc(50vw - 490px))",
          paddingRight: "max(1.25rem, calc(50vw - 490px))",
          scrollPaddingLeft: "max(1.25rem, calc(50vw - 490px))",
        }}
      >
        {HL_CARDS.map((c, i) => (
          <div key={i} style={{
            width: CARD_W, minWidth: CARD_W, maxWidth: CARD_W,
            height: CARD_H,
            flexShrink: 0, flexGrow: 0,
            background: "#fff", borderRadius: 24, padding: "28px 28px 24px",
            textAlign: "left", scrollSnapAlign: "start",
            display: "flex", flexDirection: "column",
            boxShadow: "0 1px 4px rgba(0,0,0,.04)",
          }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, lineHeight: 1.35, letterSpacing: "-.01em" }}>{c.title}</p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
              <img src={c.img} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: 14, color: g.t1, opacity: .5, fontWeight: 500 }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Sign Builder — interactive gesture tutorial ── */
function SignBuilder() {
  const [step, setStep] = useState(-1);
  const ease = "cubic-bezier(.16,1,.3,1)";

  const imgStyle = { width: "100%", maxWidth: 240, borderRadius: 16, display: "block", margin: "0 auto" };
  const steps = [
    {
      instruction: "Place both hands on your heart.",
      detail: "Palms flat against your chest.",
      hands: <img src={SIGN_WOMAN1} alt="Hands on heart" style={imgStyle} />,
    },
    {
      instruction: "Cross your wrists.",
      detail: "Right over left, thumbs hooked together.",
      hands: <img src={SIGN_WOMAN2} alt="Wrists crossed" style={imgStyle} />,
    },
    {
      instruction: "Open like wings.",
      detail: "Spread your fingers wide. That's the Butterfly Sign.",
      hands: <img src={SIGN_WOMAN3} alt="Hands open like wings" style={imgStyle} />,
    },
  ];

  // Not started
  if (step === -1) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "48px 32px", marginBottom: 20 }}>
          <img src={SIGN_HANDS} alt="The Butterfly Sign" style={{ width: "100%", maxWidth: 200, borderRadius: 16, marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, marginBottom: 6 }}>Learn the Butterfly Sign</p>
          <p style={{ fontSize: 15, color: g.t3 }}>3 steps. 10 seconds. No words needed.</p>
        </div>
        <Btn primary onClick={() => setStep(0)} style={{ fontSize: 16 }}>Try it yourself</Btn>
      </div>
    );
  }

  // Completed
  if (step >= 3) {
    return (
      <div style={{ textAlign: "center", animation: `fadeUp .5s ${ease}` }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20 }}>
          {steps[2].hands}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginTop: 16, marginBottom: 8 }}>The Butterfly Sign</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
            {["I see you.", "I care.", "You're not alone."].map((t, i) => (
              <span key={i} style={{ fontSize: 16, fontWeight: 600, color: g.t1, animation: `fadeUp .4s ${ease} ${i * 100 + 200}ms both` }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: g.t3, marginTop: 8 }}>No language. No diagnosis. No barrier. Just two hands.</p>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn primary onClick={() => setStep(-1)} style={{ fontSize: 14 }}>Got it</Btn>
          <Btn onClick={() => setStep(0)} style={{ fontSize: 13, color: g.t3 }}>Try again</Btn>
        </div>
      </div>
    );
  }

  // Active step
  const s = steps[step];
  return (
    <div style={{ textAlign: "center" }}>
      <div key={step} style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20, animation: `fadeUp .4s ${ease}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          {s.hands}
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>Step {step + 1} of 3</p>
        <p style={{ fontSize: 20, fontWeight: 600, color: g.t1, marginBottom: 4 }}>{s.instruction}</p>
        <p style={{ fontSize: 15, color: g.t3 }}>{s.detail}</p>
      </div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i <= step ? 24 : 6, height: 6, borderRadius: 3, background: i <= step ? TEAL : g.bdr, transition: `all .4s ${ease}` }} />
        ))}
      </div>
      <Btn primary onClick={() => setStep(step + 1)} style={{ fontSize: 15, padding: "12px 28px" }}>
        {step < 2 ? "Next" : "Complete"}
      </Btn>
    </div>
  );
}

/* ── Step Tabs — How it works interactive ── */
function StepTabs({ onJoin }) {
  const [active, setActive] = useState(0);
  const ease = "cubic-bezier(.16,1,.3,1)";

  const steps = [
    {
      num: "01", title: "Take the Challenge", img: STEP_DFD1,
      heading: "Make the sign. Film it.",
      body: "Open your camera. Face it toward you. Make the Butterfly Sign — hands on heart, open like wings. No filter. No production. Just you, showing up for someone.",
      tip: "Hold a name in your mind. You don't have to say it out loud.",
    },
    {
      num: "02", title: "Show the Love", img: STEP_DFD2,
      heading: "Say their name.",
      body: "Look into the camera and say: \"I see you. I care. You're not alone.\" Or: \"I got you, [name].\" Say their name out loud. That's what makes it real.",
      tip: "This isn't a script. Say whatever is true.",
    },
    {
      num: "03", title: "Lift 3 More", img: STEP_DFD3,
      heading: "Tag 3 people. Pass it forward.",
      body: "Nominate 3 people you care about. Give them 24 hours. One becomes three becomes nine becomes a billion. That's the butterfly effect.",
      tip: "They don't need followers. They need one person to think of.",
    },
  ];

  const s = steps[active];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 16, overflow: "hidden", border: "1px solid #e8e8ed" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: "14px 8px", border: "none", fontFamily: ff,
            background: active === i ? "#fff" : "transparent",
            cursor: "pointer", transition: `all .3s ${ease}`,
            borderRight: i < 2 ? "1px solid #e8e8ed" : "none",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: active === i ? TEAL : g.t4, transition: `color .3s ${ease}`, marginBottom: 2 }}>{st.num}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: active === i ? g.t1 : g.t3, transition: `color .3s ${ease}` }}>{st.title}</p>
          </button>
        ))}
      </div>

      {/* Content card */}
      <div key={active} style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        animation: `fadeUp .4s ${ease}`,
      }}>
        <img src={s.img} alt={s.heading} style={{ width: "50%", objectFit: "contain", display: "block", margin: "0 auto" }} />
        <div style={{ padding: "24px 28px 28px" }}>
        <h3 style={{ fontSize: 22, fontWeight: 600, color: g.t1, marginBottom: 8, letterSpacing: "-.02em" }}>{s.heading}</h3>
        <p style={{ fontSize: 16, color: g.t2, lineHeight: 1.65, marginBottom: 16 }}>{s.body}</p>
        <div style={{ background: g.bg, borderRadius: 14, padding: "14px 18px" }}>
          <p style={{ fontSize: 13, color: g.t3, fontStyle: "italic" }}>💡 {s.tip}</p>
        </div>
        </div>
      </div>

      {/* Progress + CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: active === i ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= active ? g.t1 : g.bdr,
              cursor: "pointer", transition: `all .35s ${ease}`,
            }} />
          ))}
        </div>
        {active === 2 ? (
          <Btn primary onClick={onJoin} style={{ fontSize: 14, padding: "10px 22px" }}>
            I'm ready — join
          </Btn>
        ) : (
          <Btn onClick={() => setActive(a => a + 1)} style={{ fontSize: 14, padding: "10px 22px", color: g.link, borderColor: "transparent" }}>
            Next step ›
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ── Support Panel (Get Support popup) ── */
const SUPPORT_COUNTRIES = {
  "United Kingdom": { name: "Samaritans", number: "116 123", url: "https://www.samaritans.org" },
  "Australia": { name: "Lifeline", number: "13 11 14", url: "https://www.lifeline.org.au" },
  "Canada": { name: "Talk Suicide Canada", number: "1-833-456-4566", url: "https://talksuicide.ca" },
  "France": { name: "SOS Amitié", number: "3114", url: "https://www.sos-amitie.com" },
  "Germany": { name: "Telefonseelsorge", number: "0800 111 0 111", url: "https://www.telefonseelsorge.de" },
  "India": { name: "iCall", number: "9152987821", url: "https://icallhelpline.org" },
  "Japan": { name: "TELL Lifeline", number: "03-5774-0992", url: "https://telljp.com" },
  "Brazil": { name: "CVV", number: "188", url: "https://www.cvv.org.br" },
  "South Africa": { name: "SADAG", number: "0800 567 567", url: "https://www.sadag.org" },
  "New Zealand": { name: "Lifeline NZ", number: "0800 543 354", url: "https://www.lifeline.org.nz" },
};

function SupportPanel() {
  const [country, setCountry] = useState("");
  const local = SUPPORT_COUNTRIES[country] || null;
  const ease = "cubic-bezier(.16,1,.3,1)";

  return (
    <div style={{ fontFamily: ff }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Heart size={18} style={{ color: TEAL }} />
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Get Support</h2>
      </div>
      <p style={{ fontSize: 14, color: g.t3, marginBottom: 22 }}>You're not alone. Help is available 24/7.</p>

      {/* US resources */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: g.t3, marginBottom: 10 }}>United States</p>
      <a href="tel:988" className="card-btn" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid #e8e8ed", borderRadius: 14, textDecoration: "none", marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: TEAL + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Phone size={18} style={{ color: TEAL }} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 1 }}>988 Suicide & Crisis Lifeline</p>
          <p style={{ fontSize: 13, color: g.t3 }}>Call or text 988 · Free · 24/7</p>
        </div>
        <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0 }} />
      </a>
      <a href="sms:741741&body=HOME" className="card-btn" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid #e8e8ed", borderRadius: 14, textDecoration: "none", marginBottom: 22 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: TEAL + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={18} style={{ color: TEAL }} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 1 }}>Crisis Text Line</p>
          <p style={{ fontSize: 13, color: g.t3 }}>Text HOME to 741741 · Free · 24/7</p>
        </div>
        <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0 }} />
      </a>

      {/* International */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: g.t3, marginBottom: 10 }}>Outside the US</p>
      <div style={{ border: "1px solid #e8e8ed", borderRadius: 14, padding: "16px 16px", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: g.t3, marginBottom: 8 }}>Select your country</p>
        <select value={country} onChange={e => { setCountry(e.target.value); if (e.target.value) track('crisis_country_selected', { country: e.target.value }); }} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, background: "#fff", outline: "none", marginBottom: local ? 12 : 0 }}>
          <option value="">Choose...</option>
          {Object.keys(SUPPORT_COUNTRIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {local && (
          <div style={{ animation: `fadeUp .3s ${ease}`, background: "#f0fdf9", borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 4 }}>{local.name}</p>
            <a href={"tel:" + local.number.replace(/\s/g, "")} style={{ fontSize: 15, fontWeight: 600, color: TEAL, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Phone size={14} /> {local.number}</a>
            <a href={local.url} target="_blank" rel="noopener" style={{ fontSize: 13, color: g.link, textDecoration: "none" }}>Visit website →</a>
          </div>
        )}
      </div>

      <a href="https://findahelpline.com" target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", border: "1px solid " + TEAL, borderRadius: 980, textDecoration: "none", fontFamily: ff, fontSize: 14, fontWeight: 500, color: TEAL, marginBottom: 16 }}>
        <Globe2 size={15} /> Find local resources
      </a>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: g.bg, borderRadius: 12 }}>
        <Heart size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: g.t3, lineHeight: 1.5 }}><strong style={{ color: g.t2 }}>What you share is your choice.</strong> All conversations with crisis lines are confidential.</p>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */

/* ── Shared page styles ── */
const sec = (bg) => ({ padding: "100px 24px", background: bg || "#fff", textAlign: "center" });
const wrap = { maxWidth: 680, margin: "0 auto" };
const label = { fontSize: 14, fontWeight: 400, color: g.t3, marginBottom: 6 };
const h2s = { fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: g.t1 };
const gradH = { ...h2s, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" };

/* ── Hash Router Hook ── */
function useHashRouter() {
  const [page, setPage] = useState(window.location.hash.replace('#/', '') || '');
  useEffect(() => {
    const handler = () => setPage(window.location.hash.replace('#/', '') || '');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = useCallback((p) => { window.location.hash = '#/' + p; window.scrollTo(0, 0); }, []);
  return { page, navigate };
}

/* ── Nav Component ── */
function Nav({ page, navigate, onJoin, onSupport, currentUser, onSignIn, onSignOut, userDropdownOpen, setUserDropdownOpen, displayName, avatarUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ease = "cubic-bezier(.16,1,.3,1)";
  const links = [{l:"Story",p:"story"},{l:"Science",p:"science"},{l:"Alliance",p:"alliance"},{l:"Live",p:"live"}];

  const go = (p) => { navigate(p); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @media(min-width:769px){.nav-mobile{display:none!important}.nav-desktop{display:flex!important}}
        @media(max-width:768px){.nav-mobile{display:flex!important}.nav-desktop{display:none!important}}
      `}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px" }}>
          {/* Logo — always visible */}
          <button onClick={() => go('')} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
            <img src={LOGO_DARK} alt="Butterfly Challenge" style={{ height: 32 }} />
          </button>

          {/* Desktop center links */}
          <div className="nav-desktop" style={{ display: "none", alignItems: "center", gap: 24 }}>
            {links.map(t => (
              <button key={t.p} onClick={() => navigate(t.p)} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 13, fontWeight: 500, color: page === t.p ? TEAL : g.t2, cursor: "pointer", padding: 0, position: "relative" }}>
                {t.l}
                {page === t.p && <div style={{ position: "absolute", bottom: -8, left: 0, right: 0, height: 2, background: TEAL, borderRadius: 1 }} />}
              </button>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="nav-desktop" style={{ display: "none", alignItems: "center", gap: 10 }}>
            <button onClick={() => window.open("https://google.com","_blank","noopener")} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 12, fontWeight: 500, color: g.t3, cursor: "pointer", padding: "6px 0", display: "flex", alignItems: "center", gap: 4 }}>
              <ExternalLink size={11} />Safe Exit
            </button>
            <button onClick={onSupport} style={{ background: "none", border: "1px solid " + g.bdr, borderRadius: 980, fontFamily: ff, fontSize: 13, fontWeight: 500, color: g.t1, cursor: "pointer", padding: "7px 14px", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: TEAL }}>♡</span> Get Support
            </button>
            <Btn primary onClick={onJoin} style={{ padding: "8px 18px", fontSize: 13, borderRadius: 980 }}>Take the Challenge</Btn>
            {/* Auth: Sign In or User Menu */}
            {!currentUser ? (
              <button onClick={onSignIn} style={{ background: "none", border: "1px solid " + g.bdr, borderRadius: 980, fontFamily: ff, fontSize: 13, fontWeight: 500, color: g.t1, cursor: "pointer", padding: "7px 14px" }}>Sign in</button>
            ) : (
              <div style={{ position: "relative" }}>
                <button onClick={() => setUserDropdownOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid " + g.bdr, borderRadius: 980, padding: "4px 12px 4px 4px", cursor: "pointer", fontFamily: ff }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" style={{ width: 26, height: 26, borderRadius: 13, objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 26, height: 26, borderRadius: 13, background: TEAL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{displayName?.charAt(0)?.toUpperCase()}</div>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 500, color: g.t1, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</span>
                </button>
                {userDropdownOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,.1)", border: "1px solid rgba(0,0,0,.06)", padding: "8px 4px", minWidth: 160, zIndex: 10, animation: "fadeUp .2s cubic-bezier(.16,1,.3,1)" }}>
                    <p style={{ padding: "8px 14px", fontSize: 12, color: g.t4, fontFamily: ff }}>{currentUser.email}</p>
                    <button onClick={onSignOut} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", fontFamily: ff, fontSize: 14, fontWeight: 500, color: "#ef4444", cursor: "pointer", borderRadius: 8 }}>Sign out</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile right: Join + Hamburger */}
          <div className="nav-mobile" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <Btn primary onClick={onJoin} style={{ padding: "7px 14px", fontSize: 12, borderRadius: 980 }}>Join</Btn>
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: 36, height: 36 }}>
              <span style={{ display: "block", width: 18, height: 1.5, background: g.t1, borderRadius: 1, transition: `all .35s ${ease}`, transform: menuOpen ? "translateY(3.75px) rotate(45deg)" : "none" }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: g.t1, borderRadius: 1, margin: "3px 0", transition: `all .35s ${ease}`, opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "scaleX(1)" }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: g.t1, borderRadius: 1, transition: `all .35s ${ease}`, transform: menuOpen ? "translateY(-3.75px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu overlay — Apple style */}
      <div className="nav-mobile" style={{
        display: "none",
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
        background: "rgba(255,255,255,.98)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: `opacity .4s ${ease}`,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%", padding: "0 32px" }}>
          {links.map((t, i) => (
            <button key={t.p} onClick={() => go(t.p)} style={{
              background: "none", border: "none", fontFamily: ff, cursor: "pointer", padding: "18px 0", width: "100%",
              fontSize: 32, fontWeight: 600, letterSpacing: "-.02em",
              color: page === t.p ? TEAL : g.t1,
              borderBottom: i < links.length - 1 ? "1px solid " + g.bdr : "none",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .4s ${ease} ${(i + 1) * 60}ms, transform .5s ${ease} ${(i + 1) * 60}ms, color .3s`,
            }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", padding: "0 32px", marginTop: 40,
          opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(20px)",
          transition: `opacity .4s ${ease} 320ms, transform .5s ${ease} 320ms`,
        }}>
          <Btn primary onClick={() => { onJoin(); setMenuOpen(false); }} style={{ width: "100%", fontSize: 16, padding: "14px 20px", borderRadius: 14 }}>Take the Challenge</Btn>
          <button onClick={() => { onSupport(); setMenuOpen(false); }} style={{ width: "100%", background: "none", border: "1px solid " + g.bdr, borderRadius: 14, fontFamily: ff, fontSize: 15, fontWeight: 500, color: g.t1, cursor: "pointer", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ color: TEAL }}>♡</span> Get Support
          </button>
          <button onClick={() => { window.open("https://google.com","_blank","noopener"); setMenuOpen(false); }} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 13, fontWeight: 500, color: g.t3, cursor: "pointer", padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <ExternalLink size={11} />Safe Exit
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Footer Component ── */
function Footer({ navigate, onSupport }) {
  return (
    <footer style={{ background: g.bg, padding: "60px 24px 28px", fontFamily: ff }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <img src={LOGO_DARK} alt="Butterfly Challenge" style={{ height: 36, marginBottom: 14 }} />
            <p style={{ fontSize: 13, color: g.t3, lineHeight: 1.5, marginBottom: 16 }}>An initiative of One Humanity Foundation.</p>
            <div style={{ display: "flex", gap: 14 }}>
              {["💬", "🔗", "𝕏", "▶"].map((ic, i) => (
                <span key={i} style={{ width: 28, height: 28, borderRadius: 14, border: "1px solid " + g.bdr, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: g.t3, cursor: "pointer" }}>{ic}</span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 14 }}>Resources</p>
            {[{l:"Story",p:"story"},{l:"Science",p:"science"},{l:"Alliance",p:"alliance"},{l:"Live Events",p:"live"}].map(t => (
              <p key={t.p} style={{ marginBottom: 10 }}><button onClick={() => navigate(t.p)} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 13, color: g.t2, cursor: "pointer", padding: 0 }}>{t.l}</button></p>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 14 }}>For Organizations</p>
            {["For Schools", "For Teams", "For Brands", "Butterfly Protocol"].map(t => (
              <p key={t} style={{ marginBottom: 10 }}><button onClick={() => navigate('alliance')} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 13, color: g.t2, cursor: "pointer", padding: 0 }}>{t}</button></p>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 14 }}>Need Help?</p>
            <div style={{ border: "1px solid #e8e8ed", borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 2 }}>US: Call or Text 988</p>
              <p style={{ fontSize: 12, color: g.t3 }}>24/7 free and confidential support.</p>
            </div>
            <Btn primary onClick={onSupport} style={{ width: "100%", fontSize: 14, padding: "11px 18px" }}>Get Support Now</Btn>
          </div>
        </div>
        <div style={{ borderTop: "1px solid " + g.bdr, paddingTop: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Privacy", "Terms", "Accessibility", "About"].map(t => (
                <button key={t} onClick={() => {}} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 12, color: g.t3, cursor: "pointer", padding: 0 }}>{t}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: g.t4, maxWidth: 360, textAlign: "right", lineHeight: 1.5 }}>The Butterfly Challenge is a social gesture, not a replacement for professional care. If someone you know is in danger, call 911 or your local emergency number.</p>
          </div>
          <p style={{ fontSize: 12, color: g.t4, textAlign: "center" }}>© 2026 One Humanity Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Home Page ── */
function HomePage({ onJoin, onShare, onRemind, onDidIt, showPlusOne, onUgcOpen, communityData, setRP, setAP, setTlPopup, entries, handCount }) {
  return (
    <main id="main-content">
      {/* HERO */}
      <section style={{ minHeight: "90dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 30%)" }}>
        <Reveal style={{ width: "100%" }}><img src={HERO_IMG} alt="Two people making the Butterfly Sign" style={{ width: "100%", maxWidth: 920, display: "block", margin: "0 auto", marginBottom: -70 }} /></Reveal>
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal delay={0.1}><p style={{ ...label, marginTop: 0 }}>Butterfly Challenge</p></Reveal>
          <Reveal delay={0.15}><h1 style={{ ...gradH, fontSize: "clamp(2.6rem,8vw,4.8rem)", marginBottom: 14 }}>Lift a billion hands.</h1></Reveal>
          <Reveal delay={0.2}><p style={{ fontSize: 21, color: g.t2, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.45 }}>A 60‑second gesture for mental health.<br /><em style={{ fontStyle: "normal", color: g.t1 }}>Feel it. Do it. Share it.</em></p></Reveal>
          <Reveal delay={0.25}><div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>Join the Challenge</Btn>
            <div style={{ position: "relative", display: "inline-flex" }}>
              <Btn onClick={onDidIt} style={{ fontSize: 17 }}>I did it</Btn>
              {showPlusOne && <span style={{ position: "absolute", top: -18, right: -8, color: "#32C189", fontWeight: 700, fontSize: 18, animation: "fadeUp 0.8s ease forwards", pointerEvents: "none" }}>+1</span>}
            </div>
          </div></Reveal>
          {handCount > 0 && (
            <Reveal delay={0.3}><div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, padding: "8px 18px", borderRadius: 980, background: "rgba(14,165,160,.08)", border: "1px solid rgba(14,165,160,.15)" }} aria-live="polite" aria-atomic="true" aria-label={`${handCount.toLocaleString()} hands raised worldwide`}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: g.t1 }}>{handCount.toLocaleString()} hands raised</span>
            </div></Reveal>
          )}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <HighlightCarousel />

      {/* COMMUNITY FEED */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><p style={label}>From The Community</p>
          <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 8 }}>Doing it together.</h2>
          <p style={{ fontSize: 16, color: g.t2, marginBottom: 28 }}>Real people. Real stories.</p></Reveal>
          {communityData && communityData.length > 0 ? (
            <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {communityData.map((sub, i) => (
                <div key={sub.id || i} style={{ borderRadius: 16, overflow: "hidden", background: g.bg, aspectRatio: "1" }}>
                  {sub.file_type === 'video' ? (
                    <video src={sub.file_url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} onPlay={() => track('community_video_played')} />
                  ) : (
                    <img src={sub.file_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div></Reveal>
          ) : (
            <Reveal delay={0.1}><div style={{ background: g.bg, borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 15, color: g.t3 }}>Be the first to share your butterfly moment.</p>
            </div></Reveal>
          )}
          <Reveal delay={0.15}><div style={{ marginTop: 20, textAlign: "center" }}>
            <Btn onClick={onUgcOpen} style={{ fontSize: 15, borderColor: TEAL, color: TEAL }}>Share Your Story</Btn>
          </div></Reveal>
        </div>
      </section>

      {/* THE SIGN */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal><p style={label}>The Sign</p>
          <h2 style={{ ...gradH, marginBottom: 8 }}>Two hands. One signal.</h2>
          <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>The first universal gesture for mental health. Try it.</p></Reveal>
          <Reveal delay={0.1}><SignBuilder /></Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={sec(g.bg)}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal><p style={label}>How It Works</p>
          <h2 style={{ ...h2s, marginBottom: 36 }}>Three steps. One minute.</h2></Reveal>
          <Reveal delay={0.1}><StepTabs onJoin={onJoin} /></Reveal>
        </div>
      </section>

      {/* BUTTERFLY EFFECT */}
      <section style={sec("#fff")}><Reveal><div style={{ maxWidth: 420, margin: "0 auto" }}>
        <p style={label}>The Butterfly Effect</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>See how 1 becomes 1 billion.</h2>
        <div style={{ background: g.bg, borderRadius: 20, padding: "28px 24px" }}><Chain onJoin={onJoin} /></div>
      </div></Reveal></section>

      {/* EVENT TEASER */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>Already in Motion</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 8 }}>April 30. Miami.</h2>
        <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>Where it all begins.</p></Reveal>
        <Reveal delay={0.1}><CountdownTimer /></Reveal>
        <Reveal delay={0.15}><div style={{
          background: "#0D1117", borderRadius: 20, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL }}>Founding Event</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 6, letterSpacing: "-.02em" }}>One Night For<br />One Humanity</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 16, lineHeight: 1.5 }}>Queen Miami Beach · Miami Grand Prix Weekend<br />The Hero Act — revealed live.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>April 30, 2026</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>Miami, FL</span>
            </div>
          </div>
        </div></Reveal>
        <Reveal delay={0.2}><Btn primary onClick={() => window.location.hash = '#/live'} style={{ fontSize: 15 }}>View Full Schedule</Btn></Reveal>
      </div></section>

      {/* FAQ */}
      <section id="faq" style={sec("#fff")}><Reveal><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 20 }}>Questions.</h2>
        <FAQ />
      </div></Reveal></section>

      {/* CTA */}
      <section style={{ ...sec("#f5f5f7"), paddingBottom: 80 }}>
        <Reveal><img src={CTA_IMG} alt="Hundreds of people doing the Butterfly Sign" style={{ width: "100%", display: "block", marginBottom: 8 }} /></Reveal>
        <Reveal delay={0.1}><h2 style={{ ...gradH, fontSize: "clamp(2rem,6vw,3.4rem)", marginTop: 12, marginBottom: 6 }}>60 seconds.</h2></Reveal>
        <Reveal delay={0.15}><p style={{ fontSize: 19, color: g.t2, marginBottom: 28 }}>Be the person who showed up.</p></Reveal>
        <Reveal delay={0.2}><div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>Join the Challenge</Btn>
          <Btn onClick={onRemind} style={{ fontSize: 17 }}>Remind Me May 1</Btn>
        </div></Reveal>
      </section>
    </main>
  );
}

/* ── Story Page ── */
function StoryPage({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Where it came from.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>From a moment of crisis in 1998 to a global movement in 2026.</p></Reveal>
      </section>

      {/* ORIGIN */}
      <section style={sec("#fff")}><div style={wrap}>
        <Reveal><img src={STORY_IMG_ORIGIN} alt="Lucina Artigas guiding survivors through the butterfly hug after Hurricane Pauline" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>The Origin</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>1998 · Hurricane Pauline</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 18 }}>Lucina Artigas was a therapist in Mexico when Hurricane Pauline devastated the coast. In the aftermath, thousands of people — many of them children — were in severe psychological trauma with nowhere to turn.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>She created a simple bilateral stimulation gesture anyone could do without a therapist present. Two hands crossed on your chest, alternating taps. She called it the butterfly hug.</p></Reveal>
        </div>
      </div></section>

      {/* SPREAD */}
      <section style={sec(g.bg)}><div style={wrap}>
        <Reveal><img src={CTA_IMG} alt="The butterfly hug spreading globally" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>Global Adoption</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>2000–2024 · The Spread</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>The butterfly hug moved through disaster zones, refugee camps, and crisis centers globally. It became embedded in EMDR therapy, in NGO protocols, in first responder training. It worked. It was simple. It was free. And it didn't require permission.</p></Reveal>
        </div>
      </div></section>

      {/* PRINCE HARRY */}
      <section style={sec("#fff")}><div style={wrap}>
        <Reveal><img src={STORY_IMG_STAGE} alt="The butterfly hug demonstrated on a global stage" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>The Tipping Point</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>May 2024 · The Moment</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>Prince Harry demonstrated the butterfly hug on stage. It was seen by millions. Suddenly, the gesture wasn't hidden in clinical papers anymore. It was visible. It was real. And it belonged to everyone.</p></Reveal>
        </div>
      </div></section>

      {/* THE CHALLENGE */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)" }} />
        <div style={{ position: "relative", ...wrap }}>
        <Reveal><p style={{ ...label, color: "rgba(255,255,255,.5)" }}>This Moment</p>
        <h2 style={{ fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#fff", marginBottom: 18 }}>April 2026 · The Challenge</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>We're organizing the first coordinated global moment. One night. One gesture. Visible proof that mental health care is a human right, not a luxury. That you can lead change without permission.</p></Reveal>
        </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={sec("#fff")}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>The Timeline</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>Key milestones.</h2></Reveal>
        <Reveal delay={0.1}><VisualTimeline /></Reveal>
      </div></section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>You're part of this story.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>It started with one person helping another. Join the next chapter.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>Join the Challenge</Btn>
          <Btn onClick={() => navigate('science')} style={{ fontSize: 16 }}>See the Science</Btn>
        </div>
      </div></Reveal></section>
    </div>
  );
}

/* ── Science Page ── */
function SciencePage({ navigate }) {
  const sec = (bg) => ({ padding: "100px 24px", background: bg || "#fff", textAlign: "center" });
  const h2s = { fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: g.t1 };
  const gradH = { ...h2s, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" };
  const label = { fontSize: 14, fontWeight: 400, color: g.t3, marginBottom: 6 };
  const statCard = { background: g.bg, borderRadius: 16, padding: "20px 22px", textAlign: "center" };

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #E0F7FF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Why it works.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.5 }}>The neuroscience behind the butterfly hug — backed by research, used by therapists worldwide.</p></Reveal>
        <Reveal delay={0.2}><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: 600, margin: "0 auto" }}>
          {[
            { num: "WHO", sub: "Recommended treatment" },
            { num: "30+", sub: "Years of research" },
            { num: "100+", sub: "Countries using EMDR" },
          ].map((s, i) => (
            <div key={i} style={{ ...statCard, minWidth: 140, flex: "1 1 140px" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: TEAL, letterSpacing: "-.02em", marginBottom: 2 }}>{s.num}</p>
              <p style={{ fontSize: 12, color: g.t3 }}>{s.sub}</p>
            </div>
          ))}
        </div></Reveal>
      </section>

      {/* BILATERAL STIMULATION */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_BRAIN} alt="Brain hemispheres showing bilateral stimulation" style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>How Your Brain Works</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>Crossing the midline.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>When you perform the butterfly hug — alternating stimulation across your body's midline — you activate both hemispheres of your brain simultaneously. Your left side notices movement on the right. Your right notices movement on the left.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>This bilateral stimulation is how your brain processes and integrates overwhelming information. It's the same mechanism that happens during REM sleep, when your eyes move side-to-side. It helps your nervous system work through stress.</p></Reveal>
        </div>
      </div></section>

      {/* EMDR CONNECTION */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_HANDS} alt="Butterfly hug gesture with calming ripples" style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>Clinical Foundation</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>Built on EMDR science.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>Dr. Francine Shapiro developed EMDR (Eye Movement Desensitization and Reprocessing) therapy in the late 1980s. She discovered that bilateral eye movements, combined with processing traumatic memories, helped people heal from PTSD. Since then, EMDR has become a WHO-recommended treatment for post-traumatic stress.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>Lucina Artigas adapted this science. Instead of eye movements guided by a therapist, she created a self-soothing version: two hands, bilateral stimulation, no therapist needed. The butterfly hug puts clinical neuroscience in your own hands.</p></Reveal>
        </div>
      </div></section>

      {/* NEUROIMAGING */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_SCAN} alt="Brain scan showing prefrontal cortex activation" style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>The Evidence</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>What brain scans show.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>fMRI studies of people using bilateral stimulation show reduced activation in the amygdala — the part of your brain that triggers fear and anxiety. At the same time, activity increases in the prefrontal cortex, the part that helps you think clearly, make rational decisions, and feel safe.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>In plain language: the butterfly hug tells your alarm system to stand down. It doesn't make the threat go away. It helps your brain recognize that, right now, in this moment, you can breathe.</p></Reveal>
        </div>
      </div></section>

      {/* PULL QUOTE */}
      <section style={sec(g.bg)}><Reveal><div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <img src={ICON_BUTTERFLY} alt="" style={{ width: 40, height: 40, display: "block", margin: "0 auto 20px", opacity: 0.3 }} />
        <p style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 600, lineHeight: 1.3, color: g.t1, marginBottom: 12 }}>"The butterfly hug is not therapy. It's what humans do instinctively when someone is hurting. Now we know why it works."</p>
        <p style={{ fontSize: 14, color: g.t3 }}>— Clinical neuroscience literature on bilateral stimulation</p>
      </div></Reveal></section>

      {/* CLARIFICATION */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a33)", borderRadius: 20, padding: "28px 28px", textAlign: "left", marginBottom: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#92400e", marginBottom: 6 }}>⚕️ Important distinction</p>
          <p style={{ fontSize: 15, color: "#78350f", lineHeight: 1.6, opacity: 0.85 }}>The butterfly hug is a grounding tool, not a replacement for therapy. If you're struggling with trauma, depression, or suicidal thoughts, please talk to a professional.</p>
        </div></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>Important Clarification</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>This is not therapy.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>The butterfly hug is evidence-based. It's used by therapists. But performing the gesture is not the same as therapy. It's a tool. A gesture. A moment where your nervous system can find a little more calm.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>But for the everyday moments when you're stressed, overwhelmed, or need to ground yourself? The science says: try it. Your brain will thank you.</p></Reveal>
        </div>
      </div></section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Ready to try it?</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Learn the gesture. Do the challenge. Share it with the world.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>Learn the Sign</Btn>
          <Btn onClick={() => navigate('story')} style={{ fontSize: 16 }}>Full Story</Btn>
        </div>
      </div></Reveal></section>
    </div>
  );
}

/* ── Alliance Page ── */
function AlliancePage({ setRP, setAP, onTrust, navigate }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Who's showing up.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>The leaders, partners, and carriers making this real.</p></Reveal>
      </section>

      {/* CULTURE CARRIERS */}
      <section style={sec("#fff")}><div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal><p style={label}>How the World Shows Up</p><h2 style={{ ...h2s, marginBottom: 8 }}>Every role. Every alliance.</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>Tap any role to learn more.</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
          {ROLES.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.03}><button onClick={() => setRP(r)} className="card-btn" style={{ background: g.bg, border: "none", borderRadius: 16, padding: "20px 10px", textAlign: "center", cursor: "pointer", fontFamily: ff, width: "100%" }}>
              <img src={r.icon} alt={r.name} style={{ width: 28, height: 28, marginBottom: 6, display: "block", marginLeft: "auto", marginRight: "auto" }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: g.t1, marginBottom: 1 }}>{r.name}</p>
              <p style={{ fontSize: 11, color: g.t4 }}>{r.word}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* ALLIANCE PARTNERS */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal><p style={label}>Alliance Partners</p><h2 style={{ ...h2s, marginBottom: 8 }}>A billion hands need a road.</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>Six founding categories. Tap to see the brief.</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {ALLIANCES.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.05}><button onClick={() => setAP(a)} className="card-btn" style={{ background: "#fff", border: "none", borderRadius: 18, padding: "24px 18px", textAlign: "left", cursor: "pointer", fontFamily: ff, width: "100%" }}>
              <img src={a.icon} alt={a.name} style={{ width: 28, height: 28, filter: a.tint }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: g.t1, margin: "8px 0 3px" }}>{a.name}</p>
              <p style={{ fontSize: 13, color: g.t3 }}>{a.line}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* TRUST */}
      <section style={sec("#fff")}><Reveal>
        <img src={TRUST_IMG} alt="Trust & governance" style={{ width: "100%", maxWidth: 480, display: "block", margin: "0 auto 24px", objectFit: "contain" }} />
        <p style={label}>Why Trust This</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 10 }}>Built to be trusted.</h2>
        <p style={{ fontSize: 17, color: g.t2, marginBottom: 16 }}>501(c)(3) nonprofit · 100% to mental health · Free forever</p>
        <Link onClick={onTrust}>View governance</Link>
      </Reveal></section>

      {/* CULTURE — Dark bg section */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${CULTURE_BG})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.85) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", paddingTop: "10rem" }}>
          <Reveal><h2 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 40 }}>Built by people who've moved culture.</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: STAT_LEADERS, num: "1,000+", label: "Leaders gathered", sub: "Bel-Air 2024" },
              { icon: STAT_REACH, num: "47M", label: "People reached", sub: "110+ media placements" },
              { icon: STAT_RAISED, num: "$220M", label: "Raised by this same mechanic", sub: "Ice Bucket Challenge 2014" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 18, padding: "28px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={s.icon} alt="" style={{ width: 28, height: 28, display: "block", margin: "0 auto 8px", filter: "invert(70%) sepia(50%) saturate(500%) hue-rotate(120deg) brightness(110%)" }} />
                <p style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 2 }}>{s.num}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.8)", marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>🛡</span> One Humanity Foundation · 501(c)(3)</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>♡</span> Routed to 988 — Suicide & Crisis Lifeline</span>
          </div></Reveal>
          <Reveal delay={0.2}><a href="https://onehumanity.one/" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 980, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: ff, backdropFilter: "blur(8px)", transition: "all .25s cubic-bezier(.16,1,.3,1)" }}>Our Foundation <ArrowRight size={13} /></a></Reveal>
        </div>
      </section>

      {/* FOR ORGANIZATIONS */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><p style={label}>For Workplaces, Schools & Organizations</p>
          <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4.5vw,2.6rem)", marginBottom: 36 }}>Bring this to your community</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { icon: ORG_SCHOOL, title: "For Schools", desc: "Classroom guides, assembly slides, and parent resources. COPPA compliant." },
              { icon: ORG_TEAMS, title: "For Teams", desc: "Manager briefings, all-hands templates, and EAP integration." },
              { icon: ORG_BRANDS, title: "For Brands", desc: "Participation guidelines, asset kits, and partnership opportunities." },
            ].map((c, i) => (
              <div key={i} className="card-btn" style={{ background: "#f5f5f5", border: "none", borderRadius: 18, padding: "28px 24px", textAlign: "left", cursor: "pointer" }}>
                <img src={c.icon} alt="" style={{ width: 32, height: 32, marginBottom: 14, filter: "invert(45%) sepia(80%) saturate(1200%) hue-rotate(140deg) brightness(95%)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: g.t1, marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 500, color: TEAL, display: "flex", alignItems: "center", gap: 4 }}>Learn more <ArrowRight size={13} /></span>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ background: "linear-gradient(135deg, #e6faf5, #dff3fc)", borderRadius: 20, padding: "32px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: "1 1 400px", textAlign: "left" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: g.t1, marginBottom: 6 }}>The Butterfly Protocol</h3>
              <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.6 }}>The gesture teaches recognition. The Butterfly Protocol teaches response. A free, 30-second check-in script your managers can deploy in one week. Compliant with OSHA, ADA, and HIPAA boundaries.</p>
            </div>
            <Btn onClick={() => {}} style={{ fontSize: 14, padding: "10px 22px", borderColor: TEAL, color: TEAL }}>Learn About the Protocol <ArrowRight size={13} /></Btn>
          </div></Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Your organization can lead.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Join the alliance. Shape the movement.</p>
        <Btn primary onClick={() => window.open("mailto:partners@onehumanity.org?subject=Alliance Inquiry")} style={{ fontSize: 16, padding: "12px 28px" }}>Join as an Organization</Btn>
      </div></Reveal></section>
    </div>
  );
}

/* ── Live Page ── */
function LivePage({ entries, setTlPopup, onShare, handCount, leaderboardData }) {
  useEffect(() => { track('leaderboard_viewed'); }, []);
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>April 30. Queen Miami Beach.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.5 }}>The founding event. The moment it all begins.</p></Reveal>
        <Reveal delay={0.15}><CountdownTimer /></Reveal>
      </section>

      {/* SCHEDULE */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>What's Happening</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>The full schedule.</h2></Reveal>

        {/* Event Card */}
        <Reveal delay={0.1}><div style={{
          background: "#0D1117", borderRadius: 20, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL }}>Founding Event</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 6, letterSpacing: "-.02em", textAlign: "left" }}>One Night For<br />One Humanity</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 16, lineHeight: 1.5, textAlign: "left" }}>Queen Miami Beach · Miami Grand Prix Weekend<br />The Hero Act — revealed live.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>April 30, 2026</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>Miami, FL</span>
            </div>
          </div>
        </div></Reveal>

        {/* Timeline */}
        <Reveal delay={0.2}><TimelineViz onEventClick={setTlPopup} /></Reveal>
      </div></section>

      {/* LIVE ENTRIES */}
      <section style={sec("#fff")}>
        <Reveal><p style={label}>Live</p><h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 4 }}>Hands raised worldwide.</h2><p style={{ fontSize: 14, color: g.t4, marginBottom: 28 }}>{(handCount || entries.length).toLocaleString()} participants</p></Reveal>
        <Reveal delay={0.1}><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, maxWidth: 640, margin: "0 auto", alignItems: "start" }}>
          <Globe entries={entries} />
          <div style={{ flex: "1 1 180px", maxWidth: 240, textAlign: "left" }}>
            {entries.slice(0, 8).map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                <img src={ICON_BUTTERFLY} alt="" style={{ width: 11, height: 11 }} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.city ? e.city + ", " : ""}{e.country}</span>
                <span style={{ fontSize: 11, color: g.t4 }}>{relT(e.createdAt)}</span>
              </div>
            ))}
          </div>
        </div></Reveal>
        {/* Leaderboard */}
        {leaderboardData && (leaderboardData.countries?.length > 0 || leaderboardData.cities?.length > 0) && (
          <Reveal delay={0.15}><div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 640, margin: "28px auto 0" }}>
            {leaderboardData.countries?.length > 0 && (
              <div style={{ flex: "1 1 200px", maxWidth: 280, textAlign: "left" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: g.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Top Countries</p>
                {leaderboardData.countries.slice(0, 5).map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{c.country_code}</span>
                    <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{c.count?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
            {leaderboardData.cities?.length > 0 && (
              <div style={{ flex: "1 1 200px", maxWidth: 280, textAlign: "left" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: g.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Top Cities</p>
                {leaderboardData.cities.slice(0, 5).map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{c.city}</span>
                    <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{c.count?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div></Reveal>
        )}
        <Reveal delay={0.2}><div style={{ marginTop: 24 }}><Btn primary onClick={onShare} style={{ fontSize: 15 }}>Share Your Moment</Btn></div></Reveal>
      </section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Be part of this moment.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Join the founding event. Share your butterfly.</p>
        <Btn primary onClick={onShare} style={{ fontSize: 16, padding: "12px 28px" }}>Share Your Moment</Btn>
      </div></Reveal></section>
    </div>
  );
}

/* ── Reminder Component ── */
function ReminderC({ onDone, onEmailSubmit }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const valid = email.includes("@") && email.includes(".");
  
  return (
    <div style={{ fontFamily: ff }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🕐</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: g.t1 }}>Get a reminder for May 1</h3>
      </div>
      
      {!sent ? (
        <>
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
          <Btn primary onClick={async () => { if (valid && onEmailSubmit) { const r = await onEmailSubmit(email); if (r.success) setSent(true); } else if (valid) { setSent(true); } }} disabled={!valid} style={{ width: "100%", fontSize: 14, padding: "10px 20px" }}>Remind Me May 1</Btn>
          <p style={{ fontSize: 11, color: g.t4, marginTop: 12, textAlign: "center", fontFamily: ff }}>No spam. Just one reminder. Unsubscribe anytime.</p>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", color: TEAL }}>
            <Check size={18} />
            <p style={{ fontSize: 16, fontWeight: 600, fontFamily: ff }}>You're on the list.</p>
          </div>
          <Btn onClick={onDone} style={{ width: "100%", fontSize: 14, padding: "10px 20px", marginTop: 12 }}>Done</Btn>
        </>
      )}
    </div>
  );
}



/* ── UGC Popup ── */
function UgcPopup({ open, onClose, recordingStep, countdownValue, isRecording, recordingSeconds, recordedPreviewUrl, ugcConsent, setUgcConsent, cameraError, ugcUploading, liveVideoRef, onSelectMode, onRetake, onUseVideo, onFileSelect, onUpload, onStopRecording }) {
  const ease = "cubic-bezier(.16,1,.3,1)";
  const btnStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600, fontFamily: ff, cursor: "pointer", border: "none", transition: `all .25s ${ease}` };

  return (
    <Popup open={open} onClose={onClose}>
      <div style={{ animation: `fadeUp .35s ${ease}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Share Your Story</h2>
        <p style={{ fontSize: 14, color: g.t3, marginBottom: 20 }}>Record a short video doing the Butterfly Sign.</p>

        {/* MODE SELECT */}
        {recordingStep === 'mode-select' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => onSelectMode('auto')} style={{ ...btnStyle, background: TEAL, color: "#fff", width: "100%" }}>
              Auto (3s countdown)
            </button>
            <button onClick={() => onSelectMode('manual')} style={{ ...btnStyle, background: g.bg, color: g.t1, width: "100%", border: "1px solid #e8e8ed" }}>
              Manual (tap to start)
            </button>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <label style={{ ...btnStyle, background: "none", color: g.t3, fontSize: 13, cursor: "pointer", padding: "8px 16px" }}>
                Or upload a file
                <input type="file" accept="video/*,image/*" onChange={onFileSelect} style={{ display: "none" }} />
              </label>
            </div>
          </div>
        )}

        {/* CAMERA / RECORDING */}
        {recordingStep === 'camera' && (
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "1" }}>
            <video ref={liveVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            {/* Countdown overlay */}
            {countdownValue > 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}>
                <span style={{ fontSize: 72, fontWeight: 700, color: "#fff", animation: `popIn .3s ${ease}` }}>{countdownValue}</span>
              </div>
            )}
            {/* Recording indicator */}
            {isRecording && (
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#ef4444", animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums" }}>0:{String(recordingSeconds).padStart(2, '0')} / 0:30</span>
              </div>
            )}
            {/* Controls */}
            <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              {isRecording ? (
                <button onClick={onStopRecording} style={{ width: 56, height: 56, borderRadius: 28, background: "#ef4444", border: "3px solid #fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 3, background: "#fff" }} />
                </button>
              ) : countdownValue === 0 && (
                <button onClick={onSelectMode} style={{ ...btnStyle, background: TEAL, color: "#fff", borderRadius: 28 }}>
                  Tap to record
                </button>
              )}
            </div>
            {/* Error */}
            {cameraError && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.8)", color: "#fff", padding: 24, textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Camera unavailable</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 16 }}>Please allow camera access or upload a file instead.</p>
                <label style={{ ...btnStyle, background: TEAL, color: "#fff", cursor: "pointer" }}>
                  Upload file
                  <input type="file" accept="video/*,image/*" onChange={onFileSelect} style={{ display: "none" }} />
                </label>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW */}
        {recordingStep === 'preview' && recordedPreviewUrl && (
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "1", marginBottom: 16 }}>
              <video src={recordedPreviewUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onRetake} style={{ ...btnStyle, flex: 1, background: g.bg, color: g.t1, border: "1px solid #e8e8ed" }}>Retake</button>
              <button onClick={onUseVideo} style={{ ...btnStyle, flex: 1, background: TEAL, color: "#fff" }}>Use this</button>
            </div>
          </div>
        )}

        {/* CONSENT */}
        {recordingStep === 'consent' && (
          <div>
            {recordedPreviewUrl && (
              <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: 16 }}>
                <video src={recordedPreviewUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 16 }}>
              <input type="checkbox" checked={ugcConsent} onChange={e => setUgcConsent(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: TEAL }} />
              <span style={{ fontSize: 13, color: g.t2, lineHeight: 1.5 }}>I consent to sharing this publicly as part of the Butterfly Challenge community. I understand it will be reviewed before appearing.</span>
            </label>
            <button onClick={onUpload} disabled={!ugcConsent || ugcUploading} style={{ ...btnStyle, width: "100%", background: ugcConsent ? TEAL : g.bdr, color: "#fff", opacity: ugcConsent && !ugcUploading ? 1 : 0.5 }}>
              {ugcUploading ? 'Uploading...' : 'Share it'}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {recordingStep === 'success' && (
          <div style={{ textAlign: "center", padding: "20px 0", animation: `fadeUp .4s ${ease}` }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🦋</span>
            <p style={{ fontSize: 20, fontWeight: 600, color: g.t1, marginBottom: 6 }}>Shared!</p>
            <p style={{ fontSize: 14, color: g.t3 }}>Your story will appear after review.</p>
          </div>
        )}
      </div>
    </Popup>
  );
}

/* ── Auth Popup ── */
function AuthPopup({ open, onClose, mode, setMode, email, setEmail, password, setPassword, name, setName, error, errorColor, loading, resetEmailSent, showEmailVerification, verificationEmail, onGoogleSignIn, onSubmit, onPasswordReset }) {
  const ease = "cubic-bezier(.16,1,.3,1)";
  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, outline: "none", boxSizing: "border-box", transition: "border-color .2s" };
  const btnBase = { width: "100%", padding: "12px 20px", borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: ff, cursor: "pointer", transition: `all .25s ${ease}`, border: "none" };

  if (showEmailVerification) {
    return (
      <Popup open={open} onClose={onClose}>
        <div style={{ textAlign: "center", animation: `fadeUp .4s ${ease}` }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>📧</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Check your email</h2>
          <p style={{ fontSize: 15, color: g.t2, lineHeight: 1.6, marginBottom: 20 }}>We sent a verification link to <strong>{verificationEmail}</strong>. Click it to activate your account.</p>
          <Btn onClick={onClose} style={{ width: "100%", fontSize: 14 }}>Got it</Btn>
        </div>
      </Popup>
    );
  }

  return (
    <Popup open={open} onClose={onClose}>
      <div style={{ animation: `fadeUp .35s ${ease}` }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, textAlign: "center" }}>
          {mode === 'register' ? 'Create an account' : 'Welcome back'}
        </h2>
        <p style={{ fontSize: 14, color: g.t3, textAlign: "center", marginBottom: 20 }}>
          {mode === 'register' ? 'Join the Butterfly Challenge' : 'Sign in to continue'}
        </p>

        {/* Google sign-in */}
        <button onClick={onGoogleSignIn} style={{ ...btnBase, background: "#fff", border: "1px solid #e8e8ed", color: g.t1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e8e8ed" }} />
          <span style={{ fontSize: 12, color: g.t4 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#e8e8ed" }} />
        </div>

        {/* Name field (register only) */}
        {mode === 'register' && (
          <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
        )}

        {/* Email + Password */}
        <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onSubmit(); }} style={{ ...inputStyle, marginBottom: 4 }} />

        {/* Forgot password */}
        {mode === 'login' && (
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            {resetEmailSent ? (
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500 }}><Check size={11} style={{ verticalAlign: "middle" }} /> Reset link sent!</span>
            ) : (
              <button onClick={onPasswordReset} style={{ background: "none", border: "none", fontSize: 12, color: g.t3, cursor: "pointer", fontFamily: ff, padding: 0 }}>Forgot password?</button>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p style={{ fontSize: 13, color: errorColor, marginBottom: 12, textAlign: "center" }}>{error}</p>}

        {/* Submit */}
        <button onClick={onSubmit} disabled={loading} style={{ ...btnBase, background: TEAL, color: "#fff", opacity: loading ? 0.6 : 1, marginTop: mode === 'register' ? 12 : 4 }}>
          {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
        </button>

        {/* Toggle mode */}
        <p style={{ fontSize: 13, color: g.t3, textAlign: "center", marginTop: 16 }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: "none", border: "none", color: TEAL, fontWeight: 600, cursor: "pointer", fontFamily: ff, fontSize: 13, padding: 0 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </Popup>
  );
}

/* ── Main App Component with Routing ── */
export default function App() {
  const queryClient = useQueryClient();
  const { entries, addEntry } = useLH();
  const { toast, show } = useToast();
  const cp = useCallback(t => { navigator.clipboard.writeText(t).then(() => show("Copied")); }, [show]);
  const { page, navigate } = useHashRouter();
  
  const [joinO, sJO] = useState(false);
  const [shareO, sSO] = useState(false);
  const [remindO, setRemindO] = useState(false);
  const [roleP, setRP] = useState(null);
  const [alP, setAP] = useState(null);
  const [trustO, setTO] = useState(false);
  const [tlPopup, setTlPopup] = useState(null);
  const [supportO, setSupportO] = useState(false);

  // ── Auth state ──
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authErrorColor, setAuthErrorColor] = useState('#ef4444');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userHandRaiseDate, setUserHandRaiseDate] = useState(null);
  const [hasCelebrated, setHasCelebrated] = useState(() => !!localStorage.getItem('bc_did_it'));
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [topParticipants, setTopParticipants] = useState([]);

  // ── UGC state ──
  const [ugcModalOpen, setUgcModalOpen] = useState(false);
  const [recordingStep, setRecordingStep] = useState('mode-select');
  const [recordingMode, setRecordingMode] = useState(null);
  const [countdownValue, setCountdownValue] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState(null);
  const [ugcConsent, setUgcConsent] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [ugcUploading, setUgcUploading] = useState(false);
  const liveVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // ── React Query hooks ──
  const { data: countData = 0 } = useQuery({
    queryKey: ['handRaisesCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('hand_raises')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const [countries, cities] = await Promise.all([
        supabase.rpc('get_country_leaderboard'),
        supabase.rpc('get_city_leaderboard'),
      ]);
      return { countries: countries.data || [], cities: cities.data || [] };
    },
    staleTime: 30 * 1000,
  });

  const { data: communityData = [] } = useQuery({
    queryKey: ['communitySubmissions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('challenge_submissions')
        .select('id, file_url, file_type, display_name, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  async function loadTopParticipants() {
    try {
      const { data } = await supabase.rpc('get_top_participants');
      if (!data) return;
      setTopParticipants(data.map(row => ({
        name: row.display_name || 'User',
        avatar: row.avatar_url,
        count: row.share_count
      })));
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'loadTopParticipants', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  // ── Auth functions ──
  async function loadUserHandRaiseDate(userId) {
    try {
      const { data } = await supabase
        .from('hand_raises')
        .select('created_at')
        .eq('user_id', userId)
        .single();
      if (data?.created_at) {
        const date = new Date(data.created_at);
        setUserHandRaiseDate(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        setHasCelebrated(true);
      }
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'loadUserHandRaiseDate', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  async function backfillCountryCode(user) {
    if (!user) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('country_code').eq('id', user.id).single();
      if (profile && !profile.country_code) {
        const cc = getCountryCode();
        if (cc) await supabase.from('profiles').update({ country_code: cc }).eq('id', user.id);
      }
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'backfillCountryCode', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  const openAuthModal = (mode) => {
    track('auth_modal_opened', { mode });
    setAuthMode(mode);
    setAuthError('');
    setAuthErrorColor('#ef4444');
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setResetEmailSent(false);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthError('');
    setAuthErrorColor('#ef4444');
  };

  const handlePasswordReset = async () => {
    if (!authEmail) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      track('password_reset_requested');
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'handlePasswordReset', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  };

  const handleGoogleSignIn = async () => {
    track('google_signin_attempted');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setAuthError(error.message);
  };

  const handleAuthSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!authEmail || !authPassword) { setAuthErrorColor('#ef4444'); setAuthError('Please fill in all fields.'); return; }
    if (!emailRegex.test(authEmail)) { setAuthErrorColor('#ef4444'); setAuthError('Please enter a valid email address.'); return; }
    if (authPassword.length < 6) { setAuthErrorColor('#ef4444'); setAuthError('Password must be at least 6 characters.'); return; }
    if (authMode === 'register' && authPassword.length < 8) { setAuthErrorColor('#ef4444'); setAuthError('Password must be at least 8 characters.'); return; }

    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: authEmail, password: authPassword,
          options: { data: { display_name: authName || authEmail.split('@')[0], country_code: getCountryCode() } }
        });
        if (error) throw error;
        track('user_registered', { method: 'email' });
        setVerificationEmail(authEmail);
        setShowEmailVerification(true);
        closeAuthModal();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
        track('user_signed_in', { method: 'email' });
        closeAuthModal();
      }
    } catch (e) {
      setAuthErrorColor('#ef4444');
      setAuthError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // ── Auth listener + referral tracking ──
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('bc_ref', refCode);
      track('referral_visit', { ref: refCode });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadUserHandRaiseDate(session.user.id);
        backfillCountryCode(session.user);
      }
    });

    loadTopParticipants();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        backfillCountryCode(session.user);
        loadUserHandRaiseDate(session.user.id);
        loadTopParticipants();
      } else {
        setCurrentUser(null);
      }
    });

    // Realtime subscriptions
    const channel = supabase
      .channel('hand_raises_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hand_raises' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          queryClient.invalidateQueries({ queryKey: ['handRaisesCount'] });
        }
      ).subscribe();

    const ugcChannel = supabase
      .channel('ugc_submissions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenge_submissions' },
        () => queryClient.invalidateQueries({ queryKey: ['communitySubmissions'] })
      ).subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
      ugcChannel.unsubscribe();
      stopCamera();
    };
  }, []);

  // ── Derived user info ──
  const displayName = currentUser?.user_metadata?.full_name
    || currentUser?.user_metadata?.name
    || currentUser?.user_metadata?.display_name
    || currentUser?.email?.split('@')[0]
    || 'User';
  const avatarUrl = currentUser?.user_metadata?.avatar_url
    || currentUser?.user_metadata?.picture
    || null;

  // ── UGC functions ──
  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: true
      });
      cameraStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play();
      }
    } catch {
      setCameraError(true);
    }
  };

  const startRecording = () => {
    if (!cameraStreamRef.current) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';
    const recorder = new MediaRecorder(cameraStreamRef.current, { mimeType });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setRecordedBlob(blob);
      setRecordedPreviewUrl(URL.createObjectURL(blob));
      setRecordingStep('preview');
      stopCamera();
    };
    mediaRecorderRef.current = recorder;
    recorder.start(100);
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 29) { stopRecording(); return 30; }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const stopCamera = () => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    cameraStreamRef.current = null;
  };

  const startAutoCountdown = () => {
    setCountdownValue(3);
    let count = 3;
    countdownRef.current = window.setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownValue(count);
      } else {
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        setCountdownValue(0);
        startRecording();
      }
    }, 1000);
  };

  const selectMode = async (mode) => {
    setRecordingMode(mode);
    setRecordingStep('camera');
    await startCamera();
    if (mode === 'auto') {
      setTimeout(() => startAutoCountdown(), 500);
    }
  };

  const handleRetake = () => {
    if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    setRecordedBlob(null);
    setRecordedPreviewUrl(null);
    setRecordingSeconds(0);
    setRecordingStep('camera');
    startCamera().then(() => {
      if (recordingMode === 'auto') setTimeout(() => startAutoCountdown(), 500);
    });
  };

  const handleUseVideo = () => setRecordingStep('consent');

  const handleUgcFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10MB'); return; }
    setRecordedBlob(file);
    setRecordedPreviewUrl(URL.createObjectURL(file));
    setRecordingStep('consent');
  };

  const handleUgcUpload = async () => {
    if (!recordedBlob || !ugcConsent) return;
    setUgcUploading(true);
    try {
      const userId = currentUser?.id || 'anon';
      const ext = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('challenge-submissions')
        .upload(path, recordedBlob);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('challenge-submissions')
        .getPublicUrl(path);

      const fileType = recordedBlob.type.startsWith('image/') ? 'image' : 'video';
      const { data: rpcResult } = await supabase.rpc('rate_limited_submission', {
        p_user_id: currentUser?.id || null,
        p_file_url: urlData.publicUrl,
        p_file_type: fileType,
        p_consent: true,
        p_display_name: displayName
      });
      if (rpcResult && !rpcResult.success) {
        alert(rpcResult.error || 'Upload limit reached. Please wait.');
        return;
      }

      track('ugc_submitted', { file_type: fileType });
      setRecordingStep('success');
      setTimeout(() => { setUgcModalOpen(false); stopCamera(); }, 3000);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUgcUploading(false);
    }
  };

  const openUgcModal = () => {
    if (!currentUser) { openAuthModal('login'); return; }
    track('ugc_cta_clicked');
    setUgcModalOpen(true);
    setRecordingStep('mode-select');
    setRecordingMode(null);
    setRecordedBlob(null);
    setRecordedPreviewUrl(null);
    setUgcConsent(false);
    setRecordingSeconds(0);
    setCountdownValue(0);
    setCameraError(false);
  };

  // ── "I Did It" handler ──
  const handleIDidIt = async () => {
    if (hasCelebrated) {
      sSO(true);
      return;
    }
    setHasCelebrated(true);
    localStorage.setItem('bc_did_it', '1');
    track('did_it_clicked');
    const refSource = localStorage.getItem('bc_ref');
    if (refSource) track('referral_converted', { ref: refSource });
    setShowPlusOne(true);
    const { city } = await getLocationData();
    saveHandRaise(currentUser?.id, city);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0072BC', '#E8A838', '#32C189', '#FFFFFF']
    });
    setTimeout(() => {
      setShowPlusOne(false);
      sSO(true);
    }, 800);
  };

  // ── Share handler ──
  async function saveShareAction(platform) {
    if (!currentUser) return;
    try {
      const { data } = await supabase.rpc('rate_limited_share', {
        p_user_id: currentUser.id,
        p_platform: platform,
        p_display_name: displayName,
        p_avatar_url: avatarUrl,
      });
      if (data && !data.success) return;
      loadTopParticipants();
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'saveShare', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
    track('share_completed', { platform });
  }

  // ── Email submit handler ──
  const handleEmailSubmit = async (emailVal) => {
    if (!emailVal || !emailVal.trim()) return { success: false };
    try {
      const result = await saveEmail(emailVal.trim());
      if (result.success || result.message?.includes('already')) {
        if (result.success) track('email_reminder_subscribed');
        return { success: true };
      }
      return { success: false, error: result.message };
    } catch (e) {
      return { success: false };
    }
  };

  // ── Modal open tracking ──
  useEffect(() => { if (shareO) track('share_modal_opened'); }, [shareO]);
  useEffect(() => { if (supportO) track('crisis_modal_opened'); }, [supportO]);
  useEffect(() => { if (remindO) track('email_reminder_opened'); }, [remindO]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: g.t1, fontFamily: ff, WebkitFontSmoothing: "antialiased", paddingBottom: 40 }}>
      <style>{`
        *{box-sizing:border-box;margin:0}body{margin:0}::selection{background:#d1fae5}
        .hs::-webkit-scrollbar{display:none}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes ping{75%,100%{transform:scale(2.5);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .hov-lift:hover{transform:translateY(-2px);box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .hov-lift:active{transform:scale(.97)}
        .card-btn{transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s cubic-bezier(.16,1,.3,1)}
        .card-btn:hover{transform:scale(1.02);box-shadow:0 4px 20px rgba(0,0,0,.06)}
        .card-btn:active{transform:scale(.98)}
      `}</style>
      
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <Toast message={toast} />

      {/* Popups */}
      <Popup open={joinO} onClose={() => sJO(false)}><h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>Join the Challenge</h2><JoinC onDone={() => { sJO(false); setTimeout(() => sSO(true), 250); }} /></Popup>
      <Popup open={shareO} onClose={() => sSO(false)}><h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>Share your Butterfly</h2><ShareC addEntry={addEntry} cp={cp} onShare={saveShareAction} onEmailSubmit={handleEmailSubmit} /></Popup>
      <Popup open={remindO} onClose={() => setRemindO(false)}><ReminderC onDone={() => setRemindO(false)} onEmailSubmit={handleEmailSubmit} /></Popup>
      <Popup open={!!roleP} onClose={() => setRP(null)}>{roleP && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><img src={roleP.icon} alt={roleP.name} style={{ width: 44, height: 44, marginBottom: 10 }} /><p style={{ color: TEAL, fontWeight: 600, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{roleP.word}</p><h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{roleP.name}</h2><p style={{ fontSize: 16, color: g.t2, lineHeight: 1.65, marginBottom: 20 }}>{roleP.detail}</p><Btn primary onClick={() => { setRP(null); sJO(true); }} style={{ fontSize: 15 }}>Join the Challenge</Btn></div>}</Popup>
      <Popup open={!!alP} onClose={() => setAP(null)}>{alP && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><img src={alP.icon} alt={alP.name} style={{ width: 44, height: 44, marginBottom: 10, filter: alP.tint }} /><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{alP.name}</h2><p style={{ fontSize: 15, color: TEAL, fontWeight: 500, marginBottom: 14 }}>{alP.line}</p><p style={{ fontSize: 15, color: g.t2, lineHeight: 1.65, marginBottom: 18 }}>{alP.brief}</p><div style={{ padding: "12px 14px", background: g.bg, borderRadius: 10, marginBottom: 18 }}><p style={{ fontSize: 13, color: g.t2 }}><strong>Non-negotiable:</strong> Safety before scale.</p></div><Btn primary onClick={() => window.open("mailto:partners@onehumanity.org?subject=Founding Partner Inquiry — " + alP.name)} style={{ fontSize: 15 }}>Become a founding partner</Btn></div>}</Popup>
      <Popup open={trustO} onClose={() => setTO(false)}><div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>Built to be trusted.</h2><div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{TRUST.map((t, i) => <div key={i} style={{ display: "flex", gap: 14, animation: `fadeUp .4s cubic-bezier(.16,1,.3,1) ${i * 60}ms both` }}><span style={{ fontSize: 22 }}>{t.m}</span><div><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{t.t}</p><p style={{ fontSize: 14, color: g.t2, lineHeight: 1.5 }}>{t.d}</p></div></div>)}</div></div></Popup>
      <Popup open={!!tlPopup} onClose={() => setTlPopup(null)}>{tlPopup && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><span style={{ fontSize: 13, fontWeight: 600, color: TEAL, padding: "4px 10px", background: TEAL + "14", borderRadius: 99 }}>{tlPopup.d}</span>{tlPopup.status === "next" && <span style={{ fontSize: 11, fontWeight: 600, color: TEAL, letterSpacing: ".08em", textTransform: "uppercase" }}>Up next</span>}</div><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, letterSpacing: "-.02em" }}>{tlPopup.t}</h2><p style={{ fontSize: 14, color: g.t3, marginBottom: 14 }}>{tlPopup.s}</p><p style={{ fontSize: 15, color: g.t2, lineHeight: 1.7 }}>{tlPopup.detail}</p></div>}</Popup>
      <Popup open={supportO} onClose={() => setSupportO(false)}><SupportPanel /></Popup>
      <AuthPopup
        open={authModalOpen} onClose={closeAuthModal}
        mode={authMode} setMode={setAuthMode}
        email={authEmail} setEmail={setAuthEmail}
        password={authPassword} setPassword={setAuthPassword}
        name={authName} setName={setAuthName}
        error={authError} errorColor={authErrorColor} loading={authLoading}
        resetEmailSent={resetEmailSent}
        showEmailVerification={showEmailVerification} verificationEmail={verificationEmail}
        onGoogleSignIn={handleGoogleSignIn} onSubmit={handleAuthSubmit} onPasswordReset={handlePasswordReset}
      />
      <UgcPopup
        open={ugcModalOpen} onClose={() => { stopCamera(); setUgcModalOpen(false); }}
        recordingStep={recordingStep} countdownValue={countdownValue}
        isRecording={isRecording} recordingSeconds={recordingSeconds}
        recordedPreviewUrl={recordedPreviewUrl}
        ugcConsent={ugcConsent} setUgcConsent={setUgcConsent}
        cameraError={cameraError} ugcUploading={ugcUploading}
        liveVideoRef={liveVideoRef}
        onSelectMode={selectMode} onRetake={handleRetake}
        onUseVideo={handleUseVideo} onFileSelect={handleUgcFileSelect}
        onUpload={handleUgcUpload} onStopRecording={stopRecording}
      />

      {/* Navigation */}
      <Nav page={page} navigate={navigate} onJoin={() => sJO(true)} onSupport={() => setSupportO(true)}
        currentUser={currentUser} onSignIn={() => openAuthModal('login')} onSignOut={handleSignOut}
        userDropdownOpen={userDropdownOpen} setUserDropdownOpen={setUserDropdownOpen}
        displayName={displayName} avatarUrl={avatarUrl}
      />
      
      {/* Page Routing */}
      {page === '' && <HomePage onJoin={() => sJO(true)} onShare={() => sSO(true)} onRemind={() => setRemindO(true)} onDidIt={handleIDidIt} showPlusOne={showPlusOne} onUgcOpen={openUgcModal} communityData={communityData} setRP={setRP} setAP={setAP} setTlPopup={setTlPopup} entries={entries} handCount={countData} />}
      {page === 'story' && <StoryPage navigate={navigate} />}
      {page === 'science' && <SciencePage navigate={navigate} />}
      {page === 'alliance' && <AlliancePage setRP={setRP} setAP={setAP} onTrust={() => setTO(true)} navigate={navigate} />}
      {page === 'live' && <LivePage entries={entries} setTlPopup={setTlPopup} onShare={() => sSO(true)} handCount={countData} leaderboardData={leaderboardData} />}
      
      {/* Footer */}
      <Footer navigate={navigate} onSupport={() => setSupportO(true)} />
      
      {/* Support Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,.06)", padding: "7px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <span style={{ fontSize: 11, color: g.t4, fontFamily: ff }}>Need support?</span>
        <a href="tel:988" style={{ fontSize: 13, fontWeight: 600, color: TEAL, textDecoration: "none", fontFamily: ff, display: "flex", alignItems: "center", gap: 4 }}>📞 988</a>
        <span style={{ fontSize: 11, color: g.bdr }}>·</span>
        <a href="https://findahelpline.com" target="_blank" rel="noopener" style={{ fontSize: 12, fontWeight: 500, color: g.t3, textDecoration: "none", fontFamily: ff }}>findahelpline.com</a>
      </div>
    </div>
  );
}
