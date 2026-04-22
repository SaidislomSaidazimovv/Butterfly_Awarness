import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index.js';
import { g, ff } from '../constants/index.js';
import { getLocationData } from '../utils/supabase.js';
import { track } from '../utils/track.js';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const pick = async (code) => {
    setOpen(false);
    if (code === i18n.language) return;
    await i18n.changeLanguage(code);
    try { localStorage.setItem('bc_lang', code); } catch {}
    try {
      const loc = await getLocationData();
      track('language_changed', { lang: code, country: loc.country, city: loc.city });
    } catch {
      track('language_changed', { lang: code });
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={`${t('language.label')}: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={current.label}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34,
          background: 'none', border: '1px solid ' + g.bdr, borderRadius: '50%',
          padding: 0, cursor: 'pointer', fontFamily: ff,
          fontSize: 17, lineHeight: 1,
        }}
      >
        <span aria-hidden="true">{current.flag}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
            background: '#fff', border: '1px solid rgba(0,0,0,.06)',
            borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,.08)',
            listStyle: 'none', padding: 4, margin: 0, minWidth: 140,
            animation: 'fadeUp .2s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {SUPPORTED_LANGUAGES.map(l => (
            <li key={l.code} role="option" aria-selected={l.code === i18n.language}>
              <button
                onClick={() => pick(l.code)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px',
                  background: l.code === i18n.language ? g.bg : 'none', border: 'none',
                  fontFamily: ff, fontSize: 13, color: g.t1, cursor: 'pointer',
                  borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span aria-hidden="true">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
