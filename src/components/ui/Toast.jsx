import { Check } from 'lucide-react';
import { g, ff } from '../../constants/index.js';

export function Toast({ message }) {
  if (!message) return null;
  return <div style={{ position: "fixed", bottom: 96, left: "50%", zIndex: 300, animation: "toastIn .35s cubic-bezier(.16,1,.3,1)" }}>
    <div style={{ transform: "translateX(-50%)", background: g.t1, color: "#fff", padding: "10px 22px", borderRadius: 99, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, fontFamily: ff, boxShadow: "0 4px 20px rgba(0,0,0,.15)" }}><Check size={13} />{message}</div>
  </div>;
}
