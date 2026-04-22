import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { g, ff } from '../constants/index.js';
import { HL_CARDS } from '../data/index.js';
import { Reveal } from './ui/index.js';

export function HighlightCarousel() {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const CARD_W = 430;
  const CARD_H = 420;
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
    <section style={{ background: g.bg, paddingTop: 120, paddingBottom: 120, overflow: "hidden" }}>
      {/* Title + arrows on same row — constrained to grid */}
      <div style={{ maxWidth: GRID_MAX, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 600, letterSpacing: "-.04em", color: g.t1, lineHeight: 1.1 }}>
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
        {HL_CARDS.map((c, i) => (
          <div key={i} style={{
            width: "min(430px, 85vw)", minWidth: "min(430px, 85vw)", maxWidth: "min(430px, 85vw)",
            height: CARD_H,
            flexShrink: 0, flexGrow: 0,
            background: "#fff", borderRadius: 24, padding: "28px 28px 24px",
            textAlign: "left", scrollSnapAlign: "start",
            display: "flex", flexDirection: "column",
            boxShadow: "0 1px 4px rgba(0,0,0,.04)",
          }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: g.t1, lineHeight: 1.35, letterSpacing: "-.01em" }}>{t(`highlights.${c.id}.title`)}</p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
              <img src={c.img} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: 14, color: g.t1, opacity: .5, fontWeight: 500 }}>{t(`highlights.${c.id}.sub`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Sign Builder — interactive gesture tutorial ── */
