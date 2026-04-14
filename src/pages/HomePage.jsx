import { useEffect } from 'react';
import { g, ff, TEAL, sec, wrap, label, h2s, gradH, HERO_IMG, EVENT_BG, CTA_IMG } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';
import { HighlightCarousel, SignBuilder, StepTabs, Chain, FAQ, CountdownTimer, LiveFeed } from '../components/index.js';
import { track } from '../utils/track.js';

export default function HomePage({ onJoin, onShare, onRemind, onDidIt, showPlusOne, onUgcOpen, communityData, setRP, setAP, setTlPopup, entries, handCount, leaderboardData }) {
  return (
    <main id="main-content">
      {/* HERO */}
      <section style={{ minHeight: "90dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 30%)" }}>
        <Reveal style={{ width: "100%" }}><img src={HERO_IMG} alt="Two people making the Butterfly Sign" width="1900" height="1060" loading="eager" fetchpriority="high" decoding="async" style={{ width: "100%", maxWidth: 920, height: "auto", display: "block", margin: "0 auto", marginBottom: -70 }} /></Reveal>
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Reveal delay={0.1}><p style={{ ...label, marginTop: 0 }}>Butterfly Challenge</p></Reveal>
          <Reveal delay={0.15}><h1 style={{ ...gradH, fontSize: "clamp(2.6rem,8vw,4.8rem)", marginBottom: 14 }}>Lift a billion hands.</h1></Reveal>
          <Reveal delay={0.2}><p style={{ fontSize: 21, color: g.t2, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.45 }}>A 60‑second gesture for mental health.<br /><em style={{ fontStyle: "normal", color: g.t1 }}>Feel it. Do it. Share it.</em></p></Reveal>
          <Reveal delay={0.25}><div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>Join the Challenge</Btn>
            <div style={{ position: "relative", display: "inline-flex" }}>
              <Btn onClick={onDidIt} style={{ fontSize: 17 }}>I did it</Btn>
              {showPlusOne && <span style={{ position: "absolute", top: -18, right: -8, color: "#32C189", fontWeight: 700, fontSize: 18, animation: "fadeUp 0.8s ease forwards", pointerEvents: "none" }}>+1</span>}
            </div>
          </div></Reveal>
          {handCount > 0 && (
            <Reveal delay={0.3}><div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, padding: "8px 18px", borderRadius: 980, background: "rgba(14,165,160,.08)", border: "1px solid rgba(14,165,160,.15)" }} aria-live="polite" aria-atomic="true" aria-label={`${handCount.toLocaleString()} hands raised worldwide`}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: g.t1 }}>{handCount.toLocaleString()} hands raised</span>
            </div></Reveal>
          )}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <HighlightCarousel />

      {/* COMMUNITY FEED */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><p style={label}>From The Community</p>
          <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 8 }}>Doing it together.</h2>
          <p style={{ fontSize: 16, color: g.t2, marginBottom: 28 }}>Real people. Real stories.</p></Reveal>
          {communityData && communityData.length > 0 ? (
            <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {communityData.map((sub, i) => (
                <div key={sub.id || i} style={{ borderRadius: 16, overflow: "hidden", background: g.bg, aspectRatio: "1" }}>
                  {sub.file_type === 'video' ? (
                    <video src={sub.file_url} autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} onPlay={() => track('community_video_played')} />
                  ) : (
                    <img src={sub.file_url} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div></Reveal>
          ) : (
            <Reveal delay={0.1}><div style={{ background: g.bg, borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 15, color: g.t3 }}>Be the first to share your butterfly moment.</p>
            </div></Reveal>
          )}
          <Reveal delay={0.15}><div style={{ marginTop: 20, textAlign: "center" }}>
            <Btn onClick={onUgcOpen} style={{ fontSize: 15, borderColor: TEAL, color: TEAL }}>Share Your Story</Btn>
          </div></Reveal>
        </div>
      </section>

      {/* THE SIGN */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal><p style={label}>The Sign</p>
          <h2 style={{ ...gradH, marginBottom: 8 }}>Two hands. One signal.</h2>
          <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>The first universal gesture for mental health. Try it.</p></Reveal>
          <Reveal delay={0.1}><SignBuilder /></Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={sec(g.bg)}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal><p style={label}>How It Works</p>
          <h2 style={{ ...h2s, marginBottom: 36 }}>Three steps. One minute.</h2></Reveal>
          <Reveal delay={0.1}><StepTabs onJoin={onJoin} /></Reveal>
        </div>
      </section>

      {/* BUTTERFLY EFFECT */}
      <section style={sec("#fff")}><Reveal><div style={{ maxWidth: 420, margin: "0 auto" }}>
        <p style={label}>The Butterfly Effect</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>See how 1 becomes 1 billion.</h2>
        <div style={{ background: g.bg, borderRadius: 20, padding: "28px 24px" }}><Chain onJoin={onJoin} /></div>
      </div></Reveal></section>

      {/* EVENT TEASER */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>Already in Motion</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 8 }}>April 30. Miami.</h2>
        <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>Where it all begins.</p></Reveal>
        <Reveal delay={0.1}><CountdownTimer /></Reveal>
        <Reveal delay={0.15}><div style={{
          background: "#0D1117", borderRadius: 20, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL }}>Founding Event</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 6, letterSpacing: "-.02em" }}>One Night For<br />One Humanity</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 16, lineHeight: 1.5 }}>Queen Miami Beach · Miami Grand Prix Weekend<br />The Hero Act — revealed live.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>April 30, 2026</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>Miami, FL</span>
            </div>
          </div>
        </div></Reveal>
        <Reveal delay={0.2}><Btn primary onClick={() => { window.history.pushState({}, '', '/live'); window.scrollTo({ top: 0, behavior: 'smooth' }); window.dispatchEvent(new PopStateEvent('popstate')); }} style={{ fontSize: 15 }}>View Full Schedule</Btn></Reveal>
      </div></section>

      {/* LIVE FEED */}
      <LiveFeed entries={entries} handCount={handCount} leaderboardData={leaderboardData} onShare={onShare} />

      {/* FAQ */}
      <section id="faq" style={sec("#fff")}><Reveal><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 20 }}>Questions.</h2>
        <FAQ />
      </div></Reveal></section>

      {/* CTA */}
      <section style={{ ...sec("#f5f5f7"), paddingBottom: 80 }}>
        <Reveal><img src={CTA_IMG} alt="Hundreds of people doing the Butterfly Sign" width="2000" height="852" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", marginBottom: 8 }} /></Reveal>
        <Reveal delay={0.1}><h2 style={{ ...gradH, fontSize: "clamp(2rem,6vw,3.4rem)", marginTop: 12, marginBottom: 6 }}>60 seconds.</h2></Reveal>
        <Reveal delay={0.15}><p style={{ fontSize: 19, color: g.t2, marginBottom: 28 }}>Be the person who showed up.</p></Reveal>
        <Reveal delay={0.2}><div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>Join the Challenge</Btn>
          <Btn onClick={onRemind} style={{ fontSize: 17 }}>Remind Me May 1</Btn>
        </div></Reveal>
      </section>
    </main>
  );
}
