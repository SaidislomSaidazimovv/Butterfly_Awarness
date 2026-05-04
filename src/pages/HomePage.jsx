import { useEffect, useState } from "react";
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
  BE_DECOR_BG,
  FAQ_TOP_IMG,
  HOME_CTA_NEW,
  HERO_NEW,
  HERO_NEW_MOBILE,
  ORANGE,
  HAND_RAISE_BOOST,
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
  TutorialModal,
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
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const formattedCount = (handCount || 0).toLocaleString();
  return (
    <main id="main-content">
      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      {/* HERO — rebuilt per design skin */}
      <section
        data-hero-rebuilt="1"
        style={{
          position: "relative",
          minHeight: "90dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "center",
          background: "#fff",
          overflow: "visible",
          paddingTop: 72,
          paddingBottom: 48,
        }}
      >
        <div data-hero-content="1" style={{ padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <span data-hero-pill="1" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 999, color: "rgb(81,81,81)", fontWeight: 600, fontSize: 28, letterSpacing: "-0.01em" }}>
              {t('home.heroPill')}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 data-hero-h1="1" style={{ color: "#000", fontSize: "clamp(3rem,9vw,6.5rem)", fontWeight: 550, lineHeight: 1, letterSpacing: "-0.055em", margin: "6px 0 22px" }}>
              {t('home.headline')}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p data-hero-sub="1" style={{ fontSize: "clamp(18px,1.5vw,22px)", color: "rgb(134,134,139)", fontWeight: 500, margin: "0 0 6px", lineHeight: 1.4 }}>
              {t('home.subheadPart1')}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p data-hero-sub="1" style={{ fontSize: "clamp(18px,1.5vw,22px)", color: "#000", fontWeight: 600, margin: "0 0 34px", lineHeight: 1.4 }}>
              {t('home.subheadPart2')}
            </p>
          </Reveal>
        </div>

        <div data-hero-bottom="1" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: 1 }}>
          <Reveal delay={0.25}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                data-hero-action="join"
                onClick={onJoin}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "15px 32px", borderRadius: 980, fontSize: 17, fontWeight: 600,
                  fontFamily: ff, border: "none",
                  background: "rgb(255,139,51)", color: "#fff",
                  cursor: "pointer", transition: ".25s cubic-bezier(.16,1,.3,1)", outline: "none",
                }}
              >
                {t('home.joinCTA')}
              </button>
              <div style={{ position: "relative", display: "inline-flex" }}>
                <button
                  data-hero-action="didit"
                  onClick={onDidIt}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "15px 32px", borderRadius: 980, fontSize: 17, fontWeight: 600,
                    fontFamily: ff, border: "1px solid " + g.bdr,
                    background: "#fff", color: g.t1,
                    cursor: "pointer", transition: ".25s cubic-bezier(.16,1,.3,1)", outline: "none",
                  }}
                >
                  {t('home.iDidIt')}
                </button>
                {showPlusOne && (
                  <span
                    style={{
                      position: "absolute", top: -18, right: -8,
                      color: "#32C189", fontWeight: 700, fontSize: 18,
                      animation: "fadeUp 0.8s ease forwards", pointerEvents: "none",
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
              <span
                data-hero-counter="1"
                aria-live="polite"
                aria-atomic="true"
                aria-label={t('home.handsRaisedAria', { count: formattedCount })}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "7px 16px", borderRadius: 999,
                  background: "transparent", color: "#000",
                  fontWeight: 600, fontSize: 14,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 4, background: ORANGE, display: "inline-block" }} />
                {t('home.handsRaised', { count: formattedCount })}
              </span>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.35} style={{ width: "100%" }}>
          <div data-hero-img-wrap="1" style={{ width: "100%" }}>
            <picture>
              <source media="(max-width: 768px)" srcSet={HERO_NEW_MOBILE} />
              <img
                src={HERO_NEW}
                alt={t('home.heroAlt')}
                data-hero-swap="1"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{ width: "100%", display: "block", marginTop: -50, pointerEvents: "none" }}
              />
            </picture>
          </div>
        </Reveal>
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
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
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
      <section id="how-it-works" style={{ ...sec(g.bg), background: g.bg }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <Reveal>
            <p style={label} className="bc-label">{t('home.howLabel')}</p>
            <h2 style={{ ...h2s, marginBottom: 18 }}>
              {t('home.howTitle')}
            </h2>
            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", border: "none", padding: 0,
                color: "#0EA5A0", fontFamily: ff, fontSize: 16, fontWeight: 600,
                cursor: "pointer", marginBottom: 36,
              }}
            >
              <span style={{ textDecoration: "underline", textUnderlineOffset: 4, textDecorationThickness: 1.5 }}>
                {t('home.watchTutorial')}
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5 3l8 5-8 5V3z" />
              </svg>
            </button>
          </Reveal>
          <Reveal delay={0.1}>
            <StepTabs onJoin={onJoin} />
          </Reveal>
        </div>
      </section>

      {/* BUTTERFLY EFFECT */}
      <section style={{ position: "relative", overflow: "hidden", padding: "250px 24px", textAlign: "center", background: "#fff" }}>
        <img src={BE_DECOR_BG} alt="" aria-hidden="true" className="be-decor" style={{ position: "absolute", top: "30%", left: 0, right: 0, width: "100%", height: "auto", pointerEvents: "none", zIndex: 0, display: "block", objectFit: "contain" }} />
        <Reveal style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <p style={label} className="bc-label">{t('home.effectLabel')}</p>
            <h2 style={{ ...h2s, marginBottom: 28 }}>
              {t('home.effectTitle')}
            </h2>
            <div style={{ background: "#f5f5f7", borderRadius: 20, padding: "28px 24px", height: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
      <section id="faq" style={{ background: "linear-gradient(to top, #f5f5f7 0%, #ffffff 100%)", padding: "0 0 250px 0", textAlign: "center" }}>
        <img src={FAQ_TOP_IMG} alt="" aria-hidden="true" style={{ display: "block", width: "100%", height: "auto", margin: 0 }} />
        <Reveal style={{ padding: "0 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ ...h2s, marginBottom: 20 }}>
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
            src={HOME_CTA_NEW}
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
              fontSize: "clamp(2rem,5.5vw,4.2rem)",
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
