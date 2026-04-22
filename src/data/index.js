// Data arrays and lookup tables
import {
  ICON_CREATORS, ICON_CELEBRITIES, ICON_ATHLETES, ICON_MUSIC, ICON_DANCE,
  ICON_FILM, ICON_FASHION, ICON_ART, ICON_FAITH, ICON_GAMING, ICON_PODCAST,
  ICON_EVERYONE, AL_PLATFORMS, AL_CARE, AL_MEDIA, AL_BUSINESS, AL_EDUCATION,
  AL_CONNECTIVITY, HL_IMG1, HL_IMG2, HL_IMG3, HL_IMG4
} from '../constants/index.js';

export const CAPS = [
  { id: "a", key: "a" },
  { id: "b", key: "b" },
  { id: "c", key: "c" },
];
export const ROLES = [
  { id: "creators", icon: ICON_CREATORS },
  { id: "celebrities", icon: ICON_CELEBRITIES },
  { id: "athletes", icon: ICON_ATHLETES },
  { id: "music", icon: ICON_MUSIC },
  { id: "dance", icon: ICON_DANCE },
  { id: "film", icon: ICON_FILM },
  { id: "fashion", icon: ICON_FASHION },
  { id: "art", icon: ICON_ART },
  { id: "faith", icon: ICON_FAITH },
  { id: "gaming", icon: ICON_GAMING },
  { id: "podcast", icon: ICON_PODCAST },
  { id: "everyone", icon: ICON_EVERYONE },
];
export const ALLIANCES = [
  { id: "platforms", icon: AL_PLATFORMS, tint: "invert(37%) sepia(78%) saturate(2476%) hue-rotate(203deg) brightness(101%)" },
  { id: "care", icon: AL_CARE, tint: "invert(30%) sepia(95%) saturate(3000%) hue-rotate(340deg) brightness(95%)" },
  { id: "media", icon: AL_MEDIA, tint: "invert(55%) sepia(95%) saturate(2000%) hue-rotate(10deg) brightness(100%)" },
  { id: "business", icon: AL_BUSINESS, tint: "invert(20%) sepia(80%) saturate(3000%) hue-rotate(260deg) brightness(90%)" },
  { id: "education", icon: AL_EDUCATION, tint: "invert(45%) sepia(90%) saturate(1800%) hue-rotate(130deg) brightness(92%)" },
  { id: "connectivity", icon: AL_CONNECTIVITY, tint: "invert(45%) sepia(80%) saturate(2000%) hue-rotate(165deg) brightness(95%)" },
];
export const TRUST = [
  { id: "nonprofit", m: "\u{1f3db}" },
  { id: "safety", m: "\u{1f6e1}" },
  { id: "transparency", m: "\u{1f4e1}" },
  { id: "editorial", m: "⚖️" },
  { id: "dignity", m: "\u{1f30d}" },
  { id: "free", m: "✅" },
];
export const CRISIS = [
  { c: "US & Canada", n: "988", s: "24/7" },
  { c: "UK", n: "116 123", s: "Samaritans" },
  { c: "Australia", n: "13 11 14", s: "Lifeline" },
  { c: "France", n: "3114", s: "24/7" },
  { c: "Germany", n: "0800 111 0 111", s: "24/7" },
  { c: "India", n: "+91 9999 666 555", s: "24/7" },
];
export const FAQS = [
  { id: "what" }, { id: "why" }, { id: "donate" }, { id: "therapy" }, { id: "month" }, { id: "who" },
];
export const CDATA = { "United States": { lat: 39.8, lng: -98.5, cities: { "New York": [40.71, -74.01] } }, "United Kingdom": { lat: 55.4, lng: -3.4, cities: { "London": [51.51, -0.13] } }, "Canada": { lat: 56, lng: -106, cities: {} }, "Germany": { lat: 51, lng: 10.5, cities: { "Berlin": [52.52, 13.41] } }, "Brazil": { lat: -14, lng: -52, cities: { "São Paulo": [-23.55, -46.63] } }, "India": { lat: 20.6, lng: 79, cities: { "Mumbai": [19.08, 72.88] } }, "Japan": { lat: 36, lng: 138, cities: { "Tokyo": [35.68, 139.69] } }, "Australia": { lat: -25, lng: 134, cities: { "Sydney": [-33.87, 151.21] } }, "South Africa": { lat: -31, lng: 23, cities: {} }, "Kenya": { lat: 0, lng: 38, cities: { "Nairobi": [-1.29, 36.82] } }, "Mexico": { lat: 24, lng: -103, cities: {} }, "Uzbekistan": { lat: 41, lng: 65, cities: {} }, "Other": { lat: 0, lng: 0, cities: {} } };
export const SEED = [{ id: "s1", country: "United States", city: "New York", lat: 40.71, lng: -74.01, createdAt: Date.now() - 12e4 }, { id: "s2", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13, createdAt: Date.now() - 3e5 }, { id: "s3", country: "Brazil", city: "São Paulo", lat: -23.55, lng: -46.63, createdAt: Date.now() - 6e5 }, { id: "s4", country: "Japan", city: "Tokyo", lat: 35.68, lng: 139.69, createdAt: Date.now() - 9e5 }, { id: "s5", country: "India", city: "Mumbai", lat: 19.08, lng: 72.88, createdAt: Date.now() - 18e5 }, { id: "s6", country: "Kenya", city: "Nairobi", lat: -1.29, lng: 36.82, createdAt: Date.now() - 36e5 }, { id: "s7", country: "Australia", city: "Sydney", lat: -33.87, lng: 151.21, createdAt: Date.now() - 54e5 }, { id: "s8", country: "Germany", city: "Berlin", lat: 52.52, lng: 13.41, createdAt: Date.now() - 72e5 }];
export const TL_EVENTS = [
  { id: "apr30", d: "Apr 30", status: "next" },
  { id: "may1", d: "May 1", status: "future" },
  { id: "mayJun", d: "May–Jun", status: "future" },
  { id: "jul19", d: "Jul 19", status: "future" },
  { id: "sep2026", d: "Sep 2026", status: "future" },
];
export const HL_CARDS = [
  { id: "card1", img: HL_IMG1, color: "#065f46" },
  { id: "card2", img: HL_IMG2, color: "#0c4a6e" },
  { id: "card3", img: HL_IMG3, color: "#78350f" },
  { id: "card4", img: HL_IMG4, color: "#3b0764" },
];
export const SUPPORT_COUNTRIES = {
  "United Kingdom": { name: "Samaritans", number: "116 123", url: "https://www.samaritans.org" },
  "Australia": { name: "Lifeline", number: "13 11 14", url: "https://www.lifeline.org.au" },
  "Canada": { name: "Talk Suicide Canada", number: "1-833-456-4566", url: "https://talksuicide.ca" },
  "France": { name: "SOS Amitié", number: "3114", url: "https://www.sos-amitie.com" },
  "Germany": { name: "Telefonseelsorge", number: "0800 111 0 111", url: "https://www.telefonseelsorge.de" },
  "India": { name: "iCall", number: "9152987821", url: "https://icallhelpline.org" },
  "Japan": { name: "TELL Lifeline", number: "03-5774-0992", url: "https://telljp.com" },
  "Brazil": { name: "CVV", number: "188", url: "https://www.cvv.org.br" },
  "South Africa": { name: "SADAG", number: "0800 567 567", url: "https://www.sadag.org" },
  "New Zealand": { name: "Lifeline NZ", number: "0800 543 354", url: "https://www.lifeline.org.nz" },
};
