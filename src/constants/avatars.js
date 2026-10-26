/**
 * Koleksi Karakter Avatar Siap Pakai (Vector SVG Base64 / Data URI).
 * Ringan, tajam di semua resolusi layar, dan tidak membebani jaringan WebRTC.
 */

export const PRESET_AVATARS = [
  {
    id: 'char-dev',
    title: 'Developer',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%234338ca"/><circle cx="50" cy="42" r="20" fill="%23fcd34d"/><path d="M22 88c0-15.5 12.5-28 28-28s28 12.5 28 28" fill="%231e1b4b"/><rect x="36" y="38" width="11" height="8" rx="2" fill="%231e1b4b"/><rect x="53" y="38" width="11" height="8" rx="2" fill="%231e1b4b"/><rect x="47" y="41" width="6" height="2" fill="%231e1b4b"/><path d="M28 42c0-12 10-22 22-22s22 10 22 22" fill="none" stroke="%236366f1" stroke-width="4"/><circle cx="28" cy="43" r="6" fill="%236366f1"/><circle cx="72" cy="43" r="6" fill="%236366f1"/></svg>`,
  },
  {
    id: 'char-hacker',
    title: 'Cyber Hacker',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23064e3b"/><path d="M50 20c-16 0-26 12-26 28v22c0 10 8 18 26 18s26-8 26-18V48c0-16-10-28-26-28z" fill="%23047857"/><circle cx="50" cy="46" r="15" fill="%23022c22"/><rect x="37" y="42" width="26" height="6" rx="3" fill="%2334d399"/><path d="M20 90c0-16 13.5-28 30-28s30 12 30 28" fill="%23022c22"/></svg>`,
  },
  {
    id: 'char-robot',
    title: 'Cute Robot',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230369a1"/><rect x="30" y="30" width="40" height="32" rx="8" fill="%23e0f2fe"/><circle cx="42" cy="44" r="5" fill="%230284c7"/><circle cx="58" cy="44" r="5" fill="%230284c7"/><line x1="42" y1="54" x2="58" y2="54" stroke="%230284c7" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="19" r="4" fill="%2338bdf8"/><line x1="50" y1="23" x2="50" y2="30" stroke="%2338bdf8" stroke-width="3"/><path d="M25 90c0-14 11-24 25-24s25 10 25 24" fill="%23075985"/></svg>`,
  },
  {
    id: 'char-ninja',
    title: 'Code Ninja',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2318181b"/><circle cx="50" cy="44" r="22" fill="%2327272a"/><path d="M30 40h40v10H30z" fill="%23f43f5e"/><circle cx="43" cy="45" r="3.5" fill="%23fafafa"/><circle cx="57" cy="45" r="3.5" fill="%23fafafa"/><path d="M22 88c0-15 12.5-26 28-26s28 11 28 26" fill="%2309090b"/></svg>`,
  },
  {
    id: 'char-astronaut',
    title: 'Astronaut',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%231e1b4b"/><circle cx="50" cy="44" r="24" fill="%23f4f4f5"/><rect x="34" y="32" width="32" height="22" rx="10" fill="%2338bdf8"/><path d="M38 35c4-2 10-2 16 0" stroke="%23ffffff" stroke-width="2" stroke-linecap="round"/><path d="M22 90c0-15 12-25 28-25s28 10 28 25" fill="%23e4e4e7"/></svg>`,
  },
  {
    id: 'char-wizard',
    title: 'Tech Wizard',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23581c87"/><circle cx="50" cy="48" r="18" fill="%23fed7aa"/><path d="M24 40l26-24 26 24-10 6H34z" fill="%239333ea"/><circle cx="50" cy="16" r="3" fill="%23facc15"/><circle cx="43" cy="46" r="2.5" fill="%233b0764"/><circle cx="57" cy="46" r="2.5" fill="%233b0764"/><path d="M40 52c4 4 16 4 20 0" fill="none" stroke="%233b0764" stroke-width="2"/><path d="M22 90c0-14 12-23 28-23s28 9 28 23" fill="%233b0764"/></svg>`,
  },
  {
    id: 'char-gamer',
    title: 'Pro Gamer',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><circle cx="50" cy="44" r="20" fill="%23fed7aa"/><path d="M34 26c-8 6-12 16-8 26" stroke="%23f43f5e" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M66 26c8 6 12 16 8 26" stroke="%23f43f5e" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="25" y="42" width="6" height="12" rx="3" fill="%23f43f5e"/><rect x="69" y="42" width="6" height="12" rx="3" fill="%23f43f5e"/><circle cx="44" cy="43" r="3" fill="%231e293b"/><circle cx="56" cy="43" r="3" fill="%231e293b"/><path d="M22 90c0-15 12-25 28-25s28 10 28 25" fill="%23334155"/></svg>`,
  },
  {
    id: 'char-detective',
    title: 'Bug Detective',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2378350f"/><circle cx="50" cy="48" r="18" fill="%23ffedd5"/><ellipse cx="50" cy="34" rx="28" ry="6" fill="%2392400e"/><path d="M32 34l6-16h24l6 16z" fill="%23b45309"/><circle cx="44" cy="48" r="2.5" fill="%23451a03"/><circle cx="56" cy="48" r="2.5" fill="%23451a03"/><path d="M42 56c4 3 12 3 16 0" stroke="%23451a03" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M22 90c0-14 12-23 28-23s28 9 28 23" fill="%23451a03"/></svg>`,
  },
];
