import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, SB_STILL, SB_VIDEO_1, SB_VIDEO_2, SB_VIDEO_3 } from '../constants/index.js';
import { Btn } from './ui/index.js';

const STEP_VIDEOS = [SB_VIDEO_1, SB_VIDEO_2, SB_VIDEO_3];

export function SignBuilder() {
  const { t } = useTranslation();
  const [step, setStep] = useState(-1);
  const ease = "cubic-bezier(.16,1,.3,1)";
  const videoRefs = [useRef(null), useRef(null), useRef(null)];

  // Preload all step videos once on mount.
  useEffect(() => {
    STEP_VIDEOS.forEach(src => { try { const v = document.createElement('video'); v.preload = 'auto'; v.src = src; } catch {} });
  }, []);

  // Restart the active video from frame 0 when its step becomes active.
  useEffect(() => {
    if (step < 0 || step > 2) return;
    const v = videoRefs[step].current;
    if (!v) return;
    try { v.currentTime = 0; v.play().catch(() => {}); } catch {}
    // Pause the others.
    videoRefs.forEach((ref, i) => { if (i !== step) { try { ref.current && ref.current.pause(); } catch {} } });
  }, [step]);

  const stepData = [
    { key: 'step1' },
    { key: 'step2' },
    { key: 'step3' },
  ].map(s => ({
    instruction: t(`signBuilder.${s.key}.instruction`),
    detail: t(`signBuilder.${s.key}.detail`),
    alt: t(`signBuilder.${s.key}.alt`),
  }));

  const cardOuter = { background: g.bg, borderRadius: 24, overflow: "hidden", maxWidth: 1196, margin: "0 auto" };
  const cardInner = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", alignItems: "stretch", minHeight: 480 };

  if (step === -1) {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="sb-card" style={cardOuter}>
          <div className="sb-card-inner" style={cardInner}>
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
              <p style={{ fontSize: 26, fontWeight: 600, color: g.t1, marginBottom: 8 }}>{t('signBuilder.intro.title')}</p>
              <p style={{ fontSize: 17, color: g.t3, marginBottom: 24 }}>{t('signBuilder.intro.sub')}</p>
              <div>
                <Btn primary onClick={() => setStep(0)} style={{ fontSize: 16 }}>{t('signBuilder.intro.start')}</Btn>
              </div>
            </div>
            <div style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
              <img src={SB_STILL} alt={t('signBuilder.done.label')} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step >= 3) {
    const lines = [t('signBuilder.done.line1'), t('signBuilder.done.line2'), t('signBuilder.done.line3')];
    return (
      <div style={{ textAlign: "center", animation: `fadeUp .5s ${ease}` }}>
        <div className="sb-card" style={cardOuter}>
          <div className="sb-card-inner" style={cardInner}>
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>{t('signBuilder.done.label')}</p>
              <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
                {lines.map((line, i) => (
                  <span key={i} style={{ fontSize: 22, fontWeight: 600, color: g.t1, animation: `fadeUp .4s ${ease} ${i * 100 + 200}ms both` }}>{line}</span>
                ))}
              </div>
              <p style={{ fontSize: 15, color: g.t3, marginBottom: 24 }}>{t('signBuilder.done.caption')}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn primary onClick={() => setStep(-1)} style={{ fontSize: 14 }}>{t('signBuilder.done.got')}</Btn>
                <Btn onClick={() => setStep(0)} style={{ fontSize: 13, color: g.t3 }}>{t('signBuilder.done.again')}</Btn>
              </div>
            </div>
            <div style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
              <img src={SB_STILL} alt={t('signBuilder.done.label')} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const s = stepData[step];
  return (
    <div style={{ textAlign: "center" }}>
      <div className="sb-card" key={step} style={{ ...cardOuter, animation: `fadeUp .4s ${ease}` }}>
        <div className="sb-card-inner" style={cardInner}>
          <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginBottom: 8 }}>{t('signBuilder.progress', { n: step + 1 })}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: g.t1, marginBottom: 6 }}>{s.instruction}</p>
            <p style={{ fontSize: 16, color: g.t3, marginBottom: 24 }}>{s.detail}</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: i <= step ? 24 : 6, height: 6, borderRadius: 3, background: i <= step ? TEAL : g.bdr, transition: `all .4s ${ease}` }} />
              ))}
            </div>
            <div>
              <Btn primary onClick={() => setStep(step + 1)} style={{ fontSize: 15, padding: "12px 28px" }}>
                {step < 2 ? t('signBuilder.next') : t('signBuilder.complete')}
              </Btn>
            </div>
          </div>
          <div style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
            {STEP_VIDEOS.map((src, i) => (
              <video
                key={i}
                ref={videoRefs[i]}
                src={src}
                muted
                playsInline
                preload="auto"
                aria-label={stepData[i].alt}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  opacity: i === step ? 1 : 0,
                  transition: `opacity .25s ${ease}`,
                  pointerEvents: "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
