import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { g, ff, JOIN_STEP1, JOIN_STEP2, JOIN_STEP3, SCRIPT } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function JoinC({ onDone }) {
  const [s, sS] = useState(0);
  const st = [{ e: JOIN_STEP1, t: "Make the sign", d: "Hands on heart. Open like wings." }, { e: JOIN_STEP2, t: "Say the message", d: "\"" + SCRIPT + "\"" }, { e: JOIN_STEP3, t: "Lift 3 more", d: "Tag 3 people. 24 hours." }];
  return <div style={{ fontFamily: ff }}><div style={{ display: "flex", gap: 4, margin: "6px 0 20px" }}>{st.map((_, i) => <div key={i} style={{ height: 2.5, flex: 1, borderRadius: 2, background: i <= s ? g.t1 : "#e8e8ed", transition: "background .35s cubic-bezier(.16,1,.3,1)" }} />)}</div><div key={s} style={{ textAlign: "center", padding: "12px 0 22px", animation: "fadeUp .4s cubic-bezier(.16,1,.3,1)" }}><img src={st[s].e} alt={st[s].t} style={{ width: 160, height: 160, objectFit: "contain", display: "block", margin: "0 auto 8px" }} /><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: g.t3, marginBottom: 6 }}>Step {s + 1}</p><h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{st[s].t}</h3><p style={{ fontSize: 16, color: g.t2 }}>{st[s].d}</p></div><div style={{ display: "flex", gap: 8 }}>{s > 0 && <Btn onClick={() => sS(x => x - 1)} style={{ flex: 1, fontSize: 15 }}>Back</Btn>}{s < 2 ? <Btn primary onClick={() => sS(x => x + 1)} style={{ flex: 1, fontSize: 15 }} icon={<ChevronRight size={15} />}>Next</Btn> : <Btn primary onClick={onDone} style={{ flex: 1, fontSize: 15 }} icon={<Share2 size={14} />}>Done — share</Btn>}</div></div>;
}

/* ── Countdown Timer ── */
