import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, sec, label, h2s, gradH, EVENT_BG, SHOW_APR30_EVENT, LIVE_HERO_BG } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';
import { CountdownTimer, TimelineViz, LiveFeed } from '../components/index.js';
import { track } from '../utils/track.js';

export default function LivePage({ entries, setTlPopup, onShare, handCount, leaderboardData }) {
  const { t } = useTranslation();
  useEffect(() => { track('leaderboard_viewed'); }, []);
  return (
    <div>
      <section data-page="live" style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", backgroundImage: `url(${LIVE_HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", padding: 20, position: "relative" }}>
        <Reveal><h1 style={{ ...h2s, fontSize: "clamp(3.4rem,7vw,6.2rem)", marginBottom: 14, color: "#fff" }}>{t('livePage.heroTitle')}</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: "#fff", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.5 }}>{t('livePage.heroSub')}</p></Reveal>
        {SHOW_APR30_EVENT && <Reveal delay={0.15}><CountdownTimer /></Reveal>}
      </section>

      <section style={sec(g.bg)}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label} className="bc-label">{t('livePage.scheduleLabel')}</p>
        <h2 style={{ ...h2s, marginBottom: 28 }}>{t('livePage.scheduleTitle')}</h2></Reveal>

        <Reveal delay={0.1}><div style={{
          background: "#0D1117", borderRadius: 20, padding: "36px 32px", marginBottom: 32, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: TEAL, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL }}>{t('livePage.foundingEvent')}</span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.15, marginBottom: 6, letterSpacing: "-.02em", textAlign: "left" }}>{t('livePage.eventName')}</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 16, lineHeight: 1.5, textAlign: "left" }}>{t('livePage.eventVenue')}<br />{t('livePage.eventReveal')}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>{t('livePage.eventDate')}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)", padding: "5px 12px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 99 }}>{t('livePage.eventCity')}</span>
            </div>
          </div>
        </div></Reveal>

        <Reveal delay={0.2}><TimelineViz onEventClick={setTlPopup} /></Reveal>
      </div></section>

      <LiveFeed entries={entries} handCount={handCount} leaderboardData={leaderboardData} />

      <section data-live-cta="1" style={{ background: "#f5f5f7", textAlign: "center", padding: "0 0 180px 0" }}>
        <img src="/han.webp" alt="" style={{ display: "block", width: "100%", height: "auto", margin: 0 }} />
        <Reveal style={{ padding: "80px 24px 0" }}><div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t('livePage.ctaTitle')}</h2>
          <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>{t('livePage.ctaSub')}</p>
          <Btn primary onClick={onShare} style={{ fontSize: 16, padding: "12px 28px" }}>{t('livePage.ctaBtn')}</Btn>
        </div></Reveal>
      </section>
    </div>
  );
}
