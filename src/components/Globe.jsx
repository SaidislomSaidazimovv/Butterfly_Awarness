import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { g, TEAL } from '../constants/index.js';

export function Globe({ entries }) {
  const canvasRef = useRef(null);
  const pointerRef = useRef(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const dragRef = useRef(null);
  const velRef = useRef(0);
  const SIZE = 600;
  const R = 240;

  // Accurate land mask — longitude ranges per latitude band (every 4°)
  const LAND_BANDS = useMemo(() => {
    const raw = [
      [72,[[-170,-140],[-130,-60],[15,180]]],
      [68,[[-168,-142],[-136,-58],[14,180]]],
      [64,[[-168,-140],[-140,-55],[-24,-13],[6,180]]],
      [60,[[-165,-140],[-140,-54],[-24,-13],[4,180]]],
      [56,[[-162,-148],[-136,-52],[-8,-1],[6,180]]],
      [52,[[-132,-52],[-11,2],[4,180]]],
      [48,[[-126,-52],[-6,145]]],
      [44,[[-124,-66],[-10,148]]],
      [40,[[-124,-74],[-10,80],[84,145]]],
      [36,[[-122,-75],[-10,45],[48,78],[96,146]]],
      [32,[[-120,-78],[-8,36],[38,70],[72,88],[98,135]]],
      [28,[[-118,-80],[-16,56],[68,95],[98,122],[128,142]]],
      [24,[[-114,-86],[-18,56],[70,94],[98,122]]],
      [20,[[-106,-86],[-18,52],[72,92],[96,122]]],
      [16,[[-92,-82],[-18,52],[74,85],[96,126]]],
      [12,[[-86,-82],[-16,52],[75,81],[98,128]]],
      [8,[[-80,-60],[-14,50],[98,132]]],
      [4,[[-80,-50],[-10,46],[98,142]]],
      [0,[[-80,-48],[-10,42],[100,142]]],
      [-4,[[-80,-38],[8,42],[104,142]]],
      [-8,[[-78,-34],[12,42],[106,142]]],
      [-12,[[-76,-36],[16,50],[118,140]]],
      [-16,[[-74,-38],[20,50],[122,148]]],
      [-20,[[-72,-40],[24,48],[116,152]]],
      [-24,[[-70,-40],[26,50],[114,154]]],
      [-28,[[-68,-48],[18,34],[114,154]]],
      [-32,[[-72,-52],[-66,-56],[18,32],[115,153]]],
      [-36,[[-74,-70],[-65,-56],[18,30],[116,152]]],
      [-40,[[-74,-72],[-68,-62],[140,148],[172,178]]],
      [-44,[[-76,-72],[-70,-64],[144,148],[168,178]]],
      [-48,[[-76,-72]]],
      [-52,[[-72,-68]]],
    ];
    return raw;
  }, []);

  const isLand = useCallback((lat, lng) => {
    // Find the two closest bands and interpolate
    let best = null, bestDist = 999;
    for (const band of LAND_BANDS) {
      const d = Math.abs(lat - band[0]);
      if (d < bestDist) { bestDist = d; best = band; }
    }
    if (!best || bestDist > 6) return false;
    const ranges = best[1];
    for (const [lo, hi] of ranges) {
      if (lng >= lo && lng <= hi) return true;
    }
    return false;
  }, [LAND_BANDS]);

  // Pre-generate sphere dots
  const sphereDots = useMemo(() => {
    const dots = [];
    const N = 8000;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < N; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / N);
      const phi = 2 * Math.PI * i / goldenRatio;
      const lat = 90 - (theta * 180 / Math.PI);
      const lng = (phi * 180 / Math.PI) % 360 - 180;
      const land = isLand(lat, lng);
      dots.push({ lat, lng, theta, phi, land });
    }
    return dots;
  }, [isLand]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = SIZE;
    canvas.height = SIZE;

    let reduced = false;
    try { reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) {}

    let animId;
    const cx = SIZE / 2, cy = SIZE / 2;
    const toR = d => d * Math.PI / 180;

    const draw = () => {
      // Auto-rotate
      if (!dragRef.current) {
        phiRef.current += reduced ? 0 : 0.003;
        phiRef.current += velRef.current;
        velRef.current *= 0.95;
      }

      const phi = phiRef.current;
      const theta = thetaRef.current;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Globe glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.4);
      glow.addColorStop(0, "rgba(14,165,160,0.04)");
      glow.addColorStop(1, "rgba(14,165,160,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Globe background
      const bg = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
      bg.addColorStop(0, "#fafafa");
      bg.addColorStop(1, "#e8e8ed");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Project and draw dots
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (const dot of sphereDots) {
        const la = toR(dot.lat);
        const lo = toR(dot.lng);

        const x0 = Math.cos(la) * Math.cos(lo);
        const y0 = Math.cos(la) * Math.sin(lo);
        const z0 = Math.sin(la);

        const x1 = x0 * cosPhi + y0 * sinPhi;
        const y1 = -x0 * sinPhi + y0 * cosPhi;
        const z1 = z0;

        const x2 = x1;
        const y2 = y1 * cosTheta - z1 * sinTheta;
        const z2 = y1 * sinTheta + z1 * cosTheta;

        if (z2 < 0.02) continue;

        const px = cx + x2 * R;
        const py = cy - y2 * R;

        if (dot.land) {
          const size = 0.6 + z2 * 1.0;
          const alpha = 0.15 + z2 * 0.65;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,160,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // Draw entry markers
      const projected = [];
      for (const entry of entries) {
        const la = toR(entry.lat);
        const lo = toR(entry.lng);

        const x0 = Math.cos(la) * Math.cos(lo);
        const y0 = Math.cos(la) * Math.sin(lo);
        const z0 = Math.sin(la);

        const x1 = x0 * cosPhi + y0 * sinPhi;
        const y1 = -x0 * sinPhi + y0 * cosPhi;
        const x2 = x1;
        const y2 = y1 * cosTheta - z0 * sinTheta;
        const z2 = y1 * sinTheta + z0 * cosTheta;

        projected.push({ px: cx + x2 * R, py: cy - y2 * R, z2, x0, y0, z0: z0 });

        if (z2 < 0.1) continue;

        const px = cx + x2 * R;
        const py = cy - y2 * R;

        // Glow
        const mg = ctx.createRadialGradient(px, py, 0, px, py, 12);
        mg.addColorStop(0, `rgba(14,165,160,${0.4 * z2})`);
        mg.addColorStop(1, "rgba(14,165,160,0)");
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = TEAL;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Animated arcs between entry pairs
      const now = Date.now();
      const arcPairs = [];
      for (let i = 0; i < entries.length - 1 && i < 6; i++) {
        arcPairs.push([i, i + 1]);
      }
      // Also connect last to first for a loop
      if (entries.length > 2) arcPairs.push([entries.length - 1, 0]);

      for (const [ai, bi] of arcPairs) {
        const a = entries[ai], b = entries[bi];
        const la1 = toR(a.lat), lo1 = toR(a.lng);
        const la2 = toR(b.lat), lo2 = toR(b.lng);

        // Cartesian positions on unit sphere
        const ax = Math.cos(la1) * Math.cos(lo1), ay = Math.cos(la1) * Math.sin(lo1), az = Math.sin(la1);
        const bx = Math.cos(la2) * Math.cos(lo2), by = Math.cos(la2) * Math.sin(lo2), bz = Math.sin(la2);

        // Great circle interpolation with height
        const dot = ax * bx + ay * by + az * bz;
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
        const arcHeight = 0.15 + angle * 0.25; // higher arcs for longer distances

        // Pulse animation: progress cycles 0→1 over 3 seconds per arc, offset by pair index
        const pulse = ((now + ai * 700) % 3000) / 3000;
        const pulseWidth = 0.25;

        const STEPS = 32;
        let prevPt = null;
        for (let s = 0; s <= STEPS; s++) {
          const t = s / STEPS;

          // Slerp between the two points
          const sinA = Math.sin(angle);
          let ix, iy, iz;
          if (sinA < 0.001) {
            ix = ax + (bx - ax) * t;
            iy = ay + (by - ay) * t;
            iz = az + (bz - az) * t;
          } else {
            const w1 = Math.sin((1 - t) * angle) / sinA;
            const w2 = Math.sin(t * angle) / sinA;
            ix = ax * w1 + bx * w2;
            iy = ay * w1 + by * w2;
            iz = az * w1 + bz * w2;
          }

          // Normalize and add height (parabolic)
          const len = Math.sqrt(ix * ix + iy * iy + iz * iz);
          const h = 1 + arcHeight * 4 * t * (1 - t); // parabolic rise
          ix = ix / len * h;
          iy = iy / len * h;
          iz = iz / len * h;

          // Rotate same as globe
          const rx1 = ix * cosPhi + iy * sinPhi;
          const ry1 = -ix * sinPhi + iy * cosPhi;
          const rx2 = rx1;
          const ry2 = ry1 * cosTheta - iz * sinTheta;
          const rz2 = ry1 * sinTheta + iz * cosTheta;

          if (rz2 < 0.05) { prevPt = null; continue; }

          const px = cx + rx2 * R;
          const py = cy - ry2 * R;

          if (prevPt) {
            // Pulse brightness — brighter near the pulse position
            const dist = Math.abs(t - pulse);
            const wrap = Math.min(dist, 1 - dist);
            const brightness = Math.max(0, 1 - wrap / pulseWidth);
            const alpha = (0.06 + brightness * 0.35) * rz2;

            ctx.beginPath();
            ctx.moveTo(prevPt.x, prevPt.y);
            ctx.lineTo(px, py);
            ctx.strokeStyle = `rgba(14,165,160,${alpha.toFixed(2)})`;
            ctx.lineWidth = 0.8 + brightness * 1.5;
            ctx.stroke();
          }
          prevPt = { x: px, y: py };
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [entries, sphereDots]);

  // Pointer interaction
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, phi: phiRef.current, theta: thetaRef.current };
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    phiRef.current = dragRef.current.phi + dx * 0.005;
    thetaRef.current = dragRef.current.theta + dy * 0.005;
    velRef.current = dx * 0.0001;
  };
  const onPointerUp = () => { dragRef.current = null; };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-label="Interactive globe showing participant locations"
      role="img"
      style={{
        width: "100%", maxWidth: 320, aspectRatio: "1", cursor: "grab",
        touchAction: "none",
      }}
    />
  );
}
