import { useEffect, useRef } from 'react';
import { TUTORIAL_VIDEO } from '../constants/index.js';

export function TutorialModal({ open, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!open) {
      try { videoRef.current?.pause(); } catch {}
      return;
    }
    try {
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    } catch {}
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,.78)", padding: 32,
        animation: "fadeUp .25s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <div style={{ position: "relative", maxWidth: "min(960px, 92vw)", width: "100%" }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: -52, right: 0,
            width: 40, height: 40, borderRadius: 999,
            background: "#fff", border: "none", cursor: "pointer",
            fontSize: 22, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ×
        </button>
        <video
          ref={videoRef}
          src={TUTORIAL_VIDEO}
          controls
          playsInline
          style={{
            width: "100%", maxHeight: "80vh",
            borderRadius: 16, display: "block", background: "#000",
          }}
        />
      </div>
    </div>
  );
}
