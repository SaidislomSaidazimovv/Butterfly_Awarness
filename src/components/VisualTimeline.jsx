import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { g, TEAL, ff } from '../constants/index.js';

export function VisualTimeline() {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const items = [
    { d: "Apr 30", t: t('visualTimeline.apr30.t'), s: t('visualTimeline.apr30.s'), live: true },
    { d: "May 1", t: t('visualTimeline.may1.t'), s: t('visualTimeline.may1.s') },
    { d: "May–Jun", t: t('visualTimeline.mayJun.t'), s: t('visualTimeline.mayJun.s') },
    { d: "Jul 19", t: t('visualTimeline.jul19.t'), s: t('visualTimeline.jul19.s') },
    { d: "Sep", t: t('visualTimeline.sep.t'), s: t('visualTimeline.sep.s') },
  ];

  return (
    <div style={{ textAlign: "left" }}>
      {items.map((item, i) => {
        const isOpen = active === i;
        return (
          <button key={i} onClick={() => setActive(isOpen ? null : i)} style={{
            display: "flex", gap: 16, width: "100%", padding: "16px 0",
            borderBottom: i < items.length - 1 ? "1px solid #e8e8ed" : "none",
            background: "none", border: "none", borderBottomStyle: i < items.length - 1 ? "solid" : "none",
            borderBottomWidth: 1, borderBottomColor: "#e8e8ed",
            cursor: "pointer", fontFamily: ff, textAlign: "left",
            transition: "all .2s"
          }}>
            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, minWidth: 16 }}>
              <div style={{
                width: item.live ? 10 : 8, height: item.live ? 10 : 8, borderRadius: "50%",
                background: item.live ? TEAL : isOpen ? g.t1 : g.bdr,
                transition: "all .3s cubic-bezier(.16,1,.3,1)",
                boxShadow: item.live ? "0 0 0 3px " + TEAL + "30" : "none",
                animation: item.live ? "pulse 2s ease infinite" : "none"
              }} />
              {i < items.length - 1 && (
                <div style={{ width: 1.5, flex: 1, marginTop: 6, background: isOpen ? g.t1 + "30" : "#e8e8ed", transition: "background .3s", minHeight: 20 }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.live ? TEAL : g.t3, marginRight: 10 }}>{item.d}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: g.t1 }}>{item.t}</span>
                </div>
                <ChevronDown size={14} style={{
                  color: g.t4, flexShrink: 0,
                  transition: "transform .35s cubic-bezier(.16,1,.3,1)",
                  transform: isOpen ? "rotate(180deg)" : "none"
                }} />
              </div>
              <div style={{
                overflow: "hidden",
                maxHeight: isOpen ? 80 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease",
                marginTop: isOpen ? 8 : 0
              }}>
                <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.55 }}>{item.s}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
