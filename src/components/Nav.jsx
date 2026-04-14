import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { g, ff, TEAL, LOGO_DARK } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function Nav({ page, navigate, onJoin, onSupport, currentUser, onSignIn, onSignOut, userDropdownOpen, setUserDropdownOpen, displayName, avatarUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showAvatarImg = !!avatarUrl && !avatarFailed;
  const ease = "cubic-bezier(.16,1,.3,1)";
  const links = [{l:"Story",p:"story"},{l:"Science",p:"science"},{l:"Alliance",p:"alliance"},{l:"Live",p:"live"}];

  const go = (p) => { navigate(p); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @media(min-width:1024px){.nav-mobile{display:none!important}.nav-desktop{display:flex!important}}
        @media(max-width:1023px){.nav-mobile{display:flex!important}.nav-desktop{display:none!important}}
        @media(min-width:1024px) and (max-width:1199px){.nav-center-links{gap:12px!important}.nav-safe-exit{display:none!important}}
      `}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px" }}>
          {/* Logo — always visible */}
          <button onClick={() => go('')} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
            <img src={LOGO_DARK} alt="Butterfly Challenge" width="120" height="32" decoding="async" style={{ height: 32, width: "auto" }} />
          </button>

          {/* Desktop center links */}
          <div className="nav-desktop nav-center-links" style={{ display: "none", alignItems: "center", gap: 24 }}>
            {links.map(t => (
              <button key={t.p} onClick={() => navigate(t.p)} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 13, fontWeight: 500, color: page === t.p ? TEAL : g.t2, cursor: "pointer", padding: 0, position: "relative" }}>
                {t.l}
                {page === t.p && <div style={{ position: "absolute", bottom: -8, left: 0, right: 0, height: 2, background: TEAL, borderRadius: 1 }} />}
              </button>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="nav-desktop" style={{ display: "none", alignItems: "center", gap: 10 }}>
            <button className="nav-safe-exit" onClick={() => window.open("https://google.com","_blank","noopener")} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 12, fontWeight: 500, color: g.t3, cursor: "pointer", padding: "6px 0", display: "flex", alignItems: "center", gap: 4 }}>
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
                <button aria-label="User menu" onClick={() => setUserDropdownOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid " + g.bdr, borderRadius: 980, padding: "4px 12px 4px 4px", cursor: "pointer", fontFamily: ff }}>
                  {showAvatarImg ? (
                    <img src={avatarUrl} alt="" width="26" height="26" referrerPolicy="no-referrer" decoding="async" onError={() => setAvatarFailed(true)} style={{ width: 26, height: 26, borderRadius: 13, objectFit: "cover" }} />
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
            {currentUser && (
              <div style={{ position: "relative" }}>
                <button aria-label="User menu" onClick={() => setUserDropdownOpen(v => !v)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
                  {showAvatarImg ? (
                    <img src={avatarUrl} alt="" width="32" height="32" referrerPolicy="no-referrer" decoding="async" onError={() => setAvatarFailed(true)} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {(displayName || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>
                {userDropdownOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,.1)", border: "1px solid rgba(0,0,0,.06)", padding: "8px 4px", minWidth: 180, zIndex: 10, animation: "fadeUp .2s cubic-bezier(.16,1,.3,1)" }}>
                    <p style={{ padding: "8px 14px", fontSize: 12, color: g.t4, fontFamily: ff }}>{currentUser.email}</p>
                    <button onClick={onSignOut} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", fontFamily: ff, fontSize: 14, fontWeight: 500, color: "#ef4444", cursor: "pointer", borderRadius: 8 }}>Sign out</button>
                  </div>
                )}
              </div>
            )}
            <button aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: 36, height: 36 }}>
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
          {/* Auth section in mobile menu */}
          <div style={{ borderTop: "1px solid " + g.bdr, paddingTop: 16, marginTop: 8 }}>
            {currentUser ? (
              <div>
                <p style={{ color: g.t3, fontSize: 13, marginBottom: 8, fontFamily: ff, textAlign: "center" }}>
                  {currentUser.user_metadata?.full_name || currentUser.email}
                </p>
                <button onClick={() => { onSignOut(); setMenuOpen(false); }} aria-label="Sign out" style={{ background: "none", border: "1px solid " + g.bdr, borderRadius: 14, color: "#ef4444", padding: "12px 20px", fontSize: 15, fontWeight: 500, cursor: "pointer", width: "100%", fontFamily: ff }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => { onSignIn(); setMenuOpen(false); }} aria-label="Sign in" style={{ background: TEAL, border: "none", borderRadius: 14, color: "#fff", padding: "13px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: ff }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Footer Component ── */
