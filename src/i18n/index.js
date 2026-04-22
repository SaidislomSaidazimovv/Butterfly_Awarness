import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

const STORED = typeof localStorage !== 'undefined' ? localStorage.getItem('bc_lang') : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: STORED || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];
