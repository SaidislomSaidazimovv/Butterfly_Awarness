import { useState, useEffect } from 'react';

const TYPED_TEXT = "Currently under construction — check back soon.";
const TYPING_SPEED = 55;
const PAUSE_BEFORE_RESET = 2200;
const PAUSE_BEFORE_TYPING = 600;

export function WorkingProgress() {
  const [displayedLen, setDisplayedLen] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isDeleting && displayedLen < TYPED_TEXT.length) {
      timeout = setTimeout(() => setDisplayedLen(d => d + 1), TYPING_SPEED);
    } else if (!isDeleting && displayedLen === TYPED_TEXT.length) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_BEFORE_RESET);
    } else if (isDeleting && displayedLen > 0) {
      timeout = setTimeout(() => setDisplayedLen(d => d - 1), 25);
    } else {
      timeout = setTimeout(() => setIsDeleting(false), PAUSE_BEFORE_TYPING);
    }
    return () => clearTimeout(timeout);
  }, [displayedLen, isDeleting]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        .wip-root { position: fixed; inset: 0; z-index: 9999; width: 100vw; height: 100vh; background: #fafaf8; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', 'Courier New', monospace; overflow: hidden; }
        .wip-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%); -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%); }
        .wip-scanline { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.012) 2px, rgba(0,0,0,0.012) 4px); pointer-events: none; }
        .wip-scanline::after { content: ''; position: absolute; left: 0; right: 0; height: 120px; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.03), transparent); animation: scanMove 6s linear infinite; }
        @keyframes scanMove { 0% { top: -120px; } 100% { top: calc(100vh + 120px); } }
        .wip-cursor { display: inline-block; width: 2px; height: 1.15em; background: #1a1a1a; margin-left: 2px; vertical-align: text-bottom; animation: cursorBlink 0.8s step-end infinite; }
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .wip-label { display: inline-block; letter-spacing: 0.35em; font-size: 11px; font-weight: 500; color: #555; border: 1px solid #c0c0b8; padding: 6px 18px; border-radius: 2px; animation: labelGlow 3s ease-in-out infinite; }
        @keyframes labelGlow { 0%, 100% { border-color: #c0c0b8; box-shadow: 0 0 0 rgba(45,122,79,0); } 50% { border-color: #2d7a4f; box-shadow: 0 0 20px rgba(45,122,79,0.08); } }
        .wip-content { position: relative; z-index: 1; text-align: center; padding: 0 24px; max-width: 680px; animation: wipFadeUp 1s cubic-bezier(0.25, 0.1, 0.25, 1) both; }
        @keyframes wipFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .wip-heading { font-size: clamp(28px, 5vw, 48px); font-weight: 700; color: #1a1a1a; line-height: 1.2; margin: 32px 0 24px; }
        .wip-typed { font-size: clamp(13px, 2vw, 16px); font-weight: 300; color: #888; line-height: 1.7; min-height: 1.7em; }
        .wip-bar { position: absolute; bottom: 40px; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; color: #999; font-family: 'JetBrains Mono', 'Courier New', monospace; animation: wipFadeUp 1s cubic-bezier(0.25, 0.1, 0.25, 1) 0.5s both; }
        .wip-dot { width: 6px; height: 6px; border-radius: 50%; background: #2d7a4f; animation: dotPulse 2s ease-in-out infinite; }
        @keyframes dotPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
      <div className="wip-root">
        <div className="wip-grid" />
        <div className="wip-scanline" />
        <div className="wip-content">
          <span className="wip-label">WORK IN PROGRESS</span>
          <h1 className="wip-heading">We're Building<br />Something Great</h1>
          <p className="wip-typed">
            {TYPED_TEXT.slice(0, displayedLen)}
            <span className="wip-cursor" />
          </p>
        </div>
        <div className="wip-bar">
          <span className="wip-dot" />
          <span>systems loading</span>
        </div>
      </div>
    </>
  );
}
