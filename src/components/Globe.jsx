import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { relT } from '../utils/helpers.js';

// ══ NEW GLOBE — ported 1:1 from butterfly-challenge-merged.html ══
// Polaroid cards float over each marker; teal markers; auto-rotate with
// momentum drag (horizontal only — theta is fixed at 0.3); no animated arcs.

const TEAL = [0, 0.694, 0.553]; // #00B18D normalized RGB

// Seed entries with the same eight portraits as the merged HTML reference.
// These photos are the polaroid avatars sitting on top of each marker.
const POLAROID_SEED = [
  { id: "p1", country: "United States",  city: "New York",  lat:  40.71, lng:  -74.01, person: "Mark",     img: "/people/mark.webp" },
  { id: "p2", country: "United Kingdom", city: "London",    lat:  51.51, lng:   -0.13, person: "Erica",    img: "/people/erica.webp" },
  { id: "p3", country: "Brazil",         city: "São Paulo", lat: -23.55, lng:  -46.63, person: "Marcel",   img: "/people/marcel.webp" },
  { id: "p4", country: "Japan",          city: "Tokyo",     lat:  35.68, lng:  139.69, person: "Keila",    img: "/people/keila.webp" },
  { id: "p5", country: "India",          city: "Mumbai",    lat:  19.08, lng:   72.88, person: "Gina",     img: "/people/gina.webp" },
  { id: "p6", country: "Kenya",          city: "Nairobi",   lat:  -1.29, lng:   36.82, person: "Adam",     img: "/people/adam.webp" },
  { id: "p7", country: "Australia",      city: "Sydney",    lat: -33.87, lng:  151.21, person: "Brian",    img: "/people/brian.webp" },
  { id: "p8", country: "Germany",        city: "Berlin",    lat:  52.52, lng:   13.41, person: "Kristine", img: "/people/kristine.webp" },
];

// Project (lat, lng) to 2D canvas coords given cobe's (phi, theta).
// Same math as the merged-HTML reference.
function project(lat, lng, phi, theta) {
  const lambda = lng * Math.PI / 180;
  const phiR = lat * Math.PI / 180;
  let x = Math.cos(phiR) * Math.sin(lambda);
  let y = Math.sin(phiR);
  let z = Math.cos(phiR) * Math.cos(lambda);
  // Rotate around Y axis by -phi.
  const cP = Math.cos(phi), sP = Math.sin(phi);
  const x1 = x * cP + z * sP;
  const z1 = -x * sP + z * cP;
  x = x1; z = z1;
  // Rotate around X axis by theta (positive theta tilts top toward viewer).
  const cT = Math.cos(theta), sT = Math.sin(theta);
  const y1 = y * cT - z * sT;
  const z2 = y * sT + z * cT;
  y = y1; z = z2;
  return { x, y, z, visible: z > 0 };
}

