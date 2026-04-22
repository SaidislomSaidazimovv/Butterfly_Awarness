import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { g, ff } from '../constants/index.js';
import { FAQS } from '../data/index.js';
import { track } from '../utils/track.js';

export function FAQ() {
  const { t } = useTranslation();
  const [o, sO] = useState(null);
  return <div>{FAQS.map((f, i) => {
    const q = t(`faq.${f.id}.q`);
    const a = t(`faq.${f.id}.a`);
    return <div key={f.id}>
      <button onClick={() => { const next = o === i ? null : i; sO(next); if (next !== null) track('faq_opened', { question: q.substring(0, 50) }); }} style={{ width: "100%", textAlign: "left", padding: "16px 0", background: "none", border: "none", borderBottom: "1px solid " + g.bg, cursor: "pointer", fontFamily: ff, fontSize: 16, fontWeight: 600, color: g.t1, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color .2s" }}>
        {q}<ChevronDown size={16} style={{ color: g.t3, transition: "transform .35s cubic-bezier(.16,1,.3,1)", transform: o === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 16 }} />
      </button>
      <div style={{ overflow: "hidden", maxHeight: o === i ? 200 : 0, opacity: o === i ? 1 : 0, transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease" }}>
        <p style={{ padding: "6px 0 18px", fontSize: 15, color: g.t2, lineHeight: 1.6 }}>{a}</p>
      </div>
    </div>;
  })}</div>;
}
