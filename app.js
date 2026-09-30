(function () {
  const D = PALM_DATA;
  const C = SITE_CONFIG;
  const $ = (sel) => document.querySelector(sel);

  const state = { index: 0, answers: {} };

  // 公開版（Instagram・note向け）と LINE版（既存の友だち向け・?from=line）の切り替え
  const IS_LINE = new URLSearchParams(location.search).get('from') === 'line';

  // ===== 計測（GA4 / GTM を入れたら自動で送られる） =====
  function track(event, params) {
    const payload = Object.assign({ diagnosis_id: D.meta.id, mode: IS_LINE ? 'line' : 'public' }, params || {});
    if (typeof window.gtag === 'function') window.gtag('event', event, payload);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event }, payload));
  }

  // ===== スタート画面 =====
  function renderStart() {
    HAND.mount();
    $('#startEyebrow').textContent = D.meta.eyebrow;
    $('#startTitle').innerHTML = D.meta.title;
    $('#startSubtitle').textContent = D.meta.subtitle;
    $('#startHand').innerHTML = HAND.svg({
      faint: ['kanjoCurve', 'chinoStraight', 'seimeiNormal', 'unmei'], deco: 'full', glyphs: true, labels: true
    });
    $('#heroCrescent').innerHTML = crescent();
    $('#loadingMedallion').innerHTML = medallion('✦');
    $('#sky').innerHTML = skySparkles();
    $('#startLead').innerHTML = D.meta.lead;
    $('#handTip').textContent = D.meta.handTip;
    $('#startBadges').innerHTML = D.meta.badges.map((b) => `<li>${b}</li>`).join('');
    if (IS_LINE) {
      $('#startBadges').insertAdjacentHTML('beforebegin', '<p class="line-only">✦ LINEの皆さま限定・完全版 ✦</p>');
    }
    $('#readerMini').innerHTML = `${avatar('sm')}
      <div><p class="reader-mini-name">鑑定師 ${C.reader.name}</p>
      <p class="reader-mini-career">${C.reader.career.slice(0, 2).join('・')}</p></div>`;
    $('#startBtn').addEventListener('click', () => {
      track('diagnosis_start');
      show('questionScreen');
      renderQuestion();
    });
    $('#backBtn').addEventListener('click', goBack);
    track('diagnosis_view');
  }

  // ===== 装飾 =====
  // 太陽の光線をまとったメダイヨン（タイプの紋章・読み解き中の演出）
  function medallion(inner) {
    const c = 70;
    const rays = Array.from({ length: 32 }, (_, i) => {
      const a = (i * 360 / 32) * Math.PI / 180;
      const r1 = 50;
      const r2 = i % 2 ? 60 : 68;
      const w = 0.05;
      const pt = (r, t) => `${(c + r * Math.cos(t)).toFixed(1)},${(c + r * Math.sin(t)).toFixed(1)}`;
      return `M${pt(r1, a - w)} L${pt(r2, a)} L${pt(r1, a + w)} Z`;
    }).join(' ');
    const dots = [0, 90, 180, 270].map((d) => {
      const t = d * Math.PI / 180;
      return HAND.sparkle(c + 44 * Math.cos(t), c + 44 * Math.sin(t), 3.2);
    }).join('');
    return `<svg viewBox="0 0 140 140" class="medallion">
      <path d="${rays}" class="med-rays"/>
      <circle cx="${c}" cy="${c}" r="50" class="med-disc"/>
      <circle cx="${c}" cy="${c}" r="40" class="med-ring"/>
      ${dots}
      <text x="${c}" y="${c}" class="med-text" text-anchor="middle" dominant-baseline="central">${inner}</text>
    </svg>`;
  }

  // 金の線画の三日月と、つり下がる星
  function crescent() {
    return `<svg viewBox="0 0 120 150" class="crescent">
      <path d="M78,10 A44,44 0 1 0 110,82 A36,36 0 1 1 78,10 Z" class="cres-moon"/>
      <path d="M40,96 L40,126 M58,104 L58,140 M22,84 L22,108" class="cres-thread"/>
      ${HAND.sparkle(40, 130, 5)}${HAND.sparkle(58, 144, 4)}${HAND.sparkle(22, 112, 4)}
    </svg>`;
  }

  // 背景にちりばめる星
  function skySparkles() {
    const pts = [[3, 8, 7], [93, 14, 9], [2, 46, 6], [95, 52, 7], [4, 88, 8], [92, 90, 6]];
    return pts.map(([x, y, r]) =>
      `<svg class="sky-star" style="left:${x}%;top:${y}%;width:${r * 2}px;height:${r * 2}px" viewBox="${-r} ${-r} ${r * 2} ${r * 2}">${HAND.sparkle(0, 0, r)}</svg>`
    ).join('');
  }

  function avatar(size) {
    const r = C.reader;
    return r.photo
      ? `<img class="avatar avatar-${size}" src="${r.photo}" alt="${r.name}">`
      : `<span class="avatar avatar-${size}" aria-hidden="true">${r.initial}</span>`;
  }

  // ===== 質問 =====
  function renderQuestion() {
    const q = D.questions[state.index];
    const total = D.questions.length;
    $('#qNum').textContent = state.index + 1;
    $('#qTotal').textContent = total;
    $('#progressBar').style.width = `${((state.index + 1) / total) * 100}%`;
    $('#qLabelEn').textContent = `QUESTION ${String(state.index + 1).padStart(2, '0')}`;
    $('#qTitle').textContent = q.label;
    $('#qHelp').textContent = q.help || '';
    $('#qHelp').classList.toggle('hidden', !q.help);

    const current = state.answers[q.id];
    const isSelected = (v) => (q.type === 'multi' ? (current || []).includes(v) : current === v);

    const wrap = document.createElement('div');
    // 画像2択・4択は2列、画像3択は大きく見せるため1行1択
    const rows = q.layout === 'image' && q.options.length === 3;
    wrap.className = q.layout !== 'image' ? 'opt-list' : rows ? 'opt-list opt-rows' : 'opt-grid opt-grid-2';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt' + (isSelected(opt.value) ? ' selected' : '');
      btn.setAttribute('aria-pressed', isSelected(opt.value));
      if (rows) {
        btn.innerHTML = `${HAND.svg(opt.hand)}<span class="opt-text"><span class="opt-label">${opt.label}</span></span>`;
      } else if (q.layout === 'image') {
        btn.innerHTML = `${HAND.svg(opt.hand)}<span class="opt-label">${opt.label}</span>` +
          (opt.sub ? `<span class="opt-sub">${opt.sub}</span>` : '') +
          (q.type === 'multi' ? '<span class="opt-check" aria-hidden="true"></span>' : '');
      } else {
        btn.innerHTML = `<span class="opt-mark">${'ABCDE'[i]}</span><span class="opt-label">${opt.label}</span>`;
      }
      btn.addEventListener('click', () => select(q, opt.value, btn));
      wrap.appendChild(btn);
    });

    const box = $('#qOptions');
    box.innerHTML = '';
    box.appendChild(wrap);

    const footer = $('#qFooter');
    footer.innerHTML = '';
    if (q.unknown) {
      const u = document.createElement('button');
      u.type = 'button';
      u.className = 'opt-unknown' + (current === 'unknown' ? ' selected' : '');
      u.textContent = 'よくわからない';
      u.addEventListener('click', () => select(q, 'unknown', u));
      footer.appendChild(u);
    }
    if (q.type === 'multi') {
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'btn btn-primary';
      next.id = 'multiNext';
      footer.appendChild(next);
      updateMultiNext(q);
      next.addEventListener('click', () => advance(q));
    }

    $('#backBtn').style.visibility = 'visible';
    window.scrollTo({ top: 0 });
  }

  function updateMultiNext(q) {
    const n = (state.answers[q.id] || []).length;
    $('#multiNext').textContent = n > 0 ? `${n}つ選んで次へ` : q.noneLabel;
  }

  function select(q, value, el) {
    if (q.type === 'multi') {
      const arr = state.answers[q.id] || [];
      state.answers[q.id] = arr.includes(value) ? arr.filter((v) => v !== value) : arr.concat(value);
      const on = state.answers[q.id].includes(value);
      el.classList.toggle('selected', on);
      el.setAttribute('aria-pressed', on);
      updateMultiNext(q);
      return;
    }
    state.answers[q.id] = value;
    document.querySelectorAll('#qOptions .opt, #qFooter .opt-unknown').forEach((b) => b.classList.remove('selected'));
    el.classList.add('selected');
    setTimeout(() => advance(q), 320);
  }

  function advance(q) {
    track('question_answer', { question_id: q.id, question_no: state.index + 1, answer: [].concat(state.answers[q.id] || []).join(',') });
    if (state.index < D.questions.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function goBack() {
    if (state.index === 0) {
      show('startScreen');
      return;
    }
    state.index--;
    renderQuestion();
  }

  // ===== 読み解き演出 =====
  function finish() {
    show('loadingScreen');
    const msgs = ['右手の線を読み解いています…', '感情線と頭脳線から、才能を見ています…', '財運線から、金運タイプを見ています…'];
    let i = 0;
    $('#loadingText').textContent = msgs[0];
    const timer = setInterval(() => {
      i++;
      if (i < msgs.length) $('#loadingText').textContent = msgs[i];
    }, 1100);
    setTimeout(() => {
      clearInterval(timer);
      const result = computeResult();
      renderResult(result);
      show('resultScreen');
      track('diagnosis_complete', { type: result.typeKey, theme: result.themeKey });
    }, 3400);
  }

  // ===== 判定 =====
  function pick(id) {
    const v = state.answers[id];
    return !v || v === 'unknown' ? D.fallback[id] : v;
  }

  function computeResult() {
    const kanjo = pick('kanjo');
    const chino = pick('chino');
    const seimei = pick('seimei');
    const typeKey = D.typeMap[`${kanjo}-${chino}`];
    const themeKey = state.answers.theme || 'self';
    return {
      typeKey,
      type: D.types[typeKey],
      themeKey,
      theme: D.themes[themeKey],
      signs: [
        D.signs.kanjo[kanjo],
        D.signs.chino[chino],
        D.signs.unmei[state.answers.unmei || 'none'],
        D.signs.seimei[seimei]
      ],
      money: D.moneyTypes[state.answers.zaiun || 'none'],
      rare: (state.answers.rare || []).map((k) => D.rare[k]),
      mood: D.moodMessages[state.answers.mood] || '',
      hand: myHand(kanjo, chino, seimei)
    };
  }

  // 回答どおりの線を描いた「あなたの右手」
  function myHand(kanjo, chino, seimei) {
    const cap = (v) => v.charAt(0).toUpperCase() + v.slice(1);
    const a = state.answers;
    const hi = [`kanjo${cap(kanjo)}`, `chino${cap(chino)}`, `seimei${cap(seimei)}`];
    const hiDashed = [];
    if (a.unmei === 'clear') hi.push('unmei');
    if (a.unmei === 'faint') hiDashed.push('unmei');
    if (a.zaiun === 'clear') hi.push('zaiun');
    if (a.zaiun === 'faint') hiDashed.push('zaiun');
    const rare = a.rare || [];
    if (rare.includes('masukake')) hi.splice(0, 2, 'masukake');
    return { gold: hi.concat(rare.filter((k) => k !== 'masukake')), goldDashed: hiDashed, faint: [] };
  }

  // ===== 結果 =====
  // LINE版：トーク画面を開き、合言葉を入力済みにするURL（送信すると詳しい鑑定が自動で届く）
  function oaMessageUrl(keyword) {
    const text = C.lineMessage.replace('{keyword}', keyword);
    return `https://line.me/R/oaMessage/${encodeURIComponent(C.lineId)}/?${encodeURIComponent(text)}`;
  }

  function shareUrl(t) {
    const text = `手相でわかる「あなたの取扱説明書」診断、やってみたら「${t.name}」でした！\n${C.publicUrl}`;
    return `https://line.me/R/share?text=${encodeURIComponent(text)}`;
  }

  function lineCta(r) {
    const t = r.type;
    return `<div class="cta-block" id="mainCta">
        <p class="cta-head">この鑑定結果を<br>LINEで<strong>受け取りませんか？</strong></p>
        <p class="cta-lead">送っていただくと、あなたのタイプ別の詳しい鑑定文と、特典のご案内がトークに届きます。あとからいつでも読み返せます。</p>
        <ol class="steps">
          <li><span>1</span><p>下のボタンを押す</p></li>
          <li><span>2</span><p>トーク画面に「<strong>${t.keyword}</strong>」と入った状態で開きます</p></li>
          <li><span>3</span><p>そのまま送信するだけ</p></li>
        </ol>
        <a class="btn btn-line" id="lineBtn" href="${oaMessageUrl(t.keyword)}">この結果をLINEで受け取る</a>
        <a class="btn-share" href="${shareUrl(t)}">お友だちにもこの診断を教える</a>
      </div>`;
  }

  // 優先順位：タイプ別URL → テーマ別URL → 共通URL（プロラインの登録シナリオを分けたい場合に設定）
  function lineUrl(typeKey, themeKey) {
    return C.lineUrlByType[typeKey] || C.lineUrlByTheme[themeKey] || C.lineUrl;
  }

  function paragraphs(text) {
    return text.split('\n').map((p) => `<p>${p}</p>`).join('');
  }

  function renderResult(r) {
    const t = r.type;
    const url = IS_LINE ? oaMessageUrl(t.keyword) : lineUrl(r.typeKey, r.themeKey);
    const rare = r.rare.length
      ? `<div class="card card-rare">
          <p class="rare-badge">✦ レア線をお持ちです ✦</p>
          ${r.rare.map((x) => `<p class="rare-item"><strong>${x.name}</strong>${x.text}</p>`).join('')}
        </div>`
      : '';

    const testimonials = C.testimonials.length
      ? `<div class="card"><h3 class="card-title">鑑定を受けた方の声</h3>
          ${C.testimonials.map((v) => `<blockquote class="voice"><p>${v.text}</p><cite>${v.name}</cite></blockquote>`).join('')}</div>`
      : '';

    $('#resultScreen').innerHTML = `
      <div class="type-card">
        <p class="result-pre">あなたの才能タイプは</p>
        <div class="result-emblem">${medallion(t.kanji)}</div>
        <h2 class="result-name">${t.name}</h2>
        <p class="result-catch">${t.catch}</p>
      </div>

      ${rare}

      <div class="card">
        <h3 class="card-title">あなたの右手に出ているサイン</h3>
        <div class="my-hand">${HAND.svg(Object.assign({ glyphs: true, deco: 'light' }, r.hand))}</div>
        <ul class="signs">${r.signs.map((s) => `<li><strong>${s.title}</strong><span>${s.text}</span></li>`).join('')}</ul>
      </div>

      <div class="card">
        <h3 class="card-title">あなたの取扱説明書</h3>
        <div class="body-text">${paragraphs(t.core)}</div>
        <ul class="chips">${t.strengths.map((s) => `<li>${s}</li>`).join('')}</ul>
        <dl class="manual">
          <dt>力を発揮できるとき</dt><dd>${t.power}</dd>
          <dt>疲れやすいとき</dt><dd>${t.tired}</dd>
          <dt>取扱いのひとこと</dt><dd>${t.advice}</dd>
        </dl>
      </div>

      <div class="card card-money">
        <h3 class="card-title">あなたの金運タイプ</h3>
        <p class="money-name">${r.money.name}</p>
        <p>${r.money.text}</p>
        ${IS_LINE
          ? `<p class="tip"><strong>金運のヒント</strong>${t.moneyTip}</p>`
          : '<p class="locked-inline">🔒 金運が動き出す時期と、あなたに合ったお金の増やし方は詳しい鑑定で</p>'}
      </div>

      ${IS_LINE ? `
      <div class="card">
        <h3 class="card-title">才能の活かし方</h3>
        <p>${t.use}</p>
      </div>` : ''}

      <div class="card">
        <h3 class="card-title">${r.theme.label}について</h3>
        ${IS_LINE
          ? `<p>${t.hints[r.themeKey] || r.theme.hint}</p><p>${r.theme.lineNext}</p>`
          : `<div class="teaser"><p>${t.hints[r.themeKey] || r.theme.hint}</p><p>${r.theme.cliff}</p></div>`}
      </div>

      ${IS_LINE ? lineCta(r) : `<div class="cta-block" id="mainCta">
        <p class="cta-head">この続きは<br>LINEで<strong>無料</strong>でお届けします</p>
        <ul class="locked-list">${r.theme.locked.map((l) => `<li>🔒 ${l}</li>`).join('')}</ul>

        <ol class="steps">
          <li><span>1</span><p>下のボタンからLINEを友だち追加</p></li>
          <li><span>2</span><p>合言葉「<strong>${t.keyword}</strong>」を送る</p></li>
          <li><span>3</span><p>あなた専用の詳しい鑑定がすぐ届きます</p></li>
        </ol>

        <div class="keyword-box">
          <p class="keyword-label">あなたの合言葉</p>
          <p class="keyword">${t.keyword}</p>
          <button type="button" class="btn-copy" id="copyBtn">合言葉をコピーする</button>
        </div>

        <a class="btn btn-line" id="lineBtn" href="${url}" target="_blank" rel="noopener">LINEで続きを受け取る（無料）</a>
        <p class="cta-safe">登録は無料です。不要になったらいつでもブロックできます。</p>

        <div class="gifts">
          <p class="gifts-title">🎁 LINE登録でお受け取りいただけるもの</p>
          <ul>${C.gifts.concat(C.giftsByTheme[r.themeKey] || []).map((g) => `<li>${g}</li>`).join('')}</ul>
        </div>
      </div>`}

      <div class="card card-letter">
        <h3 class="card-title">${C.reader.name}からのメッセージ</h3>
        ${r.mood ? `<p>${r.mood}</p>` : ''}
        <p>${D.closingMessage}</p>
        <p class="philosophy">${C.reader.philosophy}</p>
      </div>

      <div class="card profile">
        ${avatar('lg')}
        <p class="profile-name">${C.reader.name}<small>（${C.reader.kana}）</small></p>
        <p class="profile-title">${C.reader.title}</p>
        <ul class="profile-career">${C.reader.career.map((c) => `<li>${c}</li>`).join('')}</ul>
        <p>${C.reader.profile}</p>
      </div>

      ${testimonials}

      <p class="limit-note">${D.limitNote}</p>

      ${IS_LINE
        ? `<a class="btn btn-line" href="${url}" data-cta="bottom">この結果をLINEで受け取る</a>`
        : `<a class="btn btn-line" href="${url}" target="_blank" rel="noopener" data-cta="bottom">LINEで続きを受け取る（無料）</a>`}
      <button type="button" class="btn-text" id="restartBtn">もう一度診断する</button>
      <p class="footer">© ${C.reader.name}</p>
    `;

    if ($('#copyBtn')) $('#copyBtn').addEventListener('click', () => copyKeyword(t.keyword));
    $('#restartBtn').addEventListener('click', restart);
    $('#stickyLineBtn').href = url;
    if (IS_LINE) {
      $('#stickyLineBtn').textContent = 'この結果をLINEで受け取る';
      $('#stickyLineBtn').removeAttribute('target');
    }
    document.querySelectorAll('.btn-line').forEach((a) => {
      a.addEventListener('click', () => {
        if (!IS_LINE) copyKeyword(t.keyword, true);
        track(IS_LINE ? 'line_send_click' : 'line_click', { type: r.typeKey, theme: r.themeKey, position: a.dataset.cta || a.id });
      });
    });
    setupSticky();
  }

  function copyKeyword(word, silent) {
    const done = () => { if (!silent) toast(`「${word}」をコピーしました`); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(word).then(done).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = word;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
      ta.remove();
    }
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }

  // メインのLINEボタンが画面外にある間だけ、下部に追従ボタンを表示
  function onScroll() {
    const main = $('#mainCta');
    if (!main || $('#resultScreen').classList.contains('hidden')) return;
    const r = main.getBoundingClientRect();
    const visible = r.top < window.innerHeight && r.bottom > 0;
    $('#stickyCta').classList.toggle('hidden', visible || window.scrollY < 500);
  }

  function setupSticky() {
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function restart() {
    state.index = 0;
    state.answers = {};
    $('#stickyCta').classList.add('hidden');
    show('startScreen');
  }

  function show(id) {
    ['startScreen', 'questionScreen', 'loadingScreen', 'resultScreen'].forEach((s) => {
      $('#' + s).classList.toggle('hidden', s !== id);
    });
    if (id !== 'resultScreen') $('#stickyCta').classList.add('hidden');
    window.scrollTo({ top: 0 });
  }

  document.addEventListener('DOMContentLoaded', renderStart);
})();
