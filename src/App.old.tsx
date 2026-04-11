import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FooterSection } from './components/FooterSection';
import { BottomSafetyBar } from './components/BottomSafetyBar';
import { HeroSection } from './components/HeroSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { createClient } from '@supabase/supabase-js';
import mixpanel from 'mixpanel-browser';

// ===================== SUPABASE =====================
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===================== MIXPANEL =====================
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: false,
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
  api_host: 'https://api-eu.mixpanel.com'
});

function track(event: string, props?: Record<string, unknown>) {
  try { mixpanel.track(event, props || {}); } catch(e) { /* silent */ }
}

// ===================== HELPERS =====================
function getCountryCode(): string | null {
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

async function getLocationData(): Promise<{ country: string | null, city: string | null }> {
  try {
    const res = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`);
    const data = await res.json();
    return {
      country: data.country || null,
      city: data.city || null
    };
  } catch (error) {
    if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'getLocationData', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    return { country: getCountryCode(), city: null };
  }
}

async function saveHandRaise(userId?: string, city?: string | null) {
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

async function saveEmail(email: string) {
  try {
    const { error } = await supabase.from('email_reminders').insert({ email });
    if (error) {
      const msg = error.message || error.details || '';
      const code = error.code || '';
      if (code === '23505' || msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists') || msg.includes('conflict')) {
        return { success: false, message: 'You\'re already subscribed! 🦋' };
      }
      return { success: false, message: 'Something went wrong.' };
    }

    // Send confirmation email via Edge Function
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'confirmation', email, secret: import.meta.env.VITE_FUNCTION_SECRET })
      });
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'sendConfirmationEmail', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }

    return { success: true };
  } catch { return { success: false, message: 'Something went wrong.' }; }
}

// loadRealCount, loadLeaderboard, loadCommunitySubmissions replaced by React Query hooks
import {
  Heart,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Phone,
  MessageCircle,
  Globe,
  Share2,
  Copy,
  Check,
  CheckCircle,
  Award,
  Users,
  Shield,
  ArrowRight,
  BarChart2,
  Menu,
  Clock,
  GraduationCap,
  Briefcase,
  Tag,
  Smartphone,
  Camera,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
// globe.gl loaded dynamically in useEffect to reduce initial bundle
import logo from './Butterfly_Challenge_logo_main (1).svg';
// handImg2 moved to HeroSection component
import logo988 from './988Logo.jpg';
import logoOneHumanity from './ONE_HUMANITY_Logo_Main.png';
import logoVerified from './Certified-Nonprofit-Gold.webp';
import imgISeeYou from './I see you.png';
import imgICare from './I care.png';
import imgYouAreNotAlone from './You are not alone.png';

// Types
interface FAQItem {
  question: string;
  answer: string;
}

interface LeaderboardItem {
  rank: number;
  flag: string;
  name: string;
  count: number;
}

interface CommunitySubmission {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  display_name: string | null;
  created_at: string;
}

interface CountryLeaderboardRow {
  country_code: string;
  cnt: number;
}

interface CityLeaderboardRow {
  city: string;
  cnt: number;
}

interface TopParticipantRow {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  share_count: number;
}

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    display_name?: string;
    avatar_url?: string;
    picture?: string;
    country_code?: string;
  };
}

// Globe.gl type helpers (replaces `as any` casts)
interface GlobeInstance {
  _destructor?: () => void;
}

interface GlobeMaterial {
  opacity: number;
  shininess: number;
}

interface GlobeContainerElement extends HTMLDivElement {
  _arcInterval?: ReturnType<typeof setInterval>;
  _resizeHandler?: () => void;
}


function getShareUrl(userId?: string | null, sessionId?: string | null): string {
  const base = 'https://thebutterflychallenge.com';
  const ref = userId || sessionId || localStorage.getItem('bc_session');
  return ref ? `${base}?ref=${ref}` : base;
}

const crisisLines: Record<string, { name: string; phone: string; url: string }> = {
  'United States': { name: '988 Suicide & Crisis Lifeline', phone: '988', url: 'https://988lifeline.org' },
  'United Kingdom': { name: 'Samaritans', phone: '116 123', url: 'https://www.samaritans.org' },
  'Canada': { name: 'Crisis Services Canada', phone: '1-833-456-4566', url: 'https://www.crisisservicescanada.ca' },
  'Australia': { name: 'Lifeline Australia', phone: '13 11 14', url: 'https://www.lifeline.org.au' },
  'Germany': { name: 'Telefonseelsorge', phone: '0800 111 0 111', url: 'https://www.telefonseelsorge.de' },
  'France': { name: 'Numéro National Prévention Suicide', phone: '3114', url: 'https://www.3114.fr' },
  'Brazil': { name: 'CVV', phone: '188', url: 'https://www.cvv.org.br' },
  'India': { name: 'iCall', phone: '9152987821', url: 'https://icallhelpline.org' },
  'Nigeria': { name: 'Mentally Aware Nigeria', phone: '08079069614', url: 'https://www.mani.ng' },
  'South Africa': { name: 'SADAG', phone: '0800 456 789', url: 'https://www.sadag.org' },
  'New Zealand': { name: 'Lifeline NZ', phone: '0800 543 354', url: 'https://www.lifeline.org.nz' },
  'Ireland': { name: 'Samaritans Ireland', phone: '116 123', url: 'https://www.samaritans.org' },
  'Netherlands': { name: '113 Zelfmoordpreventie', phone: '113', url: 'https://www.113.nl' },
  'Sweden': { name: 'Mind Självmordslinjen', phone: '90101', url: 'https://mind.se' },
  'Norway': { name: 'Mental Helse', phone: '116 123', url: 'https://mentalhelse.no' },
  'Denmark': { name: 'Livslinien', phone: '70 201 201', url: 'https://www.livslinien.dk' },
  'Spain': { name: 'Teléfono de la Esperanza', phone: '717 003 717', url: 'https://www.telefonodelaesperanza.org' },
  'Italy': { name: 'Telefono Amico', phone: '02 2327 2327', url: 'https://www.telefonoamico.it' },
  'Japan': { name: 'Inochi no Denwa', phone: '0120-783-556', url: 'https://www.ifd.or.jp' },
  'South Korea': { name: 'Korea Suicide Prevention Hotline', phone: '1393', url: 'https://www.1393.go.kr' },
  'Singapore': { name: 'Samaritans of Singapore', phone: '1800-221-4444', url: 'https://www.sos.org.sg' },
  'Mexico': { name: 'SAPTEL', phone: '55 5259-8121', url: 'https://www.saptel.org.mx' },
  'Argentina': { name: 'Centro de Asistencia al Suicida', phone: '135', url: 'https://www.asistenciaalsuicida.org.ar' },
  'Other': { name: 'Find International Resources', phone: '', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
};

const COLORS = {
  bg: '#FFFFFF',
  surface: '#F5F5F7',
  warmBg: '#FFFAF5',
  text: '#111111',
  muted: '#4D4D4D',
  caption: '#6E6E73',
  hair: '#E5E5EA',
  accent: '#00b18d',
  accentLight: '#E8F4FD',
  success: '#32C189',
  warning: '#684D0B',
  danger: '#FF3B30',
  warm: '#E8A838'
};

// FAQ Data
const faqData: FAQItem[] = [
  {
    question: "Do I have to talk about my mental health?",
    answer: "No. You say \"I got you\" to someone you care about. That's it. You share nothing about yourself unless you want to."
  },
  {
    question: "What if I feel awkward on camera?",
    answer: "Everyone does. That's the point. Keep it short and real. 60 seconds."
  },
  {
    question: "What if someone I tag doesn't respond?",
    answer: "Your post still counts. The chain continues through people who do respond. No pressure on anyone."
  },
  {
    question: "What if someone I tagged seems to be struggling?",
    answer: "Send them a private message — not another tag. A simple check-in: \"Hey, no pressure at all on the challenge. I just wanted to make sure you're okay.\" The 24 hours is for the gesture, not the relationship. If you're worried, contact 988 (call or text, 24/7) for guidance."
  },
  {
    question: "Does this actually help anyone?",
    answer: "Every chain extends the reach of a simple idea: it's okay to check in on someone. The gesture itself — once recognized by millions — becomes a real-world signal that connects people to professional support through the Butterfly Protocol."
  },
  {
    question: "How do I do the Butterfly gesture?",
    answer: "Hands on heart → thumbs cross → fingers spread like wings → hold. That's it. It's a simple gesture that says \"I see you\" without words."
  }
];

// Leaderboard helpers
function getFlag(code: string): string {
  try {
    return code.toUpperCase().replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
  } catch { return '🌍'; }
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    US: 'USA', GB: 'UK', BR: 'Brazil', NG: 'Nigeria', IN: 'India',
    DE: 'Germany', FR: 'France', CA: 'Canada', AU: 'Australia', MX: 'Mexico',
    JP: 'Japan', KR: 'South Korea', IT: 'Italy', ES: 'Spain', RU: 'Russia',
    UZ: 'Uzbekistan', KZ: 'Kazakhstan', TR: 'Turkey', PK: 'Pakistan', ID: 'Indonesia'
  };
  return names[code] || code;
}


function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    firstEl.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, containerRef]);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Home() {
  // State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(() => !!localStorage.getItem('bc_did_it'));
  const [userHandRaiseDate, setUserHandRaiseDate] = useState<string | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [closingModal, setClosingModal] = useState<string | null>(null);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showPlatformGuide, setShowPlatformGuide] = useState<'tiktok' | 'instagram' | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isEmailReminderOpen, setIsEmailReminderOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<'country' | 'city'>('country');
  const [countryLeaderboard, setCountryLeaderboard] = useState<LeaderboardItem[]>([]);
  const [cityLeaderboard, setCityLeaderboard] = useState<LeaderboardItem[]>([]);

  // UGC state
  const [ugcModalOpen, setUgcModalOpen] = useState(false);
  const [ugcConsent, setUgcConsent] = useState(false);
  const [ugcUploading, setUgcUploading] = useState(false);
  const [communitySubmissions, setCommunitySubmissions] = useState<CommunitySubmission[]>([]);
  const [topParticipants, setTopParticipants] = useState<{name: string, avatar: string | null, count: number}[]>([]);
  const [recordingStep, setRecordingStep] = useState<'mode-select' | 'camera' | 'preview' | 'consent' | 'success'>('mode-select');
  const [recordingMode, setRecordingMode] = useState<'auto' | 'manual' | null>(null);
  const [countdownValue, setCountdownValue] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const ugcInputRef = useRef<HTMLInputElement>(null);
  const leaderboardTrackedRef = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [crisisResult, setCrisisResult] = useState<{ name: string; phone: string; url: string } | null>(null);

  // Auth UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [authErrorColor, setAuthErrorColor] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const authModalRef = useRef<HTMLDivElement>(null);
  const crisisModalRef = useRef<HTMLDivElement>(null);
  const shareModalRef = useRef<HTMLDivElement>(null);
  const videoModalRef = useRef<HTMLDivElement>(null);
  const statsModalRef = useRef<HTMLDivElement>(null);
  const emailModalRef = useRef<HTMLDivElement>(null);
  const ugcModalRef = useRef<HTMLDivElement>(null);
  const platformGuideRef = useRef<HTMLDivElement>(null);

  // Refs
  const heroRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<GlobeInstance | null>(null);

  // ===================== REACT QUERY HOOKS =====================
  const { data: countData } = useQuery({
    queryKey: ['handRaisesCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('hand_raises')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    staleTime: 10 * 1000,
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

  const { data: communityData } = useQuery({
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
    staleTime: 60 * 1000,
  });

  // Sync React Query data to state
  useEffect(() => {
    if (countData !== undefined) {
      setCounter(countData);
    }
  }, [countData]);

  useEffect(() => {
    if (leaderboardData) {
      setCountryLeaderboard(
        (leaderboardData.countries as CountryLeaderboardRow[]).map((row: CountryLeaderboardRow, i: number) => ({
          rank: i + 1,
          flag: getFlag(row.country_code),
          name: getCountryName(row.country_code),
          count: row.cnt
        }))
      );
      setCityLeaderboard(
        (leaderboardData.cities as CityLeaderboardRow[]).map((row: CityLeaderboardRow, i: number) => ({
          rank: i + 1,
          flag: '🏙️',
          name: row.city,
          count: row.cnt
        }))
      );
    }
  }, [leaderboardData]);

  useEffect(() => {
    if (communityData) {
      const unique = (communityData as CommunitySubmission[]).filter((item: CommunitySubmission, index: number, self: CommunitySubmission[]) =>
        index === self.findIndex((t) => t.id === item.id)
      );
      setCommunitySubmissions(unique as CommunitySubmission[]);
    }
  }, [communityData]);

  // Auth listener + realtime
  useEffect(() => {
    // Referral tracking
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('bc_ref', refCode);
      track('referral_visit', { ref: refCode });
    }

    // Counter and leaderboard now managed by React Query hooks above

    // Auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUser(session.user);
        backfillCountryCode(session.user);
        loadUserHandRaiseDate(session.user.id);
        if (session.user.email) setEmail(session.user.email);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        backfillCountryCode(session.user);
        loadUserHandRaiseDate(session.user.id);
        if (session.user.email) setEmail(session.user.email);
      } else {
        setEmail('');
        setTopParticipants([]);
      }
    });

    // Load leaderboard + realtime
    // Leaderboard and community data now managed by React Query
    loadTopParticipants();
    const channel = supabase
      .channel('hand_raises_changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'hand_raises' },
        () => { queryClient.invalidateQueries({ queryKey: ['leaderboard'] }); queryClient.invalidateQueries({ queryKey: ['handRaisesCount'] }); }
      )
      .subscribe();
    const ugcChannel = supabase
      .channel('ugc_submissions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenge_submissions' },
        () => queryClient.invalidateQueries({ queryKey: ['communitySubmissions'] })
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
      ugcChannel.unsubscribe();
    };
  }, []);

  // Focus traps for accessibility
  useFocusTrap(authModalOpen, authModalRef);
  useFocusTrap(isCrisisModalOpen, crisisModalRef);
  useFocusTrap(isShareDrawerOpen, shareModalRef);
  useFocusTrap(isVideoModalOpen, videoModalRef);
  useFocusTrap(isStatsModalOpen, statsModalRef);
  useFocusTrap(isEmailReminderOpen, emailModalRef);
  useFocusTrap(ugcModalOpen, ugcModalRef);
  useFocusTrap(!!showPlatformGuide, platformGuideRef);

  // Track modal opens
  useEffect(() => { if (isCrisisModalOpen) track('crisis_modal_opened'); }, [isCrisisModalOpen]);
  useEffect(() => { if (isShareDrawerOpen) track('share_modal_opened'); }, [isShareDrawerOpen]);

  // Track leaderboard viewed (once)
  useEffect(() => {
    const el = document.getElementById('leaderboard');
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !leaderboardTrackedRef.current) {
        leaderboardTrackedRef.current = true;
        track('leaderboard_viewed');
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll lock when any modal is open
  useEffect(() => {
    const anyModalOpen =
      isVideoModalOpen ||
      isCrisisModalOpen ||
      isShareDrawerOpen ||
      isStatsModalOpen ||
      ugcModalOpen ||
      authModalOpen ||
      isEmailReminderOpen;

    if (anyModalOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isVideoModalOpen, isCrisisModalOpen, isShareDrawerOpen, isStatsModalOpen, ugcModalOpen, authModalOpen, isEmailReminderOpen]);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionsRef.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Globe.gl initialization (dynamically loaded)
  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container || globeInstanceRef.current) return;

    (async () => {

    // Check for reduced motion preference
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (isReduced && isReduced.matches) return;

    const globeWidth = container.getBoundingClientRect().width;
    const accentColor = COLORS.accent;
    const neutralColor = '#b0b4b9';
    const DEG2RAD = Math.PI / 180;
    const N = 10;
    const map = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWP4DwQACfsD/Qy7W+cAAAAASUVORK5CYII=';
    const landCheckUrl = 'https://assets.ot.digital/img/map.png';

    const GlobeGL = (await import('globe.gl')).default;
    const world = new GlobeGL(container)
      .globeImageUrl(map)
      .backgroundColor('rgba(0, 0, 0, 0)')
      .showAtmosphere(true)
      .atmosphereColor(neutralColor)
      .atmosphereAltitude(0.3)
      .width(globeWidth)
      .height(globeWidth);

    globeInstanceRef.current = world as unknown as GlobeInstance;

    const globeMat = world.globeMaterial();
    (globeMat as unknown as GlobeMaterial).opacity = 0.5;
    (globeMat as unknown as GlobeMaterial).shininess = 0.5;

    world.pointOfView({ altitude: 2 });
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.85;
    world.controls().enabled = true;
    world.controls().enableZoom = false;

    // d3 shuffle helper
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const randomSample = <T,>(arr: T[], n: number): T[] => shuffleArray(arr).slice(0, n);

    const getImageData = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      return ctx.getImageData(0, 0, img.width, img.height);
    };

    const visibilityForCoordinate = (lng: number, lat: number, data: ImageData) => {
      const i = 4 * data.width;
      const r = Math.round((lng + 180) / 360 * data.width + 0.5);
      const a = data.height - Math.round((lat + 90) / 180 * data.height - 0.5);
      const s = Math.round(i * (a - 1) + 4 * r) + 3;
      return data.data[s] > 90;
    };

    const landCheckImg = new Image();
    landCheckImg.crossOrigin = 'Anonymous';
    landCheckImg.src = landCheckUrl;
    landCheckImg.onload = () => {
      const d = getImageData(landCheckImg);
      const dots: { lat: number; lng: number }[] = [];
      const rows = 200;

      for (let lat = -90; lat <= 90; lat += 180 / rows) {
        const radius = Math.cos(Math.abs(lat) * DEG2RAD) * 25;
        const circum = radius * Math.PI * 2 * 2;
        for (let r = 0; r < circum; r++) {
          const lng = 360 * r / circum - 180;
          if (!visibilityForCoordinate(lng, lat, d)) continue;
          dots.push({ lat, lng });
        }
      }

      world
        .pointsData(dots)
        .pointColor(() => neutralColor)
        .pointRadius(0.25)
        .pointResolution(5)
        .pointAltitude(0)
        .pointsMerge(true)
        .arcColor(() => accentColor)
        .arcStroke(0.25)
        .arcDashInitialGap(1)
        .arcDashLength(2)
        .arcDashGap(2)
        .arcDashAnimateTime(2000)
        .labelText(() => '')
        .labelColor(() => accentColor)
        .labelDotRadius(0.3)
        .labelAltitude(0.002)
        .labelsTransitionDuration(250)
        .ringColor(() => (t: number) => `rgba(0,177,141,${1 - t})`)
        .ringMaxRadius(2)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(0);

      const arcInterval = setInterval(() => {
        const c10 = randomSample(dots, N * 2);
        const arcs = [...Array(N).keys()].map((_, i) => ({
          startLat: c10[i].lat,
          startLng: c10[i].lng,
          endLat: c10[i + N].lat,
          endLng: c10[i + N].lng
        }));
        const labels = [...Array(N * 2).keys()].map((_, i) => ({
          lat: c10[i].lat,
          lng: c10[i].lng
        }));
        const rings = [...Array(N).keys()].map((_, i) => ({
          lat: c10[i + N].lat,
          lng: c10[i + N].lng
        }));

        world.arcsData(arcs).labelsData(labels);
        setTimeout(() => { world.ringsData(rings); }, 4000);
      }, 6000);

      // Store interval for cleanup
      (container as unknown as GlobeContainerElement)._arcInterval = arcInterval;
    };

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.getBoundingClientRect().width;
      world.width(w).height(w);
    };
    window.addEventListener('resize', handleResize);
    (container as unknown as GlobeContainerElement)._resizeHandler = handleResize;
    })();

    return () => {
      const gc = container as unknown as GlobeContainerElement;
      if (gc?._resizeHandler) window.removeEventListener('resize', gc._resizeHandler);
      if (gc?._arcInterval) clearInterval(gc._arcInterval);
      globeInstanceRef.current?._destructor?.();
      globeInstanceRef.current = null;
    };
  }, []);

  // Auto-play video wall scroll
  useEffect(() => {
    const interval = setInterval(() => {
      // Simple carousel logic for demonstration
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSafeExit = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  // ===================== AUTH FUNCTIONS =====================
  async function loadUserHandRaiseDate(userId: string) {
    try {
      const { data } = await supabase
        .from('hand_raises')
        .select('created_at')
        .eq('user_id', userId)
        .single();
      if (data?.created_at) {
        const date = new Date(data.created_at);
        const formatted = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        setUserHandRaiseDate(formatted);
        setHasCelebrated(true);
      }
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'loadUserHandRaiseDate', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  async function backfillCountryCode(user: SupabaseUser) {
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

  const openAuthModal = (mode: 'login' | 'register') => {
    track('auth_modal_opened', { mode });
    setAuthMode(mode);
    setAuthError('');
    setAuthErrorColor('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setResetEmailSent(false);
    setAuthModalOpen(true);
  };

  const closeVideoModal = () => {
    setClosingModal('video');
    setTimeout(() => { setIsVideoModalOpen(false); setClosingModal(null); }, 200);
  };
  const closeCrisisModal = () => {
    setClosingModal('crisis');
    setTimeout(() => { setIsCrisisModalOpen(false); setClosingModal(null); }, 200);
  };
  const closeShareDrawer = () => {
    setClosingModal('share');
    setTimeout(() => { setIsShareDrawerOpen(false); setClosingModal(null); }, 200);
  };
  const closeEmailModal = () => {
    setClosingModal('email');
    setTimeout(() => { setIsEmailReminderOpen(false); setClosingModal(null); }, 200);
  };
  const closeStatsModal = () => {
    setClosingModal('stats');
    setTimeout(() => { setIsStatsModalOpen(false); setClosingModal(null); }, 200);
  };

  const closeAuthModal = () => {
    setClosingModal('auth');
    setTimeout(() => {
      setAuthModalOpen(false);
      setClosingModal(null);
      setAuthError('');
      setAuthErrorColor('');
    }, 200);
  };

  const handlePasswordReset = async () => {
    if (!authEmail) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetEmailSent(true);
    } catch (error) {
      if (typeof mixpanel !== 'undefined') {
        mixpanel.track('app_error', {
          source: 'handlePasswordReset',
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      }
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
    if (!authEmail || !authPassword) { setAuthErrorColor('var(--danger,#FF3B30)'); setAuthError('Please fill in all fields.'); return; }
    if (!emailRegex.test(authEmail)) { setAuthErrorColor('var(--danger,#FF3B30)'); setAuthError('Please enter a valid email address.'); return; }
    if (honeypotRef.current?.value) return;
    if (authPassword.length < 6) { setAuthErrorColor('var(--danger,#FF3B30)'); setAuthError('Password must be at least 6 characters.'); return; }
    if (authMode === 'register' && authPassword.length < 8) { setAuthErrorColor('var(--danger,#FF3B30)'); setAuthError('Password must be at least 8 characters.'); return; }

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
    } catch (e: unknown) {
      setAuthErrorColor(COLORS.danger);
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

  const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById('user-menu-wrap');
      if (el && !el.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ===================== UGC FUNCTIONS =====================
  async function loadTopParticipants() {
    try {
      const { data } = await supabase.rpc('get_top_participants');
      if (!data) return;

      setTopParticipants(
        (data as TopParticipantRow[]).map((row: TopParticipantRow) => ({
          name: row.display_name || 'User',
          avatar: row.avatar_url,
          count: row.share_count
        }))
      );
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'loadTopParticipants', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  // Camera functions
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

  const selectMode = async (mode: 'auto' | 'manual') => {
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

  // Fallback file input
  const handleUgcFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10MB'); return; }
    const blob = file as Blob;
    setRecordedBlob(blob);
    setRecordedPreviewUrl(URL.createObjectURL(blob));
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
        p_display_name: currentUser ? getDisplayName() : null
      });
      if (rpcResult && !rpcResult.success) {
        alert(rpcResult.error || 'Upload limit reached. Please wait before submitting again.');
        return;
      }

      track('ugc_submitted', { file_type: fileType });
      setRecordingStep('success');
      setTimeout(() => closeUgcModal(), 3000);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUgcUploading(false);
    }
  };

  const openUgcModal = () => {
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

  const closeUgcModal = () => {
    stopRecording();
    stopCamera();
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    setClosingModal('ugc');
    setTimeout(() => {
      if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
      setUgcModalOpen(false);
      setClosingModal(null);
      setRecordedBlob(null);
      setRecordedPreviewUrl(null);
      setUgcConsent(false);
      setIsRecording(false);
      setRecordingSeconds(0);
      setCountdownValue(0);
      setCameraError(false);
      setRecordingStep('mode-select');
      setRecordingMode(null);
    }, 200);
  };

  const avatarUrl = useMemo((): string | null => {
    if (currentUser?.user_metadata?.avatar_url) return currentUser.user_metadata.avatar_url;
    if (currentUser?.user_metadata?.picture) return currentUser.user_metadata.picture;
    return null;
  }, [currentUser]);

  const displayName = useMemo((): string => {
    if (currentUser?.user_metadata?.full_name) return currentUser.user_metadata.full_name;
    if (currentUser?.user_metadata?.name) return currentUser.user_metadata.name;
    if (currentUser?.user_metadata?.display_name) return currentUser.user_metadata.display_name;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'User';
  }, [currentUser]);

  const shareUrl = useMemo(() => getShareUrl(currentUser?.id), [currentUser]);

  // Keep function signatures for backward compat in JSX
  function getAvatarUrl(): string | null { return avatarUrl; }
  function getDisplayName(): string { return displayName; }

  const handleIDidIt = async () => {
    if (hasCelebrated) { setEmail(currentUser?.email || ''); setEmailSubmitted(false); setIsShareDrawerOpen(true); return; }
    setHasCelebrated(true);
    localStorage.setItem('bc_did_it', '1');
    track('did_it_clicked');
    const refSource = localStorage.getItem('bc_ref');
    if (refSource) track('referral_converted', { ref: refSource });
    setShowPlusOne(true);
    setCounter(prev => prev + 1);
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
      setEmail(currentUser?.email || '');
      setEmailSubmitted(false);
      setIsShareDrawerOpen(true);
    }, 800);
  };

  async function saveShare(platform: string) {
    if (!currentUser) return;
    try {
      const { data } = await supabase.rpc('rate_limited_share', {
        p_user_id: currentUser.id,
        p_platform: platform,
        p_display_name: getDisplayName(),
        p_avatar_url: getAvatarUrl() || null
      });
      if (data && !data.success) {
        console.warn('Share rate limited:', data.error);
        return;
      }
      loadTopParticipants();
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'saveShare', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Butterfly Challenge',
          text: `I raised my hand. 🦋 #ButterflyChallenge\nYour turn → ${shareUrl}`,
          url: shareUrl
        });
        track('share_completed', { platform: 'native_share' });
        saveShare('native');
      } catch {
        // User cancelled — do nothing
      }
    }
  };

  const handleCopyLink = () => {
    track('share_completed', { platform: 'copy' });
    saveShare('copy');
    navigator.clipboard?.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const result = await saveEmail(email.trim());
    if (result.success || result.message?.includes('already')) {
      if (result.success) track('email_reminder_subscribed');
      setEmailSubmitted(true);
      setTimeout(() => {
        setEmailSubmitted(false);
        setIsEmailReminderOpen(false);
        if (!currentUser) setEmail('');
      }, 2000);
    }
  };

  const toggleFAQ = (index: number) => {
    const newIndex = activeFAQ === index ? null : index;
    setActiveFAQ(newIndex);
    if (newIndex !== null) track('faq_opened', { question: faqData[index]?.question?.substring(0, 50) });
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* ============ TOP NAVBAR ============ */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${hasScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md border-transparent'
          }`}
        style={{ height: '56px' }} // Restored slightly taller original height or kept for better button fit
      >
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center"
            >
              <img
                src={logo}
                alt="Butterfly Challenge"
                className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
              style={{ color: COLORS.muted }}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('for-organizations')}
              className="text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
              style={{ color: COLORS.muted }}
            >
              For Organizations
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
              style={{ color: COLORS.muted }}
            >
              FAQ
            </button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            {/* Safe Exit (small) */}
            <button
              onClick={handleSafeExit}
              className="hidden lg:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.caption }}
              aria-label="Safe exit - navigate away quickly"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Safe Exit</span>
            </button>

            {/* Sign In / User Menu */}
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border"
                style={{ color: COLORS.text, borderColor: COLORS.hair, background: 'transparent' }}
              >
                Sign in
              </button>
            ) : (
              <div className="relative" id="user-menu-wrap">
                <button
                  onClick={toggleUserDropdown}
                  className="inline-flex items-center gap-1 sm:gap-2 pl-1 sm:pl-1.5 pr-2 sm:pr-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all border"
                  style={{ backgroundColor: COLORS.surface, borderColor: COLORS.hair, color: COLORS.text }}
                >
                  {getAvatarUrl() ? (
                    <img src={getAvatarUrl()!} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white uppercase flex-shrink-0"
                      style={{ backgroundColor: COLORS.accent }}
                    >
                      {getDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[80px] lg:max-w-[100px] truncate hidden md:inline">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </button>
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-2xl border shadow-lg p-2 z-50 min-w-[200px] dropdown-menu"
                    style={{ background: COLORS.bg, borderColor: COLORS.hair }}
                  >
                    <div className="flex items-center gap-3 px-2 py-2">
                      {getAvatarUrl() ? (
                        <img src={getAvatarUrl()!} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase flex-shrink-0"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          {getDisplayName().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: COLORS.text }}>{getDisplayName()}</p>
                        <p className="text-xs truncate" style={{ color: COLORS.caption }}>{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="h-px my-1.5" style={{ background: COLORS.hair }} />
                    <button
                      onClick={() => { setUserDropdownOpen(false); setIsStatsModalOpen(true); }}
                      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                      style={{ color: COLORS.text }}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      My Stats
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-red-50"
                      style={{ color: COLORS.danger }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Get Support */}
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Get Support</span>
            </button>

            {/* Take Challenge CTA (desktop) */}
            <button
              onClick={() => scrollToSection('hero')}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: COLORS.accent }}
            >
              Take the Challenge
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" style={{ color: COLORS.text }} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-12 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                style={{ color: COLORS.text }}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('for-organizations')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                style={{ color: COLORS.text }}
              >
                For Organizations
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                style={{ color: COLORS.text }}
              >
                FAQ
              </button>
              <button
                onClick={handleSafeExit}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                style={{ color: COLORS.muted }}
              >
                <ExternalLink className="w-4 h-4" />
                Safe Exit
              </button>

              {!currentUser ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); openAuthModal('login'); }}
                  className="w-full mt-4 py-3 rounded-2xl text-white font-semibold text-center"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  Sign In
                </button>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 px-2 mb-3">
                    {getAvatarUrl() ? (
                      <img src={getAvatarUrl()!} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: COLORS.accent }}
                      >
                        {getDisplayName().charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm" style={{ color: COLORS.text }}>{getDisplayName()}</div>
                      <div className="text-xs" style={{ color: COLORS.caption }}>{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsStatsModalOpen(true); }}
                    className="w-full py-2 px-3 text-left text-sm hover:bg-gray-50 rounded-xl"
                    style={{ color: COLORS.text }}
                  >
                    My Stats
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }}
                    className="w-full py-2 px-3 text-left text-sm hover:bg-gray-50 rounded-xl"
                    style={{ color: COLORS.danger }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ============ MAIN CONTENT ============ */}
      <main id="main-content" className="pt-14 pb-16"> {/* Padding for fixed header and bottom bar */}

        {/* ============ SECTION 1: HERO ============ */}
        <section
          id="hero"
          ref={(el) => { sectionsRef.current['hero'] = el; heroRef.current = el; }}
          className="relative flex flex-col items-center justify-between overflow-hidden px-5 pt-[55px] pb-0"
          style={{ minHeight: '90vh', backgroundColor: '#fafafa' }}
        >
          <HeroSection
            visible={visibleSections.has('hero')}
            counter={counter}
            showPlusOne={showPlusOne}
            formatNumber={formatNumber}
            onLearnMore={() => scrollToSection('how-it-works')}
            onWatchTutorial={() => setIsVideoModalOpen(true)}
          />
        </section>

        {/* ============ SECTION 2: SOCIAL PROOF BAR ============ */}
        <section
          id="social-proof"
          ref={(el) => { sectionsRef.current['social-proof'] = el; }}
          className="py-6 border-y"
          style={{ borderColor: COLORS.bg, backgroundColor: COLORS.bg }}
        >
          <div className="max-w-7xl mx-auto px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-center mb-4" style={{ color: COLORS.caption }}>
              Supported by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
              <img src={logo988} alt="988 Suicide & Crisis Lifeline" className="h-[28px] md:h-10 max-w-[140px] object-contain mix-blend-multiply" loading="lazy" />
              <img src={logoOneHumanity} alt="One Humanity Foundation" className="h-[34px] md:h-12 max-w-[200px] object-contain flex-shrink-0" loading="lazy" />
              <img src={logoVerified} alt="Certified Nonprofit Gold" className="h-[46px] md:h-16 max-w-[140px] object-contain flex-shrink-0" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ============ SECTION 3: HOW IT WORKS ============ */}
        <section
          id="how-it-works"
          ref={(el) => { sectionsRef.current['how-it-works'] = el; howItWorksRef.current = el; }}
          className="py-24 overflow-hidden relative"
          style={{ backgroundColor: COLORS.bg }}
        >
          {/* Section header left-aligned to main grid */}
          <div className={`max-w-7xl mx-auto px-5 mb-16 transition-all duration-700 ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2
              className="text-3xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-center leading-tight px-8 mx-auto"
              style={{ color: COLORS.text, letterSpacing: '-0.02em' }}
            >
              Four simple steps.<br />
              <span className="text-gray-400">60 seconds. Anyone can do it.</span>
            </h2>
          </div>

          {/* Hide scrollbar styles */}
          <style>{`
            .apple-scroll-hide::-webkit-scrollbar { display: none; }
            .apple-scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {/* Full bleed wrapper */}
          <div className="w-full relative">
            <ul
              id="how-it-works-scroll"
              className="flex overflow-x-auto snap-x snap-mandatory pb-4 apple-scroll-hide m-0 list-none"
              style={{
                /* EXACT logic referenced for Apple's signature layout */
                paddingLeft: 'max(1.25rem, calc((100vw - 1280px) / 2))',
                paddingRight: 'max(1.25rem, calc((100vw - 1280px) / 2))',
                /* Critical: matching scroll-padding prevents erratic snap jumps */
                scrollPaddingLeft: 'max(1.25rem, calc((100vw - 1280px) / 2))',
                gap: '1.5rem',
              }}
            >
              {[
                {
                  step: '01',
                  image: '/images/Step 01.webp',
                  title: 'Open camera',
                  description: 'Phone facing you. No filter. No production. Just you.'
                },
                {
                  step: '02',
                  image: '/images/Step 02.webp',
                  title: 'The gesture',
                  description: 'Hands on heart, open outward like wings. Hold it.'
                },
                {
                  step: '03',
                  image: '/images/Step 03.webp',
                  title: 'Say it',
                  description: '"I got you, [name]." Or: "I see you." Whatever is real.'
                },
                {
                  step: '04',
                  image: '/images/Step 04.webp',
                  title: 'Tag 3',
                  description: 'Nominate 3 people. They have 24 hours. Pass it forward.'
                }
              ].map((step, index) => (
                <li
                  key={index}
                  className={`flex-shrink-0 snap-start w-[85vw] sm:w-[380px] flex flex-col transition-all duration-700`}
                  style={{
                    opacity: visibleSections.has('how-it-works') ? 1 : 0,
                    transform: visibleSections.has('how-it-works') ? 'translateY(0)' : 'translateY(2rem)',
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  {/* Card visual */}
                  <div className="bg-[#F5F5F7] rounded-[2rem] h-[520px] sm:h-[580px] flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500 ease-out mb-4">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {/* Soft gradient overlay at the bottom if needed for depth? Often Apple leaves it clean. */}
                  </div>

                  {/* Text below card */}
                  <p className="text-[17px] leading-relaxed px-2" style={{ color: '#86868b' }}>
                    <span className="font-semibold" style={{ color: COLORS.text }}>Step {step.step}. {step.title}.</span> {step.description}
                  </p>
                </li>
              ))}
            </ul>

            {/* Navigation Arrows */}
            <div className={`max-w-7xl mx-auto px-5 mt-6 flex justify-end gap-3 transition-opacity duration-700 ${visibleSections.has('how-it-works') ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('how-it-works-scroll');
                  if (scrollContainer) scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: COLORS.muted }} />
              </button>
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('how-it-works-scroll');
                  if (scrollContainer) scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full bg-[#E5E5EA] flex items-center justify-center hover:bg-[#D1D1D6] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" style={{ color: COLORS.muted }} />
              </button>
            </div>
          </div>
        </section>

        {/* ============ RECORD & SHARE CTA (MOBILE ONLY) ============ */}
        <div className="md:hidden py-8 flex justify-center px-5" style={{ backgroundColor: COLORS.bg }}>
          <button
            onClick={() => {
              if (!currentUser) { openAuthModal('register'); return; }
              openUgcModal();
              track('ugc_cta_clicked');
            }}
            className="flex items-center gap-3 px-6 py-4 rounded-full font-semibold text-base text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: COLORS.accent }}
          >
            <Camera className="w-5 h-5" />
            📸 Record & Share Your Challenge
          </button>
        </div>

        {/* ============ SECTION 4: VIDEO WALL ============ */}
        <section
          id="video-wall"
          ref={(el) => { sectionsRef.current['video-wall'] = el; }}
          className="py-24 overflow-hidden"
          style={{ backgroundColor: COLORS.surface }}
        >
          <div className={`max-w-7xl mx-auto mb-12 px-5 flex flex-col items-center text-center transition-all duration-700 ${visibleSections.has('video-wall') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-4xl md:text-[48px] xl:text-[56px] 2xl:text-[64px] font-bold mb-4" style={{ color: COLORS.text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              People are showing up.
            </h2>
          </div>

          <style>{`
            @keyframes slide-infinite {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-250px * 5 - 1rem * 5)); }
            }
            @media (max-width: 768px) {
              @keyframes slide-infinite {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-200px * 5 - 1rem * 5)); }
              }
            }
            .animate-slide-infinite {
              animation: slide-infinite 40s linear infinite;
              display: flex;
              width: max-content;
              padding-left: max(1.25rem, calc((100vw - 1280px) / 2));
            }
            .animate-slide-infinite:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="w-full overflow-hidden pb-12">
            <div className={`animate-slide-infinite gap-4 transition-all duration-1000 ${visibleSections.has('video-wall') ? 'opacity-100' : 'opacity-0'}`}>
              {/* Combine array with a duplicate of itself for infinite scroll effect */}
              {[
                { id: 1, src: '/videos/Influencer1.mp4', handle: '@marcus', text: 'I see you.' },
                { id: 2, src: '/videos/Influencer2.webm', handle: '@sarah_j', text: 'I got you.' },
                { id: 3, src: '/videos/Influencer3.mp4', handle: '@david_smith', text: 'Always here.' },
                { id: 4, src: '/videos/Influencer4.mp4', handle: '@emily_r', text: 'No filter needed.' },
                { id: 5, src: '/videos/Influencer5.mp4', handle: '@michael_t', text: 'Sending love.' },
                // Duplicates for looping
                { id: 6, src: '/videos/Influencer1.mp4', handle: '@marcus', text: 'I see you.' },
                { id: 7, src: '/videos/Influencer2.webm', handle: '@sarah_j', text: 'I got you.' },
                { id: 8, src: '/videos/Influencer3.mp4', handle: '@david_smith', text: 'Always here.' },
                { id: 9, src: '/videos/Influencer4.mp4', handle: '@emily_r', text: 'No filter needed.' },
                { id: 10, src: '/videos/Influencer5.mp4', handle: '@michael_t', text: 'Sending love.' }
              ].map((video, index) => (
                <div
                  key={`${video.id}-${index}`}
                  className="relative flex-shrink-0 w-[200px] h-[350px] md:w-[250px] md:h-[420px] rounded-[1.5rem] overflow-hidden shadow-lg bg-black"
                >
                  <video
                    src={video.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-[1.03]"
                  />
                  {/* Subtle vignette for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                  {/* Handle & Title Overlay */}
                  <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
                    <p className="text-base md:text-lg font-semibold mb-0.5 drop-shadow-md leading-tight">{video.handle}</p>
                    <p className="text-sm md:text-[15px] opacity-90 drop-shadow-md leading-tight">{video.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`max-w-7xl mx-auto px-5 transition-all duration-1000 delay-300 ${visibleSections.has('video-wall') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Stats bar */}
            <div className="flex flex-wrap justify-center items-center gap-12 font-medium text-center">
              <div className="flex flex-col items-center gap-1">
                <Globe className="w-5 h-5" style={{ color: COLORS.accent }} />
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold" style={{ color: COLORS.text }}>23</span>
                  <span className="text-[15px]" style={{ color: COLORS.muted }}>countries</span>
                </div>
              </div>

              <div className="w-px h-12" style={{ backgroundColor: COLORS.hair }} />

              <div className="flex flex-col items-center gap-1">
                <Users className="w-5 h-5" style={{ color: COLORS.accent }} />
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold" style={{ color: COLORS.text }}>147K+</span>
                  <span className="text-[15px]" style={{ color: COLORS.muted }}>people</span>
                </div>
              </div>

              <div className="w-px h-12" style={{ backgroundColor: COLORS.hair }} />

              <div className="flex flex-col items-center gap-1">
                <Award className="w-5 h-5" style={{ color: COLORS.success }} />
                <div className="flex items-baseline mt-1">
                  <span className="text-[17px] font-semibold" style={{ color: COLORS.text }}>The wave is growing.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FROM THE COMMUNITY ============ */}
        <section className="py-16 overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
          <div className="max-w-7xl mx-auto px-5 text-center mb-10">
            <p className="text-xs uppercase font-bold tracking-[0.18em] mb-3" style={{ color: COLORS.caption }}>
              FROM THE COMMUNITY
            </p>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold" style={{ color: COLORS.text, letterSpacing: '-0.02em' }}>
              Your butterflies, your stories.
            </h2>
          </div>

            <style>{`
              @keyframes community-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-community-scroll {
                animation: community-scroll 30s linear infinite;
                display: flex;
                width: max-content;
              }
              .animate-community-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>

          {communitySubmissions.length >= 3 ? (
            <div className="w-full overflow-hidden">
              <div className="animate-community-scroll gap-3 md:gap-4">
                {[...communitySubmissions, ...communitySubmissions].map((sub, i) => (
                  <div
                    key={`${sub.id}-${i}`}
                    className="relative flex-shrink-0 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
                  >
                    {sub.file_type === 'video' ? (
                      <video src={sub.file_url} className="w-full h-full object-cover" autoPlay muted loop playsInline preload="none" onPlay={() => track('community_video_played')} />
                    ) : (
                      <img src={sub.file_url} alt="Community submission" className="w-full h-full object-cover" loading="lazy" />
                    )}
                    {sub.display_name && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                        <p className="text-white text-xs font-medium">{sub.display_name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : communitySubmissions.length > 0 ? (
            <div className="flex justify-center gap-4 flex-wrap px-5">
              {communitySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
                >
                  {sub.file_type === 'video' ? (
                    <video src={sub.file_url} className="w-full h-full object-cover" autoPlay muted loop playsInline preload="none" onPlay={() => track('community_video_played')} />
                  ) : (
                    <img src={sub.file_url} alt="Community submission" className="w-full h-full object-cover" loading="lazy" />
                  )}
                  {sub.display_name && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2.5">
                      <p className="text-white text-xs font-medium">{sub.display_name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Be the first to share your butterfly moment! 🦋</p>
              <p className="text-sm mt-2">Record yourself doing the gesture and inspire others.</p>
            </div>
          )}
        </section>

        {/* ============ SECTION 5: I DID IT ============ */}
        <section
          id="i-did-it"
          ref={(el) => { sectionsRef.current['i-did-it'] = el; }}
          className="py-16 md:py-24 px-5"
          style={{ backgroundColor: COLORS.bg }}
        >
          <div className={`max-w-[1000px] mx-auto text-center transition-all duration-700 bg-[#f1f8fc] rounded-[3rem] py-24 px-6 md:px-12 ${visibleSections.has('i-did-it') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

            <p className="text-[11px] md:text-xs uppercase font-bold tracking-[0.18em] mb-4 text-[#8b9298]">
              PARTICIPATION
            </p>

            <h2 className="text-4xl md:text-[48px] xl:text-[56px] 2xl:text-[64px] font-bold mb-5 text-[#1d1d1f] tracking-tight leading-tight">
              Already raised your hand?
            </h2>

            <p className="text-lg md:text-xl text-[#8b9298] mb-8 max-w-lg mx-auto">
              Let the world know you're part of the chain.
            </p>

            {currentUser && userHandRaiseDate && (
              <p className="text-sm font-medium mb-8 text-[#00b18d]">
                You raised your hand on {userHandRaiseDate} 🦋
              </p>
            )}

            <button
              onClick={handleIDidIt}
              className="relative w-36 h-36 md:w-40 md:h-40 mx-auto rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center justify-center gap-1.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] active:scale-[0.98] transition-all cursor-pointer"
            >
              {hasCelebrated ? (
                <>
                  <CheckCircle className="w-8 h-8 md:w-9 md:h-9 text-[#00b18d]" strokeWidth={2} />
                  <span className="text-[#00b18d] font-bold text-sm md:text-[15px] tracking-[0.05em]">
                    YOU DID IT
                  </span>
                  {currentUser && userHandRaiseDate && (
                    <span className="text-[#00b18d]/60 text-[10px] font-medium">
                      {userHandRaiseDate}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Smartphone className="w-8 h-8 md:w-9 md:h-9 text-[#0066cc]" strokeWidth={2} />
                  <span className="text-[#0066cc] font-bold text-sm md:text-[15px] tracking-[0.05em] mt-1">
                    I DID IT
                  </span>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ backgroundColor: '#0066cc', animationDuration: '3s' }} />
                </>
              )}
            </button>

          </div>
        </section>

        {/* ============ SECTION 6: WORLD MAP + LEADERBOARD ============ */}
        <section
          id="leaderboard"
          ref={(el) => { sectionsRef.current['leaderboard'] = el; }}
          className="py-16 px-5"
          style={{ backgroundColor: COLORS.bg }}
        >
          <div className="max-w-4xl mx-auto">
            <LeaderboardSection
              countryLeaderboard={countryLeaderboard}
              cityLeaderboard={cityLeaderboard}
              topParticipants={topParticipants}
              showParticipants={!!currentUser}
              visible={visibleSections.has('leaderboard')}
              leaderboardTab={leaderboardTab}
              onTabChange={setLeaderboardTab}
              formatNumber={formatNumber}
            />

            {/* Interactive 3D Globe — kept in parent for ref access */}
            <div
              className={`relative w-full mb-8 pt-8 flex items-center justify-center rounded-[2rem] overflow-hidden transition-all duration-700 ${visibleSections.has('leaderboard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ backgroundColor: '#f5f5f7' }}
            >
              <div
                ref={globeContainerRef}
                className="w-full max-w-[500px] xl:max-w-[650px] 2xl:max-w-[750px] aspect-square"
              />
            </div>
          </div>
        </section>

        {/* ============ SECTION 7: THE MEANING ============ */}
        <section
          id="meaning"
          ref={(el) => { sectionsRef.current['meaning'] = el; }}
          className="py-24 px-5 bg-white"
        >
          <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${visibleSections.has('meaning') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="space-y-4 mb-16">
              <p
                className="text-2xl md:text-[28px] font-normal italic text-[#8a9bb1]"
                style={{ lineHeight: '1.5' }}
              >
                "A daughter tags her father.
              </p>
              <p
                className="text-2xl md:text-[28px] font-normal italic text-[#8a9bb1]"
                style={{ lineHeight: '1.5' }}
              >
                A teammate tags the one who checked in after a bad week.
              </p>
              <p
                className="text-2xl md:text-[28px] font-normal italic text-[#8a9bb1]"
                style={{ lineHeight: '1.5' }}
              >
                A student tags the teacher who noticed."
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-24 text-[#1d1d1f] tracking-tight">
              The sentence is always simple:{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, rgba(9, 9, 121, 1) 0%, rgba(0, 255, 195, 1) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                I got you.
              </span>
            </h2>

            {/* Three pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 max-w-3xl mx-auto">
              {[
                { img: imgISeeYou, heading: 'Recognition', sub: 'I see you', size: 'h-20 w-20' },
                { img: imgICare, heading: 'Connection', sub: 'I care', size: 'h-20 w-20' },
                { img: imgYouAreNotAlone, heading: 'Belonging', sub: 'You are not alone', size: 'h-20 w-20' }
              ].map((pillar, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-all duration-500`}
                >
                  <img src={pillar.img} alt={pillar.heading} className={`${pillar.size} object-contain mb-4`} loading="lazy" />
                  <p className="text-[19px] font-bold text-[#1d1d1f] mb-2 tracking-tight">
                    {pillar.heading}
                  </p>
                  <p className="text-[14px] text-[#8a9bb1]">
                    {pillar.sub}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[15px] text-[#8a9bb1] max-w-xl mx-auto" style={{ lineHeight: '1.6' }}>
              The Butterfly Challenge stands for love in action. It stands for the idea that no one should feel invisible.
            </p>
          </div>
        </section>

        {/* ============ SECTION 8: CREDIBILITY ============ */}
        <section
          id="credibility"
          ref={(el) => { sectionsRef.current['credibility'] = el; }}
          className="py-16 px-5"
          style={{ backgroundColor: COLORS.bg }}
        >
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('credibility') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.text }}>
                Built by people who've moved culture.
              </h2>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { number: '1,000+', label: 'Leaders gathered', sub: 'Bel-Air 2024', icon: <Users className="w-8 h-8" /> },
                { number: '47M', label: 'People reached', sub: '110+ media placements', icon: <Globe className="w-8 h-8" /> },
                { number: '$220M', label: 'Raised by this same mechanic', sub: 'Ice Bucket Challenge 2014', icon: <Award className="w-8 h-8" /> }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border text-center transition-all duration-500 ${visibleSections.has('credibility') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  style={{ borderColor: COLORS.hair, transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 flex justify-center" style={{ color: COLORS.accent }}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
                    {stat.number}
                  </p>
                  <p className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                    {stat.label}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.caption }}>
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: COLORS.success }} />
                <span className="text-sm font-medium" style={{ color: COLORS.muted }}>
                  One Humanity Foundation · 501(c)(3)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: COLORS.accent }} />
                <span className="text-sm font-medium" style={{ color: COLORS.muted }}>
                  Routed to 988 — Suicide & Crisis Lifeline
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 9: FOR ORGANIZATIONS ============ */}
        <section
          id="for-organizations"
          ref={(el) => { sectionsRef.current['for-organizations'] = el; }}
          className="py-16 px-5"
          style={{ backgroundColor: COLORS.surface }}
        >
          <div className={`max-w-4xl mx-auto transition-all duration-700 ${visibleSections.has('for-organizations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: COLORS.caption }}>
                For Workplaces, Schools & Organizations
              </span>
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.text }}>
                Bring this to your community
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: <GraduationCap className="w-8 h-8" />,
                  title: 'For Schools',
                  description: 'Classroom guides, assembly slides, and parent resources. COPPA compliant.',
                  link: '#'
                },
                {
                  icon: <Briefcase className="w-8 h-8" />,
                  title: 'For Teams',
                  description: 'Manager briefings, all-hands templates, and EAP integration.',
                  link: '#'
                },
                {
                  icon: <Tag className="w-8 h-8" />,
                  title: 'For Brands',
                  description: 'Participation guidelines, asset kits, and partnership opportunities.',
                  link: '#'
                }
              ].map((card, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border bg-white transition-all hover:shadow-md cursor-pointer"
                  style={{ borderColor: COLORS.hair }}
                >
                  <div className="mb-4" style={{ color: COLORS.accent }}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>
                    {card.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.muted, lineHeight: '24px' }}>
                    {card.description}
                  </p>
                  <button className="text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.accent }}>
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Protocol section */}
            <div className="p-8 rounded-2xl" style={{ backgroundColor: COLORS.accentLight }}>
              <div className="md:flex items-center gap-8">
                <div className="flex-1 mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                    The Butterfly Protocol
                  </h3>
                  <p className="text-sm mb-4" style={{ color: COLORS.muted, lineHeight: '24px' }}>
                    The gesture teaches recognition. The Butterfly Protocol teaches response.
                    A free, 30-second check-in script your managers can deploy in one week.
                    Compliant with OSHA, ADA, and HIPAA boundaries.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => window.open('https://www.butterfly.one/', '_blank')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all hover:bg-white"
                    style={{ borderColor: COLORS.accent, color: COLORS.accent }}
                  >
                    Learn About the Protocol
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 10: FAQ ============ */}
        <section
          id="faq"
          ref={(el) => { sectionsRef.current['faq'] = el; }}
          className="py-16 px-5"
          style={{ backgroundColor: COLORS.bg }}
        >
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.text }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: COLORS.muted }}>
                Everything you need to know before you participate.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border overflow-hidden transition-all duration-500 ${visibleSections.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  style={{
                    borderColor: activeFAQ === index ? COLORS.accent : COLORS.hair,
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={activeFAQ === index}
                  >
                    <span className="text-sm font-semibold flex-1" style={{ color: COLORS.text }}>
                      {faq.question}
                    </span>
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: activeFAQ === index ? COLORS.accentLight : COLORS.surface }}
                    >
                      <ChevronDown
                        className={`w-5 h-5 faq-chevron ${activeFAQ === index ? 'faq-chevron-open' : ''}`}
                        style={{ color: activeFAQ === index ? COLORS.accent : COLORS.caption }}
                      />
                    </div>
                  </button>

                  {activeFAQ === index && (
                    <div className="px-5 pb-5 faq-answer-open">
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: COLORS.muted, lineHeight: '26px' }}
                      >
                        {faq.answer}
                      </p>
                      {index === 3 && (
                        <button
                          onClick={() => setIsCrisisModalOpen(true)}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
                          style={{ color: COLORS.accent }}
                        >
                          <Phone className="w-4 h-4" />
                          Contact 988
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 11: FINAL CTA ============ */}
        <section
          id="final-cta"
          ref={(el) => { sectionsRef.current['final-cta'] = el; }}
          className="relative py-32 px-5 overflow-hidden bg-[#000]"
        >
          {/* Background Image Setup */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/People_doing_butterfly_202603311123.jpeg"
              alt="A billion hands rise"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              loading="lazy"
            />
            {/* Gradient overlay to ensure text readability */}

          </div>

          <div className={`relative z-10 max-w-4xl mx-auto text-center text-white transition-all duration-700 ${visibleSections.has('final-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-lg mb-4 opacity-90">
              One person starts. 3 more continue.
            </p>
            <p className="text-6xl font-bold mb-2">
              A billion hands rise.
            </p>
            <p className="text-xl mb-10 opacity-90">
              60 seconds. 3 names. 24 hours. Are you in?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-base font-semibold transition-all hover:opacity-90"
                style={{ color: COLORS.accent }}
              >
                Take the Challenge
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => { track('email_reminder_opened'); setEmail(currentUser?.email || ''); setIsEmailReminderOpen(true); }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/50 text-white text-base font-semibold transition-all hover:bg-white/10"
              >
                <Clock className="w-5 h-5" />
                Remind Me May 1
              </button>
            </div>
          </div>
        </section>

        {/* ============ SECTION 12: FOOTER ============ */}
        <FooterSection onCrisisOpen={() => setIsCrisisModalOpen(true)} />
      </main>

      {/* ============ BOTTOM SAFETY BAR ============ */}
      <BottomSafetyBar onSafeExit={handleSafeExit} onCrisisOpen={() => setIsCrisisModalOpen(true)} />

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div ref={videoModalRef} role="dialog" aria-modal="true" className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md ${closingModal === 'video' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}>
          <button
            onClick={closeVideoModal}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-[110]"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className={`w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative px-4 md:px-0 ${closingModal === 'video' ? 'modal-content-closing' : 'modal-content'}`}>
            <video
              src="/videos/compressed.mp4"
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div
          className={`fixed inset-0 z-[9800] flex items-center justify-center p-5 ${closingModal === 'auth' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={closeAuthModal}
        >
          <div
            ref={authModalRef}
            role="dialog"
            aria-modal="true"
            className={`w-full max-w-[420px] rounded-3xl p-8 relative ${closingModal === 'auth' ? 'modal-content-closing' : 'modal-content'}`}
            style={{ background: COLORS.bg }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-5 w-7 h-7 rounded-full flex items-center justify-center text-lg"
              style={{ background: COLORS.surface, color: COLORS.muted }}
            >×</button>

            <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.text }}>
              {authMode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="text-sm mb-6" style={{ color: COLORS.caption }}>Continue to Butterfly Challenge</p>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-full text-sm font-semibold mb-3 transition-colors"
              style={{ border: `1.5px solid ${COLORS.hair}`, background: COLORS.bg, color: COLORS.text }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: COLORS.caption }}>
              <div className="flex-1 h-px" style={{ background: COLORS.hair }} />
              <span>or</span>
              <div className="flex-1 h-px" style={{ background: COLORS.hair }} />
            </div>

            {/* Name (register only) */}
            {authMode === 'register' && (
              <div className="mb-3">
                <label className="text-xs font-semibold mb-1 block" style={{ color: COLORS.text }}>Your name (optional)</label>
                <input
                  type="text" value={authName} onChange={e => setAuthName(e.target.value)}
                  placeholder="Your name" autoComplete="name"
                  className="w-full rounded-xl px-3.5 py-3 text-sm outline-none transition-colors"
                  style={{ background: COLORS.surface, border: `1px solid ${COLORS.hair}`, color: COLORS.text }}
                  onFocus={e => e.target.style.borderColor = COLORS.accent}
                  onBlur={e => e.target.style.borderColor = COLORS.hair}
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: COLORS.text }}>Email</label>
              <input
                type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                placeholder="you@email.com" autoComplete="email"
                className="w-full rounded-xl px-3.5 py-3 text-sm outline-none transition-colors"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.hair}`, color: COLORS.text }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.hair}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: COLORS.text }}>Password</label>
              <input
                type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                className="w-full rounded-xl px-3.5 py-3 text-sm outline-none transition-colors"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.hair}`, color: COLORS.text }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.hair}
                onKeyDown={e => e.key === 'Enter' && handleAuthSubmit()}
              />
            </div>

            {/* Forgot password (login only) */}
            {authMode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '8px' }}>
                {resetEmailSent ? (
                  <span style={{ fontSize: '13px', color: '#22c55e' }}>Reset email sent!</span>
                ) : (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: COLORS.accent,
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: -9999, opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <input type="text" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
            </div>

            {/* Error */}
            {authError && (
              <p className="text-xs mb-2 min-h-[18px]" style={{ color: authErrorColor || COLORS.danger }}>{authError}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleAuthSubmit}
              disabled={authLoading}
              className="w-full py-3.5 rounded-full text-base font-bold text-white mb-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: COLORS.accent }}
            >
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            {/* Toggle mode */}
            <p className="text-sm text-center" style={{ color: COLORS.caption }}>
              {authMode === 'login' ? (
                <>No account? <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className="font-semibold underline" style={{ color: COLORS.accent }}>Sign up</button></>
              ) : (
                <>Have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="font-semibold underline" style={{ color: COLORS.accent }}>Sign in</button></>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Crisis Modal */}
      {isCrisisModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-end md:items-center justify-center ${closingModal === 'crisis' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeCrisisModal}
          />

          {/* Modal */}
          <div
            ref={crisisModalRef}
            className={`relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-2xl ${closingModal === 'crisis' ? 'modal-content-closing' : 'modal-content'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crisis-modal-title"
          >
            {/* Close button */}
            <button
              onClick={closeCrisisModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: COLORS.text }} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6" style={{ color: COLORS.accent }} />
                <h2 id="crisis-modal-title" className="text-xl font-bold" style={{ color: COLORS.text }}>
                  Get Support
                </h2>
              </div>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                You're not alone. Help is available 24/7.
              </p>
            </div>

            {/* US Resources */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.caption }}>
                UNITED STATES
              </h3>

              {/* 988 */}
              <a
                href="tel:988"
                className="flex items-center gap-4 p-4 rounded-xl border mb-3 transition-colors hover:bg-blue-50"
                style={{ borderColor: COLORS.hair }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: COLORS.text }}>
                    988 Suicide & Crisis Lifeline
                  </p>
                  <p className="text-sm" style={{ color: COLORS.muted }}>
                    Call or text 988 · Free · 24/7
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: COLORS.caption }} />
              </a>

              {/* Text HOME */}
              <a
                href="sms:741741?body=HOME"
                className="flex items-center gap-4 p-4 rounded-xl border mb-3 transition-colors hover:bg-green-50"
                style={{ borderColor: COLORS.hair }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COLORS.success }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: COLORS.text }}>
                    Crisis Text Line
                  </p>
                  <p className="text-sm" style={{ color: COLORS.muted }}>
                    Text HOME to 741741 · Free · 24/7
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: COLORS.caption }} />
              </a>
            </div>

            {/* International */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.caption }}>
                OUTSIDE THE US
              </h3>

              <div className="p-4 rounded-xl border" style={{ borderColor: COLORS.hair }}>
                <label className="block text-xs font-medium mb-2" style={{ color: COLORS.muted }}>
                  Select your country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => { setSelectedCountry(e.target.value); setCrisisResult(null); }}
                  className="w-full p-3 rounded-lg border text-sm"
                  style={{ borderColor: COLORS.hair, backgroundColor: COLORS.bg }}
                >
                  {Object.keys(crisisLines).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const result = crisisLines[selectedCountry];
                    if (result) setCrisisResult(result);
                    track('crisis_country_selected', { country: selectedCountry });
                  }}
                  className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
                  style={{ backgroundColor: COLORS.surface, color: COLORS.text }}
                >
                  <Globe className="w-4 h-4" />
                  Find local resources
                </button>

                {crisisResult && (
                  <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.accentLight, border: `1px solid ${COLORS.hair}` }}>
                    <div className="font-semibold text-sm mb-1" style={{ color: COLORS.text }}>{crisisResult.name}</div>
                    {crisisResult.phone && (
                      <a href={`tel:${crisisResult.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-bold text-lg mb-2" style={{ color: COLORS.accent }}>
                        📞 {crisisResult.phone}
                      </a>
                    )}
                    <a href={crisisResult.url} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: COLORS.accent }}>
                      Visit website →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: COLORS.accentLight }}>
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
              <p className="text-xs" style={{ color: COLORS.muted, lineHeight: '20px' }}>
                <strong style={{ color: COLORS.text }}>What you share is your choice.</strong>
                All conversations with crisis lines are confidential.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ SHARE MODAL (Apple-style centered) ============ */}
      {isShareDrawerOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${closingModal === 'share' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}>
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={closeShareDrawer}
          />

          {/* Modal */}
          <div
            ref={shareModalRef}
            className={`relative w-full max-w-lg bg-white rounded-[1.75rem] p-8 md:p-10 shadow-2xl ${closingModal === 'share' ? 'drawer-content-closing' : 'drawer-content'}`}
            role="dialog"
            aria-modal="true"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Close button */}
            <button
              onClick={closeShareDrawer}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#e8e8ed] flex items-center justify-center transition-colors hover:bg-[#d2d2d7]"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-[#1d1d1f]" />
            </button>

            {/* Category label */}
            <p className="text-[11px] uppercase font-bold tracking-[0.16em] text-[#86868b] mb-3">
              Share the challenge
            </p>

            {/* Headline */}
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-2">
              You're hand #{formatNumber(counter)}!
            </h2>

            {/* Subtitle */}
            <p className="text-[15px] md:text-[17px] text-[#86868b] mb-8 leading-relaxed">
              Thank you for showing up. Now share the wave — every hand counts.
            </p>

            {/* Native share (mobile only) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && currentUser && (
              <div className="md:hidden mb-4">
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #00b18d, #0072BC)' }}
                >
                  <Share2 className="w-5 h-5" />
                  Share to Instagram, TikTok & more
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Opens your phone's share menu</p>
              </div>
            )}

            {/* Share buttons */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {[
                {
                  label: 'TikTok',
                  color: '#000000',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.63a8.28 8.28 0 004.76 1.5V6.69h-1z" />
                    </svg>
                  ),
                  onClick: () => { track('share_completed', { platform: 'tiktok' }); saveShare('tiktok'); setShowPlatformGuide('tiktok'); }
                },
                {
                  label: 'Instagram',
                  color: '#E4405F',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                  onClick: () => { track('share_completed', { platform: 'instagram' }); saveShare('instagram'); setShowPlatformGuide('instagram'); }
                },
                {
                  label: 'WhatsApp',
                  color: '#25D366',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                  onClick: () => { track('share_completed', { platform: 'whatsapp' }); saveShare('whatsapp'); window.open(`https://wa.me/?text=${encodeURIComponent(`I raised my hand. 🦋 #ButterflyChallenge\nYour turn → ${shareUrl}`)}`, '_blank'); }
                },
                {
                  label: 'X',
                  color: '#000000',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  onClick: () => { track('share_completed', { platform: 'twitter' }); saveShare('twitter'); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I raised my hand. 🦋 #ButterflyChallenge\nYour turn → ${shareUrl}`)}`, '_blank'); }
                },
                {
                  label: linkCopied ? 'Copied!' : 'Copy Link',
                  color: COLORS.accent,
                  icon: linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
                  onClick: handleCopyLink
                }
              ].map((platform, i) => (
                <button
                  key={i}
                  onClick={platform.onClick}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95"
                    style={{
                      backgroundColor: i === 4 && linkCopied ? COLORS.success : `${platform.color}10`,
                    }}
                  >
                    <div style={{ color: i === 4 && linkCopied ? '#FFFFFF' : platform.color }}>
                      {platform.icon}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#86868b]">
                    {platform.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Pre-written Caption */}
            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: '#f5f5f7' }}>
              <p className="text-[11px] uppercase font-bold tracking-[0.14em] text-[#86868b] mb-2">
                Pre-written caption
              </p>
              <p className="text-[15px] text-[#1d1d1f] leading-relaxed mb-4">
                "I raised my hand. 🦋 #ButterflyChallenge
                <br />
                Your turn → butterflychallenge.org"
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`I raised my hand. 🦋 #ButterflyChallenge\nYour turn → ${shareUrl}`);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="text-[13px] font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70"
                style={{ color: '#0066cc' }}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy caption
              </button>
            </div>

            {/* Email Reminder */}
            <div className="p-5 rounded-2xl border" style={{ borderColor: '#e8e8ed' }}>
              <p className="text-[15px] font-semibold text-[#1d1d1f] mb-3">
                Want a Butterfly Month reminder?
              </p>
              {emailSubmitted ? (
                <div className="flex items-center gap-2 py-2">
                  <Check className="w-5 h-5" style={{ color: COLORS.success }} />
                  <span className="text-[15px] font-medium" style={{ color: COLORS.success }}>
                    We'll remind you on May 1!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="off"
                    className="flex-1 px-4 py-3 rounded-xl border text-[15px] outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-all"
                    style={{ borderColor: '#e8e8ed' }}
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl text-[15px] font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#0066cc' }}
                  >
                    Remind Me
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============ EMAIL REMINDER MODAL ============ */}
      {isEmailReminderOpen && (
        <div ref={emailModalRef} role="dialog" aria-modal="true" className={`fixed inset-0 z-50 flex items-end md:items-center justify-center ${closingModal === 'email' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEmailModal}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-2xl ${closingModal === 'email' ? 'modal-content-closing' : 'modal-content'}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={closeEmailModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#1d1d1f]" />
            </button>

            <div className="text-center mb-6">
              <Clock className="w-12 h-12 mx-auto mb-4 text-[#00b18d]" />
              <h2 className="text-xl font-bold mb-2 text-[#1d1d1f]">
                Get a reminder for May 1
              </h2>
              <p className="text-sm text-[#8a9bb1]">
                We'll send you a quick note when Butterfly Month begins.
              </p>
            </div>

            {emailSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e6f9f1]">
                  <Check className="w-8 h-8 text-[#00b18d]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#1d1d1f]">
                  You're all set!
                </h3>
                <p className="text-sm text-[#8a9bb1]">
                  We'll see you on May 1. 🦋
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="off"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#e8e8ed] text-base mb-4 outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 bg-[#00b18d] active:scale-95"
                >
                  Remind Me May 1
                </button>
                <p className="text-xs text-center mt-4 text-[#8a9bb1]">
                  No spam. Just one reminder. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      )}



      {/* ============ MY STATS MODAL ============ */}
      {isStatsModalOpen && (
        <div
          ref={statsModalRef}
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[9800] flex items-center justify-center p-5 ${closingModal === 'stats' ? 'modal-backdrop-closing' : 'modal-backdrop'}`}
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={closeStatsModal}
        >
          <div
            className={`w-full max-w-sm rounded-3xl p-8 relative ${closingModal === 'stats' ? 'modal-content-closing' : 'modal-content'}`}
            style={{ background: COLORS.bg }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeStatsModal}
              className="absolute top-4 right-5 w-7 h-7 rounded-full flex items-center justify-center text-lg"
              style={{ background: COLORS.surface, color: COLORS.muted }}
            >×</button>

            <div className="text-center mb-6">
              <BarChart2 className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.accent }} />
              <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Your Challenge Stats</h2>
            </div>

            {userHandRaiseDate ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: COLORS.surface }}>
                  <CheckCircle className="w-5 h-5 text-[#00b18d] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.caption }}>Joined</p>
                    <p className="text-sm font-bold" style={{ color: COLORS.text }}>{userHandRaiseDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: COLORS.surface }}>
                  <Globe className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.accent }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.caption }}>Global hand count</p>
                    <p className="text-sm font-bold" style={{ color: COLORS.text }}>{counter.toLocaleString()} hands raised</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: COLORS.surface }}>
                  <Users className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.accent }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.caption }}>Countries participating</p>
                    <p className="text-sm font-bold" style={{ color: COLORS.text }}>{countryLeaderboard.length} countries</p>
                  </div>
                </div>
                <p className="text-center text-xs mt-4" style={{ color: COLORS.caption }}>
                  You're part of something bigger. 🦋
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm mb-4" style={{ color: COLORS.muted }}>
                  You haven't taken the challenge yet!
                </p>
                <button
                  onClick={() => { closeStatsModal(); setTimeout(() => document.getElementById('i-did-it')?.scrollIntoView({ behavior: 'smooth' }), 250); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  Take it now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ UGC RECORD MODAL ============ */}
      {ugcModalOpen && (
        <div ref={ugcModalRef} role="dialog" aria-modal="true" className={`fixed inset-0 z-[9800] flex items-center justify-center ${closingModal === 'ugc' ? 'modal-backdrop-closing' : 'modal-backdrop'}`} style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className={`w-full h-full max-w-lg mx-auto flex flex-col relative ${closingModal === 'ugc' ? 'modal-content-closing' : 'modal-content'}`} onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button
              onClick={closeUgcModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hidden file input fallback */}
            <input ref={ugcInputRef} type="file" accept="image/*,video/*" capture="user" className="hidden" onChange={handleUgcFileSelect} />

            {/* STEP: Mode Select */}
            {recordingStep === 'mode-select' && (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm">
                  <div className="text-center mb-8">
                    <span className="text-4xl mb-3 block">🦋</span>
                    <h2 className="text-xl font-bold text-white mb-1">How do you want to record?</h2>
                    <p className="text-sm text-white/60">Pick your style. Max 30 seconds.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => selectMode('auto')}
                      className="w-full rounded-2xl border-2 p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = COLORS.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">🤖</span>
                        <div>
                          <p className="text-base font-bold text-white">Auto</p>
                          <p className="text-sm text-white/50">Hands-free · 3 sec countdown</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => selectMode('manual')}
                      className="w-full rounded-2xl border-2 p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = COLORS.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">👆</span>
                        <div>
                          <p className="text-base font-bold text-white">Manual</p>
                          <p className="text-sm text-white/50">I'll press record myself</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => ugcInputRef.current?.click()}
                    className="w-full mt-4 py-3 text-sm text-white/40 hover:text-white/60 transition-colors text-center"
                  >
                    Or upload a file instead
                  </button>
                </div>
              </div>
            )}

            {/* STEP: Camera */}
            {recordingStep === 'camera' && (
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="text-center pt-6 pb-3 px-5">
                  <h2 className="text-lg font-bold text-white">
                    {recordingMode === 'auto' && !isRecording && countdownValue > 0 ? 'Get ready...' : 'Record your butterfly moment'}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">Do the gesture. Say "I got you." Max 30 seconds.</p>
                </div>

                {/* Camera view */}
                <div className="flex-1 flex items-center justify-center px-4 relative">
                  {cameraError ? (
                    <div className="text-center">
                      <p className="text-white/70 text-sm mb-4">Camera not available</p>
                      <button
                        onClick={() => ugcInputRef.current?.click()}
                        className="px-6 py-3 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Upload a file instead
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={liveVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full aspect-[3/4] rounded-3xl object-cover bg-black"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      {/* Countdown overlay */}
                      {countdownValue > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-8xl font-bold text-white drop-shadow-2xl"
                            style={{ animation: 'pulse 1s ease-in-out' }}
                            key={countdownValue}
                          >
                            {countdownValue}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-3 py-6">
                  {isRecording && (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-sm font-mono font-bold">
                        {String(Math.floor(recordingSeconds / 60)).padStart(1, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}
                      </span>
                      <span className="text-white/60 text-xs">/ 0:30</span>
                    </div>
                  )}
                  {!cameraError && (
                    <>
                      {recordingMode === 'manual' && !isRecording && (
                        <button
                          onClick={startRecording}
                          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90"
                          style={{ background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.6)' }}
                        >
                          <div className="w-14 h-14 rounded-full bg-red-500" />
                        </button>
                      )}
                      {isRecording && (
                        <button
                          onClick={stopRecording}
                          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-90"
                          style={{ background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.6)' }}
                        >
                          <div className="w-7 h-7 rounded-md bg-red-500" />
                        </button>
                      )}
                      {recordingMode === 'auto' && !isRecording && countdownValue === 0 && (
                        <p className="text-white/40 text-xs">Starting automatically...</p>
                      )}
                    </>
                  )}
                  <p className="text-white/40 text-xs">
                    {isRecording ? 'Tap to stop' : recordingMode === 'manual' ? 'Tap to record' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* STEP: Preview */}
            {recordingStep === 'preview' && recordedPreviewUrl && (
              <div className="flex-1 flex flex-col">
                <div className="text-center pt-6 pb-3 px-5">
                  <h2 className="text-lg font-bold text-white">Looking good! 🦋</h2>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <video
                    src={recordedPreviewUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full aspect-[3/4] rounded-3xl object-cover bg-black"
                  />
                </div>
                <div className="flex gap-3 px-5 py-6">
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-3.5 rounded-full text-base font-semibold text-white border border-white/30 transition-colors hover:bg-white/10"
                  >
                    Retake
                  </button>
                  <button
                    onClick={handleUseVideo}
                    className="flex-1 py-3.5 rounded-full text-base font-bold text-white transition-colors"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    Use This Video
                  </button>
                </div>
              </div>
            )}

            {/* STEP: Consent */}
            {recordingStep === 'consent' && (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm rounded-3xl p-7" style={{ background: COLORS.bg }}>
                  <div className="text-center mb-5">
                    <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.text }}>Almost there!</h2>
                    <p className="text-sm" style={{ color: COLORS.caption }}>Your video is ready to share.</p>
                  </div>
                  <label className="flex items-start gap-3 mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ugcConsent}
                      onChange={e => setUgcConsent(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded accent-[#00b18d]"
                    />
                    <span className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
                      I agree to share this publicly on thebutterflychallenge.com
                    </span>
                  </label>
                  <button
                    onClick={handleUgcUpload}
                    disabled={!ugcConsent || ugcUploading}
                    className="w-full py-3.5 rounded-full text-base font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    {ugcUploading ? 'Uploading...' : 'Share It 🦋'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP: Success */}
            {recordingStep === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm rounded-3xl p-8 text-center" style={{ background: COLORS.bg }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#e6f9f1' }}>
                    <CheckCircle className="w-8 h-8 text-[#00b18d]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.text }}>Submitted for review! 🦋</h3>
                  <p className="text-sm" style={{ color: COLORS.caption }}>Your video has been submitted for review. It will appear in the community feed once approved.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ EMAIL VERIFICATION MODAL ============ */}
      {showEmailVerification && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop"
          onClick={() => setShowEmailVerification(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md p-8 text-center relative modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEmailVerification(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              aria-label="Close"
            >×</button>

            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Check your email</h3>
            <p className="mb-2" style={{ color: COLORS.caption }}>We sent a confirmation link to:</p>
            <p className="font-bold mb-6 break-all" style={{ color: COLORS.text }}>{verificationEmail}</p>

            <div className="rounded-2xl p-4 mb-6 text-left space-y-2" style={{ backgroundColor: COLORS.surface }}>
              <div className="flex gap-3 items-start">
                <span className="font-bold" style={{ color: COLORS.accent }}>1.</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>Open your email inbox</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold" style={{ color: COLORS.accent }}>2.</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>Click the confirmation link from Butterfly Challenge</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-bold" style={{ color: COLORS.accent }}>3.</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>You will be signed in automatically</span>
              </div>
            </div>

            <p className="text-xs mb-4" style={{ color: COLORS.caption }}>Didn't receive it? Check your spam folder.</p>

            <button
              onClick={() => setShowEmailVerification(false)}
              className="w-full py-3 rounded-2xl text-white font-bold hover:opacity-90"
              style={{ backgroundColor: COLORS.accent }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ============ PLATFORM GUIDE MODAL ============ */}
      {showPlatformGuide && (
        <div
          ref={platformGuideRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 modal-backdrop"
          onClick={() => setShowPlatformGuide(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md p-6 relative modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPlatformGuide(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              aria-label="Close"
            >×</button>

            <div className="text-center mb-5">
              <div className="text-3xl mb-2">{showPlatformGuide === 'tiktok' ? '🎵' : '📷'}</div>
              <h3 className="text-xl font-bold" style={{ color: COLORS.text }}>
                Share on {showPlatformGuide === 'tiktok' ? 'TikTok' : 'Instagram'}
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.caption }}>Follow these steps to share your challenge</p>
            </div>

            <ol className="space-y-3 mb-5">
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.accent }}>1</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>Copy the caption below</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.accent }}>2</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>
                  {showPlatformGuide === 'tiktok'
                    ? 'Open TikTok → tap + → record or upload your butterfly gesture video'
                    : 'Open Instagram → tap + → Story or Reel → record or upload your butterfly gesture video'}
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.accent }}>3</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>Paste the caption in your post description</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: COLORS.accent }}>4</span>
                <span className="text-sm" style={{ color: COLORS.muted }}>Tag 3 friends and post! 🦋</span>
              </li>
            </ol>

            <div className="rounded-2xl p-3 mb-4 relative" style={{ backgroundColor: COLORS.surface }}>
              <p className="text-sm pr-16 leading-relaxed" style={{ color: COLORS.muted }}>
                I raised my hand. 🦋 #ButterflyChallenge — Your turn → {shareUrl}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`I raised my hand. 🦋 #ButterflyChallenge — Your turn → ${shareUrl}`);
                  track('share_caption_copied', { platform: showPlatformGuide });
                }}
                className="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-lg border"
                style={{ color: COLORS.accent, backgroundColor: COLORS.bg, borderColor: COLORS.hair }}
              >
                Copy
              </button>
            </div>

            <a
              href={showPlatformGuide === 'tiktok' ? 'https://www.tiktok.com/upload' : 'https://www.instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl text-base hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.accent }}
              onClick={() => track('platform_opened', { platform: showPlatformGuide })}
            >
              Open {showPlatformGuide === 'tiktok' ? 'TikTok' : 'Instagram'} →
            </a>
          </div>
        </div>
      )}

      {/* ============ CUSTOM STYLES ============ */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
        
        /* Accessibility: reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Modal animations */
        .modal-backdrop {
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          animation: slideUp 0.25s ease-out;
        }
        .drawer-content {
          animation: slideFromBottom 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideFromBottom {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.97); }
        }
        @keyframes slideToBottom {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(100%); }
        }
        .modal-backdrop-closing { animation: fadeOut 0.2s ease-in forwards; }
        .modal-content-closing { animation: slideDown 0.2s ease-in forwards; }
        .drawer-content-closing { animation: slideToBottom 0.25s ease-in forwards; }
        @keyframes dropdownOpen {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-menu { animation: dropdownOpen 0.15s ease-out; }
        /* FAQ accordion */
        @keyframes faqOpen {
          from { opacity: 0; transform: translateY(-8px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 500px; }
        }
        .faq-answer-open {
          animation: faqOpen 0.25s ease-out forwards;
          overflow: hidden;
        }
        .faq-chevron {
          transition: transform 0.25s ease;
        }
        .faq-chevron-open {
          transform: rotate(180deg);
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #00b18d; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #009b7d; }
        * { scrollbar-width: thin; scrollbar-color: #00b18d transparent; }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
        * {
          -webkit-overflow-scrolling: touch;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
