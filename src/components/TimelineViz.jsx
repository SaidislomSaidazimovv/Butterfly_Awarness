import { ChevronRight } from 'lucide-react';
import { g, TEAL, ff } from '../constants/index.js';
import { TL_EVENTS } from '../data/index.js';

export function TimelineViz({ onEventClick }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28 }}>
      {/* Vertical line */}
      <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 1.5, background: "linear-gradient(to bottom, " + TEAL + ", " + g.bdr + ")", borderRadius: 1 }} />

      {TL_EVENTS.map((ev, i) => (
        <button key={i} onClick={() => onEventClick(ev)} className="card-btn" style={{
          display: "flex", gap: 14, padding: "16px 16px 16px 20px", marginBottom: i < TL_EVENTS.length - 1 ? 6 : 0,
          background: "#fff", borderRadius: 14, border: "none", width: "100%", textAlign: "left",
          cursor: "pointer", fontFamily: ff, position: "relative"
        }}>
          {/* Dot on the line */}
          <div style={{
            position: "absolute", left: -24, top: 22, width: 10, height: 10, borderRadius: 5,
            background: ev.status === "next" ? TEAL : "#fff",
            border: ev.status === "next" ? "none" : "2px solid " + g.bdr,
            boxShadow: ev.status === "next" ? "0 0 0 4px " + TEAL + "22" : "none",
            transition: "all .3s"
          }} />
          {ev.status === "next" && <div style={{ position: "absolute", left: -24, top: 22, width: 10, height: 10, borderRadius: 5, background: TEAL, animation: "ping 2s cubic-bezier(0,0,.2,1) infinite" }} />}

          <div style={{ minWidth: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: ev.status === "next" ? TEAL : g.t3 }}>{ev.d}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: g.t1, marginBottom: 2 }}>{ev.t}</p>
            <p style={{ fontSize: 13, color: g.t4 }}>{ev.s}</p>
          </div>
          <ChevronRight size={14} style={{ color: g.bdr, flexShrink: 0, alignSelf: "center" }} />
        </button>
      ))}
    </div>
  );
}

/* ── Highlight Carousel (Apple full-bleed scroll) ── */
