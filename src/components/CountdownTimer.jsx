import { useState, useEffect } from 'react';
import { g, TEAL, ff } from '../constants/index.js';

export function CountdownTimer() {
  const target = new Date("2026-04-30T19:00:00-04:00").getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 864e5);
  const hrs = Math.floor((diff % 864e5) / 36e5);
  const mins = Math.floor((diff % 36e5) / 6e4);
  const secs = Math.floor((diff % 6e4) / 1e3);
  const past = diff === 0;

  const unit = (val, label) => (
    <div style={{ textAlign: "center", minWidth: 56 }}>
      <p style={{ fontSize: 32, fontWeight: 600, color: past ? g.t4 : TEAL, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums", transition: "color .3s" }}>
        {String(val).padStart(2, "0")}
      </p>
      <p style={{ fontSize: 11, color: g.t4, textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{label}</p>
    </div>
  );

  const sep = <span style={{ fontSize: 24, fontWeight: 300, color: g.bdr, alignSelf: "flex-start", paddingTop: 6 }}>:</span>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 6, marginBottom: 28 }}>
      {past ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: TEAL }}>It's happening now.</p>
        </div>
      ) : (
        <>{unit(days, "Days")}{sep}{unit(hrs, "Hours")}{sep}{unit(mins, "Min")}{sep}{unit(secs, "Sec")}</>
      )}
    </div>
  );
}

/* ── Timeline ── */