export function Globe({ entries: liveEntries }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const polaroidHostRef = useRef(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const pointerRef = useRef(null);
  const pointerStartRef = useRef(0);
  const velocityRef = useRef(0);
  // Use the polaroid seed (with photos) for the floating cards. The live
  // `entries` prop is still accepted so other places can keep passing it.
  const ENTRIES = POLAROID_SEED;

  useEffect(() => {
    const canvas = canvasRef.current;
    const polaroidHost = polaroidHostRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !polaroidHost || !wrap) return;

    let reducedMotion = false;
    try { reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches; } catch {}

    // Build polaroid DOM nodes — one per entry — with the matching tilt class.
    polaroidHost.innerHTML = '';
    ENTRIES.forEach((e, i) => {
      const p = document.createElement('div');
      p.className = 'bfy-polaroid';
      p.dataset.id = e.id;
      const tilt = ((i % 5) - 2) * 1.8;
      p.style.setProperty('--tilt', tilt + 'deg');
      p.innerHTML =
        '<div class="bfy-polaroid-photo"><img src="' + e.img + '" alt="' + e.person + '" loading="lazy" /></div>' +
        '<p class="bfy-polaroid-name">' + e.person + '</p>' +
        '<p class="bfy-polaroid-time">' + relT(Date.now() - (i + 1) * 120000) + '</p>';
      polaroidHost.appendChild(p);
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const initialSize = Math.min(canvas.clientWidth, 800) || 680;

    let cobe;
    try {
      cobe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: initialSize * 2,
        height: initialSize * 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 1.15,
        scale: 1,
        mapSamples: 16000,
        mapBrightness: 4.5,
        baseColor: [1, 1, 1],
        markerColor: TEAL,
        glowColor: [1, 1, 1],
        markers: ENTRIES.map(e => ({ location: [e.lat, e.lng], size: 0.06 })),
        onRender: (s) => {
          if (pointerRef.current === null && !reducedMotion) {
            phiRef.current += 0.004;
          }
          phiRef.current += velocityRef.current;
          velocityRef.current *= 0.94;

          s.phi = phiRef.current;
          s.theta = thetaRef.current;
          const sz = canvas.clientWidth || initialSize;
          s.width = sz * 2;
          s.height = sz * 2;

          // Position each polaroid card over its marker.
          const rect = canvas.getBoundingClientRect();
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const radius = rect.width * 0.48;
          for (let i = 0; i < ENTRIES.length; i++) {
            const e = ENTRIES[i];
            const p = polaroidHost.children[i];
            if (!p) continue;
            const proj = project(e.lat, e.lng, phiRef.current, thetaRef.current);
            if (!proj.visible) {
              p.style.opacity = '0';
              p.style.pointerEvents = 'none';
              continue;
            }
            const px = cx + proj.x * radius;
            const py = cy - proj.y * radius;
            const depthOpacity = Math.min(1, Math.max(0.25, proj.z * 1.3));
            p.style.opacity = depthOpacity.toFixed(2);
            p.style.pointerEvents = proj.z > 0.3 ? 'auto' : 'none';
            p.style.transform = 'translate(' + px + 'px, ' + py + 'px) translate(-50%, -110%) rotate(var(--tilt,0deg))';
            p.style.zIndex = String(Math.round(100 + proj.z * 100));
          }
        },
      });
    } catch {
      // cobe failed to init; bail silently.
    }

    // Drag-to-rotate (horizontal only, with momentum).
    const onDown = (ev) => {
      pointerRef.current = ev.clientX - phiRef.current / 0.005;
      pointerStartRef.current = ev.clientX;
      velocityRef.current = 0;
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(ev.pointerId); } catch {}
    };
    const onMove = (ev) => {
      if (pointerRef.current === null) return;
      const delta = ev.clientX - pointerRef.current;
      phiRef.current = delta * 0.005;
      velocityRef.current = (ev.clientX - pointerStartRef.current) * 0.00008;
      pointerStartRef.current = ev.clientX;
    };
    const onUp = () => {
      pointerRef.current = null;
      canvas.style.cursor = 'grab';
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onUp);
    canvas.addEventListener('pointercancel', onUp);

    // Resize handling.
    let ro;
    try {
      ro = new ResizeObserver(() => {
        if (!cobe) return;
        const s = canvas.clientWidth;
        try {
          cobe.resize({ width: s * 2, height: s * 2, devicePixelRatio: dpr });
        } catch {}
      });
      ro.observe(canvas);
    } catch {}

    return () => {
      try { cobe && cobe.destroy(); } catch {}
      try { ro && ro.disconnect(); } catch {}
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="bfy-globe-frame"
      data-globe-cobe="1"
      role="img"
      aria-label="Rotating globe of participants"
      style={{ position: 'relative', flex: '2 1 520px', width: '100%', maxWidth: 680, aspectRatio: '1' }}
    >
      <canvas
        ref={canvasRef}
        className="bfy-globe"
        aria-label="Rotating globe of participants"
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'none' }}
      />
      <div
        ref={polaroidHostRef}
        className="bfy-polaroid-host"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ *
 * PREVIOUS GLOBE — kept for reference / rollback.
 * Originally rendered cobe markers from the live `entries` feed plus a
 * separate canvas overlay drawing animated great-circle arcs between them.
 *
 * To restore: comment out the new `Globe` export above and uncomment the
 * block below (renaming `GlobeOld` → `Globe`).
 * ══════════════════════════════════════════════════════════════════════ */
/*
const ARC_COLOR = "rgba(14,165,160,";
const MARKER_COLOR = [255 / 255, 139 / 255, 51 / 255]; // #FF8B33 orange

function drawArcPulse(ctx, a, b, phi, theta, R, cx, cy, pulse, pulseWidth) {
  const sinP = Math.sin(phi), cosP = Math.cos(phi);
  const sinT = Math.sin(theta), cosT = Math.cos(theta);
  const toR = d => d * Math.PI / 180;
  const la1 = toR(a.lat), lo1 = toR(a.lng);
  const la2 = toR(b.lat), lo2 = toR(b.lng);
  const ax = Math.cos(la1) * Math.sin(lo1);
  const ay = Math.sin(la1);
  const az = Math.cos(la1) * Math.cos(lo1);
  const bx = Math.cos(la2) * Math.sin(lo2);
  const by = Math.sin(la2);
  const bz = Math.cos(la2) * Math.cos(lo2);
  const dot = ax * bx + ay * by + az * bz;
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (omega < 0.01) return;
  const sinO = Math.sin(omega);
  const steps = 60;
  let prev = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ka = Math.sin((1 - t) * omega) / sinO;
    const kb = Math.sin(t * omega) / sinO;
    let x = ka * ax + kb * bx;
    let y = ka * ay + kb * by;
    let z = ka * az + kb * bz;
    const lift = 1 + 0.15 * Math.sin(t * Math.PI);
    const len = Math.sqrt(x * x + y * y + z * z);
    x = x * lift / len; y = y * lift / len; z = z * lift / len;
    const x1 = x * cosP + z * sinP;
    const y1 = y;
    const z1 = -x * sinP + z * cosP;
    const x2 = x1;
    const y2 = y1 * cosT - z1 * sinT;
    const z2 = y1 * sinT + z1 * cosT;
    const px = cx + x2 * R;
    const py = cy - y2 * R;
    if (prev && z2 > -0.2) {
      const distFromPulse = Math.abs(t - pulse);
      const wrapD = Math.min(distFromPulse, 1 - distFromPulse);
      const brightness = Math.max(0, 1 - wrapD / pulseWidth);
      const alpha = (0.05 + brightness * 0.55) * Math.max(0.05, z2 + 0.2);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(px, py);
      ctx.strokeStyle = ARC_COLOR + alpha.toFixed(2) + ")";
      ctx.lineWidth = 0.8 + brightness * 1.5;
      ctx.stroke();
    }
    prev = { x: px, y: py };
  }
}

export function GlobeOld({ entries }) {
  const wrapRef = useRef(null);
  const globeCanvasRef = useRef(null);
  const arcsCanvasRef = useRef(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.32);
  const dragRef = useRef(null);
  const entriesRef = useRef(entries);
  const arcsAnimRef = useRef(null);

  useEffect(() => { entriesRef.current = entries; }, [entries]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const globeCanvas = globeCanvasRef.current;
    const arcsCanvas = arcsCanvasRef.current;
    if (!wrap || !globeCanvas || !arcsCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const size = Math.round(rect.width || 520);

    const buildMarkers = () => {
      const list = entriesRef.current || [];
      const out = [];
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.lat == null || e.lng == null) continue;
        const seed = (e.id || '' + i).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const jLat = ((seed * 37) % 100 - 50) / 100;
        const jLng = ((seed * 71) % 100 - 50) / 100;
        out.push({ location: [e.lat + jLat, e.lng + jLng], size: 0.04 });
      }
      return out;
    };

    let cobe;
    try {
      cobe = createGlobe(globeCanvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: 0,
        theta: thetaRef.current,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.96, 0.96, 0.97],
        markerColor: MARKER_COLOR,
        glowColor: [1, 1, 1],
        markers: buildMarkers(),
        onRender: (state) => {
          if (!dragRef.current) phiRef.current += 0.003;
          state.phi = phiRef.current;
          state.theta = thetaRef.current;
          state.markers = buildMarkers();
        },
      });
    } catch {}

    arcsCanvas.width = size * dpr;
    arcsCanvas.height = size * dpr;
    arcsCanvas.style.width = size + 'px';
    arcsCanvas.style.height = size + 'px';
    const ctx = arcsCanvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2;
    const R = size * 0.45;

    const drawArcs = () => {
      ctx.clearRect(0, 0, size, size);
      const all = entriesRef.current || [];
      const arcCount = Math.min(40, Math.max(0, all.length - 1));
      const step = all.length > arcCount + 1 ? Math.floor(all.length / (arcCount + 1)) : 1;
      const pts = [];
      for (let i = 0; i < all.length && pts.length < arcCount + 1; i += step) {
        if (all[i].lat != null && all[i].lng != null) pts.push(all[i]);
      }
      const pairs = [];
      for (let i = 0; i < pts.length - 1; i++) pairs.push([i, i + 1]);
      if (pts.length > 2) pairs.push([pts.length - 1, 0]);
      const now = Date.now();
      const period = 4000;
      const pulse = (now % period) / period;
      const pulseWidth = 0.18;
      for (const [ai, bi] of pairs) {
        drawArcPulse(ctx, pts[ai], pts[bi], phiRef.current, thetaRef.current, R, cx, cy, pulse, pulseWidth);
      }
      arcsAnimRef.current = requestAnimationFrame(drawArcs);
    };
    drawArcs();

    const onPointerDown = (e) => {
      dragRef.current = { x: e.clientX, y: e.clientY, phi: phiRef.current, theta: thetaRef.current };
      wrap.style.cursor = 'grabbing';
      try { wrap.setPointerCapture(e.pointerId); } catch {}
    };
    const onPointerMove = (e) => {
      if (!dragRef.current) return;
      phiRef.current = dragRef.current.phi + (e.clientX - dragRef.current.x) * 0.005;
      thetaRef.current = dragRef.current.theta + (e.clientY - dragRef.current.y) * 0.005;
    };
    const onPointerUp = () => { dragRef.current = null; wrap.style.cursor = 'grab'; };

    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerup', onPointerUp);
    wrap.addEventListener('pointerleave', onPointerUp);
    wrap.addEventListener('pointercancel', onPointerUp);

    return () => {
      try { cobe && cobe.destroy(); } catch {}
      if (arcsAnimRef.current) cancelAnimationFrame(arcsAnimRef.current);
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('pointerleave', onPointerUp);
      wrap.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-globe-cobe="1"
      aria-label="Interactive globe showing participant locations"
      role="img"
      style={{
        position: "relative",
        width: "100%", maxWidth: 520,
        aspectRatio: "1",
        cursor: "grab", touchAction: "none",
        margin: "0 auto",
      }}
    >
      <canvas ref={globeCanvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block" }} />
      <canvas ref={arcsCanvasRef} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />
    </div>
  );
}
*/
