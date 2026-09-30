// ===== 手のイラスト（SVG） =====
// 「自分の右手のひらを見たときの向き」（左に小指、右に親指）で描いています。
// 西洋手相の図版のような、フラットな手＋点線の手相線＋惑星記号＋星のデザインです。
const HAND = (function () {
  // 指：[付け根の中心x, 付け根の中心y, 太さ, 長さ, 角度(度)]
  const FINGERS = [
    [90, 192, 31, 122, -12], // 小指
    [127, 174, 34, 160, -5], // 薬指
    [165, 168, 35, 178, 0], // 中指
    [203, 178, 34, 154, 7] // 人差し指
  ];
  const THUMB =
    'M222,246 C246,236 276,212 298,196 C314,184 334,196 326,216 ' +
    'C306,252 266,304 220,356 Z';
  const PALM =
    'M74,196 C66,256 80,312 104,390 L210,390 C216,350 226,318 236,280 ' +
    'C244,248 236,210 226,182 C200,162 100,160 74,196 Z';

  function finger([x, y, w, len, deg]) {
    return `<rect x="${-w / 2}" y="${-len}" width="${w}" height="${len + 24}" rx="${w / 2}" ` +
      `transform="translate(${x},${y}) rotate(${deg})"/>`;
  }

  const PARTS = `<path d="${PALM}"/>` + FINGERS.map(finger).join('') + `<path d="${THUMB}"/>`;

  // 指の関節（点線）
  function joints([x, y, w, len, deg], ratios) {
    return `<g transform="translate(${x},${y}) rotate(${deg})">` +
      ratios.map((r) => `<path d="M${-w / 2 + 4},${-len * r} L${w / 2 - 4},${-len * r}" class="hand-joint"/>`).join('') +
      '</g>';
  }

  const DETAILS =
    FINGERS.map((f) => joints(f, [0.36, 0.66])).join('') +
    '<path d="M262,233 L287,258" class="hand-joint"/>' +
    // 手首の線（ラセッタ）
    '<path d="M100,364 Q156,372 214,362" class="hand-joint"/>' +
    '<path d="M102,378 Q156,386 212,376" class="hand-joint"/>';

  // ===== 惑星記号（丘の位置） =====
  const GLYPHS = {
    jupiter: 'M-5,-4 Q-2,-8 1,-4 Q2,-1 -5,4 L6,4 M3,-7 L3,8',
    saturn: 'M-3,-8 L-3,6 M-6,-5 L0,-5 M-3,0 Q2,-5 5,0 Q6,4 2,8',
    sun: 'M0,-6 A6,6 0 1 1 -0.01,-6 Z M0,-1 A1,1 0 1 1 -0.01,-1 Z',
    mercury: 'M-4,-9 Q0,-5 4,-9 M0,-5 A4,4 0 1 1 -0.01,-5 Z M0,3 L0,9 M-3,6 L3,6',
    venus: 'M0,-8 A5,5 0 1 1 -0.01,-8 Z M0,2 L0,10 M-4,6 L4,6',
    moon: 'M3,-8 A8,8 0 1 0 3,8 A6,6 0 1 1 3,-8 Z',
    mars: 'M-2,-1 A5,5 0 1 1 -2.01,-1 Z M1.5,-4.5 L7,-10 M3,-10 L7,-10 L7,-6'
  };
  const MOUNDS = [
    ['jupiter', 206, 206], ['saturn', 165, 198], ['sun', 128, 202], ['mercury', 94, 214],
    ['venus', 208, 318], ['moon', 98, 326], ['mars', 214, 262]
  ];
  const glyphs = MOUNDS.map(([k, x, y]) => `<path d="${GLYPHS[k]}" transform="translate(${x},${y}) scale(1.15)" class="hand-glyph"/>`).join('');

  // ===== 星・月の飾り =====
  function sparkle(x, y, r) {
    const s = r * 0.28;
    return `<path d="M${x},${y - r} Q${x + s},${y - s} ${x + r},${y} Q${x + s},${y + s} ${x},${y + r} ` +
      `Q${x - s},${y + s} ${x - r},${y} Q${x - s},${y - s} ${x},${y - r} Z" class="deco-star"/>`;
  }
  const DECO_LIGHT = sparkle(40, 120, 9) + sparkle(300, 100, 7) + sparkle(318, 300, 9) +
    `<circle cx="52" cy="160" r="2.5" class="deco-dot"/><circle cx="296" cy="140" r="2.5" class="deco-dot"/>`;
  const DECO_FULL = DECO_LIGHT + sparkle(30, 290, 7) + sparkle(270, 20, 6) + sparkle(46, 40, 5) +
    `<path d="M24,210 A10,10 0 1 0 24,230 A8,8 0 1 1 24,210 Z" class="deco-moon"/>` +
    `<path d="M318,236 A9,9 0 1 0 318,254 A7,7 0 1 1 318,236 Z" class="deco-moon"/>` +
    `<circle cx="36" cy="340" r="2.5" class="deco-dot"/><circle cx="330" cy="200" r="2" class="deco-dot"/>`;
  const BLOB =
    '<path d="M60,40 C120,-10 240,0 290,60 C340,120 330,220 320,300 C305,380 230,400 160,396 ' +
    'C80,392 20,350 22,260 C24,180 10,90 60,40 Z" class="deco-blob"/>';

  const LINES = {
    kanjoStraight: 'M74,222 Q140,217 204,212',
    kanjoCurve: 'M74,222 Q156,232 190,182',
    chinoUp: 'M232,230 Q166,236 102,222',
    chinoStraight: 'M232,230 Q160,246 88,256',
    chinoDown: 'M232,230 Q162,248 112,320',
    seimeiLarge: 'M232,232 Q128,300 184,392',
    seimeiNormal: 'M232,232 Q160,300 196,392',
    seimeiSmall: 'M232,232 Q194,300 210,392',
    unmei: 'M162,388 L160,208',
    zaiun: 'M96,262 L93,200',
    masukake: 'M74,238 Q152,228 232,230',
    shinpi: 'M130,226 L146,244 M146,226 L130,244',
    haou: 'M150,352 L160,208 M150,352 L126,200 M150,352 L96,208',
    solomon: 'M190,196 Q206,214 224,194'
  };

  const NATURAL = ['kanjoCurve', 'chinoStraight', 'seimeiNormal'];

  // spec: { hi, hiDashed, gold, goldDashed, faint, deco: 'light'|'full', glyphs, labels }
  function svg(spec) {
    spec = spec || {};
    const path = (k, cls) => `<path d="${LINES[k]}" class="${cls}"/>`;
    const faint = (spec.faint || NATURAL).map((k) => path(k, 'ln-faint')).join('');
    const hi = (spec.hi || []).map((k) => path(k, 'ln-glow') + path(k, 'ln-hi')).join('');
    const dashed = (spec.hiDashed || []).map((k) => path(k, 'ln-glow') + path(k, 'ln-hi ln-dashed')).join('');
    const gold = (spec.gold || []).map((k) => path(k, 'ln-gold')).join('') +
      (spec.goldDashed || []).map((k) => path(k, 'ln-gold ln-dashed')).join('');
    const deco = spec.deco === 'full' ? BLOB + DECO_FULL : spec.deco === 'light' ? DECO_LIGHT : '';
    const labels = spec.labels
      ? '<text x="64" y="214" class="hand-label" text-anchor="end">感情線</text>' +
        '<text x="80" y="276" class="hand-label" text-anchor="end">頭脳線</text>' +
        '<text x="238" y="372" class="hand-label">生命線</text>' +
        '<text x="152" y="300" class="hand-label" text-anchor="end">運命線</text>'
      : '';
    return `<svg viewBox="10 -24 336 408" class="hand" aria-hidden="true">
      ${deco}
      <g class="hand-shade" transform="translate(7,5)">${PARTS}</g>
      <g class="hand-fill">${PARTS}</g>
      <g clip-path="url(#handClip)">${DETAILS}${spec.glyphs ? glyphs : ''}${faint}</g>
      ${gold}${dashed}${hi}${labels}</svg>`;
  }

  // ページに一度だけ入れる共通の定義（切り抜き）
  function mount() {
    if (document.getElementById('handDefs')) return;
    const wrap = document.createElement('div');
    wrap.id = 'handDefs';
    wrap.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <clipPath id="handClip">${PARTS}</clipPath></defs></svg>`;
    document.body.prepend(wrap);
  }

  return { svg, mount, LINES, sparkle };
})();
