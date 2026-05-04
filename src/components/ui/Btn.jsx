import { g, ff, ORANGE } from '../../constants/index.js';

export function Btn({ children, primary, onClick, icon, disabled, style }) {
  return <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "14px 28px", borderRadius: 980, fontSize: 17, fontWeight: 400, fontFamily: ff, border: primary ? "none" : "1px solid " + g.bdr, background: primary ? ORANGE : "#fff", color: primary ? "#fff" : g.t1, cursor: disabled ? "default" : "pointer", opacity: disabled ? .35 : 1, transition: "all .25s cubic-bezier(.16,1,.3,1)", outline: "none", ...style }}>{icon}{children}</button>;
}
