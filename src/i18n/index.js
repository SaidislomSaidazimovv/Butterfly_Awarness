import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map(l => l.code));
export const RTL_LANGS = new Set(['ar']);

// Country → language mapping. Everything not listed falls back to 'en'.
const SPANISH_COUNTRIES = new Set([
  'ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY',
  'CR', 'PA', 'DO', 'CU', 'HN', 'SV', 'NI', 'GT', 'PR', 'GQ',
]);

const FRENCH_COUNTRIES = new Set([
  'FR', 'BE', 'LU', 'MC', 'CH', 'HT',
  // African Francophone majority
  'SN', 'CI', 'ML', 'NE', 'BF', 'BJ', 'TG', 'CM', 'GA', 'CG', 'CD',
  'RW', 'BI', 'MG', 'KM', 'DJ', 'GN', 'MR',
  // French overseas
  'PF', 'NC', 'RE', 'GP', 'MQ', 'YT', 'GF', 'PM', 'WF',
]);

const ARABIC_COUNTRIES = new Set([
  'SA', 'AE', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'OM', 'PS',
  'QA', 'SY', 'TN', 'YE', 'BH', 'DZ', 'SD', 'SO', 'TD', 'ER',
]);

export function mapCountryToLang(cc) {
  if (!cc) return null;
  const code = cc.toUpperCase();
  if (SPANISH_COUNTRIES.has(code)) return 'es';
  if (FRENCH_COUNTRIES.has(code)) return 'fr';
  if (ARABIC_COUNTRIES.has(code)) return 'ar';
  return 'en';
}

function detectBrowserLang() {
  try {
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const l of langs) {
      if (!l) continue;
      const base = l.split('-')[0].toLowerCase();
      if (SUPPORTED_CODES.has(base)) return base;
    }
  } catch {}
  return null;
}

function applyDirection(lang) {
  if (typeof document === 'undefined') return;
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}

const STORED = typeof localStorage !== 'undefined' ? localStorage.getItem('bc_lang') : null;
const BROWSER = detectBrowserLang();
const INITIAL_LANG = STORED || BROWSER || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: INITIAL_LANG,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

applyDirection(INITIAL_LANG);
i18n.on('languageChanged', applyDirection);

export default i18n;
