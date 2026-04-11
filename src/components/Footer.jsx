import { g, ff, LOGO_DARK } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function Footer({ navigate, onSupport }) {
  return (
    <footer style={{ background: g.bg, padding: "60px 24px 28px", fontFamily: ff }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <img src={LOGO_DARK} alt="Butterfly Challenge" style={{ height: 36, marginBottom: 14 }} />
            <p style={{ fontSize: 13, color: g.t3, lineHeight: 1.5, marginBottom: 16 }}>An initiative of One Humanity Foundation.</p>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ic:"💬",l:"TikTok"},{ic:"🔗",l:"Share"},{ic:"𝕏",l:"Twitter"},{ic:"▶",l:"YouTube"}].map((s, i) => (
                <span key={i} role="link" aria-label={"Visit our " + s.l} tabIndex={0} style={{ width: 28, height: 28, borderRadius: 14, border: "1px solid " + g.bdr, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: g.t3, cursor: "pointer" }}>{s.ic}</span>
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
