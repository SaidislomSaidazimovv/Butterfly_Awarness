// Pure utility functions
import { CDATA } from '../data/index.js';

export function relT(ts) { const d = Math.floor((Date.now() - ts) / 1000); if (d < 60) return "now"; if (d < 3600) return Math.floor(d / 60) + "m"; if (d < 86400) return Math.floor(d / 3600) + "h"; return Math.floor(d / 86400) + "d"; }
export function rLL(co, ci) { const c = CDATA[co]; if (!c) return [0, 0]; if (ci && c.cities[ci]) return c.cities[ci]; for (const [k, v] of Object.entries(c.cities)) if (k.toLowerCase().includes((ci || "").toLowerCase())) return v; return [c.lat + (Math.random() - .5) * 4, c.lng + (Math.random() - .5) * 4]; }
export function uid() { return Math.random().toString(36).slice(2, 9); }
