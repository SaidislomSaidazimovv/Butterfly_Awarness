import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff, HL_NEW_1, HL_NEW_2, HL_NEW_3, HL_NEW_4 } from '../constants/index.js';
import { Reveal } from './ui/index.js';

const HL_DATA = [
  { id: 'card1', img: HL_NEW_1, bg: '#ffffff',         textColor: '#fff', layout: 'fullbg' },
  { id: 'card2', img: HL_NEW_2, bg: '#f5f5f7',         textColor: '#000', layout: 'imgleft' },
  { id: 'card3', img: HL_NEW_3, bg: '#DFF9E7',         textColor: '#000', layout: 'imgright' },
  { id: 'card4', img: HL_NEW_4, bg: '#FAF1DA',         textColor: '#000', layout: 'imgleft' },
];

export function HighlightCarousel() {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const CARD_W = 1200;
  const CARD_H = 680;
  const GAP = 20;
  const GRID_MAX = 980;

  const checkBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkBounds, { passive: true });
    checkBounds();
    window.addEventListener("resize", checkBounds, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkBounds);
      window.removeEventListener("resize", checkBounds);
    };
  }, [checkBounds]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = Math.min(CARD_W, window.innerWidth * 0.85);
    el.scrollBy({ left: dir * (cardW + GAP), behavior: "smooth" });
  };

  return (
    <section style={{ background: "#ffffff", paddingTop: 120, paddingBottom: 120, overflow: "hidden" }}>
      {/* Title + arrows on same row — constrained to grid */}
      <div style={{ maxWidth: GRID_MAX, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(2rem,5.5vw,4.2rem)", fontWeight: 600, letterSpacing: "-.04em", color: "#000", lineHeight: 1.1 }}>
            Get the highlights.
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingBottom: 4 }}>
          {[{ dir: -1, ok: canPrev, ch: "‹", label: "Previous" }, { dir: 1, ok: canNext, ch: "›", label: "Next" }].map(a => (
            <button key={a.dir} onClick={() => scrollBy(a.dir)} disabled={!a.ok} aria-label={a.label} style={{
              width: 40, height: 40, borderRadius: 20,
              border: "1px solid " + (a.ok ? g.bdr : "#e8e8ed"),
              background: a.ok ? "#fff" : "transparent",
              color: a.ok ? g.t2 : "#d2d2d7",
              cursor: a.ok ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .25s cubic-bezier(.16,1,.3,1)",
              fontSize: 22, fontWeight: 300, fontFamily: ff,
            }}>{a.ch}</button>
          ))}
        </div>
      </div>

      {/* Scrollable track — bleeds right */}
      <div
        ref={trackRef}
        className="hs"
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          paddingLeft: "max(1.25rem, calc(50vw - 490px))",
          paddingRight: "max(1.25rem, calc(50vw - 490px))",
          scrollPaddingLeft: "max(1.25rem, calc(50vw - 490px))",
        }}
      >
        {HL_DATA.map((c, i) => {
          const title = t(`highlights.${c.id}.title`);
          const sub = t(`highlights.${c.id}.sub`);
          if (c.layout === 'fullbg') {
            return (
              <div key={c.id} className="hl-card" style={{
                width: "min(1200px, 92vw)", minWidth: "min(560px, 92vw)",
                height: CARD_H,
                flexShrink: 0, flexGrow: 0,
                backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                borderRadius: 24, padding: "48px 48px 24px",
                textAlign: "left", scrollSnapAlign: "start",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                color: c.textColor,
                boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                position: "relative",
              }}>
                <p style={{ fontSize: "2rem", fontWeight: 600, color: c.textColor, lineHeight: 1.2, letterSpacing: "-.01em", width: "50%", margin: 0 }}>{title}</p>
                <p style={{ fontSize: 14, color: c.textColor, opacity: .8, fontWeight: 500, margin: 0 }}>{sub}</p>
              </div>
            );
          }
          // 2-col card
          const imgRight = c.layout === 'imgright';
          return (
            <div key={c.id} className="hl-card" style={{
              width: "min(1200px, 92vw)", minWidth: "min(560px, 92vw)",
              height: CARD_H,
              flexShrink: 0, flexGrow: 0,
              background: c.bg, borderRadius: 24,
              scrollSnapAlign: "start",
              display: "grid",
              gridTemplateColumns: imgRight ? "minmax(0, 1fr) minmax(0, 1.4fr)" : "minmax(0, 1.4fr) minmax(0, 1fr)",
              gridTemplateRows: "1fr auto auto 1fr",
              padding: 0,
              textAlign: "left",
              boxShadow: "0 1px 4px rgba(0,0,0,.04)",
            }}>
              <div style={{
                gridColumn: imgRight ? 2 : 1,
                gridRow: "1 / -1",
                backgroundImage: `url(${c.img})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%", height: "100%",
              }} />
              <p style={{
                gridColumn: imgRight ? 1 : 2,
                gridRow: 2,
                fontSize: "2rem", fontWeight: 600, color: c.textColor, lineHeight: 1.2, letterSpacing: "-.01em",
                margin: 0, padding: "28px 70px 0 70px", alignSelf: "end",
              }}>{title}</p>
              <p style={{
                gridColumn: imgRight ? 1 : 2,
                gridRow: 3,
                fontSize: 14, color: c.textColor, opacity: .5, fontWeight: 500,
                margin: "8px 0 0", padding: "0 70px", alignSelf: "start",
              }}>{sub}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Sign Builder — interactive gesture tutorial ── */
