// 350 synthetic hand_raises to warm-start the visible count, globe, feed,
// and leaderboards. Deterministically generated from a seeded PRNG so the
// data is stable across renders/sessions. Does NOT write to Supabase —
// merged client-side on top of real data.

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CITY_POOL = [
  ["US", "New York", 40.71, -74.01, 6],
  ["US", "Los Angeles", 34.05, -118.24, 5],
  ["US", "Chicago", 41.88, -87.63, 3],
  ["US", "Houston", 29.76, -95.37, 2],
  ["US", "Miami", 25.76, -80.19, 3],
  ["US", "San Francisco", 37.77, -122.42, 3],
  ["US", "Seattle", 47.61, -122.33, 2],
  ["US", "Boston", 42.36, -71.06, 2],
  ["US", "Atlanta", 33.75, -84.39, 2],
  ["US", "Austin", 30.27, -97.74, 2],
  ["US", "Denver", 39.74, -104.99, 1],
  ["US", "Phoenix", 33.45, -112.07, 1],
  ["GB", "London", 51.51, -0.13, 6],
  ["GB", "Manchester", 53.48, -2.24, 2],
  ["GB", "Birmingham", 52.49, -1.90, 1],
  ["GB", "Edinburgh", 55.95, -3.19, 1],
  ["GB", "Glasgow", 55.86, -4.25, 1],
  ["CA", "Toronto", 43.65, -79.38, 3],
  ["CA", "Vancouver", 49.28, -123.12, 2],
  ["CA", "Montreal", 45.50, -73.57, 2],
  ["MX", "Mexico City", 19.43, -99.13, 3],
  ["MX", "Guadalajara", 20.66, -103.35, 1],
  ["BR", "São Paulo", -23.55, -46.63, 5],
  ["BR", "Rio de Janeiro", -22.90, -43.17, 3],
  ["BR", "Brasília", -15.83, -47.88, 1],
  ["BR", "Salvador", -12.97, -38.50, 1],
  ["AR", "Buenos Aires", -34.60, -58.38, 3],
  ["AR", "Córdoba", -31.42, -64.18, 1],
  ["CL", "Santiago", -33.45, -70.67, 2],
  ["CO", "Bogotá", 4.71, -74.07, 2],
  ["CO", "Medellín", 6.24, -75.57, 1],
  ["PE", "Lima", -12.05, -77.04, 2],
  ["FR", "Paris", 48.86, 2.35, 4],
  ["FR", "Marseille", 43.30, 5.37, 1],
  ["FR", "Lyon", 45.76, 4.84, 1],
  ["DE", "Berlin", 52.52, 13.41, 3],
  ["DE", "Munich", 48.14, 11.58, 2],
  ["DE", "Hamburg", 53.55, 9.99, 1],
  ["DE", "Frankfurt", 50.11, 8.68, 1],
  ["ES", "Madrid", 40.42, -3.70, 2],
  ["ES", "Barcelona", 41.39, 2.17, 2],
  ["IT", "Rome", 41.90, 12.50, 2],
  ["IT", "Milan", 45.46, 9.19, 2],
  ["PT", "Lisbon", 38.72, -9.14, 1],
  ["NL", "Amsterdam", 52.37, 4.90, 2],
  ["BE", "Brussels", 50.85, 4.35, 1],
  ["CH", "Zurich", 47.38, 8.54, 1],
  ["AT", "Vienna", 48.21, 16.37, 1],
  ["SE", "Stockholm", 59.33, 18.07, 1],
  ["NO", "Oslo", 59.91, 10.75, 1],
  ["DK", "Copenhagen", 55.68, 12.57, 1],
  ["FI", "Helsinki", 60.17, 24.94, 1],
  ["IE", "Dublin", 53.35, -6.26, 1],
  ["PL", "Warsaw", 52.23, 21.01, 2],
  ["PL", "Kraków", 50.06, 19.94, 1],
  ["CZ", "Prague", 50.08, 14.44, 1],
  ["GR", "Athens", 37.98, 23.73, 1],
  ["TR", "Istanbul", 41.01, 28.98, 3],
  ["TR", "Ankara", 39.93, 32.87, 1],
  ["UA", "Kyiv", 50.45, 30.52, 2],
  ["RO", "Bucharest", 44.43, 26.10, 1],
  ["RU", "Moscow", 55.75, 37.62, 3],
  ["RU", "Saint Petersburg", 59.93, 30.34, 1],
  ["JP", "Tokyo", 35.68, 139.69, 5],
  ["JP", "Osaka", 34.69, 135.50, 2],
  ["JP", "Kyoto", 35.01, 135.77, 1],
  ["KR", "Seoul", 37.57, 126.98, 3],
  ["KR", "Busan", 35.18, 129.08, 1],
  ["CN", "Beijing", 39.90, 116.41, 3],
  ["CN", "Shanghai", 31.23, 121.47, 3],
  ["CN", "Guangzhou", 23.13, 113.26, 1],
  ["IN", "Mumbai", 19.08, 72.88, 4],
  ["IN", "Delhi", 28.61, 77.21, 4],
  ["IN", "Bangalore", 12.97, 77.59, 3],
  ["IN", "Chennai", 13.08, 80.27, 2],
  ["IN", "Kolkata", 22.57, 88.36, 2],
  ["IN", "Hyderabad", 17.39, 78.49, 2],
  ["PK", "Karachi", 24.86, 67.01, 2],
  ["PK", "Lahore", 31.55, 74.34, 1],
  ["BD", "Dhaka", 23.81, 90.41, 2],
  ["ID", "Jakarta", -6.21, 106.85, 2],
  ["ID", "Surabaya", -7.25, 112.75, 1],
  ["PH", "Manila", 14.60, 120.98, 2],
  ["TH", "Bangkok", 13.75, 100.50, 2],
  ["VN", "Ho Chi Minh City", 10.77, 106.70, 2],
  ["VN", "Hanoi", 21.03, 105.85, 1],
  ["MY", "Kuala Lumpur", 3.14, 101.69, 1],
  ["SG", "Singapore", 1.35, 103.82, 2],
  ["AU", "Sydney", -33.87, 151.21, 3],
  ["AU", "Melbourne", -37.81, 144.96, 2],
  ["AU", "Brisbane", -27.47, 153.03, 1],
  ["NZ", "Auckland", -36.85, 174.76, 1],
  ["NZ", "Wellington", -41.29, 174.78, 1],
  ["ZA", "Johannesburg", -26.20, 28.04, 2],
  ["ZA", "Cape Town", -33.92, 18.42, 2],
  ["NG", "Lagos", 6.52, 3.38, 2],
  ["NG", "Abuja", 9.08, 7.49, 1],
  ["KE", "Nairobi", -1.29, 36.82, 2],
  ["EG", "Cairo", 30.04, 31.24, 2],
  ["MA", "Casablanca", 33.57, -7.59, 1],
  ["ET", "Addis Ababa", 9.03, 38.74, 1],
  ["GH", "Accra", 5.60, -0.19, 1],
  ["SA", "Riyadh", 24.71, 46.68, 1],
  ["AE", "Dubai", 25.20, 55.27, 2],
  ["AE", "Abu Dhabi", 24.47, 54.37, 1],
  ["IL", "Tel Aviv", 32.09, 34.78, 1],
  ["QA", "Doha", 25.29, 51.53, 1],
  ["KZ", "Almaty", 43.24, 76.95, 1],
  ["UZ", "Tashkent", 41.30, 69.24, 1],
  ["IS", "Reykjavík", 64.13, -21.94, 1],
];

