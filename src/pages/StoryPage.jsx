import { g, ff, sec, wrap, label, h2s, gradH, STORY_IMG_ORIGIN, STORY_IMG_STAGE, EVENT_BG, CTA_IMG } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';
import { VisualTimeline } from '../components/index.js';

export default function StoryPage({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Where it came from.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>From a moment of crisis in 1998 to a global movement in 2026.</p></Reveal>
      </section>

      {/* ORIGIN */}
      <section style={sec("#fff")}><div style={wrap}>
        <Reveal><img src={STORY_IMG_ORIGIN} alt="Lucina Artigas guiding survivors through the butterfly hug after Hurricane Pauline" width="1376" height="768" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>The Origin</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>1998 · Hurricane Pauline</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 18 }}>Lucina Artigas was a therapist in Mexico when Hurricane Pauline devastated the coast. In the aftermath, thousands of people — many of them children — were in severe psychological trauma with nowhere to turn.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>She created a simple bilateral stimulation gesture anyone could do without a therapist present. Two hands crossed on your chest, alternating taps. She called it the butterfly hug.</p></Reveal>
        </div>
      </div></section>

      {/* SPREAD */}
      <section style={sec(g.bg)}><div style={wrap}>
        <Reveal><img src={CTA_IMG} alt="The butterfly hug spreading globally" width="2000" height="852" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>Global Adoption</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>2000–2024 · The Spread</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>The butterfly hug moved through disaster zones, refugee camps, and crisis centers globally. It became embedded in EMDR therapy, in NGO protocols, in first responder training. It worked. It was simple. It was free. And it didn't require permission.</p></Reveal>
        </div>
      </div></section>

      {/* PRINCE HARRY */}
      <section style={sec("#fff")}><div style={wrap}>
        <Reveal><img src={STORY_IMG_STAGE} alt="The butterfly hug demonstrated on a global stage" width="1376" height="768" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>The Tipping Point</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>May 2024 · The Moment</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>Prince Harry demonstrated the butterfly hug on stage. It was seen by millions. Suddenly, the gesture wasn't hidden in clinical papers anymore. It was visible. It was real. And it belonged to everyone.</p></Reveal>
        </div>
      </div></section>

      {/* THE CHALLENGE */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)" }} />
        <div style={{ position: "relative", ...wrap }}>
        <Reveal><p style={{ ...label, color: "rgba(255,255,255,.5)" }}>This Moment</p>
        <h2 style={{ fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#fff", marginBottom: 18 }}>April 2026 · The Challenge</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>We're organizing the first coordinated global moment. One night. One gesture. Visible proof that mental health care is a human right, not a luxury. That you can lead change without permission.</p></Reveal>
        </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={sec("#fff")}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>The Timeline</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>Key milestones.</h2></Reveal>
        <Reveal delay={0.1}><VisualTimeline /></Reveal>
      </div></section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>You're part of this story.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>It started with one person helping another. Join the next chapter.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>Join the Challenge</Btn>
          <Btn onClick={() => navigate('science')} style={{ fontSize: 16 }}>See the Science</Btn>
        </div>
      </div></Reveal></section>
    </div>
  );
}
