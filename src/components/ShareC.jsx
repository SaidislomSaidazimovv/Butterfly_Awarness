import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Mail, MessageCircle, Send, Film, ExternalLink, Clock } from 'lucide-react';
import { g, ff, TEAL, URL_, STXT } from '../constants/index.js';
import { CAPS } from '../data/index.js';
import { track } from '../utils/track.js';
import { Btn } from './ui/index.js';
import { InstagramIcon as Instagram } from './ui/index.js';

export function ShareC({ cp, onShare, onEmailSubmit }) {
  const { t } = useTranslation();
  const [cpd, sCPD] = useState(null);
  const [remEmail, setRemEmail] = useState("");
  const [remSent, setRemSent] = useState(false);
  const remValid = remEmail.includes("@") && remEmail.includes(".");
  const sh = [
    { l: t('shareC.copyLink'), i: <Copy size={13} />, a: () => { cp(URL_); if (onShare) onShare('copy'); } },
    { l: "𝕏", i: <span style={{ fontWeight: 800, fontSize: 12 }}>𝕏</span>, a: () => { window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(STXT)); if (onShare) onShare('twitter'); } },
    { l: t('shareC.whatsapp'), i: <MessageCircle size={13} />, a: () => { window.open("https://wa.me/?text=" + encodeURIComponent(STXT + " " + URL_)); if (onShare) onShare('whatsapp'); } },
    { l: t('shareC.telegram'), i: <Send size={13} />, a: () => { window.open("https://t.me/share/url?url=" + encodeURIComponent(URL_)); if (onShare) onShare('telegram'); } },
    { l: t('shareC.facebook'), i: <ExternalLink size={13} />, a: () => { window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(URL_)); if (onShare) onShare('facebook'); } },
    { l: t('shareC.email'), i: <Mail size={13} />, a: () => { window.open("mailto:?subject=Butterfly%20Challenge&body=" + encodeURIComponent(STXT)); if (onShare) onShare('email'); } },
  ];
  return <div style={{ fontFamily: ff }}>
    <p style={{ color: g.t3, fontSize: 14, marginBottom: 16 }}>{t('shareC.sub')}</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 18 }}>
      {sh.map(s => <button key={s.l} onClick={s.a} aria-label={"Share via " + s.l} className="hov-lift" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 4px", borderRadius: 12, border: "1px solid #e8e8ed", background: "#fff", cursor: "pointer", color: g.t1, fontSize: 11, fontWeight: 500, fontFamily: ff, transition: "all .2s cubic-bezier(.16,1,.3,1)" }}>{s.i}<span>{s.l}</span></button>)}
    </div>
    <p style={{ fontSize: 12, color: g.t3, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}><Instagram size={11} /><Film size={11} />{t('shareC.captionHint')}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
      {CAPS.map(cap => {
        const text = t(`shareC.captions.${cap.key}`);
        return <div key={cap.id} style={{ border: "1px solid #e8e8ed", borderRadius: 12, padding: 11, transition: "border-color .2s" }}>
          <p style={{ fontSize: 13, color: g.t2, lineHeight: 1.5, marginBottom: 6 }}>{text}</p>
          <button aria-label={t('shareC.copy')} onClick={() => { navigator.clipboard.writeText(text).then(() => { sCPD(cap.id); track('share_caption_copied'); setTimeout(() => sCPD(null), 1500); }); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, color: cpd === cap.id ? TEAL : g.t3, display: "flex", alignItems: "center", gap: 3, padding: 0, fontFamily: ff, transition: "color .2s" }}>
            {cpd === cap.id ? <><Check size={10} />{t('shareC.copied')}</> : <><Copy size={10} />{t('shareC.copy')}</>}
          </button>
        </div>;
      })}
    </div>
    <div style={{ borderTop: "1px solid " + g.bg, paddingTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 500, color: g.t2, marginBottom: 12 }}><Clock size={13} />{t('shareC.remindHeading')}</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <input type="email" placeholder={t('reminderC.placeholder')} value={remEmail} onChange={e => setRemEmail(e.target.value)} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e8e8ed", fontSize: 13, fontFamily: ff, outline: "none", transition: "border-color .2s" }} />
        <Btn primary onClick={async () => { if (remValid && onEmailSubmit) { const r = await onEmailSubmit(remEmail); if (r.success) setRemSent(true); } else if (remValid) { setRemSent(true); } }} disabled={!remValid} style={{ padding: "8px 14px", fontSize: 12 }}>{t('shareC.remindBtn')}</Btn>
      </div>
      {remSent && <p style={{ color: TEAL, fontSize: 12, fontWeight: 500, marginBottom: 12 }}><Check size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />{t('shareC.remindSuccess')}</p>}
    </div>
  </div>;
}
