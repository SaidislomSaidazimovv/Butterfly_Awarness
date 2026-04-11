import { useState } from 'react';
import { g, ff, TEAL, SIGN_WOMAN1, SIGN_WOMAN2, SIGN_WOMAN3, SIGN_HANDS } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function SignBuilder() {
  const [step, setStep] = useState(-1);
  const ease = "cubic-bezier(.16,1,.3,1)";

  const imgStyle = { width: "100%", maxWidth: 240, borderRadius: 16, display: "block", margin: "0 auto" };
  const steps = [
    {
      instruction: "Place both hands on your heart.",
      detail: "Palms flat against your chest.",
      hands: <img src={SIGN_WOMAN1} alt="Hands on heart" style={imgStyle} />,
    },
    {
      instruction: "Cross your wrists.",
      detail: "Right over left, thumbs hooked together.",
      hands: <img src={SIGN_WOMAN2} alt="Wrists crossed" style={imgStyle} />,
    },
    {
      instruction: "Open like wings.",
      detail: "Spread your fingers wide. That's the Butterfly Sign.",
      hands: <img src={SIGN_WOMAN3} alt="Hands open like wings" style={imgStyle} />,
    },
  ];

  // Not started
  if (step === -1) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "48px 32px", marginBottom: 20 }}>
          <img src={SIGN_HANDS} alt="The Butterfly Sign" style={{ width: "100%", maxWidth: 200, borderRadius: 16, marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, marginBottom: 6 }}>Learn the Butterfly Sign</p>
          <p style={{ fontSize: 15, color: g.t3 }}>3 steps. 10 seconds. No words needed.</p>
        </div>
        <Btn primary onClick={() => setStep(0)} style={{ fontSize: 16 }}>Try it yourself</Btn>
      </div>
    );
  }

  // Completed
  if (step >= 3) {
    return (
      <div style={{ textAlign: "center", animation: `fadeUp .5s ${ease}` }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20 }}>
          {steps[2].hands}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginTop: 16, marginBottom: 8 }}>The Butterfly Sign</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
            {["I see you.", "I care.", "You're not alone."].map((t, i) => (
              <span key={i} style={{ fontSize: 16, fontWeight: 600, color: g.t1, animation: `fadeUp .4s ${ease} ${i * 100 + 200}ms both` }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: g.t3, marginTop: 8 }}>No language. No diagnosis. No barrier. Just two hands.</p>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn primary onClick={() => setStep(-1)} style={{ fontSize: 14 }}>Got it</Btn>
          <Btn onClick={() => setStep(0)} style={{ fontSize: 13, color: g.t3 }}>Try again</Btn>
        </div>
      </div>
    );
  }

  // Active step
  const s = steps[step];
  return (
    <div style={{ textAlign: "center" }}>
      <div key={step} style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20, animation: `fadeUp .4s ${ease}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          {s.hands}
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>Step {step + 1} of 3</p>
        <p style={{ fontSize: 20, fontWeight: 600, color: g.t1, marginBottom: 4 }}>{s.instruction}</p>
        <p style={{ fontSize: 15, color: g.t3 }}>{s.detail}</p>
      </div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i <= step ? 24 : 6, height: 6, borderRadius: 3, background: i <= step ? TEAL : g.bdr, transition: `all .4s ${ease}` }} />
        ))}
      </div>
      <Btn primary onClick={() => setStep(step + 1)} style={{ fontSize: 15, padding: "12px 28px" }}>
        {step < 2 ? "Next" : "Complete"}
      </Btn>
    </div>
  );
}

/* ── Step Tabs — How it works interactive ── */
