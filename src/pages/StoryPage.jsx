import { useTranslation } from 'react-i18next';
import { g, ff, sec, wrap, label, h2s, gradH, EVENT_BG, CTA_IMG, SHOW_APR30_EVENT, STORY_ORIGIN_NEW, STORY_TIPPING_NEW, STORY_CTA_TOP } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';
import { VisualTimeline } from '../components/index.js';

export default function StoryPage({ navigate }) {
  const { t } = useTranslation();
  return (
    <div>
      <section data-page="story" style={{ minHeight: "50dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#fff" }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(3.4rem,7vw,6.2rem)", marginBottom: 14 }}>{t('story.heroTitle')}</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 28, color: g.t2, maxWidth: 720, margin: "0 auto", lineHeight: 1.5, padding: "0 20px" }} className="bc-h2-desc">{t('story.heroSub')}</p></Reveal>
      </section>

      <section style={{ padding: "0 24px 100px", background: "#fff", textAlign: "center" }}>
        <Reveal><img src={STORY_ORIGIN_NEW} alt={t('story.origin.imgAlt')} width="1376" height="768" loading="lazy" decoding="async" style={{ width: "100vw", maxWidth: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", height: "auto", display: "block", borderRadius: 0, marginBottom: 40 }} /></Reveal>
        <div style={wrap}>
        <Reveal delay={0.05}><p style={label} className="bc-label">{t('story.origin.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('story.origin.title')}</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 18 }}>{t('story.origin.p1')}</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('story.origin.p2')}</p></Reveal>
        </div>
        </div>
      </section>

      <section style={sec(g.bg)}><div style={wrap}>
        <Reveal><img src={CTA_IMG} alt={t('story.spread.imgAlt')} width="2000" height="852" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block", margin: "0 auto 40px", borderRadius: 24 }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>{t('story.spread.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('story.spread.title')}</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('story.spread.p')}</p></Reveal>
        </div>
      </div></section>

      <section style={sec("#fff")}><div style={wrap}>
        <Reveal><img src={STORY_TIPPING_NEW} alt={t('story.tipping.imgAlt')} width="1376" height="768" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", margin: "0 auto 40px" }} /></Reveal>
        <Reveal delay={0.05}><p style={label}>{t('story.tipping.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('story.tipping.title')}</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('story.tipping.p')}</p></Reveal>
        </div>
      </div></section>

      <section style={{ position: "relative", overflow: "hidden", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${EVENT_BG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)" }} />
        <div style={{ position: "relative", ...wrap }}>
        <Reveal><p style={{ ...label, color: "rgba(255,255,255,.5)" }}>{t('story.challenge.label')}</p>
        <h2 style={{ fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#fff", marginBottom: 18 }}>{t('story.challenge.title')}</h2></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={{ fontSize: 18, color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>{t('story.challenge.p')}</p></Reveal>
        </div>
        </div>
      </section>

      <section style={sec("#fff")}><div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Reveal><p style={label} className="bc-label">{t('story.timeline.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 28 }}>{t('story.timeline.title')}</h2></Reveal>
        <Reveal delay={0.1}><VisualTimeline /></Reveal>
      </div></section>

      <section data-story-cta="1" style={{ background: "#f5f5f7", textAlign: "center", padding: "0 0 180px 0" }}>
        <img src={STORY_CTA_TOP} alt="" style={{ display: "block", width: "100%", height: "auto", margin: 0 }} />
        <Reveal style={{ padding: "80px 24px 0" }}><div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,5.5vw,4.2rem)", marginBottom: 14 }}>{t('story.cta.title')}</h2>
          <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>{t('story.cta.sub')}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>{t('story.cta.join')}</Btn>
            <Btn onClick={() => navigate('science')} style={{ fontSize: 16 }}>{t('story.cta.science')}</Btn>
          </div>
        </div></Reveal>
      </section>
    </div>
  );
}
