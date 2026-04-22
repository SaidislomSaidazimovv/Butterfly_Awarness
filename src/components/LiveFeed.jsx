import { useTranslation } from 'react-i18next';
import { g, TEAL, ICON_BUTTERFLY, sec, label, h2s } from '../constants/index.js';
import { Reveal, Btn } from './ui/index.js';
import { Globe } from './Globe.jsx';
import { relT } from '../utils/helpers.js';

export function LiveFeed({ entries = [], handCount, leaderboardData, onShare }) {
  const { t } = useTranslation();
  const count = (handCount || entries.length).toLocaleString();
  return (
    <section style={sec("#fff")}>
      <Reveal><p style={label}>{t('live.label')}</p><h2 style={{ ...h2s, fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: 4 }}>{t('live.title')}</h2><p style={{ fontSize: 14, color: g.t4, marginBottom: 28 }}>{t('live.participants', { count })}</p></Reveal>
      <Reveal delay={0.1}><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, maxWidth: 640, margin: "0 auto", alignItems: "start" }}>
        <Globe entries={entries} />
        <div style={{ flex: "1 1 180px", maxWidth: 240, textAlign: "left" }}>
          {entries.slice(0, 8).map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
              <img src={ICON_BUTTERFLY} alt="" style={{ width: 11, height: 11 }} />
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.city ? e.city + ", " : ""}{e.country}</span>
              <span style={{ fontSize: 11, color: g.t4 }}>{relT(e.createdAt)}</span>
            </div>
          ))}
        </div>
      </div></Reveal>
      {leaderboardData && (leaderboardData.countries?.length > 0 || leaderboardData.cities?.length > 0 || leaderboardData.participants?.length > 0) && (
        <Reveal delay={0.15}><div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 960, margin: "28px auto 0" }}>
          {leaderboardData.countries?.length > 0 && (
            <div style={{ flex: "1 1 200px", maxWidth: 280, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: g.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>{t('live.topCountries')}</p>
              {leaderboardData.countries.slice(0, 5).map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{c.country_code}</span>
                  <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{c.count?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          {leaderboardData.cities?.length > 0 && (
            <div style={{ flex: "1 1 200px", maxWidth: 280, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: g.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>{t('live.topCities')}</p>
              {leaderboardData.cities.slice(0, 5).map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{c.city}</span>
                  <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{c.count?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          {leaderboardData.participants?.length > 0 && (
            <div style={{ flex: "1 1 200px", maxWidth: 280, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: g.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>{t('live.topParticipants')}</p>
              {leaderboardData.participants.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 4 ? "1px solid #f0f0f0" : "none" }}>
                  {p.avatar ? (
                    <img src={p.avatar} alt="" width="22" height="22" referrerPolicy="no-referrer" decoding="async" style={{ width: 22, height: 22, borderRadius: 11, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: TEAL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{(p.name || 'U')[0].toUpperCase()}</div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: TEAL, fontWeight: 600 }}>{p.count?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div></Reveal>
      )}
      {onShare && <Reveal delay={0.2}><div style={{ marginTop: 24 }}><Btn primary onClick={onShare} style={{ fontSize: 15 }}>{t('live.shareMoment')}</Btn></div></Reveal>}
    </section>
  );
}
