import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, sec, label, h2s, gradH, TRUST_IMG, CULTURE_BG, STAT_LEADERS, STAT_REACH, STAT_RAISED, ORG_SCHOOL, ORG_TEAMS, ORG_BRANDS, ALLIANCE_TOP } from '../constants/index.js';
import { ROLES, ALLIANCES, TRUST } from '../data/index.js';
import { Reveal, Btn, Link } from '../components/ui/index.js';
import { ArrowRight } from 'lucide-react';

export default function AlliancePage({ setRP, setAP, onTrust, navigate }) {
  const { t } = useTranslation();
  return (
    <div>
      {/* HERO */}
      <section data-page="alliance" style={{ minHeight: "70dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#fff", paddingTop: 0, paddingBottom: 20 }}>
        <img src={ALLIANCE_TOP} alt="" style={{ display: "block", width: "100%", height: "auto", margin: 0 }} />
        <Reveal><h1 style={{ ...gradH, fontSize: "clamp(3.4rem,7vw,6.2rem)", marginBottom: 14, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>{t('alliancePage.heroTitle')}</h1></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: 20, color: g.t2, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>{t('alliancePage.heroSub')}</p></Reveal>
      </section>

      {/* CULTURE CARRIERS */}
      <section style={sec("#fff")}><div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal><p style={label}>{t('alliancePage.rolesLabel')}</p><h2 style={{ ...h2s, marginBottom: 8 }}>{t('alliancePage.rolesTitle')}</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>{t('alliancePage.rolesSub')}</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10 }}>
          {ROLES.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.03}><button onClick={() => setRP(r)} className="card-btn" style={{ background: g.bg, border: "none", borderRadius: 16, padding: "20px 10px", textAlign: "center", cursor: "pointer", fontFamily: ff, width: "100%" }}>
              <img src={r.icon} alt={t(`popups.role.${r.id}.name`)} width="28" height="28" loading="lazy" decoding="async" style={{ width: 28, height: 28, marginBottom: 6, display: "block", marginLeft: "auto", marginRight: "auto" }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: g.t1, marginBottom: 1 }}>{t(`popups.role.${r.id}.name`)}</p>
              <p style={{ fontSize: 11, color: g.t4 }}>{t(`popups.role.${r.id}.word`)}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* ALLIANCE PARTNERS */}
      <section style={sec(g.bg)}><div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Reveal><p style={label}>{t('alliancePage.alliancesLabel')}</p><h2 style={{ ...h2s, marginBottom: 8 }}>{t('alliancePage.alliancesTitle')}</h2><p style={{ fontSize: 17, color: g.t2, marginBottom: 36 }}>{t('alliancePage.alliancesSub')}</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, gridAutoRows: "1fr", alignItems: "stretch" }}>
          {ALLIANCES.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05} style={{ height: "100%" }}><button onClick={() => setAP(a)} className="card-btn" style={{ background: "#fff", border: "none", borderRadius: 18, padding: "24px 18px", textAlign: "left", cursor: "pointer", fontFamily: ff, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
              <img src={a.icon} alt={t(`popups.alliance.${a.id}.name`)} width="28" height="28" loading="lazy" decoding="async" style={{ width: 28, height: 28, filter: a.tint, flexShrink: 0 }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: g.t1, margin: "8px 0 3px" }}>{t(`popups.alliance.${a.id}.name`)}</p>
              <p style={{ fontSize: 13, color: g.t3, margin: 0 }}>{t(`popups.alliance.${a.id}.line`)}</p>
            </button></Reveal>
          ))}
        </div>
      </div></section>

      {/* TRUST */}
      <section style={sec("#fff")}><Reveal>
        <img src={TRUST_IMG} alt={t('alliancePage.trustAlt')} width="1000" height="558" loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 480, height: "auto", display: "block", margin: "0 auto 24px", objectFit: "contain" }} />
        <p style={label}>{t('alliancePage.trustLabel')}</p>
        <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 10 }}>{t('alliancePage.trustTitle')}</h2>
        <p style={{ fontSize: 17, color: g.t2, marginBottom: 16 }}>{t('alliancePage.trustSub')}</p>
        <Link onClick={onTrust}>{t('alliancePage.viewGovernance')}</Link>
      </Reveal></section>

      {/* CULTURE — Dark bg section */}
      <section data-section="culture-dark" style={{ position: "relative", overflow: "hidden", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${CULTURE_BG})`, backgroundSize: "cover", backgroundPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.85) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", paddingTop: "10rem" }}>
          <Reveal><h2 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 40 }}>{t('alliancePage.cultureTitle')}</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: STAT_LEADERS, num: t('alliancePage.stats.leaders.num'), label: t('alliancePage.stats.leaders.label'), sub: t('alliancePage.stats.leaders.sub') },
              { icon: STAT_REACH, num: t('alliancePage.stats.reach.num'), label: t('alliancePage.stats.reach.label'), sub: t('alliancePage.stats.reach.sub') },
              { icon: STAT_RAISED, num: t('alliancePage.stats.raised.num'), label: t('alliancePage.stats.raised.label'), sub: t('alliancePage.stats.raised.sub') },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 18, padding: "28px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={s.icon} alt="" width="28" height="28" loading="lazy" decoding="async" style={{ width: 28, height: 28, display: "block", margin: "0 auto 8px", filter: "invert(70%) sepia(50%) saturate(500%) hue-rotate(120deg) brightness(110%)" }} />
                <p style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 2 }}>{s.num}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.8)", marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>🛡</span> {t('alliancePage.cultureFoundation')}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: TEAL }}>♡</span> {t('alliancePage.cultureRouted')}</span>
          </div></Reveal>
          <Reveal delay={0.2}><a href="https://onehumanity.one/" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 980, border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none", fontFamily: ff, backdropFilter: "blur(8px)", transition: "all .25s cubic-bezier(.16,1,.3,1)" }}>{t('alliancePage.ourFoundation')} <ArrowRight size={13} /></a></Reveal>
        </div>
      </section>

      {/* FOR ORGANIZATIONS */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal><p style={label}>{t('alliancePage.orgsLabel')}</p>
          <h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4.5vw,2.6rem)", marginBottom: 36 }}>{t('alliancePage.orgsTitle')}</h2></Reveal>
          <Reveal delay={0.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { icon: ORG_SCHOOL, title: t('alliancePage.orgs.schools.title'), desc: t('alliancePage.orgs.schools.desc') },
              { icon: ORG_TEAMS, title: t('alliancePage.orgs.teams.title'), desc: t('alliancePage.orgs.teams.desc') },
              { icon: ORG_BRANDS, title: t('alliancePage.orgs.brands.title'), desc: t('alliancePage.orgs.brands.desc') },
            ].map((c, i) => (
              <div key={i} className="card-btn" style={{ background: "#f5f5f5", border: "none", borderRadius: 18, padding: "28px 24px", textAlign: "left", cursor: "pointer" }}>
                <img src={c.icon} alt="" width="32" height="32" loading="lazy" decoding="async" style={{ width: 32, height: 32, marginBottom: 14, filter: "invert(45%) sepia(80%) saturate(1200%) hue-rotate(140deg) brightness(95%)" }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: g.t1, marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.55, marginBottom: 14 }}>{c.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 500, color: TEAL, display: "flex", alignItems: "center", gap: 4 }}>{t('alliancePage.learnMore')} <ArrowRight size={13} /></span>
              </div>
            ))}
          </div></Reveal>
          <Reveal delay={0.15}><div style={{ background: "linear-gradient(135deg, #e6faf5, #dff3fc)", borderRadius: 20, padding: "32px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: "1 1 400px", textAlign: "left" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: g.t1, marginBottom: 6 }}>{t('alliancePage.protocolTitle')}</h3>
              <p style={{ fontSize: 14, color: g.t2, lineHeight: 1.6 }}>{t('alliancePage.protocolDesc')}</p>
            </div>
            <Btn onClick={() => {}} style={{ fontSize: 14, padding: "10px 22px", borderColor: TEAL, color: TEAL }}>{t('alliancePage.protocolBtn')} <ArrowRight size={13} /></Btn>
          </div></Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={sec("#f5f5f7")}><Reveal><div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ ...gradH, fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: 14, background: "linear-gradient(90deg, #00B18D, #0EA5A0, #06b6d4, #2ecc71)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t('alliancePage.ctaTitle')}</h2>
        <p style={{ fontSize: 18, color: g.t2, marginBottom: 28 }}>{t('alliancePage.ctaSub')}</p>
        <Btn primary onClick={() => window.open("mailto:partners@onehumanity.org?subject=Alliance Inquiry")} style={{ fontSize: 16, padding: "12px 28px" }}>{t('alliancePage.ctaBtn')}</Btn>
      </div></Reveal></section>
    </div>
  );
}
