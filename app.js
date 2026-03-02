(function () {
  const state = {
    currentStep: -1,
    answers: {},
    totalSteps: PALM_DATA.steps.length
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== Init =====
  function init() {
    $('#startBtn').addEventListener('click', startWizard);
    $('#prevBtn').addEventListener('click', prevStep);
    $('#nextBtn').addEventListener('click', nextStep);
    $('#restartBtn').addEventListener('click', restart);
    $('#enhanceBtn').addEventListener('click', enhanceWithAI);
  }

  // ===== Navigation =====
  function startWizard() {
    $('#startScreen').classList.add('hidden');
    $('#stepScreen').classList.remove('hidden');
    $('#progressSection').classList.add('active');
    $('#bottomNav').classList.remove('hidden');
    document.body.classList.add('has-progress', 'has-bottom-nav');
    state.currentStep = 0;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextStep() {
    if (state.currentStep < state.totalSteps - 1) {
      state.currentStep++;
      renderStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showResults();
    }
  }

  function prevStep() {
    if (state.currentStep > 0) {
      state.currentStep--;
      renderStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function restart() {
    state.currentStep = -1;
    state.answers = {};
    $('#resultScreen').classList.add('hidden');
    $('#stepScreen').classList.add('hidden');
    $('#progressSection').classList.remove('active');
    $('#bottomNav').classList.add('hidden');
    document.body.classList.remove('has-progress', 'has-bottom-nav');
    $('#startScreen').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== Render Step =====
  function renderStep() {
    const step = PALM_DATA.steps[state.currentStep];
    if (!step) return;

    updateProgress();

    $('#stepTitle').textContent = step.title;
    $('#stepDescription').textContent = step.description;

    const container = $('#questionsContainer');
    container.innerHTML = '';

    step.questions.forEach((q) => {
      const group = document.createElement('div');
      group.className = 'question-group';
      group.dataset.questionId = q.id;

      if (q.conditional) {
        const condAnswer = state.answers[q.conditional.questionId];
        if (condAnswer !== q.conditional.value) {
          group.classList.add('conditional-hidden');
        }
      }

      const label = document.createElement('div');
      label.className = 'question-label';
      label.textContent = q.label;
      group.appendChild(label);

      if (q.helpText) {
        const help = document.createElement('div');
        help.className = 'question-help';
        help.textContent = q.helpText;
        group.appendChild(help);
      }

      if (q.image) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'question-image';
        const img = document.createElement('img');
        img.src = q.image;
        img.alt = q.label;
        img.loading = 'lazy';
        imgWrap.appendChild(img);
        group.appendChild(imgWrap);
      } else if (q.images && q.images.length > 0) {
        const gridWrap = document.createElement('div');
        gridWrap.className = 'question-images-grid';
        q.images.forEach((src) => {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'question-image';
          const img = document.createElement('img');
          img.src = src;
          img.alt = q.label;
          img.loading = 'lazy';
          imgWrap.appendChild(img);
          gridWrap.appendChild(imgWrap);
        });
        group.appendChild(gridWrap);
      }

      const grid = document.createElement('div');
      grid.className = 'options-grid';

      q.options.forEach((opt) => {
        const card = document.createElement('label');
        card.className = 'option-card';

        const input = document.createElement('input');
        input.type = q.type === 'checkbox' ? 'checkbox' : 'radio';
        input.name = q.id;
        input.value = opt.value;

        const currentAnswer = state.answers[q.id];
        if (q.type === 'checkbox') {
          if (Array.isArray(currentAnswer) && currentAnswer.includes(opt.value)) {
            input.checked = true;
            card.classList.add('selected');
          }
        } else {
          if (currentAnswer === opt.value) {
            input.checked = true;
            card.classList.add('selected');
          }
        }

        input.addEventListener('change', () => handleOptionChange(q, opt.value, input));
        card.appendChild(input);

        if (opt.image) {
          card.classList.add('option-with-image');
          const optImg = document.createElement('div');
          optImg.className = 'option-image';
          const img = document.createElement('img');
          img.src = opt.image;
          img.alt = opt.label;
          img.loading = 'lazy';
          optImg.appendChild(img);
          card.appendChild(optImg);
        }

        const rowWrap = document.createElement('div');
        rowWrap.className = 'option-row';

        const indicator = document.createElement('span');
        indicator.className = q.type === 'checkbox' ? 'option-checkbox' : 'option-radio';
        rowWrap.appendChild(indicator);

        const textDiv = document.createElement('div');
        textDiv.className = 'option-text';
        const title = document.createElement('div');
        title.className = 'option-title';
        title.textContent = opt.label;
        textDiv.appendChild(title);

        if (opt.description) {
          const desc = document.createElement('div');
          desc.className = 'option-desc';
          desc.textContent = opt.description;
          textDiv.appendChild(desc);
        }

        rowWrap.appendChild(textDiv);
        card.appendChild(rowWrap);
        grid.appendChild(card);
      });

      group.appendChild(grid);
      container.appendChild(group);
    });

    updateNavigation();
  }

  function handleOptionChange(question, value, input) {
    if (question.type === 'checkbox') {
      if (!Array.isArray(state.answers[question.id])) {
        state.answers[question.id] = [];
      }
      if (value === 'none') {
        state.answers[question.id] = ['none'];
        $$(`input[name="${question.id}"]`).forEach((inp) => {
          inp.checked = inp.value === 'none';
          inp.closest('.option-card').classList.toggle('selected', inp.value === 'none');
        });
      } else {
        state.answers[question.id] = state.answers[question.id].filter((v) => v !== 'none');
        const noneInput = document.querySelector(`input[name="${question.id}"][value="none"]`);
        if (noneInput) {
          noneInput.checked = false;
          noneInput.closest('.option-card').classList.remove('selected');
        }

        if (input.checked) {
          state.answers[question.id].push(value);
        } else {
          state.answers[question.id] = state.answers[question.id].filter((v) => v !== value);
        }
        input.closest('.option-card').classList.toggle('selected', input.checked);
      }
    } else {
      state.answers[question.id] = value;
      $$(`input[name="${question.id}"]`).forEach((inp) => {
        inp.closest('.option-card').classList.toggle('selected', inp.checked);
      });

      const step = PALM_DATA.steps[state.currentStep];
      step.questions.forEach((q) => {
        if (q.conditional && q.conditional.questionId === question.id) {
          const group = document.querySelector(`[data-question-id="${q.id}"]`);
          if (group) {
            const shouldHide = value !== q.conditional.value;
            group.classList.toggle('conditional-hidden', shouldHide);
            if (shouldHide) {
              delete state.answers[q.id];
            }
          }
        }
      });
    }

    updateNavigation();
  }

  function updateNavigation() {
    const step = PALM_DATA.steps[state.currentStep];
    const requiredQuestions = step.questions.filter((q) => {
      if (q.conditional) {
        return state.answers[q.conditional.questionId] === q.conditional.value;
      }
      return true;
    });

    const allAnswered = requiredQuestions.every((q) => {
      const answer = state.answers[q.id];
      if (q.type === 'checkbox') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== null;
    });

    $('#nextBtn').disabled = !allAnswered;
    const isLast = state.currentStep === state.totalSteps - 1;
    $('#nextBtn').textContent = isLast ? '鑑定結果を見る' : '次へ';
    $('#prevBtn').style.visibility = state.currentStep === 0 ? 'hidden' : 'visible';
  }

  function updateProgress() {
    const pct = ((state.currentStep + 1) / state.totalSteps) * 100;
    $('#progressBar').style.width = pct + '%';

    const step = PALM_DATA.steps[state.currentStep];
    $('#progressStepLabel').textContent = step ? step.title : '';
    $('#progressCounter').textContent = `${state.currentStep + 1} / ${state.totalSteps}`;
  }

  // ===== Results =====
  function showResults() {
    $('#stepScreen').classList.add('hidden');
    $('#progressSection').classList.remove('active');
    $('#bottomNav').classList.add('hidden');
    document.body.classList.remove('has-progress', 'has-bottom-nav');
    $('#resultScreen').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderResults();
  }

  function renderResults(results) {
    const cards = $('#resultCards');
    cards.innerHTML = '';

    const data = results || generateResults();
    state.lastResults = data;

    data.forEach((result) => {
      if (!result.content || result.content.trim() === '') return;

      const card = document.createElement('div');
      card.className = 'result-card';

      card.innerHTML = `
        <div class="result-card-header">
          <span class="result-card-icon">${result.icon}</span>
          <span class="result-card-title">${result.title}</span>
        </div>
        <div class="result-card-body">
          ${result.content.split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}
        </div>
      `;
      cards.appendChild(card);
    });
  }

  async function enhanceWithAI() {
    const btn = $('#enhanceBtn');
    if (!state.lastResults || state.lastResults.length === 0) return;

    const cardsToSend = state.lastResults
      .filter((r) => r.content && r.content.trim() !== '')
      .map((r) => ({ icon: r.icon, title: r.title, content: r.content, tags: r.tags }));

    if (cardsToSend.length === 0) return;

    btn.disabled = true;
    btn.textContent = '処理中...';

    try {
      const base = window.location.origin;
      const res = await fetch(base + '/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: cardsToSend })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enhancement failed');

      const enhanced = data.cards;
      const merged = state.lastResults.map((orig) => {
        const found = enhanced.find((e) => e.title === orig.title);
        return found ? { ...orig, content: found.content } : orig;
      });
      state.lastResults = merged;
      renderResults(merged);
      btn.textContent = 'より詳細な鑑定結果を見る（完了）';
    } catch (err) {
      alert('AIでの文章整形に失敗しました。' + (err.message || ''));
      btn.textContent = 'より詳細な鑑定結果を見る';
    } finally {
      btn.disabled = false;
    }
  }

  function buildCompositeContent(groups, opening, closing) {
    const paragraphs = [];
    groups.forEach((g) => {
      const text = g.filter(Boolean).join('');
      if (text) paragraphs.push(text);
    });
    if (paragraphs.length === 0) return '';
    let result = opening ? opening + '\n\n' : '';
    result += paragraphs.join('\n\n');
    if (closing && paragraphs.length > 0) result += '\n\n' + closing;
    return result;
  }

  function generateResults() {
    const a = state.answers;
    const interp = PALM_DATA.interpretations;

    return [
      generatePersonality(a, interp),
      generateWork(a, interp),
      generateLove(a, interp),
      generateHealth(a, interp),
      generateAdvice(a, interp)
    ];
  }

  function generatePersonality(a, interp) {
    const overallParts = [];
    const chinoParts = [];
    const kanjoParts = [];
    const tags = [];

    if (a.lineCount && interp.overall.lineCount[a.lineCount]) {
      overallParts.push(interp.overall.lineCount[a.lineCount].text);
      tags.push('線の多さ');
    }
    if (a.leftRight && interp.overall.leftRight[a.leftRight]) {
      overallParts.push(interp.overall.leftRight[a.leftRight].text);
      tags.push('左右の類似度');
    }
    if (a.chinoLength && interp.chinoLine.chinoLength[a.chinoLength]) {
      chinoParts.push(interp.chinoLine.chinoLength[a.chinoLength].personality);
      tags.push('知能線の長さ');
    }
    if (a.chinoStart && interp.chinoLine.chinoStart[a.chinoStart]) {
      chinoParts.push(interp.chinoLine.chinoStart[a.chinoStart].personality);
      tags.push('知能線の始点');
    }
    if (a.chinoEnd && interp.chinoLine.chinoEnd[a.chinoEnd]) {
      chinoParts.push(interp.chinoLine.chinoEnd[a.chinoEnd].personality);
      tags.push('知能線の終点');
    }
    const chinoSpecialArr = Array.isArray(a.chinoSpecial) ? a.chinoSpecial : (a.chinoSpecial ? [a.chinoSpecial] : []);
    chinoSpecialArr.filter((v) => v !== 'none').forEach((v) => {
      if (interp.chinoLine.chinoSpecial[v]) {
        chinoParts.push(interp.chinoLine.chinoSpecial[v].text);
      }
    });
    if (chinoSpecialArr.some((v) => v !== 'none')) tags.push('知能線の特殊形状');
    if (a.kanjoCurve && interp.kanjoLine.kanjoCurve[a.kanjoCurve]) {
      kanjoParts.push(interp.kanjoLine.kanjoCurve[a.kanjoCurve].personality);
      tags.push('感情線のカーブ');
    }
    if (a.kanjoHorizontal && interp.kanjoLine.kanjoHorizontal[a.kanjoHorizontal]) {
      kanjoParts.push(interp.kanjoLine.kanjoHorizontal[a.kanjoHorizontal].text);
      tags.push('感情線の横幅');
    }
    if (a.kanjoVertical && interp.kanjoLine.kanjoVertical[a.kanjoVertical]) {
      kanjoParts.push(interp.kanjoLine.kanjoVertical[a.kanjoVertical].text);
      tags.push('感情線の縦幅');
    }
    const kanjoSpecialArr = Array.isArray(a.kanjoSpecial) ? a.kanjoSpecial : (a.kanjoSpecial ? [a.kanjoSpecial] : []);
    kanjoSpecialArr.filter((v) => v !== 'none').forEach((v) => {
      if (interp.kanjoLine.kanjoSpecial[v]) {
        kanjoParts.push(interp.kanjoLine.kanjoSpecial[v].text);
      }
    });
    if (kanjoSpecialArr.some((v) => v !== 'none')) tags.push('感情線の特殊形状');

    const groups = [overallParts, chinoParts, kanjoParts];
    const content = buildCompositeContent(groups, '', '');
    return {
      icon: '✨',
      title: '性格・才能タイプ',
      content: content || [...overallParts, ...chinoParts, ...kanjoParts].filter(Boolean).join('\n'),
      tags
    };
  }

  function generateWork(a, interp) {
    const unmeiParts = [];
    const chinoParts = [];
    const kanjoParts = [];
    const tags = [];

    if (a.unmeiExist && interp.unmeiLine.unmeiExist[a.unmeiExist]) {
      const d = interp.unmeiLine.unmeiExist[a.unmeiExist];
      unmeiParts.push(d.text);
      if (d.work) unmeiParts.push(d.work);
      tags.push('運命線の有無');
    }
    if (a.chinoEnd && interp.chinoLine.chinoEnd[a.chinoEnd]) {
      const d = interp.chinoLine.chinoEnd[a.chinoEnd];
      if (d.work) {
        chinoParts.push(d.work);
        tags.push('知能線の終点');
      }
    }
    if (a.chinoStart && interp.chinoLine.chinoStart[a.chinoStart]) {
      const d = interp.chinoLine.chinoStart[a.chinoStart];
      if (d.work) {
        chinoParts.push(d.work);
        tags.push('知能線の始点');
      }
    }
    if (a.kanjoCurve && interp.kanjoLine.kanjoCurve[a.kanjoCurve]) {
      kanjoParts.push(interp.kanjoLine.kanjoCurve[a.kanjoCurve].work);
      tags.push('感情線のカーブ');
    }

    const groups = [unmeiParts, chinoParts, kanjoParts];
    const content = buildCompositeContent(groups, '', '');
    return {
      icon: '💼',
      title: '仕事運',
      content: content || [...unmeiParts, ...chinoParts, ...kanjoParts].filter(Boolean).join('\n'),
      tags: [...new Set(tags)]
    };
  }

  function generateLove(a, interp) {
    const baseParts = [];
    const specialParts = [];
    const tags = [];

    if (a.kanjoCurve && interp.kanjoLine.kanjoCurve[a.kanjoCurve]) {
      baseParts.push(interp.kanjoLine.kanjoCurve[a.kanjoCurve].love);
      tags.push('感情線のカーブ');
    }
    if (a.kanjoHorizontal && interp.kanjoLine.kanjoHorizontal[a.kanjoHorizontal]) {
      const d = interp.kanjoLine.kanjoHorizontal[a.kanjoHorizontal];
      if (d.love) {
        baseParts.push(d.love);
        tags.push('感情線の横の長さ');
      }
    }
    if (a.kanjoVertical && interp.kanjoLine.kanjoVertical[a.kanjoVertical]) {
      const d = interp.kanjoLine.kanjoVertical[a.kanjoVertical];
      if (d.love) {
        baseParts.push(d.love);
        tags.push('感情線の縦の長さ');
      }
    }
    const kanjoSpecialArr = Array.isArray(a.kanjoSpecial) ? a.kanjoSpecial : (a.kanjoSpecial ? [a.kanjoSpecial] : []);
    kanjoSpecialArr.filter((v) => v !== 'none').forEach((v) => {
      if (interp.kanjoLine.kanjoSpecial[v]) {
        specialParts.push(interp.kanjoLine.kanjoSpecial[v].text);
      }
    });
    if (kanjoSpecialArr.some((v) => v !== 'none')) tags.push('感情線の特殊形状');

    const groups = [baseParts, specialParts];
    const content = buildCompositeContent(groups, '', '');
    return {
      icon: '💕',
      title: '恋愛',
      content: content || [...baseParts, ...specialParts].filter(Boolean).join('\n'),
      tags: [...new Set(tags)]
    };
  }

  function generateHealth(a, interp) {
    const vitalityParts = [];
    const directionParts = [];
    const tags = [];

    if (a.seimeiThickness && interp.seimeiLine.seimeiThickness[a.seimeiThickness]) {
      vitalityParts.push(interp.seimeiLine.seimeiThickness[a.seimeiThickness].text);
      tags.push('生命線の太さ');
    }
    if (a.seimieBulge && interp.seimeiLine.seimieBulge[a.seimieBulge]) {
      vitalityParts.push(interp.seimeiLine.seimieBulge[a.seimieBulge].text);
      tags.push('生命線の張り出し');
    }
    if (a.seimeiEnd && interp.seimeiLine.seimeiEnd[a.seimeiEnd]) {
      directionParts.push(interp.seimeiLine.seimeiEnd[a.seimeiEnd].text);
      tags.push('生命線の終点');
    }

    const groups = [vitalityParts, directionParts];
    const content = buildCompositeContent(groups, '', '');
    return {
      icon: '🌿',
      title: '健康・生命力',
      content: content || [...vitalityParts, ...directionParts].filter(Boolean).join('\n'),
      tags
    };
  }

  function generateAdvice(a, interp) {
    const parts = [];
    const fallback = '日々の選択を大切に、自分らしい人生を歩んでいってください。';

    if (a.kanjoCurve && interp.kanjoLine.kanjoCurve[a.kanjoCurve] && interp.kanjoLine.kanjoCurve[a.kanjoCurve].advice) {
      parts.push(interp.kanjoLine.kanjoCurve[a.kanjoCurve].advice);
    }
    if (parts.length === 0) {
      parts.push('あなたの手相からは、4大基本線それぞれに個性が読み取れます。' + fallback);
    } else {
      parts.push(fallback);
    }

    return {
      icon: '💬',
      title: '総合アドバイス',
      content: parts.filter(Boolean).join('\n'),
      tags: []
    };
  }

  // ===== Boot =====
  document.addEventListener('DOMContentLoaded', init);
})();
