import { useState } from 'react';
import { Check } from 'lucide-react';
import { g, ff, TEAL } from '../constants/index.js';
import { Btn } from './ui/index.js';

export function ReminderC({ onDone, onEmailSubmit }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const valid = email.includes("@") && email.includes(".");
  
  return (
    <div style={{ fontFamily: ff }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🕐</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: g.t1 }}>Get a reminder for May 1</h3>
      </div>
      
      {!sent ? (
        <>
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e8e8ed", fontSize: 14, fontFamily: ff, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />
          <Btn primary onClick={async () => { if (valid && onEmailSubmit) { const r = await onEmailSubmit(email); if (r.success) setSent(true); } else if (valid) { setSent(true); } }} disabled={!valid} style={{ width: "100%", fontSize: 14, padding: "10px 20px" }}>Remind Me May 1</Btn>
          <p style={{ fontSize: 11, color: g.t4, marginTop: 12, textAlign: "center", fontFamily: ff }}>No spam. Just one reminder. Unsubscribe anytime.</p>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", color: TEAL }}>
            <Check size={18} />
            <p style={{ fontSize: 16, fontWeight: 600, fontFamily: ff }}>You're on the list.</p>
          </div>
          <Btn onClick={onDone} style={{ width: "100%", fontSize: 14, padding: "10px 20px", marginTop: 12 }}>Done</Btn>
        </>
      )}
    </div>
  );
}



/* ── UGC Popup ── */
