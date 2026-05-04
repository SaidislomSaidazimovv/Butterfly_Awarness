import { g, ff, TEAL, ORANGE } from '../constants/index.js';
import { Popup, Btn } from './ui/index.js';

export function UgcPopup({ open, onClose, recordingStep, countdownValue, isRecording, recordingSeconds, recordedPreviewUrl, ugcConsent, setUgcConsent, cameraError, ugcUploading, liveVideoRef, onSelectMode, onStartRecording, onRetake, onUseVideo, onFileSelect, onUpload, onStopRecording }) {
  const ease = "cubic-bezier(.16,1,.3,1)";
  const btnStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600, fontFamily: ff, cursor: "pointer", border: "none", transition: `all .25s ${ease}` };

  return (
    <Popup open={open} onClose={onClose}>
      <div style={{ animation: `fadeUp .35s ${ease}` }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Share Your Story</h2>
        <p style={{ fontSize: 14, color: g.t3, marginBottom: 20 }}>Record a short video doing the Butterfly Sign.</p>

        {/* MODE SELECT */}
        {recordingStep === 'mode-select' && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => onSelectMode('auto')} style={{ ...btnStyle, background: ORANGE, color: "#fff", width: "100%" }}>
              Auto (3s countdown)
            </button>
            <button onClick={() => onSelectMode('manual')} style={{ ...btnStyle, background: g.bg, color: g.t1, width: "100%", border: "1px solid #e8e8ed" }}>
              Manual (tap to start)
            </button>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <label style={{ ...btnStyle, background: "none", color: g.t3, fontSize: 13, cursor: "pointer", padding: "8px 16px" }}>
                Or upload a file
                <input type="file" accept="video/*,image/*" onChange={onFileSelect} style={{ display: "none" }} />
              </label>
            </div>
          </div>
        )}

        {/* CAMERA / RECORDING */}
        {recordingStep === 'camera' && (
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "1" }}>
            <video ref={liveVideoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            {/* Countdown overlay */}
            {countdownValue > 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)" }}>
                <span style={{ fontSize: 72, fontWeight: 700, color: "#fff", animation: `popIn .3s ${ease}` }}>{countdownValue}</span>
              </div>
            )}
            {/* Recording indicator */}
            {isRecording && (
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#ef4444", animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums" }}>0:{String(recordingSeconds).padStart(2, '0')} / 0:30</span>
              </div>
            )}
            {/* Controls */}
            <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              {isRecording ? (
                <button onClick={onStopRecording} style={{ width: 56, height: 56, borderRadius: 28, background: "#ef4444", border: "3px solid #fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 3, background: "#fff" }} />
                </button>
              ) : countdownValue === 0 && (
                <button onClick={onStartRecording} style={{ ...btnStyle, background: ORANGE, color: "#fff", borderRadius: 28 }}>
                  Tap to record
                </button>
              )}
            </div>
            {/* Error */}
            {cameraError && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.8)", color: "#fff", padding: 24, textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Camera unavailable</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 16 }}>Please allow camera access or upload a file instead.</p>
                <label style={{ ...btnStyle, background: ORANGE, color: "#fff", cursor: "pointer" }}>
                  Upload file
                  <input type="file" accept="video/*,image/*" onChange={onFileSelect} style={{ display: "none" }} />
                </label>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW */}
        {recordingStep === 'preview' && recordedPreviewUrl && (
          <div>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "1", marginBottom: 16 }}>
              <video src={recordedPreviewUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onRetake} style={{ ...btnStyle, flex: 1, background: g.bg, color: g.t1, border: "1px solid #e8e8ed" }}>Retake</button>
              <button onClick={onUseVideo} style={{ ...btnStyle, flex: 1, background: ORANGE, color: "#fff" }}>Use this</button>
            </div>
          </div>
        )}

        {/* CONSENT */}
        {recordingStep === 'consent' && (
          <div>
            {recordedPreviewUrl && (
              <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: 16 }}>
                <video src={recordedPreviewUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 16 }}>
              <input type="checkbox" checked={ugcConsent} onChange={e => setUgcConsent(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: TEAL }} />
              <span style={{ fontSize: 13, color: g.t2, lineHeight: 1.5 }}>I consent to sharing this publicly as part of the Butterfly Challenge culture. I understand it will be reviewed before appearing.</span>
            </label>
            <button onClick={onUpload} disabled={!ugcConsent || ugcUploading} style={{ ...btnStyle, width: "100%", background: ugcConsent ? TEAL : g.bdr, color: "#fff", opacity: ugcConsent && !ugcUploading ? 1 : 0.5 }}>
              {ugcUploading ? 'Uploading...' : 'Share it'}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {recordingStep === 'success' && (
          <div style={{ textAlign: "center", padding: "20px 0", animation: `fadeUp .4s ${ease}` }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🦋</span>
            <p style={{ fontSize: 20, fontWeight: 600, color: g.t1, marginBottom: 6 }}>Shared!</p>
            <p style={{ fontSize: 14, color: g.t3 }}>Your story will appear after review.</p>
          </div>
        )}
      </div>
    </Popup>
  );
}

/* ── Auth Popup ── */
