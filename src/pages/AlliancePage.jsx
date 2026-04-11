import { g, ff, TEAL, sec, label, h2s, gradH, TRUST_IMG, CULTURE_BG, STAT_LEADERS, STAT_REACH, STAT_RAISED, ORG_SCHOOL, ORG_TEAMS, ORG_BRANDS } from '../constants/index.js';
import { ROLES, ALLIANCES, TRUST } from '../data/index.js';
import { Reveal, Btn, Link } from '../components/ui/index.js';
import { ArrowRight } from 'lucide-react';

export default function AlliancePage({ setRP, setAP, onTrust, navigate }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>Who's showing up.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>The leaders, partners, and carriers making this real.</p></Reveal>
      </section>

      {/* CULTURE CARRIERS */}
      <section style={sec("#fff")}><div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal><p style={label}>How the World Shows Up</p><h2 style={{ ...h2s, marginBottom: 8 }}>Every role. Every alliance.</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>Tap any role to learn more.</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
          {ROLES.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.03}><button onClick={() => setRP(r)} className="card-btn" style={{ background: g.bg, border: "none", borderRadius: 16, padding: "20px 10px", textAlign: "center", cursor: "pointer", fontFamily: ff, width: "100%" }}>
              <img src={r.icon} alt={r.name} style={{ width: 28, height: 28, marginBottom: 6, display: "block", marginLeft: "auto", marginRight: "auto" }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: g.t1, marginBottom: 1 }}>{r.name}</p>
              <p style={{ fontSize: 11, color: g.t4 }}>{r.word}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* ALLIANCE PARTNERS */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal><p style={label}>Alliance Partners</p><h2 style={{ ...h2s, marginBottom: 8 }}>A billion hands need a road.</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>Six founding categories. Tap to see the brief.</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {ALLIANCES.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.05}><button onClick={() => setAP(a)} className="card-btn" style={{ background: "#fff", border: "none", borderRadius: 18, padding: "24px 18px", textAlign: "left", cursor: "pointer", fontFamily: ff, width: "100%" }}>
              <img src={a.icon} alt={a.name} style={{ width: 28, height: 28, filter: a.tint }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: g.t1, margin: "8px 0 3px" }}>{a.name}</p>
              <p style={{ fontSize: 13, color: g.t3 }}>{a.line}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* TRUST */}
      <section style={sec("#fff")}><Reveal>
        <img src={TRUST_IMG} alt="Trust & governance" style={{ width: "100%", maxWidth: 480, display: "block", margin: "0 auto 24px", objectFit: "contain" }} />
        <p style={label}>Why Trust This</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 10 }}>Built to be trusted.</h2>
        <p style={{ fontSize: 17, color: g.t2, marginBottom: 16 }}>501(c)(3) nonprofit · 100% to mental health · Free forever</p>
        <Link onClick={onTrust}>View governance</Link>
      </Reveal></section>

      {/* CULTURE — Dark bg section */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${CULTURE_BG})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.85) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", paddingTop: "10rem" }}>
          <Reveal><h2 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 40 }}>Built by people who've moved culture.</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: STAT_LEADERS, num: "1,000+", label: "Leaders gathered", sub: "Bel-Air 2024" },
              { icon: STAT_REACH, num: "47M", label: "People reached", sub: "110+ media placements" },
              { icon: STAT_RAISED, num: "$220M", label: "Raised by this same mechanic", sub: "Ice Bucket Challenge 2014" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 18, padding: "28px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={s.icon} alt="" style={{ width: 28, height: 28, display: "block", margin: "0 auto 8px", filter: "invert(70%) sepia(50%) saturate(500%) hue-rotate(120deg) brightness(110%)" }} />
                <p style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 2 }}>{s.num}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.8)", marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>🛡</span> One Humanity Foundation · 501(c)(3)</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>♡</span> Routed to 988 — Suicide & Crisis Lifeline</span>
          </div></Reveal>
          <Reveal delay={0.2}><a href="https://onehumanity.one/" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 980, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: ff, backdropFilter: "blur(8px)", transition: "all .25s cubic-bezier(.16,1,.3,1)" }}>Our Foundation <ArrowRight size={13} /></a></Reveal>
        </div>
      </section>

      {/* FOR ORGANIZATIONS */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><p style={label}>For Workplaces, Schools & Organizations</p>
          <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4.5vw,2.6rem)", marginBottom: 36 }}>Bring this to your community</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { icon: ORG_SCHOOL, title: "For Schools", desc: "Classroom guides, assembly slides, and parent resources. COPPA compliant." },
              { icon: ORG_TEAMS, title: "For Teams", desc: "Manager briefings, all-hands templates, and EAP integration." },
              { icon: ORG_BRANDS, title: "For Brands", desc: "Participation guidelines, asset kits, and partnership opportunities." },
            ].map((c, i) => (
              <div key={i} className="card-btn" style={{ background: "#f5f5f5", border: "none", borderRadius: 18, padding: "28px 24px", textAlign: "left", cursor: "pointer" }}>
                <img src={c.icon} alt="" style={{ width: 32, height: 32, marginBottom: 14, filter: "invert(45%) sepia(80%) saturate(1200%) hue-rotate(140deg) brightness(95%)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: g.t1, marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 500, color: TEAL, display: "flex", alignItems: "center", gap: 4 }}>Learn more <ArrowRight size={13} /></span>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ background: "linear-gradient(135deg, #e6faf5, #dff3fc)", borderRadius: 20, padding: "32px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: "1 1 400px", textAlign: "left" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: g.t1, marginBottom: 6 }}>The Butterfly Protocol</h3>
              <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.6 }}>The gesture teaches recognition. The Butterfly Protocol teaches response. A free, 30-second check-in script your managers can deploy in one week. Compliant with OSHA, ADA, and HIPAA boundaries.</p>
            </div>
            <Btn onClick={() => {}} style={{ fontSize: 14, padding: "10px 22px", borderColor: TEAL, color: TEAL }}>Learn About the Protocol <ArrowRight size={13} /></Btn>
          </div></Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Your organization can lead.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Join the alliance. Shape the movement.</p>
        <Btn primary onClick={() => window.open("mailto:partners@onehumanity.org?subject=Alliance Inquiry")} style={{ fontSize: 16, padding: "12px 28px" }}>Join as an Organization</Btn>
      </div></Reveal></section>
    </div>
  );
}
