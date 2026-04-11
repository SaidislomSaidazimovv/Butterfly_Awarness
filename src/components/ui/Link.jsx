import { g, ff } from '../../constants/index.js';

export function Link({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", fontFamily: ff, fontSize: 16, fontWeight: 400, color: g.link, cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 3, transition: "gap .2s" }}>{children} <span style={{ fontSize: 18, transition: "transform .2s" }}>›</span></button>;
}
