// ===== 手のイラスト（SVG） =====
// 「自分の右手のひらを見たときの向き」（左に小指、右に親指）で描いています。
const HAND = (function () {
  // 指：[付け根の中心x, 付け根の中心y, 太さ, 長さ, 角度(度)]
  const FINGERS = [
    [90, 192, 30, 122, -12], // 小指
    [127, 174, 33, 160, -5], // 薬指
    [165, 168, 34, 178, 0], // 中指
    [203, 178, 33, 154, 7] // 人差し指
  ];
  const THUMB =
    'M222,246 C246,236 276,212 298,196 C314,184 334,196 326,216 ' +
    'C306,252 266,304 220,356 Z';
  const PALM =
    'M74,196 C66,256 80,312 104,390 L210,390 C216,350 226,318 236,280 ' +
    'C244,248 236,210 226,182 C200,162 100,160 74,196 Z';

  function finger([x, y, w, len, deg], extra) {
    return `<rect x="${-w / 2}" y="${-len}" width="${w}" height="${len + 24}" rx="${w / 2}" ` +
      `transform="translate(${x},${y}) rotate(${deg})"${extra || ''}/>`;
  }

  const PARTS = `<path d="${PALM}"/>` + FINGERS.map((f) => finger(f)).join('') + `<path d="${THUMB}"/>`;

  // 指の関節のしわと、指先のほんのりした赤み
  function fingerDetail([x, y, w, len, deg], joints) {
    const creases = joints
      .map((r) => {
        const cy = -len * r;
        const hw = w * 0.3;
        return `<path d="M${-hw},${cy} Q0,${cy + 3} ${hw},${cy}" class="hand-crease"/>`;
      })
      .join('');
    return `<g transform="translate(${x},${y}) rotate(${deg})">` +
      `<ellipse cx="0" cy="${-len + w * 0.55}" rx="${w * 0.32}" ry="${w * 0.42}" fill="url(#handTipGlow)"/>` +
      creases + '</g>';
  }

  const DETAILS =
    FINGERS.map((f) => fingerDetail(f, [0.36, 0.66])).join('') +
    '<ellipse cx="312" cy="206" rx="12" ry="14" fill="url(#handTipGlow)"/>' +
    '<path d="M276,228 Q288,236 292,250" class="hand-crease"/>' +
    // 親指の付け根（金星丘）と小指側（月丘）のふくらみ
    '<ellipse cx="206" cy="318" rx="46" ry="66" fill="url(#handMound)"/>' +
    '<ellipse cx="96" cy="318" rx="34" ry="60" fill="url(#handMound)" opacity="0.7"/>';

  // ページに一度だけ入れる共通の定義（グラデーション・切り抜き）
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="handSkin" gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2="390">
      <stop offset="0" stop-color="#fff6f1"/><stop offset="1" stop-color="#fbe4d9"/>
    </linearGradient>
    <radialGradient id="handTipGlow"><stop offset="0" stop-color="#f7c6bd" stop-opacity="0.8"/><stop offset="1" stop-color="#f7c6bd" stop-opacity="0"/></radialGradient>
    <radialGradient id="handMound"><stop offset="0" stop-color="#f0c4b2" stop-opacity="0.45"/><stop offset="1" stop-color="#f0c4b2" stop-opacity="0"/></radialGradient>
    <clipPath id="handClip">${PARTS}</clipPath>
  </defs></svg>`;

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

  // 実際の手のしわ風に、うっすら描く線
  const NATURAL = ['kanjoCurve', 'chinoStraight', 'seimeiNormal'];

  function svg(spec) {
    spec = spec || {};
    const path = (k, cls) => `<path d="${LINES[k]}" class="${cls}"/>`;
    const faint = (spec.faint || NATURAL).map((k) => path(k, 'ln-faint')).join('');
    const hi = (spec.hi || []).map((k) => path(k, 'ln-glow') + path(k, 'ln-hi')).join('');
    const dashed = (spec.hiDashed || []).map((k) => path(k, 'ln-hi ln-dashed')).join('');
    const gold = (spec.gold || []).map((k) => path(k, 'ln-gold')).join('') +
      (spec.goldDashed || []).map((k) => path(k, 'ln-gold ln-dashed')).join('');
    return `<svg viewBox="10 -24 336 408" class="hand" aria-hidden="true">
      <g class="hand-outline">${PARTS}</g>
      <g fill="url(#handSkin)">${PARTS}</g>
      <g clip-path="url(#handClip)">${DETAILS}${faint}</g>
      ${gold}${dashed}${hi}</svg>`;
  }

  function mount() {
    if (!document.getElementById('handDefs')) {
      const wrap = document.createElement('div');
      wrap.id = 'handDefs';
      wrap.innerHTML = DEFS;
      document.body.prepend(wrap);
    }
  }

  return { svg, mount, LINES };
})();
