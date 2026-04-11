import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { g } from '../../constants/index.js';

export function Popup({ open, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollbarWidth + 'px';
      document.body.style.overflow = "hidden";
      setVisible(true); setAnimating(true); requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(false)));
    } else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 300);
      document.body.style.paddingRight = '';
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.paddingRight = ''; document.body.style.overflow = ""; };
  }, [open]);

  // Focus trap: Tab cycles inside modal, Escape closes
  useEffect(() => {
    if (!open) return;
    const trapFocus = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !popupRef.current) return;
      const focusable = popupRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [open, onClose]);

  if (!visible) return null;
  const entering = open && !animating;
  const opa = entering ? 1 : 0;
  const scale = entering ? 1 : 0.96;
  const tY = entering ? 0 : 12;
  const ease = "cubic-bezier(.16,1,.3,1)";

  return <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${entering ? 0.18 : 0})`, backdropFilter: `blur(${entering ? 40 : 0}px)`, WebkitBackdropFilter: `blur(${entering ? 40 : 0}px)`, transition: `background .3s ${ease}, backdrop-filter .3s ${ease}, -webkit-backdrop-filter .3s ${ease}` }} />
    <div ref={popupRef} className="modal-scroll" role="dialog" aria-modal="true" style={{
      position: "absolute", top: "50%", left: "50%", width: "min(90vw,480px)", maxHeight: "84vh", overflowY: "auto",
      background: "#fff", borderRadius: 20, boxShadow: `0 8px 80px rgba(0,0,0,${entering ? 0.12 : 0}), 0 0 0 0.5px rgba(0,0,0,.06)`,
      opacity: opa, transform: `translate(-50%,-50%) scale(${scale}) translateY(${tY}px)`,
      transition: `opacity .3s ${ease}, transform .35s ${ease}, box-shadow .3s ${ease}`,
    }}>
      <button onClick={onClose} autoFocus aria-label="Close" style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.06)", border: "none", width: 44, height: 44, minWidth: 44, minHeight: 44, borderRadius: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: g.t3, zIndex: 1, transition: "background .2s" }}><X size={16} /></button>
      <div style={{ padding: "32px 30px 28px" }}>{children}</div>
    </div>
  </div>;
}