const PARTICIPANT_NAMES = [
  "Aarav S.", "Yuki T.", "Lucas Silva", "Amara O.", "Emma Müller",
  "Noah Chen", "Sofia Rossi", "Omar Khalil", "Priya N.", "Daniel Cohen",
  "Mateo García", "Hana Park", "Kwame Mensah", "Lina Nguyen", "Felix Brandt",
  "Ines Almeida", "Raj Patel", "Zara Ahmed", "Hugo Martín", "Keiko Sato",
];

function generate() {
  const rand = mulberry32(2026_04_30);
  const poolWeights = CITY_POOL.map(([, , , , w]) => w);
  const totalWeight = poolWeights.reduce((a, b) => a + b, 0);
  const pick = () => {
    let r = rand() * totalWeight;
    for (let i = 0; i < CITY_POOL.length; i++) {
      r -= poolWeights[i];
      if (r <= 0) return CITY_POOL[i];
    }
    return CITY_POOL[CITY_POOL.length - 1];
  };

  const now = Date.now();
  const MINUTE = 60_000;
  const HOUR = 3_600_000;
  const DAY = 86_400_000;
  const entries = [];

  // First 30 entries are guaranteed fresh — staggered over the last 3 hours,
  // with varied cities so the feed never looks idle.
  const seenCountries = new Set();
  for (let i = 0; i < 30; i++) {
    let [country, city, lat, lng] = pick();
    // Nudge first 12 slots to distinct countries for maximum variety at the top
    let tries = 0;
    while (i < 12 && seenCountries.has(country) && tries < 20) {
      [country, city, lat, lng] = pick();
      tries++;
    }
    seenCountries.add(country);
    const minutesAgo = i * 5 + Math.floor(rand() * 6);
    entries.push({
      id: `syn_h_${i}`,
      country, city,
      lat: lat + (rand() - 0.5) * 0.6,
      lng: lng + (rand() - 0.5) * 0.6,
      createdAt: now - minutesAgo * MINUTE,
    });
  }

  // Remaining 320 entries spread over the last 30 days (u² bias toward recent)
  for (let i = 0; i < 320; i++) {
    const [country, city, lat, lng] = pick();
    const u = rand();
    const daysAgo = 0.15 + (u * u) * 29.85;
    entries.push({
      id: `syn_${i.toString(36)}`,
      country, city,
      lat: lat + (rand() - 0.5) * 0.6,
      lng: lng + (rand() - 0.5) * 0.6,
      createdAt: now - daysAgo * DAY,
    });
  }
  entries.sort((a, b) => b.createdAt - a.createdAt);

  // Aggregate for leaderboards
  const cByCountry = new Map();
  const cByCity = new Map();
  for (const e of entries) {
    cByCountry.set(e.country, (cByCountry.get(e.country) || 0) + 1);
    cByCity.set(e.city, (cByCity.get(e.city) || 0) + 1);
  }
  const countries = [...cByCountry.entries()]
    .map(([country_code, count]) => ({ country_code, count }))
    .sort((a, b) => b.count - a.count);
  const cities = [...cByCity.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  // Synthetic top participants (3-9 actions each)
  const participants = PARTICIPANT_NAMES.map((name, i) => ({
    name,
    avatar: null,
    count: 3 + Math.floor(rand() * 7),
    _syn: true,
  })).sort((a, b) => b.count - a.count);

  return { entries, countries, cities, participants };
}

const { entries, countries, cities, participants } = generate();
export const SYNTHETIC_ENTRIES = entries;
export const SYNTHETIC_COUNTRIES = countries;
export const SYNTHETIC_CITIES = cities;
export const SYNTHETIC_PARTICIPANTS = participants;
