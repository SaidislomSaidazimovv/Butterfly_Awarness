import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  g,
  ff,
  TEAL,
  sec,
  wrap,
  label,
  h2s,
  gradH,
  HERO_IMG,
  EVENT_BG,
  CTA_IMG,
  SHOW_APR30_EVENT,
} from "../constants/index.js";
import { Reveal, Btn } from "../components/ui/index.js";
import {
  HighlightCarousel,
  SignBuilder,
  StepTabs,
  Chain,
  FAQ,
  CountdownTimer,
  LiveFeed,
} from "../components/index.js";
import { track } from "../utils/track.js";

export default function HomePage({
  onJoin,
  onShare,
  onRemind,
  onDidIt,
  showPlusOne,
  onUgcOpen,
  communityData,
  setRP,
  setAP,
  setTlPopup,
  entries,
  handCount,
  leaderboardData,
}) {
  const { t } = useTranslation();
  const formattedCount = (handCount || 0).toLocaleString();
  return (
    <main id="main-content">
      {/* HERO */}
      <section
        style={{
          minHeight: "90dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "linear-gradient(180deg, #C3FFEF 0%, #ffffff 30%)",
        }}
      >
        <Reveal style={{ width: "100%" }}>
          <img
            src={HERO_IMG}
            alt={t('home.heroAlt')}
            width="1900"
            height="1060"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            style={{
              width: "100%",
              maxWidth: 920,
              height: "auto",
              display: "block",
              margin: "0 auto",
              marginBottom: -70,
            }}
          />
        </Reveal>
        <div
          style={{
            padding: "0 24px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Reveal delay={0.1}>
            <p style={{ ...label, marginTop: 0 }}>{t('home.label')}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1
              style={{
                ...gradH,
                fontSize: "clamp(2.6rem,8vw,4.8rem)",
                marginBottom: 14,
              }}
            >
              {t('home.headline')}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                fontSize: 21,
                color: g.t2,
                maxWidth: 440,
                margin: "0 auto 36px",
                lineHeight: 1.45,
              }}
            >
              {t('home.subheadPart1')}
              <br />
              <em style={{ fontStyle: "normal", color: g.t1 }}>
                {t('home.subheadPart2')}
              </em>
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>
                {t('home.joinCTA')}
              </Btn>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <Btn onClick={onDidIt} style={{ fontSize: 17 }}>
                  {t('home.iDidIt')}
                </Btn>
                {showPlusOne && (
                  <span
                    style={{
                      position: "absolute",
                      top: -18,
                      right: -8,
                      color: "#32C189",
                      fontWeight: 700,
                      fontSize: 18,
                      animation: "fadeUp 0.8s ease forwards",
                      pointerEvents: "none",
                    }}
                  >
                    +1
                  </span>
                )}
              </div>
            </div>
          </Reveal>
          {handCount > 0 && (
            <Reveal delay={0.3}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 24,
                  padding: "8px 18px",
                  borderRadius: 980,
                  background: "rgba(14,165,160,.08)",
                  border: "1px solid rgba(14,165,160,.15)",
                }}
                aria-live="polite"
                aria-atomic="true"
                aria-label={t('home.handsRaisedAria', { count: formattedCount })}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: TEAL,
                    animation: "pulse 2s ease infinite",
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: g.t1 }}>
                  {t('home.handsRaised', { count: formattedCount })}
                </span>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <HighlightCarousel />

      {/* COMMUNITY FEED */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <p style={label}>{t('home.communityLabel')}</p>
            <h2
              style={{
                ...h2s,
                fontSize: "clamp(1.6rem,4vw,2.4rem)",
                marginBottom: 8,
              }}
            >
              {t('home.communityTitle')}
            </h2>
            <p style={{ fontSize: 16, color: g.t2, marginBottom: 28 }}>
              {t('home.communitySub')}
            </p>
          </Reveal>
          {communityData && communityData.length > 0 ? (
            <Reveal delay={0.1}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                {communityData.map((sub, i) => (
                  <div
                    key={sub.id || i}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      background: g.bg,
                      aspectRatio: "1",
                    }}
                  >
                    {sub.file_type === "video" ? (
                      <video
                        src={sub.file_url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onPlay={() => track("community_video_played")}
                      />
                    ) : (
                      <img
                        src={sub.file_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.1}>
              <div
                style={{
                  background: g.bg,
                  borderRadius: 20,
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 15, color: g.t3 }}>
                  {t('home.communityEmpty')}
                </p>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.15}>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Btn
                onClick={onUgcOpen}
                style={{ fontSize: 15, borderColor: TEAL, color: TEAL }}
              >
                {t('home.shareStory')}
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE SIGN */}
      <section style={sec("#fff")}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <p style={label}>{t('home.signLabel')}</p>
            <h2 style={{ ...gradH, marginBottom: 8 }}>
              {t('home.signTitle')}
            </h2>
            <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>
              {t('home.signSub')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <SignBuilder />
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={sec(g.bg)}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <Reveal>
            <p style={label}>{t('home.howLabel')}</p>
            <h2 style={{ ...h2s, marginBottom: 36 }}>
              {t('home.howTitle')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <StepTabs onJoin={onJoin} />
          </Reveal>
        </div>
      </section>

      {/* BUTTERFLY EFFECT */}
      <section style={sec("#fff")}>
        <Reveal>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <p style={label}>{t('home.effectLabel')}</p>
            <h2
              style={{
                ...h2s,
                fontSize: "clamp(1.6rem,4vw,2.4rem)",
                marginBottom: 28,
              }}
            >
              {t('home.effectTitle')}
            </h2>
            <div
              style={{
                background: g.bg,
                borderRadius: 20,
                padding: "28px 24px",
              }}
            >
              <Chain onJoin={onJoin} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* EVENT TEASER — Hidden until event is active (SHOW_APR30_EVENT) */}
      {SHOW_APR30_EVENT && (
      <section style={sec(g.bg)}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <p style={label}>{t('home.eventLabel')}</p>
            <h2
              style={{
                ...h2s,
                fontSize: "clamp(1.6rem,4vw,2.4rem)",
                marginBottom: 8,
              }}
            >
              {t('home.eventTitle')}
            </h2>
            <p style={{ fontSize: 17, color: g.t2, marginBottom: 32 }}>
              {t('home.eventSub')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CountdownTimer />
          </Reveal>
          <Reveal delay={0.15}>
            <div
              style={{
                background: "#0D1117",
                borderRadius: 20,
                padding: "36px 32px",
                marginBottom: 32,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${EVENT_BG})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.35,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.85) 100%)",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: TEAL,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: TEAL,
                    }}
                  >
                    {t('home.eventFounding')}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1.15,
                    marginBottom: 6,
                    letterSpacing: "-.02em",
                  }}
                >
                  {t('home.eventName')}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,.45)",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  {t('home.eventVenue')}
                  <br />
                  {t('home.eventReveal')}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,.3)",
                      padding: "5px 12px",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 99,
                    }}
                  >
                    {t('home.eventDate')}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,.3)",
                      padding: "5px 12px",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 99,
                    }}
                  >
                    {t('home.eventCity')}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <Btn
              primary
              onClick={() => {
                window.history.pushState({}, "", "/live");
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              style={{ fontSize: 15 }}
            >
              {t('home.viewSchedule')}
            </Btn>
          </Reveal>
        </div>
      </section>
      )}

      {/* LIVE FEED */}
      <LiveFeed
        entries={entries}
        handCount={handCount}
        leaderboardData={leaderboardData}
        onShare={onShare}
      />

      {/* FAQ */}
      <section id="faq" style={sec("#fff")}>
        <Reveal>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2
              style={{
                ...h2s,
                fontSize: "clamp(1.6rem,4vw,2.4rem)",
                marginBottom: 20,
              }}
            >
              {t('home.faqTitle')}
            </h2>
            <FAQ />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section style={{ ...sec("#f5f5f7"), paddingBottom: 80 }}>
        <Reveal>
          <img
            src={CTA_IMG}
            alt={t('home.ctaAlt')}
            width="2000"
            height="852"
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              marginBottom: 8,
            }}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              ...gradH,
              fontSize: "clamp(2rem,6vw,3.4rem)",
              marginTop: 12,
              marginBottom: 6,
            }}
          >
            {t('home.ctaHeadline')}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: 19, color: g.t2, marginBottom: 28 }}>
            {t('home.ctaSub')}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn primary onClick={onJoin} style={{ fontSize: 17 }}>
              {t('home.joinCTA')}
            </Btn>
            <Btn onClick={onRemind} style={{ fontSize: 17 }}>
              {t('home.remindMe')}
            </Btn>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
