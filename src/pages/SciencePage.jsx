import { g, ff, TEAL, sec, wrap, label, h2s, gradH, SCI_IMG_BRAIN, SCI_IMG_HANDS, SCI_IMG_SCAN, ICON_BUTTERFLY } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';

export default function SciencePage({ navigate }) {
  const sec = (bg) => ({ padding: "100px 24px", background: bg || "#fff", textAlign: "center" });
  const h2s = { fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: g.t1 };
  const gradH = { ...h2s, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" };
  const label = { fontSize: 14, fontWeight: 400, color: g.t3, marginBottom: 6 };
  const statCard = { background: g.bg, borderRadius: 16, padding: "20px 22px", textAlign: "center" };

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #E0F7FF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Why it works.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.5 }}>The neuroscience behind the butterfly hug — backed by research, used by therapists worldwide.</p></Reveal>
        <Reveal delay={0.2}><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: 600, margin: "0 auto" }}>
          {[
            { num: "WHO", sub: "Recommended treatment" },
            { num: "30+", sub: "Years of research" },
            { num: "100+", sub: "Countries using EMDR" },
          ].map((s, i) => (
            <div key={i} style={{ ...statCard, minWidth: 140, flex: "1 1 140px" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: TEAL, letterSpacing: "-.02em", marginBottom: 2 }}>{s.num}</p>
              <p style={{ fontSize: 12, color: g.t3 }}>{s.sub}</p>
            </div>
          ))}
        </div></Reveal>
      </section>

      {/* BILATERAL STIMULATION */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_BRAIN} alt="Brain hemispheres showing bilateral stimulation" width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>How Your Brain Works</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>Crossing the midline.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>When you perform the butterfly hug — alternating stimulation across your body's midline — you activate both hemispheres of your brain simultaneously. Your left side notices movement on the right. Your right notices movement on the left.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>This bilateral stimulation is how your brain processes and integrates overwhelming information. It's the same mechanism that happens during REM sleep, when your eyes move side-to-side. It helps your nervous system work through stress.</p></Reveal>
        </div>
      </div></section>

      {/* EMDR CONNECTION */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_HANDS} alt="Butterfly hug gesture with calming ripples" width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>Clinical Foundation</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>Built on EMDR science.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>Dr. Francine Shapiro developed EMDR (Eye Movement Desensitization and Reprocessing) therapy in the late 1980s. She discovered that bilateral eye movements, combined with processing traumatic memories, helped people heal from PTSD. Since then, EMDR has become a WHO-recommended treatment for post-traumatic stress.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>Lucina Artigas adapted this science. Instead of eye movements guided by a therapist, she created a self-soothing version: two hands, bilateral stimulation, no therapist needed. The butterfly hug puts clinical neuroscience in your own hands.</p></Reveal>
        </div>
      </div></section>

      {/* NEUROIMAGING */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><img src={SCI_IMG_SCAN} alt="Brain scan showing prefrontal cortex activation" width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>The Evidence</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>What brain scans show.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>fMRI studies of people using bilateral stimulation show reduced activation in the amygdala — the part of your brain that triggers fear and anxiety. At the same time, activity increases in the prefrontal cortex, the part that helps you think clearly, make rational decisions, and feel safe.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>In plain language: the butterfly hug tells your alarm system to stand down. It doesn't make the threat go away. It helps your brain recognize that, right now, in this moment, you can breathe.</p></Reveal>
        </div>
      </div></section>

      {/* PULL QUOTE */}
      <section style={sec(g.bg)}><Reveal><div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <img src={ICON_BUTTERFLY} alt="" width="40" height="40" loading="lazy" decoding="async" style={{ width: 40, height: 40, display: "block", margin: "0 auto 20px", opacity: 0.3 }} />
        <p style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 600, lineHeight: 1.3, color: g.t1, marginBottom: 12 }}>"The butterfly hug is not therapy. It's what humans do instinctively when someone is hurting. Now we know why it works."</p>
        <p style={{ fontSize: 14, color: g.t3 }}>— Clinical neuroscience literature on bilateral stimulation</p>
      </div></Reveal></section>

      {/* CLARIFICATION */}
      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a33)", borderRadius: 20, padding: "28px 28px", textAlign: "left", marginBottom: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#92400e", marginBottom: 6 }}>⚕️ Important distinction</p>
          <p style={{ fontSize: 15, color: "#78350f", lineHeight: 1.6, opacity: 0.85 }}>The butterfly hug is a grounding tool, not a replacement for therapy. If you're struggling with trauma, depression, or suicidal thoughts, please talk to a professional.</p>
        </div></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>Important Clarification</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>This is not therapy.</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>The butterfly hug is evidence-based. It's used by therapists. But performing the gesture is not the same as therapy. It's a tool. A gesture. A moment where your nervous system can find a little more calm.</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>But for the everyday moments when you're stressed, overwhelmed, or need to ground yourself? The science says: try it. Your brain will thank you.</p></Reveal>
        </div>
      </div></section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Ready to try it?</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Learn the gesture. Do the challenge. Share it with the world.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>Learn the Sign</Btn>
          <Btn onClick={() => navigate('story')} style={{ fontSize: 16 }}>Full Story</Btn>
        </div>
      </div></Reveal></section>
    </div>
  );
}
