import { g, ff, LOGO_DARK } from '../constants/index.js';
import { Btn, InstagramIcon } from './ui/index.js';

const TikTokIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
  </svg>
);
const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/>
  </svg>
);
const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function Footer({ navigate, onSupport }) {
  const socials = [
    { l: "TikTok", Icon: TikTokIcon, href: "https://www.tiktok.com/@butterflychal" },
    { l: "Instagram", Icon: () => <InstagramIcon size={14} />, href: "https://www.instagram.com/butterflychal" },
    { l: "Facebook", Icon: FacebookIcon, href: "https://www.facebook.com/butterflychal" },
    { l: "X", Icon: XIcon, href: "https://x.com/butterflychal" },
  ];
  return (
    <footer style={{ background: g.bg, padding: "60px 24px 28px", fontFamily: ff }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid " + g.bdr }}>
          <h3 style={{ fontSize: "clamp(1.4rem,3vw,1.8rem)", fontWeight: 600, color: g.t1, letterSpacing: "-.02em", marginBottom: 8 }}>
            One humanity. Many flags. One butterfly.
          </h3>
          <p style={{ fontSize: 14, color: g.t3, marginBottom: 24 }}>
            A shared symbol across nations, cultures, and communities.
          </p>
          <img src="/images/flags-butterflies.webp" alt="Butterflies in the colors of many national flags" width="2535" height="929" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 900, height: "auto", display: "block", margin: "0 auto", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <img src={LOGO_DARK} alt="Butterfly Challenge" width="135" height="36" loading="lazy" decoding="async" style={{ height: 36, width: "auto", marginBottom: 14 }} />
            <p style={{ fontSize: 13, color: g.t3, lineHeight: 1.5, marginBottom: 10 }}>An initiative of One Humanity Foundation · 501(c)(3).</p>
            <a href="mailto:partnerships@butterfly.one" style={{ display: "inline-block", fontSize: 13, fontWeight: 500, color: g.t1, textDecoration: "none", marginBottom: 16, borderBottom: "1px solid " + g.bdr, paddingBottom: 1 }}>
              partnerships@butterfly.one
            </a>
            <div style={{ display: "flex", gap: 14 }}>
              {socials.map((s) => (
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={"Visit our " + s.l} style={{ width: 32, height: 32, borderRadius: 16, border: "1px solid " + g.bdr, display: "flex", alignItems: "center", justifyContent: "center", color: g.t3, textDecoration: "none", transition: "color .2s, border-color .2s" }}>
                  <s.Icon />
                </a>
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
