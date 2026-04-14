import { useState, useEffect } from 'react';
import { g, ff, TEAL, STEP_DFD1, STEP_DFD2, STEP_DFD3 } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function StepTabs({ onJoin }) {
  const [active, setActive] = useState(0);
  const ease = "cubic-bezier(.16,1,.3,1)";

  // Preload all step images on mount
  useEffect(() => {
    [STEP_DFD1, STEP_DFD2, STEP_DFD3].forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const steps = [
    {
      num: "01", title: "Take the Challenge", img: STEP_DFD1,
      heading: "Make the sign. Film it.",
      body: "Open your camera. Face it toward you. Make the Butterfly Sign — hands on heart, open like wings. No filter. No production. Just you, showing up for someone.",
      tip: "Hold a name in your mind. You don't have to say it out loud.",
    },
    {
      num: "02", title: "Show the Love", img: STEP_DFD2,
      heading: "Say their name.",
      body: "Look into the camera and say: \"I see you. I care. You're not alone.\" Or: \"I got you, [name].\" Say their name out loud. That's what makes it real.",
      tip: "This isn't a script. Say whatever is true.",
    },
    {
      num: "03", title: "Lift 3 More", img: STEP_DFD3,
      heading: "Tag 3 people. Pass it forward.",
      body: "Nominate 3 people you care about. Give them 24 hours. One becomes three becomes nine becomes a billion. That's the butterfly effect.",
      tip: "They don't need followers. They need one person to think of.",
    },
  ];

  const s = steps[active];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: 16, overflow: "hidden", border: "1px solid #e8e8ed" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: "14px 8px", border: "none", fontFamily: ff,
            background: active === i ? "#fff" : "transparent",
            cursor: "pointer", transition: `all .3s ${ease}`,
            borderRight: i < 2 ? "1px solid #e8e8ed" : "none",
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: active === i ? TEAL : g.t4, transition: `color .3s ${ease}`, marginBottom: 2 }}>{st.num}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: active === i ? g.t1 : g.t3, transition: `color .3s ${ease}` }}>{st.title}</p>
          </button>
        ))}
      </div>

      {/* Content card */}
      <div key={active} style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        animation: `fadeUp .4s ${ease}`,
      }}>
        <div style={{ width: "50%", margin: "0 auto", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={s.img} alt="" width="400" height="400" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
        <h3 style={{ fontSize: 22, fontWeight: 600, color: g.t1, marginBottom: 8, letterSpacing: "-.02em" }}>{s.heading}</h3>
        <p style={{ fontSize: 16, color: g.t2, lineHeight: 1.65, marginBottom: 16 }}>{s.body}</p>
        <div style={{ background: g.bg, borderRadius: 14, padding: "14px 18px" }}>
          <p style={{ fontSize: 13, color: g.t3, fontStyle: "italic" }}>💡 {s.tip}</p>
        </div>
        </div>
      </div>

      {/* Progress + CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: active === i ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= active ? g.t1 : g.bdr,
              cursor: "pointer", transition: `all .35s ${ease}`,
            }} />
          ))}
        </div>
        {active === 2 ? (
          <Btn primary onClick={onJoin} style={{ fontSize: 14, padding: "10px 22px" }}>
            I'm ready — join
          </Btn>
        ) : (
          <Btn onClick={() => setActive(a => a + 1)} style={{ fontSize: 14, padding: "10px 22px", color: g.link, borderColor: "transparent" }}>
            Next step ›
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ── Support Panel (Get Support popup) ── */
