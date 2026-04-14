import { useEffect } from 'react';
import { g, ff, TEAL, sec, label, h2s, gradH, EVENT_BG } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';
import { CountdownTimer, TimelineViz, LiveFeed } from '../components/index.js';
import { track } from '../utils/track.js';

export default function LivePage({ entries, setTlPopup, onShare, handCount, leaderboardData }) {
  useEffect(() => { track('leaderboard_viewed'); }, []);
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 50%)" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(2.4rem,7vw,4.2rem)", marginBottom: 14 }}>April 30. Queen Miami Beach.</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.5 }}>The founding event. The moment it all begins.</p></Reveal>
        <Reveal delay={0.15}><CountdownTimer /></Reveal>
      </section>

      {/* SCHEDULE */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label}>What's Happening</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 28 }}>The full schedule.</h2></Reveal>

        {/* Event Card */}
        <Reveal delay={0.1}><div style={{
          background: "#0D1117", borderRadius: 20, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL }}>Founding Event</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 6, letterSpacing: "-.02em", textAlign: "left" }}>One Night For<br />One Humanity</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 16, lineHeight: 1.5, textAlign: "left" }}>Queen Miami Beach · Miami Grand Prix Weekend<br />The Hero Act — revealed live.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>April 30, 2026</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>Miami, FL</span>
            </div>
          </div>
        </div></Reveal>

        {/* Timeline */}
        <Reveal delay={0.2}><TimelineViz onEventClick={setTlPopup} /></Reveal>
      </div></section>

      {/* LIVE ENTRIES */}
      <LiveFeed entries={entries} handCount={handCount} leaderboardData={leaderboardData} onShare={onShare} />

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>Be part of this moment.</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>Join the founding event. Share your butterfly.</p>
        <Btn primary onClick={onShare} style={{ fontSize: 16, padding: "12px 28px" }}>Share Your Moment</Btn>
      </div></Reveal></section>
    </div>
  );
}

/* ── Reminder Component ── */
