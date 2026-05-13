// 차트별 고유 썸네일 SVG (57개)
// viewBox 0 0 100 75 (4:3 비율), 카테고리별 포인트 색상

const _BG = '<rect width="100" height="75" fill="#fff"/>';

const THUMBNAILS = {
  // ===== 비교 #2563EB =====
  "bar-vertical":
    _BG +
    '<rect x="12" y="40" width="10" height="25" fill="#2563EB"/>' +
    '<rect x="28" y="20" width="10" height="45" fill="#2563EB"/>' +
    '<rect x="44" y="30" width="10" height="35" fill="#2563EB"/>' +
    '<rect x="60" y="10" width="10" height="55" fill="#2563EB"/>' +
    '<rect x="76" y="25" width="10" height="40" fill="#2563EB"/>',

  "bar-horizontal":
    _BG +
    '<rect x="12" y="10" width="60" height="8" fill="#2563EB"/>' +
    '<rect x="12" y="22" width="80" height="8" fill="#2563EB"/>' +
    '<rect x="12" y="34" width="45" height="8" fill="#2563EB"/>' +
    '<rect x="12" y="46" width="70" height="8" fill="#2563EB"/>' +
    '<rect x="12" y="58" width="55" height="8" fill="#2563EB"/>',

  "dot-plot":
    _BG +
    '<line x1="10" y1="10" x2="10" y2="65" stroke="#94a3b8" stroke-width="0.6"/>' +
    '<line x1="10" y1="65" x2="92" y2="65" stroke="#94a3b8" stroke-width="0.6"/>' +
    '<circle cx="20" cy="50" r="3" fill="#2563EB"/>' +
    '<circle cx="30" cy="35" r="3" fill="#2563EB"/>' +
    '<circle cx="40" cy="42" r="3" fill="#2563EB"/>' +
    '<circle cx="50" cy="25" r="3" fill="#2563EB"/>' +
    '<circle cx="60" cy="20" r="3" fill="#2563EB"/>' +
    '<circle cx="70" cy="38" r="3" fill="#2563EB"/>' +
    '<circle cx="80" cy="48" r="3" fill="#2563EB"/>' +
    '<circle cx="88" cy="30" r="3" fill="#2563EB"/>',

  "bullet":
    _BG +
    '<rect x="10" y="32" width="78" height="14" fill="#BFDBFE"/>' +
    '<rect x="10" y="35" width="55" height="8" fill="#2563EB"/>' +
    '<line x1="68" y1="28" x2="68" y2="50" stroke="#1E40AF" stroke-width="2.5"/>',

  "radar":
    _BG +
    '<g fill="none" stroke="#cbd5e1" stroke-width="0.6">' +
    '<polygon points="50,12 73,28 65,55 35,55 27,28"/>' +
    '<polygon points="50,22 64,32 60,49 40,49 36,32"/>' +
    '<line x1="50" y1="37" x2="50" y2="12"/>' +
    '<line x1="50" y1="37" x2="73" y2="28"/>' +
    '<line x1="50" y1="37" x2="65" y2="55"/>' +
    '<line x1="50" y1="37" x2="35" y2="55"/>' +
    '<line x1="50" y1="37" x2="27" y2="28"/>' +
    "</g>" +
    '<polygon points="50,18 68,30 60,52 38,50 30,30" fill="#2563EB" fill-opacity="0.35" stroke="#2563EB" stroke-width="1.5"/>',

  pyramid:
    _BG +
    '<rect x="40" y="10" width="20" height="10" fill="#BFDBFE"/>' +
    '<rect x="32" y="22" width="36" height="10" fill="#93C5FD"/>' +
    '<rect x="25" y="34" width="50" height="10" fill="#60A5FA"/>' +
    '<rect x="17" y="46" width="66" height="10" fill="#3B82F6"/>' +
    '<rect x="10" y="58" width="80" height="8" fill="#2563EB"/>',

  // ===== 구성 #7C3AED =====
  pie:
    _BG +
    '<path d="M 50,37 L 50,12 A 25,25 0 0 1 75,37 Z" fill="#7C3AED"/>' +
    '<path d="M 50,37 L 75,37 A 25,25 0 0 1 50,62 Z" fill="#A78BFA"/>' +
    '<path d="M 50,37 L 50,62 A 25,25 0 0 1 25,37 Z" fill="#C4B5FD"/>' +
    '<path d="M 50,37 L 25,37 A 25,25 0 0 1 50,12 Z" fill="#DDD6FE"/>',

  doughnut:
    _BG +
    '<path d="M 50,37 L 50,12 A 25,25 0 0 1 75,37 Z" fill="#7C3AED"/>' +
    '<path d="M 50,37 L 75,37 A 25,25 0 0 1 50,62 Z" fill="#A78BFA"/>' +
    '<path d="M 50,37 L 50,62 A 25,25 0 0 1 25,37 Z" fill="#C4B5FD"/>' +
    '<path d="M 50,37 L 25,37 A 25,25 0 0 1 50,12 Z" fill="#DDD6FE"/>' +
    '<circle cx="50" cy="37" r="11" fill="#fff"/>' +
    '<text x="50" y="40" text-anchor="middle" font-size="9" font-weight="700" fill="#7C3AED" font-family="Arial,sans-serif">75%</text>',

  "stacked-bar":
    _BG +
    '<rect x="20" y="45" width="14" height="20" fill="#7C3AED"/>' +
    '<rect x="20" y="30" width="14" height="15" fill="#A78BFA"/>' +
    '<rect x="20" y="15" width="14" height="15" fill="#DDD6FE"/>' +
    '<rect x="43" y="40" width="14" height="25" fill="#7C3AED"/>' +
    '<rect x="43" y="25" width="14" height="15" fill="#A78BFA"/>' +
    '<rect x="43" y="10" width="14" height="15" fill="#DDD6FE"/>' +
    '<rect x="66" y="50" width="14" height="15" fill="#7C3AED"/>' +
    '<rect x="66" y="30" width="14" height="20" fill="#A78BFA"/>' +
    '<rect x="66" y="18" width="14" height="12" fill="#DDD6FE"/>',

  "stacked-area":
    _BG +
    '<polygon points="8,65 8,40 25,30 45,38 65,28 88,32 88,65" fill="#7C3AED" fill-opacity="0.9"/>' +
    '<polygon points="8,65 8,52 25,45 45,50 65,42 88,46 88,65" fill="#A78BFA" fill-opacity="0.95"/>' +
    '<polygon points="8,65 8,60 25,55 45,58 65,52 88,54 88,65" fill="#DDD6FE"/>',

  waterfall:
    _BG +
    '<rect x="10" y="40" width="12" height="25" fill="#7C3AED"/>' +
    '<line x1="22" y1="40" x2="24" y2="40" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="24" y="28" width="12" height="12" fill="#A78BFA"/>' +
    '<line x1="36" y1="28" x2="38" y2="28" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="38" y="20" width="12" height="8" fill="#A78BFA"/>' +
    '<line x1="50" y1="20" x2="52" y2="20" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="52" y="20" width="12" height="20" fill="#DC2626"/>' +
    '<line x1="64" y1="40" x2="66" y2="40" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="66" y="40" width="12" height="10" fill="#DC2626"/>' +
    '<line x1="78" y1="50" x2="80" y2="50" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="80" y="50" width="12" height="15" fill="#7C3AED"/>',

  marimekko:
    _BG +
    '<rect x="10" y="10" width="30" height="18" fill="#7C3AED"/>' +
    '<rect x="40" y="10" width="18" height="18" fill="#A78BFA"/>' +
    '<rect x="58" y="10" width="32" height="18" fill="#DDD6FE"/>' +
    '<rect x="10" y="28" width="30" height="22" fill="#A78BFA"/>' +
    '<rect x="40" y="28" width="18" height="22" fill="#C4B5FD"/>' +
    '<rect x="58" y="28" width="32" height="22" fill="#7C3AED"/>' +
    '<rect x="10" y="50" width="30" height="15" fill="#DDD6FE"/>' +
    '<rect x="40" y="50" width="18" height="15" fill="#7C3AED"/>' +
    '<rect x="58" y="50" width="32" height="15" fill="#A78BFA"/>',

  // ===== 분포 #059669 =====
  histogram:
    _BG +
    '<rect x="8" y="57" width="11" height="8" fill="#059669"/>' +
    '<rect x="20" y="43" width="11" height="22" fill="#059669"/>' +
    '<rect x="32" y="27" width="11" height="38" fill="#059669"/>' +
    '<rect x="44" y="15" width="11" height="50" fill="#059669"/>' +
    '<rect x="56" y="23" width="11" height="42" fill="#059669"/>' +
    '<rect x="68" y="40" width="11" height="25" fill="#059669"/>' +
    '<rect x="80" y="53" width="11" height="12" fill="#059669"/>',

  boxplot:
    _BG +
    '<line x1="50" y1="12" x2="50" y2="62" stroke="#059669" stroke-width="1.5"/>' +
    '<rect x="36" y="22" width="28" height="28" fill="#A7F3D0" stroke="#059669" stroke-width="1.5"/>' +
    '<line x1="36" y1="35" x2="64" y2="35" stroke="#059669" stroke-width="2"/>' +
    '<line x1="44" y1="12" x2="56" y2="12" stroke="#059669" stroke-width="1.5"/>' +
    '<line x1="44" y1="62" x2="56" y2="62" stroke="#059669" stroke-width="1.5"/>' +
    '<circle cx="50" cy="6" r="2" fill="#059669"/>' +
    '<circle cx="50" cy="68" r="2" fill="#059669"/>',

  scatter:
    _BG +
    [
      [14, 55], [20, 40], [28, 58], [34, 28], [42, 48], [48, 20],
      [55, 42], [62, 56], [68, 30], [76, 46], [84, 22], [90, 50]
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="#059669"/>`)
      .join(""),

  bubble:
    _BG +
    '<circle cx="22" cy="50" r="6" fill="#059669" fill-opacity="0.7"/>' +
    '<circle cx="38" cy="28" r="11" fill="#059669" fill-opacity="0.7"/>' +
    '<circle cx="55" cy="50" r="8" fill="#059669" fill-opacity="0.7"/>' +
    '<circle cx="72" cy="32" r="13" fill="#059669" fill-opacity="0.7"/>' +
    '<circle cx="88" cy="52" r="5" fill="#059669" fill-opacity="0.7"/>',

  violin:
    _BG +
    '<path d="M 50,10 C 35,14 35,28 38,40 C 42,52 35,58 50,65 C 65,58 58,52 62,40 C 65,28 65,14 50,10 Z" fill="#A7F3D0" stroke="#059669" stroke-width="1.5"/>' +
    '<line x1="50" y1="10" x2="50" y2="65" stroke="#059669" stroke-width="1.5"/>' +
    '<circle cx="50" cy="37" r="2" fill="#059669"/>',

  // ===== 추세 #D97706 =====
  line:
    _BG +
    '<polyline points="8,55 22,30 36,42 50,18 64,35 78,20 92,40" stroke="#D97706" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',

  "dual-axis":
    _BG +
    '<line x1="10" y1="10" x2="10" y2="65" stroke="#94a3b8" stroke-width="0.6"/>' +
    '<line x1="90" y1="10" x2="90" y2="65" stroke="#94a3b8" stroke-width="0.6"/>' +
    '<polyline points="10,55 25,40 40,50 55,30 70,40 85,25" stroke="#D97706" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<polyline points="10,30 25,45 40,32 55,48 70,28 85,42" stroke="#2563EB" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',

  "forecast-line":
    _BG +
    '<polyline points="8,55 22,40 36,48 50,28" stroke="#D97706" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<polyline points="50,28 64,35 78,20 92,28" stroke="#D97706" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4,3"/>' +
    '<line x1="50" y1="10" x2="50" y2="65" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="2,2"/>',

  area:
    _BG +
    '<path d="M 8,55 L 22,30 L 36,42 L 50,18 L 64,35 L 78,20 L 92,40 L 92,65 L 8,65 Z" fill="#FCD34D" fill-opacity="0.6"/>' +
    '<polyline points="8,55 22,30 36,42 50,18 64,35 78,20 92,40" stroke="#D97706" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',

  sparkline:
    _BG +
    '<polyline points="20,48 30,40 40,44 50,32 60,38 70,26 80,34" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="80" cy="34" r="2.5" fill="#D97706"/>',

  // ===== 관계 #DC2626 =====
  "bubble-matrix":
    _BG +
    '<g stroke="#fee2e2" stroke-width="0.5">' +
    '<line x1="18" y1="8" x2="18" y2="65"/>' +
    '<line x1="38" y1="8" x2="38" y2="65"/>' +
    '<line x1="58" y1="8" x2="58" y2="65"/>' +
    '<line x1="78" y1="8" x2="78" y2="65"/>' +
    '<line x1="8" y1="18" x2="92" y2="18"/>' +
    '<line x1="8" y1="37" x2="92" y2="37"/>' +
    '<line x1="8" y1="56" x2="92" y2="56"/>' +
    "</g>" +
    [5, 3, 7, 4, 2, 6, 3, 5, 8, 4, 6, 2]
      .map((r, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const cx = 18 + col * 20;
        const cy = 18 + row * 19;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#DC2626" fill-opacity="0.7"/>`;
      })
      .join(""),

  heatmap:
    _BG +
    [0.3, 0.6, 0.9, 0.4, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4, 0.6, 0.8, 0.3, 0.7, 0.5, 0.9]
      .map((op, i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        return `<rect x="${20 + c * 15}" y="${8 + r * 15}" width="13" height="13" fill="#DC2626" fill-opacity="${op}"/>`;
      })
      .join(""),

  "scatter-matrix":
    _BG +
    '<line x1="50" y1="5" x2="50" y2="70" stroke="#fecaca" stroke-width="0.5"/>' +
    '<line x1="5" y1="38" x2="95" y2="38" stroke="#fecaca" stroke-width="0.5"/>' +
    [
      [15, 30], [20, 20], [28, 15], [35, 25], [42, 12],
      [60, 28], [68, 18], [75, 30], [82, 14], [88, 22],
      [12, 58], [22, 50], [32, 62], [40, 48], [46, 55],
      [58, 55], [65, 62], [72, 50], [80, 60], [88, 52]
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#DC2626"/>`)
      .join(""),

  correlation:
    _BG +
    '<line x1="10" y1="60" x2="90" y2="15" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,2"/>' +
    [
      [15, 58], [22, 52], [30, 50], [38, 44], [46, 40],
      [54, 34], [62, 30], [70, 24], [78, 22], [86, 18]
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#DC2626"/>`)
      .join(""),

  "chord-diagram":
    _BG +
    '<circle cx="50" cy="37" r="25" fill="none" stroke="#fee2e2" stroke-width="1"/>' +
    '<path d="M 28,22 A 25,25 0 0 1 72,22" stroke="#DC2626" stroke-width="4" fill="none"/>' +
    '<path d="M 72,52 A 25,25 0 0 1 28,52" stroke="#F87171" stroke-width="4" fill="none"/>' +
    '<path d="M 50,12 A 25,25 0 0 1 75,40" stroke="#FCA5A5" stroke-width="4" fill="none"/>' +
    '<path d="M 35,15 Q 50,40 75,30" stroke="#DC2626" stroke-width="1.5" fill="none" stroke-opacity="0.6"/>' +
    '<path d="M 25,40 Q 50,37 75,55" stroke="#DC2626" stroke-width="1.5" fill="none" stroke-opacity="0.6"/>' +
    '<path d="M 50,12 Q 50,37 45,62" stroke="#DC2626" stroke-width="1.5" fill="none" stroke-opacity="0.6"/>',

  // ===== 흐름 #0891B2 =====
  cascade:
    _BG +
    '<rect x="8" y="40" width="13" height="25" fill="#0891B2"/>' +
    '<line x1="21" y1="40" x2="24" y2="40" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="24" y="28" width="13" height="12" fill="#22D3EE"/>' +
    '<line x1="37" y1="28" x2="40" y2="28" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="40" y="20" width="13" height="8" fill="#22D3EE"/>' +
    '<line x1="53" y1="20" x2="56" y2="20" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="56" y="20" width="13" height="22" fill="#DC2626"/>' +
    '<line x1="69" y1="42" x2="72" y2="42" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="72" y="42" width="13" height="23" fill="#0891B2"/>',

  funnel:
    _BG +
    '<polygon points="15,8 85,8 78,20 22,20" fill="#0891B2"/>' +
    '<polygon points="23,22 77,22 68,36 32,36" fill="#22D3EE"/>' +
    '<polygon points="33,38 67,38 58,52 42,52" fill="#67E8F9"/>' +
    '<polygon points="43,54 57,54 53,65 47,65" fill="#A5F3FC"/>',

  gantt:
    _BG +
    '<rect x="8" y="8" width="35" height="8" fill="#0891B2" rx="2"/>' +
    '<rect x="20" y="20" width="45" height="8" fill="#0891B2" rx="2"/>' +
    '<rect x="35" y="32" width="40" height="8" fill="#0891B2" rx="2"/>' +
    '<rect x="50" y="44" width="32" height="8" fill="#0891B2" rx="2"/>' +
    '<rect x="62" y="56" width="28" height="8" fill="#0891B2" rx="2"/>',

  sankey:
    _BG +
    '<path d="M 8,20 C 30,20 30,40 50,40 C 70,40 70,20 92,20" stroke="#0891B2" stroke-width="7" fill="none" stroke-opacity="0.6" stroke-linecap="round"/>' +
    '<path d="M 8,40 C 30,40 30,55 50,55 C 70,55 70,40 92,40" stroke="#22D3EE" stroke-width="6" fill="none" stroke-opacity="0.6" stroke-linecap="round"/>' +
    '<path d="M 8,55 C 30,55 30,30 50,30 C 70,30 70,55 92,55" stroke="#67E8F9" stroke-width="5" fill="none" stroke-opacity="0.6" stroke-linecap="round"/>',

  "timeline-flow":
    _BG +
    '<line x1="10" y1="37" x2="90" y2="37" stroke="#0891B2" stroke-width="1.5"/>' +
    '<line x1="22" y1="18" x2="22" y2="37" stroke="#0891B2" stroke-width="1"/>' +
    '<line x1="42" y1="37" x2="42" y2="56" stroke="#0891B2" stroke-width="1"/>' +
    '<line x1="62" y1="18" x2="62" y2="37" stroke="#0891B2" stroke-width="1"/>' +
    '<line x1="80" y1="37" x2="80" y2="56" stroke="#0891B2" stroke-width="1"/>' +
    '<circle cx="22" cy="37" r="3.5" fill="#0891B2"/>' +
    '<circle cx="42" cy="37" r="3.5" fill="#0891B2"/>' +
    '<circle cx="62" cy="37" r="3.5" fill="#0891B2"/>' +
    '<circle cx="80" cy="37" r="3.5" fill="#0891B2"/>' +
    '<rect x="17" y="10" width="10" height="6" fill="#A5F3FC"/>' +
    '<rect x="37" y="58" width="10" height="6" fill="#A5F3FC"/>' +
    '<rect x="57" y="10" width="10" height="6" fill="#A5F3FC"/>' +
    '<rect x="75" y="58" width="10" height="6" fill="#A5F3FC"/>',

  // ===== 구조 #9333EA =====
  treemap:
    _BG +
    '<g stroke="#fff" stroke-width="1.5">' +
    '<rect x="6" y="6" width="46" height="36" fill="#9333EA"/>' +
    '<rect x="52" y="6" width="42" height="22" fill="#A855F7"/>' +
    '<rect x="52" y="28" width="24" height="14" fill="#C084FC"/>' +
    '<rect x="76" y="28" width="18" height="14" fill="#D8B4FE"/>' +
    '<rect x="6" y="42" width="30" height="27" fill="#A855F7"/>' +
    '<rect x="36" y="42" width="22" height="27" fill="#C084FC"/>' +
    '<rect x="58" y="42" width="36" height="27" fill="#9333EA"/>' +
    "</g>",

  "org-chart":
    _BG +
    '<rect x="38" y="10" width="24" height="14" fill="#9333EA" rx="2"/>' +
    '<line x1="50" y1="24" x2="50" y2="32" stroke="#94a3b8"/>' +
    '<line x1="18" y1="32" x2="82" y2="32" stroke="#94a3b8"/>' +
    '<line x1="18" y1="32" x2="18" y2="42" stroke="#94a3b8"/>' +
    '<line x1="50" y1="32" x2="50" y2="42" stroke="#94a3b8"/>' +
    '<line x1="82" y1="32" x2="82" y2="42" stroke="#94a3b8"/>' +
    '<rect x="6" y="42" width="24" height="14" fill="#A855F7" rx="2"/>' +
    '<rect x="38" y="42" width="24" height="14" fill="#A855F7" rx="2"/>' +
    '<rect x="70" y="42" width="24" height="14" fill="#A855F7" rx="2"/>',

  "mind-map":
    _BG +
    '<line x1="50" y1="37" x2="20" y2="18" stroke="#94a3b8"/>' +
    '<line x1="50" y1="37" x2="82" y2="15" stroke="#94a3b8"/>' +
    '<line x1="50" y1="37" x2="85" y2="40" stroke="#94a3b8"/>' +
    '<line x1="50" y1="37" x2="80" y2="62" stroke="#94a3b8"/>' +
    '<line x1="50" y1="37" x2="18" y2="60" stroke="#94a3b8"/>' +
    '<line x1="50" y1="37" x2="15" y2="35" stroke="#94a3b8"/>' +
    '<rect x="12" y="13" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<rect x="76" y="10" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<rect x="78" y="36" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<rect x="74" y="58" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<rect x="10" y="56" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<rect x="6" y="31" width="14" height="8" fill="#A855F7" rx="2"/>' +
    '<circle cx="50" cy="37" r="10" fill="#9333EA"/>',

  matrix:
    _BG +
    '<rect x="10" y="8" width="40" height="28" fill="#9333EA"/>' +
    '<rect x="50" y="8" width="40" height="28" fill="#A855F7"/>' +
    '<rect x="10" y="36" width="40" height="29" fill="#C084FC"/>' +
    '<rect x="50" y="36" width="40" height="29" fill="#D8B4FE"/>' +
    '<line x1="50" y1="8" x2="50" y2="65" stroke="#fff" stroke-width="2"/>' +
    '<line x1="10" y1="36" x2="90" y2="36" stroke="#fff" stroke-width="2"/>',

  sunburst:
    _BG +
    '<path d="M 50,15 A 22,22 0 0 1 72,37 L 62,37 A 12,12 0 0 0 50,25 Z" fill="#9333EA"/>' +
    '<path d="M 72,37 A 22,22 0 0 1 50,59 L 50,49 A 12,12 0 0 0 62,37 Z" fill="#A855F7"/>' +
    '<path d="M 50,59 A 22,22 0 0 1 28,37 L 38,37 A 12,12 0 0 0 50,49 Z" fill="#C084FC"/>' +
    '<path d="M 28,37 A 22,22 0 0 1 50,15 L 50,25 A 12,12 0 0 0 38,37 Z" fill="#D8B4FE"/>' +
    '<path d="M 50,37 L 50,25 A 12,12 0 0 1 62,37 Z" fill="#6B21A8"/>' +
    '<path d="M 50,37 L 62,37 A 12,12 0 0 1 50,49 Z" fill="#7E22CE"/>' +
    '<path d="M 50,37 L 50,49 A 12,12 0 0 1 38,37 Z" fill="#9333EA"/>' +
    '<path d="M 50,37 L 38,37 A 12,12 0 0 1 50,25 Z" fill="#A855F7"/>',

  // ===== 지리 #65A30D =====
  "choropleth-map":
    _BG +
    '<g stroke="#fff" stroke-width="1">' +
    '<polygon points="8,12 30,8 40,30 35,45 18,50 5,28" fill="#65A30D"/>' +
    '<polygon points="40,15 65,12 78,32 70,52 50,55 42,40" fill="#A3E635"/>' +
    '<polygon points="68,20 92,18 95,42 88,62 72,58 65,40" fill="#84CC16"/>' +
    '<polygon points="10,52 35,50 42,62 30,68 12,68" fill="#D9F99D"/>' +
    '<polygon points="46,58 70,55 80,68 58,70" fill="#65A30D" fill-opacity="0.6"/>' +
    "</g>",

  "bubble-map":
    _BG +
    '<rect x="6" y="6" width="88" height="63" fill="#F0FDF4" rx="3"/>' +
    '<path d="M 15,40 Q 25,25 40,30 Q 55,35 70,28 Q 82,22 90,35 L 90,55 Q 70,60 50,52 Q 30,45 15,55 Z" fill="#D9F99D" fill-opacity="0.6"/>' +
    '<circle cx="25" cy="35" r="6" fill="#65A30D" fill-opacity="0.8"/>' +
    '<circle cx="50" cy="42" r="10" fill="#65A30D" fill-opacity="0.8"/>' +
    '<circle cx="68" cy="32" r="4" fill="#65A30D" fill-opacity="0.8"/>' +
    '<circle cx="78" cy="50" r="8" fill="#65A30D" fill-opacity="0.8"/>',

  "heatmap-geo":
    _BG +
    [0.3, 0.5, 0.7, 0.4, 0.6, 0.9, 0.4, 0.5, 0.8, 0.5, 0.7, 0.9, 0.4, 0.8, 0.6, 0.7]
      .map((op, i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        return `<rect x="${20 + c * 15}" y="${8 + r * 15}" width="13" height="13" fill="#65A30D" fill-opacity="${op}"/>`;
      })
      .join(""),

  "flow-map":
    _BG +
    '<rect x="6" y="6" width="88" height="63" fill="#F0FDF4" rx="3"/>' +
    '<circle cx="20" cy="55" r="3" fill="#65A30D"/>' +
    '<circle cx="50" cy="20" r="3" fill="#65A30D"/>' +
    '<circle cx="80" cy="50" r="3" fill="#65A30D"/>' +
    '<path d="M 23,53 Q 40,28 48,22" stroke="#65A30D" stroke-width="1.5" fill="none"/>' +
    '<polygon points="46,20 51,22 47,25" fill="#65A30D"/>' +
    '<path d="M 52,22 Q 70,16 78,48" stroke="#65A30D" stroke-width="1.5" fill="none"/>' +
    '<polygon points="76,46 80,48 77,52" fill="#65A30D"/>' +
    '<path d="M 22,55 Q 50,60 77,50" stroke="#65A30D" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>',

  // ===== 금융 #B45309 =====
  candlestick:
    _BG +
    '<line x1="18" y1="15" x2="18" y2="50" stroke="#0F172A" stroke-width="1"/>' +
    '<rect x="14" y="25" width="8" height="17" fill="#16A34A"/>' +
    '<line x1="34" y1="20" x2="34" y2="58" stroke="#0F172A" stroke-width="1"/>' +
    '<rect x="30" y="30" width="8" height="22" fill="#16A34A"/>' +
    '<line x1="50" y1="12" x2="50" y2="48" stroke="#0F172A" stroke-width="1"/>' +
    '<rect x="46" y="18" width="8" height="20" fill="#DC2626"/>' +
    '<line x1="66" y1="25" x2="66" y2="60" stroke="#0F172A" stroke-width="1"/>' +
    '<rect x="62" y="32" width="8" height="18" fill="#DC2626"/>' +
    '<line x1="82" y1="18" x2="82" y2="55" stroke="#0F172A" stroke-width="1"/>' +
    '<rect x="78" y="28" width="8" height="20" fill="#16A34A"/>',

  ohlc:
    _BG +
    '<line x1="20" y1="15" x2="20" y2="55" stroke="#B45309" stroke-width="1.5"/>' +
    '<line x1="16" y1="20" x2="20" y2="20" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="20" y1="48" x2="24" y2="48" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="35" y1="22" x2="35" y2="60" stroke="#B45309" stroke-width="1.5"/>' +
    '<line x1="31" y1="28" x2="35" y2="28" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="35" y1="55" x2="39" y2="55" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="50" y1="12" x2="50" y2="50" stroke="#B45309" stroke-width="1.5"/>' +
    '<line x1="46" y1="40" x2="50" y2="40" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="50" y1="18" x2="54" y2="18" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="65" y1="25" x2="65" y2="58" stroke="#B45309" stroke-width="1.5"/>' +
    '<line x1="61" y1="50" x2="65" y2="50" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="65" y1="32" x2="69" y2="32" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="80" y1="18" x2="80" y2="55" stroke="#B45309" stroke-width="1.5"/>' +
    '<line x1="76" y1="22" x2="80" y2="22" stroke="#B45309" stroke-width="2"/>' +
    '<line x1="80" y1="48" x2="84" y2="48" stroke="#B45309" stroke-width="2"/>',

  "waterfall-finance":
    _BG +
    '<rect x="8" y="40" width="13" height="25" fill="#16A34A"/>' +
    '<line x1="21" y1="40" x2="24" y2="40" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="24" y="28" width="13" height="12" fill="#16A34A"/>' +
    '<line x1="37" y1="28" x2="40" y2="28" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="40" y="20" width="13" height="8" fill="#16A34A"/>' +
    '<line x1="53" y1="20" x2="56" y2="20" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="56" y="20" width="13" height="22" fill="#DC2626"/>' +
    '<line x1="69" y1="42" x2="72" y2="42" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="1,1"/>' +
    '<rect x="72" y="42" width="13" height="23" fill="#B45309"/>',

  "bullet-finance":
    _BG +
    '<rect x="10" y="32" width="78" height="14" fill="#FCD34D"/>' +
    '<rect x="10" y="35" width="55" height="8" fill="#B45309"/>' +
    '<line x1="68" y1="28" x2="68" y2="50" stroke="#78350F" stroke-width="2.5"/>',

  // ===== 텍스트 #0F766E =====
  "word-cloud":
    _BG +
    '<text x="20" y="20" font-size="14" font-weight="700" fill="#0F766E" font-family="Arial,sans-serif">data</text>' +
    '<text x="55" y="22" font-size="10" fill="#2DD4BF" font-family="Arial,sans-serif">chart</text>' +
    '<text x="15" y="40" font-size="11" fill="#14B8A6" font-family="Arial,sans-serif">graph</text>' +
    '<text x="48" y="40" font-size="16" font-weight="700" fill="#0F766E" font-family="Arial,sans-serif">word</text>' +
    '<text x="14" y="58" font-size="9" fill="#5EEAD4" font-family="Arial,sans-serif">key</text>' +
    '<text x="32" y="58" font-size="12" fill="#0F766E" font-family="Arial,sans-serif">map</text>' +
    '<text x="60" y="58" font-size="13" fill="#14B8A6" font-family="Arial,sans-serif">cloud</text>' +
    '<text x="78" y="42" font-size="9" fill="#5EEAD4" font-family="Arial,sans-serif">tag</text>',

  "timeline-text":
    _BG +
    '<line x1="8" y1="37" x2="92" y2="37" stroke="#0F766E" stroke-width="2"/>' +
    '<rect x="12" y="14" width="16" height="14" fill="#CCFBF1" stroke="#0F766E" rx="2"/>' +
    '<rect x="32" y="46" width="16" height="14" fill="#CCFBF1" stroke="#0F766E" rx="2"/>' +
    '<rect x="52" y="14" width="16" height="14" fill="#CCFBF1" stroke="#0F766E" rx="2"/>' +
    '<rect x="72" y="46" width="16" height="14" fill="#CCFBF1" stroke="#0F766E" rx="2"/>' +
    '<line x1="20" y1="28" x2="20" y2="34" stroke="#0F766E" stroke-width="1"/>' +
    '<line x1="40" y1="40" x2="40" y2="46" stroke="#0F766E" stroke-width="1"/>' +
    '<line x1="60" y1="28" x2="60" y2="34" stroke="#0F766E" stroke-width="1"/>' +
    '<line x1="80" y1="40" x2="80" y2="46" stroke="#0F766E" stroke-width="1"/>' +
    '<circle cx="20" cy="37" r="3" fill="#0F766E"/>' +
    '<circle cx="40" cy="37" r="3" fill="#0F766E"/>' +
    '<circle cx="60" cy="37" r="3" fill="#0F766E"/>' +
    '<circle cx="80" cy="37" r="3" fill="#0F766E"/>',

  "network-diagram":
    _BG +
    '<line x1="25" y1="20" x2="55" y2="35" stroke="#0F766E" stroke-width="1.5"/>' +
    '<line x1="55" y1="35" x2="80" y2="20" stroke="#0F766E" stroke-width="1.5"/>' +
    '<line x1="55" y1="35" x2="80" y2="55" stroke="#0F766E" stroke-width="1.5"/>' +
    '<line x1="55" y1="35" x2="25" y2="55" stroke="#0F766E" stroke-width="1.5"/>' +
    '<line x1="25" y1="20" x2="25" y2="55" stroke="#0F766E" stroke-width="1.5"/>' +
    '<line x1="80" y1="20" x2="80" y2="55" stroke="#0F766E" stroke-width="1.5"/>' +
    '<circle cx="25" cy="20" r="6" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5"/>' +
    '<circle cx="80" cy="20" r="6" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5"/>' +
    '<circle cx="55" cy="35" r="7" fill="#0F766E"/>' +
    '<circle cx="25" cy="55" r="6" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5"/>' +
    '<circle cx="80" cy="55" r="6" fill="#2DD4BF" stroke="#0F766E" stroke-width="1.5"/>',

  sociogram:
    _BG +
    '<line x1="25" y1="22" x2="49" y2="32" stroke="#0F766E" stroke-width="1.5"/>' +
    '<polygon points="48,29 53,32 47,35" fill="#0F766E"/>' +
    '<line x1="78" y1="22" x2="61" y2="32" stroke="#0F766E" stroke-width="1.5"/>' +
    '<polygon points="62,29 57,32 63,35" fill="#0F766E"/>' +
    '<line x1="78" y1="55" x2="61" y2="40" stroke="#0F766E" stroke-width="1.5"/>' +
    '<polygon points="58,40 63,38 63,44" fill="#0F766E"/>' +
    '<line x1="25" y1="55" x2="49" y2="40" stroke="#0F766E" stroke-width="1.5"/>' +
    '<polygon points="47,38 52,40 47,44" fill="#0F766E"/>' +
    '<circle cx="25" cy="22" r="5" fill="#2DD4BF" stroke="#0F766E"/>' +
    '<circle cx="80" cy="22" r="5" fill="#2DD4BF" stroke="#0F766E"/>' +
    '<circle cx="55" cy="35" r="6" fill="#0F766E"/>' +
    '<circle cx="25" cy="55" r="5" fill="#2DD4BF" stroke="#0F766E"/>' +
    '<circle cx="80" cy="55" r="5" fill="#2DD4BF" stroke="#0F766E"/>',

  // ===== 비율 #BE185D =====
  waffle:
    _BG +
    (() => {
      let s = "";
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const filled = r * 10 + c < 65;
          s += `<rect x="${18 + c * 6.5}" y="${5 + r * 6.5}" width="5.5" height="5.5" fill="${filled ? "#BE185D" : "#FCE7F3"}" rx="0.5"/>`;
        }
      }
      return s;
    })(),

  pictogram:
    _BG +
    [18, 34, 50, 66, 82]
      .map((cx, i) => {
        const c = i < 3 ? "#BE185D" : "#FBCFE8";
        return `<circle cx="${cx}" cy="22" r="4" fill="${c}"/><path d="M ${cx - 6},58 Q ${cx - 6},32 ${cx},32 Q ${cx + 6},32 ${cx + 6},58 Z" fill="${c}"/>`;
      })
      .join(""),

  "ratio-stack":
    _BG +
    '<rect x="10" y="28" width="20" height="20" fill="#BE185D"/>' +
    '<rect x="30" y="28" width="25" height="20" fill="#F472B6"/>' +
    '<rect x="55" y="28" width="23" height="20" fill="#FBCFE8"/>' +
    '<rect x="78" y="28" width="12" height="20" fill="#831843"/>',

  "square-pie":
    _BG +
    '<rect x="10" y="10" width="40" height="40" fill="#BE185D"/>' +
    '<rect x="52" y="10" width="22" height="22" fill="#F472B6"/>' +
    '<rect x="76" y="10" width="14" height="14" fill="#FBCFE8"/>' +
    '<rect x="76" y="26" width="14" height="14" fill="#BE185D"/>' +
    '<rect x="52" y="34" width="22" height="22" fill="#831843"/>' +
    '<rect x="76" y="42" width="14" height="14" fill="#F472B6"/>' +
    '<rect x="10" y="52" width="20" height="13" fill="#FBCFE8"/>' +
    '<rect x="32" y="52" width="18" height="13" fill="#F472B6"/>' +
    '<rect x="52" y="58" width="38" height="10" fill="#BE185D"/>',

  // ===== 복합 #1D4ED8 =====
  "combo-chart":
    _BG +
    '<rect x="14" y="42" width="10" height="23" fill="#1D4ED8" fill-opacity="0.5"/>' +
    '<rect x="30" y="32" width="10" height="33" fill="#1D4ED8" fill-opacity="0.5"/>' +
    '<rect x="46" y="48" width="10" height="17" fill="#1D4ED8" fill-opacity="0.5"/>' +
    '<rect x="62" y="22" width="10" height="43" fill="#1D4ED8" fill-opacity="0.5"/>' +
    '<rect x="78" y="38" width="10" height="27" fill="#1D4ED8" fill-opacity="0.5"/>' +
    '<polyline points="19,30 35,22 51,40 67,18 83,28" stroke="#DC2626" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="19" cy="30" r="2.5" fill="#DC2626"/>' +
    '<circle cx="35" cy="22" r="2.5" fill="#DC2626"/>' +
    '<circle cx="51" cy="40" r="2.5" fill="#DC2626"/>' +
    '<circle cx="67" cy="18" r="2.5" fill="#DC2626"/>' +
    '<circle cx="83" cy="28" r="2.5" fill="#DC2626"/>',

  "dashboard-card":
    _BG +
    '<rect x="8" y="8" width="84" height="60" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1" rx="4"/>' +
    '<text x="50" y="35" text-anchor="middle" font-size="18" font-weight="700" fill="#1D4ED8" font-family="Arial,sans-serif">$42K</text>' +
    '<text x="50" y="46" text-anchor="middle" font-size="7" fill="#64748B" font-family="Arial,sans-serif">+12.5%</text>' +
    '<polyline points="20,60 32,55 44,58 56,52 68,54 80,48" stroke="#1D4ED8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',

  gauge:
    _BG +
    '<path d="M 15,50 A 35,35 0 0 1 38,18" stroke="#FCA5A5" stroke-width="10" fill="none"/>' +
    '<path d="M 38,18 A 35,35 0 0 1 62,18" stroke="#FCD34D" stroke-width="10" fill="none"/>' +
    '<path d="M 62,18 A 35,35 0 0 1 85,50" stroke="#86EFAC" stroke-width="10" fill="none"/>' +
    '<line x1="50" y1="50" x2="65" y2="22" stroke="#1D4ED8" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="50" cy="50" r="3" fill="#1D4ED8"/>' +
    '<text x="50" y="65" text-anchor="middle" font-size="10" font-weight="700" fill="#1D4ED8" font-family="Arial,sans-serif">75%</text>',

  "bullet-bar":
    _BG +
    '<rect x="10" y="10" width="78" height="10" fill="#BFDBFE"/>' +
    '<rect x="10" y="12" width="55" height="6" fill="#1D4ED8"/>' +
    '<line x1="68" y1="7" x2="68" y2="23" stroke="#0F172A" stroke-width="2"/>' +
    '<rect x="10" y="31" width="78" height="10" fill="#BFDBFE"/>' +
    '<rect x="10" y="33" width="40" height="6" fill="#1D4ED8"/>' +
    '<line x1="58" y1="28" x2="58" y2="44" stroke="#0F172A" stroke-width="2"/>' +
    '<rect x="10" y="52" width="78" height="10" fill="#BFDBFE"/>' +
    '<rect x="10" y="54" width="65" height="6" fill="#1D4ED8"/>' +
    '<line x1="72" y1="49" x2="72" y2="65" stroke="#0F172A" stroke-width="2"/>'
};

function getThumbnail(id) {
  const inner = THUMBNAILS[id] || THUMBNAILS["bar-vertical"];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style="display:block">${inner}</svg>`;
}
