import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, ChevronRight, Globe2, Heart } from 'lucide-react';
import { g, ff, TEAL } from '../constants/index.js';
import { SUPPORT_COUNTRIES } from '../data/index.js';
import { track } from '../utils/track.js';

export function SupportPanel() {
  const { t } = useTranslation();
  const [country, setCountry] = useState("");
  const local = SUPPORT_COUNTRIES[country] || null;
  const ease = "cubic-bezier(.16,1,.3,1)";

  return (
    <div style={{ fontFamily: ff }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Heart size={18} style={{ color: TEAL }} />
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{t('support.title')}</h2>
      </div>
      <p style={{ fontSize: 14, color: g.t3, marginBottom: 22 }}>{t('support.sub')}</p>

      {/* US resources */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: g.t3, marginBottom: 10 }}>{t('support.unitedStates')}</p>
      <a href="tel:988" className="card-btn" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid #e8e8ed", borderRadius: 14, textDecoration: "none", marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: TEAL + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Phone size={18} style={{ color: TEAL }} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 1 }}>{t('support.lifeline.name')}</p>
          <p style={{ fontSize: 13, color: g.t3 }}>{t('support.lifeline.detail')}</p>
        </div>
        <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0 }} />
      </a>
      <a href="sms:741741&body=HOME" className="card-btn" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid #e8e8ed", borderRadius: 14, textDecoration: "none", marginBottom: 22 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: TEAL + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageCircle size={18} style={{ color: TEAL }} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 1 }}>{t('support.textLine.name')}</p>
          <p style={{ fontSize: 13, color: g.t3 }}>{t('support.textLine.detail')}</p>
        </div>
        <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0 }} />
      </a>

      {/* International */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: g.t3, marginBottom: 10 }}>{t('support.international')}</p>
      <div style={{ border: "1px solid #e8e8ed", borderRadius: 14, padding: "16px 16px", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: g.t3, marginBottom: 8 }}>{t('support.selectCountry')}</p>
        <select value={country} onChange={e => { setCountry(e.target.value); if (e.target.value) track('crisis_country_selected', { country: e.target.value }); }} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, background: "#fff", outline: "none", marginBottom: local ? 12 : 0 }}>
          <option value="">{t('support.choose')}</option>
          {Object.keys(SUPPORT_COUNTRIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {local && (
          <div style={{ animation: `fadeUp .3s ${ease}`, background: "#f0fdf9", borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: g.t1, marginBottom: 4 }}>{local.name}</p>
            <a href={"tel:" + local.number.replace(/\s/g, "")} style={{ fontSize: 15, fontWeight: 600, color: TEAL, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Phone size={14} /> {local.number}</a>
            <a href={local.url} target="_blank" rel="noopener" style={{ fontSize: 13, color: g.link, textDecoration: "none" }}>{t('support.visitWebsite')}</a>
          </div>
        )}
      </div>

      <a href="https://findahelpline.com" target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", border: "1px solid " + TEAL, borderRadius: 980, textDecoration: "none", fontFamily: ff, fontSize: 14, fontWeight: 500, color: TEAL, marginBottom: 16 }}>
        <Globe2 size={15} /> {t('support.findLocal')}
      </a>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: g.bg, borderRadius: 12 }}>
        <Heart size={14} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: g.t3, lineHeight: 1.5 }}><strong style={{ color: g.t2 }}>{t('support.confidentialTitle')}</strong> {t('support.confidentialBody')}</p>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */

/* ── Shared page styles ── */

/* ── Hash Router Hook ── */

/* ── Nav Component ── */
