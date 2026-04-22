import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { TEAL, ff, g, HAND_RAISE_BOOST } from './constants/index.js';
import { SYNTHETIC_COUNTRIES, SYNTHETIC_CITIES, SYNTHETIC_PARTICIPANTS } from './data/syntheticHands.js';
import { TRUST } from './data/index.js';
import { track } from './utils/track.js';
import { supabase, saveHandRaise, saveEmail, getCountryCode, getLocationData } from './utils/supabase.js';
import { useToast } from './hooks/useToast.js';
import { usePathRouter } from './hooks/usePathRouter.js';
import { useLiveHands } from './hooks/useLiveHands.js';
import { Toast, Popup, Btn } from './components/ui/index.js';
import { JoinC, ShareC, ReminderC, SupportPanel, Nav, Footer, AuthPopup, UgcPopup, WorkingProgress } from './components/index.js';
import { HomePage } from './pages/index.js';

const StoryPage = lazy(() => import('./pages/StoryPage.jsx'));
const SciencePage = lazy(() => import('./pages/SciencePage.jsx'));
const AlliancePage = lazy(() => import('./pages/AlliancePage.jsx'));
const LivePage = lazy(() => import('./pages/LivePage.jsx'));


export default function App() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { entries } = useLiveHands();
  const { toast, show } = useToast();
  const cp = useCallback(text => { navigator.clipboard.writeText(text).then(() => show(t('toast.copied'))); }, [show, t]);
  const { page, navigate } = usePathRouter();
  
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
      const [countries, cities, participants] = await Promise.all([
        supabase.rpc('get_country_leaderboard'),
        supabase.rpc('get_city_leaderboard'),
        supabase.rpc('get_top_participants'),
      ]);
      const mergeByKey = (real, syn, key) => {
        const map = new Map();
        for (const row of syn) map.set(row[key], { ...row });
        for (const row of real || []) {
          const existing = map.get(row[key]);
          if (existing) existing.count = (existing.count || 0) + (row.count || 0);
          else map.set(row[key], { ...row });
        }
        return [...map.values()].sort((a, b) => (b.count || 0) - (a.count || 0));
      };
      const realParticipants = (participants.data || []).map(row => ({
        name: row.display_name || 'User',
        avatar: row.avatar_url,
        count: row.share_count,
      }));
      return {
        countries: mergeByKey(countries.data, SYNTHETIC_COUNTRIES, 'country_code'),
        cities: mergeByKey(cities.data, SYNTHETIC_CITIES, 'city'),
        participants: [...realParticipants, ...SYNTHETIC_PARTICIPANTS].sort((a, b) => (b.count || 0) - (a.count || 0)),
      };
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
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) setAuthError(error.message);
    } catch (error) {
      setAuthError('Connection failed. Please try again.');
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'handleGoogleSignIn', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
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
    try {
      await supabase.auth.signOut();
    } catch (error) {
      if (typeof mixpanel !== 'undefined') mixpanel.track('app_error', { source: 'handleSignOut', message: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() });
    }
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
        .hs{scrollbar-width:none;-ms-overflow-style:none}
        .hs::-webkit-scrollbar{display:none;width:0;height:0}
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
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#32C189;border-radius:999px}
        ::-webkit-scrollbar-thumb:hover{background:#28a876}
        *{scrollbar-width:thin;scrollbar-color:#32C189 transparent}
        html{scroll-behavior:smooth}
        .modal-scroll::-webkit-scrollbar{width:4px}
        .modal-scroll::-webkit-scrollbar-thumb{background:rgba(50,193,137,0.4);border-radius:999px}
        .modal-scroll::-webkit-scrollbar-thumb:hover{background:#32C189}
      `}</style>
      
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <Toast message={toast} />

      {/* Popups */}
      <Popup open={joinO} onClose={() => sJO(false)}><h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>{t('popups.join.title')}</h2><JoinC onDone={() => { sJO(false); setTimeout(() => sSO(true), 250); }} /></Popup>
      <Popup open={shareO} onClose={() => sSO(false)}><h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 14 }}>{t('popups.share.title')}</h2><ShareC cp={cp} onShare={saveShareAction} onEmailSubmit={handleEmailSubmit} /></Popup>
      <Popup open={remindO} onClose={() => setRemindO(false)}><ReminderC onDone={() => setRemindO(false)} onEmailSubmit={handleEmailSubmit} /></Popup>
      <Popup open={!!roleP} onClose={() => setRP(null)}>{roleP && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><img src={roleP.icon} alt={t(`popups.role.${roleP.id}.name`)} style={{ width: 44, height: 44, marginBottom: 10 }} /><p style={{ color: TEAL, fontWeight: 600, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{t(`popups.role.${roleP.id}.word`)}</p><h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{t(`popups.role.${roleP.id}.name`)}</h2><p style={{ fontSize: 16, color: g.t2, lineHeight: 1.65, marginBottom: 20 }}>{t(`popups.role.${roleP.id}.detail`)}</p><Btn primary onClick={() => { setRP(null); sJO(true); }} style={{ fontSize: 15 }}>{t('popups.role.join')}</Btn></div>}</Popup>
      <Popup open={!!alP} onClose={() => setAP(null)}>{alP && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><img src={alP.icon} alt={t(`popups.alliance.${alP.id}.name`)} style={{ width: 44, height: 44, marginBottom: 10, filter: alP.tint }} /><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{t(`popups.alliance.${alP.id}.name`)}</h2><p style={{ fontSize: 15, color: TEAL, fontWeight: 500, marginBottom: 14 }}>{t(`popups.alliance.${alP.id}.line`)}</p><p style={{ fontSize: 15, color: g.t2, lineHeight: 1.65, marginBottom: 18 }}>{t(`popups.alliance.${alP.id}.brief`)}</p><div style={{ padding: "12px 14px", background: g.bg, borderRadius: 10, marginBottom: 18 }}><p style={{ fontSize: 13, color: g.t2 }}><strong>{t('popups.alliance.nonNegotiable')}</strong> {t('popups.alliance.nonNegotiableText')}</p></div><Btn primary onClick={() => window.open("mailto:partners@onehumanity.org?subject=Founding Partner Inquiry — " + t(`popups.alliance.${alP.id}.name`))} style={{ fontSize: 15 }}>{t('popups.alliance.becomePartner')}</Btn></div>}</Popup>
      <Popup open={trustO} onClose={() => setTO(false)}><div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18 }}>{t('popups.trust.title')}</h2><div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{TRUST.map((item, i) => <div key={item.id} style={{ display: "flex", gap: 14, animation: `fadeUp .4s cubic-bezier(.16,1,.3,1) ${i * 60}ms both` }}><span style={{ fontSize: 22 }}>{item.m}</span><div><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{t(`popups.trust.items.${item.id}.t`)}</p><p style={{ fontSize: 14, color: g.t2, lineHeight: 1.5 }}>{t(`popups.trust.items.${item.id}.d`)}</p></div></div>)}</div></div></Popup>
      <Popup open={!!tlPopup} onClose={() => setTlPopup(null)}>{tlPopup && <div style={{ animation: "fadeUp .35s cubic-bezier(.16,1,.3,1)" }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><span style={{ fontSize: 13, fontWeight: 600, color: TEAL, padding: "4px 10px", background: TEAL + "14", borderRadius: 99 }}>{tlPopup.d}</span>{tlPopup.status === "next" && <span style={{ fontSize: 11, fontWeight: 600, color: TEAL, letterSpacing: ".08em", textTransform: "uppercase" }}>{t('popups.timeline.upNext')}</span>}</div><h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6, letterSpacing: "-.02em" }}>{t(`popups.timeline.${tlPopup.id}.t`)}</h2><p style={{ fontSize: 14, color: g.t3, marginBottom: 14 }}>{t(`popups.timeline.${tlPopup.id}.s`)}</p><p style={{ fontSize: 15, color: g.t2, lineHeight: 1.7 }}>{t(`popups.timeline.${tlPopup.id}.detail`)}</p></div>}</Popup>
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
      {/* {page === '' && <WorkingProgress />} */}
      {page === '' && <HomePage onJoin={() => sJO(true)} onShare={() => sSO(true)} onRemind={() => setRemindO(true)} onDidIt={handleIDidIt} showPlusOne={showPlusOne} onUgcOpen={openUgcModal} communityData={communityData} setRP={setRP} setAP={setAP} setTlPopup={setTlPopup} entries={entries} handCount={countData + HAND_RAISE_BOOST} leaderboardData={leaderboardData} />}
      <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: TEAL, fontSize: "2rem" }}>🦋</div>}>
        {page === 'story' && <StoryPage navigate={navigate} />}
        {page === 'science' && <SciencePage navigate={navigate} />}
        {page === 'alliance' && <AlliancePage setRP={setRP} setAP={setAP} onTrust={() => setTO(true)} navigate={navigate} />}
        {page === 'live' && <LivePage entries={entries} setTlPopup={setTlPopup} onShare={() => sSO(true)} handCount={countData + HAND_RAISE_BOOST} leaderboardData={leaderboardData} />}
      </Suspense>
      
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
