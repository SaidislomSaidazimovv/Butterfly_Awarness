import { Check } from 'lucide-react';
import { g, ff, TEAL, ORANGE } from '../constants/index.js';
// TEAL retained for non-button accents (e.g., reset-link confirmation text).
import { Popup, Btn } from './ui/index.js';

export function AuthPopup({ open, onClose, mode, setMode, email, setEmail, password, setPassword, name, setName, error, errorColor, loading, resetEmailSent, showEmailVerification, verificationEmail, onGoogleSignIn, onSubmit, onPasswordReset }) {
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
        <button onClick={onSubmit} disabled={loading} style={{ ...btnBase, background: ORANGE, color: "#fff", opacity: loading ? 0.6 : 1, marginTop: mode === 'register' ? 12 : 4 }}>
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
