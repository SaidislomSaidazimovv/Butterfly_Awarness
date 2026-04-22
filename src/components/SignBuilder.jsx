import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, SIGN_WOMAN1, SIGN_WOMAN2, SIGN_WOMAN3, SIGN_HANDS } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function SignBuilder() {
  const { t } = useTranslation();
  const [step, setStep] = useState(-1);
  const ease = "cubic-bezier(.16,1,.3,1)";

  useEffect(() => {
    [SIGN_WOMAN1, SIGN_WOMAN2, SIGN_WOMAN3, SIGN_HANDS].forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const imgWrap = { width: "100%", maxWidth: 240, aspectRatio: "1", margin: "0 auto", borderRadius: 16, overflow: "hidden" };
  const imgStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
  const steps = [
    { key: 'step1', src: SIGN_WOMAN1 },
    { key: 'step2', src: SIGN_WOMAN2 },
    { key: 'step3', src: SIGN_WOMAN3 },
  ].map(s => ({
    instruction: t(`signBuilder.${s.key}.instruction`),
    detail: t(`signBuilder.${s.key}.detail`),
    hands: <div style={imgWrap}><img src={s.src} alt={t(`signBuilder.${s.key}.alt`)} width="240" height="240" decoding="async" style={imgStyle} /></div>,
  }));

  if (step === -1) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "48px 32px", marginBottom: 20 }}>
          <div style={{ width: "100%", maxWidth: 200, aspectRatio: "1", margin: "0 auto 16px", borderRadius: 16, overflow: "hidden" }}>
            <img src={SIGN_HANDS} alt={t('signBuilder.done.label')} width="200" height="200" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, marginBottom: 6 }}>{t('signBuilder.intro.title')}</p>
          <p style={{ fontSize: 15, color: g.t3 }}>{t('signBuilder.intro.sub')}</p>
        </div>
        <Btn primary onClick={() => setStep(0)} style={{ fontSize: 16 }}>{t('signBuilder.intro.start')}</Btn>
      </div>
    );
  }

  if (step >= 3) {
    const lines = [t('signBuilder.done.line1'), t('signBuilder.done.line2'), t('signBuilder.done.line3')];
    return (
      <div style={{ textAlign: "center", animation: `fadeUp .5s ${ease}` }}>
        <div style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20 }}>
          {steps[2].hands}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginTop: 16, marginBottom: 8 }}>{t('signBuilder.done.label')}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
            {lines.map((line, i) => (
              <span key={i} style={{ fontSize: 16, fontWeight: 600, color: g.t1, animation: `fadeUp .4s ${ease} ${i * 100 + 200}ms both` }}>{line}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: g.t3, marginTop: 8 }}>{t('signBuilder.done.caption')}</p>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn primary onClick={() => setStep(-1)} style={{ fontSize: 14 }}>{t('signBuilder.done.got')}</Btn>
          <Btn onClick={() => setStep(0)} style={{ fontSize: 13, color: g.t3 }}>{t('signBuilder.done.again')}</Btn>
        </div>
      </div>
    );
  }

  const s = steps[step];
  return (
    <div style={{ textAlign: "center" }}>
      <div key={step} style={{ background: g.bg, borderRadius: 24, padding: "40px 32px", marginBottom: 20, animation: `fadeUp .4s ${ease}` }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          {s.hands}
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: TEAL, marginBottom: 6 }}>{t('signBuilder.progress', { n: step + 1 })}</p>
        <p style={{ fontSize: 20, fontWeight: 600, color: g.t1, marginBottom: 4 }}>{s.instruction}</p>
        <p style={{ fontSize: 15, color: g.t3 }}>{s.detail}</p>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i <= step ? 24 : 6, height: 6, borderRadius: 3, background: i <= step ? TEAL : g.bdr, transition: `all .4s ${ease}` }} />
        ))}
      </div>
      <Btn primary onClick={() => setStep(step + 1)} style={{ fontSize: 15, padding: "12px 28px" }}>
        {step < 2 ? t('signBuilder.next') : t('signBuilder.complete')}
      </Btn>
    </div>
  );
}
