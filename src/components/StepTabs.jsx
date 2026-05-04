import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff, TEAL, ORANGE, HOW_IMG_1, HOW_IMG_2, HOW_IMG_3 } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function StepTabs({ onJoin }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const ease = "cubic-bezier(.16,1,.3,1)";

  useEffect(() => {
    [HOW_IMG_1, HOW_IMG_2, HOW_IMG_3].forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const steps = [
    { key: 'step1', img: HOW_IMG_1 },
    { key: 'step2', img: HOW_IMG_2 },
    { key: 'step3', img: HOW_IMG_3 },
  ].map(s => ({
    img: s.img,
    num: t(`stepTabs.${s.key}.num`),
    title: t(`stepTabs.${s.key}.title`),
    heading: t(`stepTabs.${s.key}.heading`),
    body: t(`stepTabs.${s.key}.body`),
    tip: t(`stepTabs.${s.key}.tip`),
  }));

  const s = steps[active];

  return (
    <div className="hiw-2col" style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gridTemplateRows: "auto 1fr auto auto 1fr",
      columnGap: 32,
      alignItems: "stretch",
    }}>
      {/* Tab bar — pill, spans both columns */}
      <div style={{
        gridColumn: "1 / -1",
        display: "flex", gap: 6,
        background: "#f5f5f7", border: "none", borderRadius: 999,
        padding: 6,
        overflow: "visible",
        marginBottom: 28,
      }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: "12px 16px", border: "none", fontFamily: ff,
            background: active === i ? "#fff" : "transparent",
            cursor: "pointer", borderRadius: 999,
            transition: `background .25s ${ease}, color .25s ${ease}`,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: active === i ? TEAL : g.t4, transition: `color .3s ${ease}`, marginBottom: 2 }}>{st.num}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: active === i ? g.t1 : g.t3, transition: `color .3s ${ease}` }}>{st.title}</p>
          </button>
        ))}
      </div>

      {/* Image — left column, spans rows 2–5 */}
      <img
        key={'img-' + active}
        src={s.img}
        alt=""
        loading="eager"
        decoding="async"
        style={{
          gridColumn: 1, gridRow: "2 / 6",
          width: "100%", height: "100%", maxWidth: "100%",
          margin: 0, objectFit: "cover", objectPosition: "center",
          borderRadius: 24, display: "block",
          animation: `fadeUp .4s ${ease}`,
        }}
      />

      {/* Inner content (heading/body/tip) — right column, row 3 */}
      <div key={'body-' + active} style={{
        gridColumn: 2, gridRow: 3,
        background: "#fff", borderRadius: 24, padding: 28,
        alignSelf: "end",
        animation: `fadeUp .4s ${ease}`,
      }}>
        <h3 style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)", fontWeight: 600, color: g.t1, marginBottom: 12, letterSpacing: "-.02em", lineHeight: 1.15 }}>{s.heading}</h3>
        <p style={{ fontSize: 16, color: g.t2, lineHeight: 1.65, marginBottom: 16 }}>{s.body}</p>
        <div style={{ background: g.bg, borderRadius: 14, padding: "14px 18px" }}>
          <p style={{ fontSize: 13, color: g.t3, fontStyle: "italic" }}>💡 {s.tip}</p>
        </div>
      </div>

      {/* Progress + CTA row — right column, row 4 */}
      <div style={{
        gridColumn: 2, gridRow: 4,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 20, alignSelf: "start",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: active === i ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= active ? g.t1 : g.bdr,
              cursor: "pointer", transition: `all .35s ${ease}`,
            }} />
          ))}
        </div>
        {active === 2 ? (
          <Btn primary onClick={onJoin} style={{ fontSize: 14, padding: "10px 22px" }}>
            {t('stepTabs.ready')}
          </Btn>
        ) : (
          <button onClick={() => setActive(a => a + 1)} style={{
            background: ORANGE, color: "#fff", border: "none", borderRadius: 980,
            padding: "10px 22px", fontSize: 14, fontWeight: 600, fontFamily: ff,
            cursor: "pointer", transition: `all .25s ${ease}`,
          }}>
            {t('stepTabs.nextStep')}
          </button>
        )}
      </div>
    </div>
  );
}
