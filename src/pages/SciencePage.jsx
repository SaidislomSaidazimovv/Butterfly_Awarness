import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, ICON_BUTTERFLY, SCI_BRAIN_NEW, SCI_HANDS_NEW, SCI_SCAN_NEW } from '../constants/index.js';
import { Reveal, Btn } from '../components/ui/index.js';

export default function SciencePage({ navigate }) {
  const { t } = useTranslation();
  const sec = (bg) => ({ padding: "100px 24px", background: bg || "#fff", textAlign: "center" });
  const h2s = { fontSize: "clamp(2rem,5.5vw,3.2rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, color: g.t1 };
  const gradH = { ...h2s, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" };
  const label = { fontSize: 14, fontWeight: 400, color: g.t3, marginBottom: 6 };
  const statCard = { background: g.bg, borderRadius: 16, padding: "20px 22px", textAlign: "center" };
  const stats = [
    { num: t('science.stats.who.num'), sub: t('science.stats.who.sub') },
    { num: t('science.stats.years.num'), sub: t('science.stats.years.sub') },
    { num: t('science.stats.countries.num'), sub: t('science.stats.countries.sub') },
  ];

  return (
    <div>
      <section data-page="science" style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#fff", padding: 20 }}>
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(3.4rem,7vw,6.2rem)", marginBottom: 14 }}>{t('science.heroTitle')}</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.5 }}>{t('science.heroSub')}</p></Reveal>
        <Reveal delay={0.2}><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: 600, margin: "0 auto" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ ...statCard, minWidth: 140, flex: "1 1 140px" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: TEAL, letterSpacing: "-.02em", marginBottom: 2 }}>{s.num}</p>
              <p style={{ fontSize: 12, color: g.t3 }}>{s.sub}</p>
            </div>
          ))}
        </div></Reveal>
      </section>

      {/* Brain — 2-column on desktop, image LEFT */}
      <section style={{ padding: "180px 24px", background: "#fff", textAlign: "center" }}><div className="sci-2col" style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", alignItems: "center", columnGap: 48 }}>
        <Reveal><img src={SCI_BRAIN_NEW} alt={t('science.brain.imgAlt')} width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", margin: 0 }} /></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label} className="bc-label">{t('science.brain.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('science.brain.title')}</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>{t('science.brain.p1')}</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('science.brain.p2')}</p></Reveal>
        </div>
      </div></section>

      {/* Clinical Foundation — full-bleed image at top, centered text */}
      <section style={{ padding: "0 24px 180px", background: g.bg, textAlign: "center" }}>
        <Reveal><img src={SCI_HANDS_NEW} alt={t('science.emdr.imgAlt')} width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100vw", maxWidth: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", marginTop: 0, marginBottom: 40, borderRadius: 0, height: "auto", display: "block" }} /></Reveal>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal delay={0.1}><p style={label} className="bc-label">{t('science.emdr.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('science.emdr.title')}</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>{t('science.emdr.p1')}</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('science.emdr.p2')}</p></Reveal>
        </div>
      </section>

      {/* Evidence — 2-column on desktop, text LEFT (col 1), image RIGHT (col 2) */}
      <section data-section="evidence" style={{ padding: "180px 24px", background: "#fff", textAlign: "center" }}><div className="sci-2col-mirror" style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)", alignItems: "center", columnGap: 48 }}>
        <div style={{ textAlign: "left", gridColumn: 1 }}>
        <Reveal delay={0.1}><p style={label} className="bc-label">{t('science.neuro.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('science.neuro.title')}</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>{t('science.neuro.p1')}</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('science.neuro.p2')}</p></Reveal>
        </div>
        <Reveal style={{ gridColumn: 2 }}><img src={SCI_SCAN_NEW} alt={t('science.neuro.imgAlt')} width="1024" height="1024" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", margin: 0 }} /></Reveal>
      </div></section>

      <section style={sec(g.bg)}><Reveal><div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <img src={ICON_BUTTERFLY} alt="" width="40" height="40" loading="lazy" decoding="async" style={{ width: 40, height: 40, display: "block", margin: "0 auto 20px", opacity: 0.3 }} />
        <p style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 600, lineHeight: 1.3, color: g.t1, marginBottom: 12 }}>&ldquo;{t('science.quote.text')}&rdquo;</p>
        <p style={{ fontSize: 14, color: g.t3 }}>{t('science.quote.attribution')}</p>
      </div></Reveal></section>

      <section style={sec("#fff")}><div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Reveal><div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a33)", borderRadius: 20, padding: "28px 28px", textAlign: "left", marginBottom: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#92400e", marginBottom: 6 }}>{t('science.disclaimer.badge')}</p>
          <p style={{ fontSize: 15, color: "#78350f", lineHeight: 1.6, opacity: 0.85 }}>{t('science.disclaimer.text')}</p>
        </div></Reveal>
        <div style={{ textAlign: "left" }}>
        <Reveal delay={0.1}><p style={label}>{t('science.disclaimer.label')}</p>
        <h2 style={{ ...h2s, marginBottom: 18 }}>{t('science.disclaimer.title')}</h2>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8, marginBottom: 24 }}>{t('science.disclaimer.p1')}</p>
        <p style={{ fontSize: 18, color: g.t2, lineHeight: 1.8 }}>{t('science.disclaimer.p2')}</p></Reveal>
        </div>
      </div></section>

      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14 }}>{t('science.cta.title')}</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>{t('science.cta.sub')}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Btn primary onClick={() => navigate('')} style={{ fontSize: 16 }}>{t('science.cta.learn')}</Btn>
          <Btn onClick={() => navigate('story')} style={{ fontSize: 16 }}>{t('science.cta.fullStory')}</Btn>
        </div>
      </div></Reveal></section>
    </div>
  );
}
