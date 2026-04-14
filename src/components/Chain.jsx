import { useState, useRef, useEffect } from 'react';
import { g, ff, TEAL, ICON_BUTTERFLY } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function Chain({ onJoin }) {
  const [lv, sL] = useState(0);
  const [counting, setCounting] = useState(false);
  const [counter, setCounter] = useState(0);
  const [done, setDone] = useState(false);
  const cRef = useRef(null);

  const steps = [
    { n: 1, label: "You", msg: "One person. One gesture.", emoji: 1 },
    { n: 3, label: "3", msg: "You lift 3 people.", emoji: 3 },
    { n: 9, label: "9", msg: "They each lift 3 more.", emoji: 9 },
    { n: 27, label: "27", msg: "It's already spreading.", emoji: 27 },
    { n: 81, label: "81", msg: "Four generations deep.", emoji: 40 },
    { n: 243, label: "243", msg: "Five generations. Now watch.", emoji: 40 },
  ];

  const advance = () => {
    if (lv < 5) {
      sL(lv + 1);
    } else if (!counting && !done) {
      // Trigger the dramatic fast-count to 1 billion
      setCounting(true);
      setCounter(243);
      const targets = [729, 2187, 6561, 19683, 59049, 177147, 531441, 1594323, 4782969, 14348907, 43046721, 129140163, 387420489, 1000000000];
      let i = 0;
      const tick = () => {
        if (i < targets.length) {
          setCounter(targets[i]);
          i++;
          cRef.current = setTimeout(tick, i < 8 ? 120 : i < 12 ? 180 : 280);
        } else {
          setCounting(false);
          setDone(true);
        }
      };
      cRef.current = setTimeout(tick, 200);
    }
  };

  const reset = () => {
    clearTimeout(cRef.current);
    sL(0); setCounting(false); setCounter(0); setDone(false);
  };

  useEffect(() => { return () => clearTimeout(cRef.current); }, []);

  const fmt = (n) => {
    if (n >= 1e9) return "1,000,000,000";
    if (n >= 1e6) return Math.floor(n / 1e6).toLocaleString() + "M";
    if (n >= 1e3) return Math.floor(n / 1e3).toLocaleString() + "K";
    return n.toLocaleString();
  };

  // DONE state — the big reveal
  if (done) {
    return (
      <div style={{ textAlign: "center", animation: "fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
        <img src={ICON_BUTTERFLY} alt="" width="56" height="56" loading="lazy" decoding="async" style={{ width: 56, height: 56, marginBottom: 8, display: "block", marginLeft: "auto", marginRight: "auto" }} />
        <p style={{
          fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1,
          background: "linear-gradient(90deg," + TEAL + ",#2ecc71,#06b6d4)", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6
        }}>1,000,000,000</p>
        <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, marginBottom: 4 }}>One billion hands.</p>
        <p style={{ fontSize: 15, color: g.t3, marginBottom: 20, lineHeight: 1.5 }}>
          20 generations. Starting with one person.<br />Starting with you.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary onClick={onJoin} style={{ fontSize: 15, padding: "12px 24px" }}>Be that person</Btn>
          <Btn onClick={reset} style={{ fontSize: 13, padding: "10px 18px", color: g.t3, borderColor: g.bdr }}>Watch again</Btn>
        </div>
      </div>
    );
  }

  // COUNTING state — fast rolling numbers
  if (counting) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 4 }}>{Array.from({length:10}).map((_,i)=><img key={i} src={ICON_BUTTERFLY} alt="" width="12" height="12" loading="lazy" decoding="async" style={{ width: 12, height: 12 }} />)}</div>
        <p style={{
          fontSize: 44, fontWeight: 700, color: TEAL, letterSpacing: "-.03em",
          fontVariantNumeric: "tabular-nums", transition: "all .1s", fontFamily: "monospace, " + ff
        }}>{fmt(counter)}</p>
        <p style={{ fontSize: 13, color: g.t3, animation: "fadeUp .3s ease" }}>
          {counter < 1e4 ? "Growing..." : counter < 1e6 ? "Still going..." : counter < 1e8 ? "Almost there..." : "..."}
        </p>
      </div>
    );
  }

  // STEP state — interactive butterfly grid
  const s = steps[lv];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", minHeight: 48, alignItems: "center", padding: "8px 0" }}>
        {Array.from({ length: Math.min(s.emoji, 40) }).map((_, i) => (
          <img key={i} src={ICON_BUTTERFLY} alt="" width={s.emoji > 27 ? 11 : 20} height={s.emoji > 27 ? 11 : 20} loading="lazy" decoding="async" style={{ width: s.emoji > 27 ? 11 : 20, height: s.emoji > 27 ? 11 : 20, animation: `popIn .3s cubic-bezier(.16,1,.3,1) ${i * 15}ms both` }} />
        ))}
        {s.emoji > 40 && <span style={{ fontSize: 11, color: g.t3, marginLeft: 4 }}>+{s.n - 40}</span>}
      </div>
      <p style={{ fontSize: 36, fontWeight: 600, color: g.t1, letterSpacing: "-.03em" }}>{s.label}</p>
      <p style={{ fontSize: 14, color: g.t3, marginBottom: 16 }}>{s.msg}</p>
      <Btn primary onClick={advance} style={{ fontSize: 14, padding: "10px 22px" }}>
        {lv === 0 ? "Lift 3" : lv < 5 ? "Next generation" : "Keep going →"}
      </Btn>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 14 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i <= lv ? g.t1 : g.bdr, transition: "background .3s" }} />
        ))}
        <div style={{ width: 5, height: 5, borderRadius: 3, background: g.bdr }} />
      </div>
    </div>
  );
}
