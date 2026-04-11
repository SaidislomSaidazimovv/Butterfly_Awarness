import { useState } from 'react';
import { Phone, MessageCircle, ChevronRight, Globe2, Heart } from 'lucide-react';
import { g, ff, TEAL } from '../constants/index.js';
import { SUPPORT_COUNTRIES } from '../data/index.js';
import { track } from '../utils/track.js';

export function SupportPanel() {
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

/* ── Hash Router Hook ── */

/* ── Nav Component ── */
