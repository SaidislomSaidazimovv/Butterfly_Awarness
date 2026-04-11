// Data arrays and lookup tables
import {
  ICON_CREATORS, ICON_CELEBRITIES, ICON_ATHLETES, ICON_MUSIC, ICON_DANCE,
  ICON_FILM, ICON_FASHION, ICON_ART, ICON_FAITH, ICON_GAMING, ICON_PODCAST,
  ICON_EVERYONE, AL_PLATFORMS, AL_CARE, AL_MEDIA, AL_BUSINESS, AL_EDUCATION,
  AL_CONNECTIVITY, HL_IMG1, HL_IMG2, HL_IMG3, HL_IMG4
} from '../constants/index.js';

export const CAPS = [
  { id: "a", text: "I'm doing the #ButterflyChallenge. [Name], I see you. I care. You're not alone. Lifting 3 more: @__ @__ @__" },
  { id: "b", text: "A 60\u2011second check\u2011in. [Name], I got you. #ButterflyChallenge Lifting 3: @__ @__ @__" },
  { id: "c", text: "If you're carrying something in silence: I see you. I care. You're not alone. #ButterflyChallenge" },
];
export const ROLES = [
  { icon: ICON_CREATORS, name: "Creators", word: "Ignition", line: "You have the reach.", detail: "When a creator makes the sign, their audience doesn't see a campaign. They see someone they trust showing up. We're inviting a founding group to help ignite this into culture. One video. Three nominations. Forever." },
  { icon: ICON_CELEBRITIES, name: "Celebrities", word: "Consequence", line: "A voice the world trusts.", detail: "When a celebrity makes the sign, the world doesn't see a promotion. It sees a person saying something true. Not ambassadors \u2014 people who chose to show up when it mattered." },
  { icon: ICON_ATHLETES, name: "Athletes", word: "Strength", line: "Showing up is strength.", detail: "When an athlete makes the sign, people see courage. Sport is where humanity processes its hardest emotions. The stadium is where people feel together." },
  { icon: ICON_MUSIC, name: "Music", word: "Sound", line: "Before language, there's sound.", detail: "Music reaches where words stop. 1 billion people carry something in silence. That silence has never had a sound. Until now." },
  { icon: ICON_DANCE, name: "Dance", word: "Motion", line: "A body before a word.", detail: "Dance turns emotion into motion. Every movement that lived in the body outlasted every movement that lived only in the mind." },
  { icon: ICON_FILM, name: "Film", word: "Story", line: "A story before memory.", detail: "Film shapes how the world sees culture. April 30. Miami. The story begins there. One story told honestly." },
  { icon: ICON_FASHION, name: "Fashion", word: "Statement", line: "A statement before a speech.", detail: "What people wear is what people mean. When fashion carries the butterfly, the movement is being worn into the world." },
  { icon: ICON_ART, name: "Art", word: "Image", line: "An image before explanation.", detail: "Art makes the invisible impossible to ignore. The first works don't decorate the movement \u2014 they define how the world remembers it." },
  { icon: ICON_FAITH, name: "Faith", word: "Trust", line: "Trust before reach.", detail: "Faith and community go where no campaign can \u2014 into homes, families, grief, ordinary life. A signal anyone can make." },
  { icon: ICON_GAMING, name: "Gaming", word: "World", line: "3.6 billion players.", detail: "Gaming is belonging. Teams, squads, shared missions. The butterfly is a signal waiting to become a mission." },
  { icon: ICON_PODCAST, name: "Podcast", word: "Voice", line: "Too personal for the feed.", detail: "The most powerful thing a host can do is not explain the movement \u2014 it's to say: I made the sign. I thought of someone I love." },
  { icon: ICON_EVERYONE, name: "Everyone", word: "Humanity", line: "You need one person.", detail: "You don't need followers or a camera. You need one name in your mind and sixty seconds of courage." },
];
export const ALLIANCES = [
  { icon: AL_PLATFORMS, name: "Platforms", line: "How a movement travels.", brief: "TikTok, YouTube, Meta, Instagram, X. Feature the challenge, enable sign filters, nomination mechanics. BOS Help Button before launch.", tint: "invert(37%) sepia(78%) saturate(2476%) hue-rotate(203deg) brightness(101%)" },
  { icon: AL_CARE, name: "Care", line: "Joining people already showing up.", brief: "Mental health orgs, NGOs, foundations. Verified on the Human Routing Map. The movement points toward care \u2014 never replaces it.", tint: "invert(30%) sepia(95%) saturate(3000%) hue-rotate(340deg) brightness(95%)" },
  { icon: AL_MEDIA, name: "Media", line: "How a movement is witnessed.", brief: "Broadcasters, publishers, press. IASP safe messaging in every piece of coverage. April 30 access.", tint: "invert(55%) sepia(95%) saturate(2000%) hue-rotate(10deg) brightness(100%)" },
  { icon: AL_BUSINESS, name: "Business", line: "How it becomes culture.", brief: "Brands, employers, CSR teams. Butterfly Month in your calendar. No emotional washing.", tint: "invert(20%) sepia(80%) saturate(3000%) hue-rotate(260deg) brightness(90%)" },
  { icon: AL_EDUCATION, name: "Education", line: "The next generation.", brief: "Schools, universities, youth orgs. No student encounters the challenge without a pathway to real support.", tint: "invert(45%) sepia(90%) saturate(1800%) hue-rotate(130deg) brightness(92%)" },
  { icon: AL_CONNECTIVITY, name: "Connectivity", line: "Every hand.", brief: "Telcos, SMS, device ecosystems. The person with no data can still find help. Always.", tint: "invert(45%) sepia(80%) saturate(2000%) hue-rotate(165deg) brightness(95%)" },
];
export const TRUST = [{ m: "\u{1f3db}", t: "501(c)(3) Nonprofit", d: "Independent governance. Auditable from Day 1." }, { m: "\u{1f6e1}", t: "Safety Officer", d: "Unilateral veto. Cannot be overruled." }, { m: "\u{1f4e1}", t: "Radical Transparency", d: "Weekly: Money In \u2192 Out \u2192 Programs \u2192 Outcomes." }, { m: "\u2696\ufe0f", t: "Editorial Independence", d: "No sponsor has editorial control. Ever." }, { m: "\u{1f30d}", t: "Dignity-First", d: "Non-diagnostic. IASP safe messaging." }, { m: "\u2705", t: "Free Forever", d: "Open to everyone, everywhere." }];
export const CRISIS = [{ c: "US & Canada", n: "988", s: "24/7" }, { c: "UK", n: "116 123", s: "Samaritans" }, { c: "Australia", n: "13 11 14", s: "Lifeline" }, { c: "France", n: "3114", s: "24/7" }, { c: "Germany", n: "0800 111 0 111", s: "24/7" }, { c: "India", n: "+91 9999 666 555", s: "24/7" }];
export const FAQS = [{ q: "What is the Butterfly Challenge?", a: "A 60-second act of connection. Make the sign, say the message, challenge 3 others. Free forever." }, { q: "Why a butterfly?", a: "The most universal symbol of transformation. Already recognized in ASL. No translation needed." }, { q: "Do I need to donate?", a: "No. The challenge is free for everyone, everywhere, forever." }, { q: "Is this therapy?", a: "No. It's a signal. Crisis resources are on this page." }, { q: "What is Butterfly Month?", a: "May, every year. The globally recognized month for mental health." }, { q: "Who is behind this?", a: "ONE HUMANITY Foundation \u2014 U.S. 501(c)(3). 100% to mental health." }];
export const CDATA = { "United States": { lat: 39.8, lng: -98.5, cities: { "New York": [40.71, -74.01] } }, "United Kingdom": { lat: 55.4, lng: -3.4, cities: { "London": [51.51, -0.13] } }, "Canada": { lat: 56, lng: -106, cities: {} }, "Germany": { lat: 51, lng: 10.5, cities: { "Berlin": [52.52, 13.41] } }, "Brazil": { lat: -14, lng: -52, cities: { "S\u00e3o Paulo": [-23.55, -46.63] } }, "India": { lat: 20.6, lng: 79, cities: { "Mumbai": [19.08, 72.88] } }, "Japan": { lat: 36, lng: 138, cities: { "Tokyo": [35.68, 139.69] } }, "Australia": { lat: -25, lng: 134, cities: { "Sydney": [-33.87, 151.21] } }, "South Africa": { lat: -31, lng: 23, cities: {} }, "Kenya": { lat: 0, lng: 38, cities: { "Nairobi": [-1.29, 36.82] } }, "Mexico": { lat: 24, lng: -103, cities: {} }, "Uzbekistan": { lat: 41, lng: 65, cities: {} }, "Other": { lat: 0, lng: 0, cities: {} } };
export const SEED = [{ id: "s1", country: "United States", city: "New York", lat: 40.71, lng: -74.01, createdAt: Date.now() - 12e4 }, { id: "s2", country: "United Kingdom", city: "London", lat: 51.51, lng: -0.13, createdAt: Date.now() - 3e5 }, { id: "s3", country: "Brazil", city: "S\u00e3o Paulo", lat: -23.55, lng: -46.63, createdAt: Date.now() - 6e5 }, { id: "s4", country: "Japan", city: "Tokyo", lat: 35.68, lng: 139.69, createdAt: Date.now() - 9e5 }, { id: "s5", country: "India", city: "Mumbai", lat: 19.08, lng: 72.88, createdAt: Date.now() - 18e5 }, { id: "s6", country: "Kenya", city: "Nairobi", lat: -1.29, lng: 36.82, createdAt: Date.now() - 36e5 }, { id: "s7", country: "Australia", city: "Sydney", lat: -33.87, lng: 151.21, createdAt: Date.now() - 54e5 }, { id: "s8", country: "Germany", city: "Berlin", lat: 52.52, lng: 13.41, createdAt: Date.now() - 72e5 }];
export const TL_EVENTS = [
  { d: "Apr 30", t: "One Night For One Humanity", s: "Queen Miami Beach \u00b7 Founding event", detail: "The night that starts everything. The Hero Act is revealed live. The founding partners are recognized. The Butterfly Challenge launches the next morning. Miami Grand Prix Weekend \u2014 the world is already watching.", status: "next" },
  { d: "May 1", t: "Butterfly Month begins", s: "Challenge goes global", detail: "May 1 is Day One. The challenge goes live worldwide. Creators activate. Every platform, every language, every country. The butterfly starts to fly.", status: "future" },
  { d: "May\u2013Jun", t: "Culture surfaces activate", s: "Sport \u00b7 Music \u00b7 Film \u00b7 Fashion", detail: "The butterfly sign enters stadiums, concert stages, runways, film sets. Every cultural surface that agreed to carry the signal activates during this window.", status: "future" },
  { d: "Jul 19", t: "FIFA World Cup Final", s: "MetLife Stadium \u00b7 5 billion watching", detail: "The biggest single-audience moment in human history. If the butterfly sign is visible here, 5 billion people see it in the same second. That's the goal.", status: "future" },
  { d: "Sep 2026", t: "UN General Assembly", s: "Butterfly Week \u00b7 Institutional mandate", detail: "The movement goes institutional. Butterfly Week at the United Nations. The ask: formally recognize May as Global Mental Health Awareness Month with the butterfly as the international symbol.", status: "future" },
];
export const HL_CARDS = [
  { img: HL_IMG1, title: "Nearly 1 billion people live with a mental health condition.", sub: "WHO, 2025", color: "#065f46" },
  { img: HL_IMG2, title: "There's never been a universal gesture that says: I see you and I care.", sub: "Until now.", color: "#0c4a6e" },
  { img: HL_IMG3, title: "May is Butterfly Month. The globally recognized month for mental health.", sub: "Starting 2026.", color: "#78350f" },
  { img: HL_IMG4, title: "One becomes three becomes nine becomes a billion.", sub: "Lift 3 More.", color: "#3b0764" },
];
export const SUPPORT_COUNTRIES = {
  "United Kingdom": { name: "Samaritans", number: "116 123", url: "https://www.samaritans.org" },
  "Australia": { name: "Lifeline", number: "13 11 14", url: "https://www.lifeline.org.au" },
  "Canada": { name: "Talk Suicide Canada", number: "1-833-456-4566", url: "https://talksuicide.ca" },
  "France": { name: "SOS Amiti\u00e9", number: "3114", url: "https://www.sos-amitie.com" },
  "Germany": { name: "Telefonseelsorge", number: "0800 111 0 111", url: "https://www.telefonseelsorge.de" },
  "India": { name: "iCall", number: "9152987821", url: "https://icallhelpline.org" },
  "Japan": { name: "TELL Lifeline", number: "03-5774-0992", url: "https://telljp.com" },
  "Brazil": { name: "CVV", number: "188", url: "https://www.cvv.org.br" },
  "South Africa": { name: "SADAG", number: "0800 567 567", url: "https://www.sadag.org" },
  "New Zealand": { name: "Lifeline NZ", number: "0800 543 354", url: "https://www.lifeline.org.nz" },
};
