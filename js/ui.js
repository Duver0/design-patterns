/**
 * ui.js
 * All DOM rendering functions. No business logic here – only presentation.
 */

const UI = (() => {
  // ── Helpers ───────────────────────────────────────────────────────────────
  function el(id) { return document.getElementById(id); }
  function qs(sel, ctx = document) { return ctx.querySelector(sel); }

  function hide(...ids) { ids.forEach(id => el(id)?.classList.add('hidden')); }
  function show(...ids) { ids.forEach(id => el(id)?.classList.remove('hidden')); }

  /** Simple markdown-lite: bold **text** */
  function mdLite(text) {
    return String(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  // ── Views ─────────────────────────────────────────────────────────────────
  function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    el(viewId)?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Home view ─────────────────────────────────────────────────────────────
  const CATEGORY_ICONS = {
    'Creacional':     '🏗️',
    'Estructural':    '🔧',
    'Comportamiento': '🔄',
  };

  const CATEGORY_CLASSES = {
    'Creacional':     'badge--creacional',
    'Estructural':    'badge--estructural',
    'Comportamiento': 'badge--comportamiento',
  };

  function renderHome(patterns, onPatternClick, onResetAll) {
    // Group by category
    const categories = {};
    patterns.forEach(p => {
      if (!categories[p.category]) categories[p.category] = [];
      categories[p.category].push(p);
    });

    // Global stats
    const stats = Quiz.getGlobalStats(patterns);
    el('global-stats').innerHTML = `
      <div class="stat-item">
        <span class="stat-value">${stats.completedPatterns}/${stats.totalPatterns}</span>
        <span class="stat-label">Patrones completados</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.correctAnswers}/${stats.totalQuestions}</span>
        <span class="stat-label">Respuestas correctas</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.accuracy}%</span>
        <span class="stat-label">Precisión global</span>
      </div>
    `;

    const grid = el('patterns-grid');
    grid.innerHTML = '';

    const categoryOrder = ['Creacional', 'Estructural', 'Comportamiento'];
    categoryOrder.forEach(cat => {
      if (!categories[cat]) return;

      const section = document.createElement('section');
      section.className = 'category-section';
      section.innerHTML = `
        <h2 class="category-heading">
          <span>${CATEGORY_ICONS[cat] || '📦'}</span>
          ${cat}
        </h2>
        <div class="cards-row" id="cards-${cat}"></div>
      `;
      grid.appendChild(section);

      const row = qs(`#cards-${cat}`, section);
      categories[cat].forEach(pattern => {
        const score = Quiz.getPatternScore(pattern.id, pattern.questions.length);
        const pct   = Math.round(score * 100);
        const entry = Quiz.getPatternProgress(pattern.id);
        const answered = entry ? Object.keys(entry.answers).length : 0;

        const card = document.createElement('button');
        card.className = 'pattern-card';
        card.setAttribute('aria-label', `Ir al patrón ${pattern.name}`);
        card.innerHTML = `
          <span class="pattern-badge ${CATEGORY_CLASSES[cat] || ''}">${cat}</span>
          <h3 class="pattern-name">${pattern.name}</h3>
          <p class="pattern-desc">${pattern.description}</p>
          <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="progress-label">${answered}/${pattern.questions.length} preguntas respondidas</span>
        `;
        card.addEventListener('click', () => onPatternClick(pattern));
        row.appendChild(card);
      });
    });

    // Reset all button
    const resetBtn = el('btn-reset-all');
    if (resetBtn) {
      resetBtn.onclick = onResetAll;
    }
  }

  // ── Pattern detail view ───────────────────────────────────────────────────
  function renderPatternDetail(pattern, onStart, onBack) {
    el('detail-name').textContent     = pattern.name;
    el('detail-category').textContent = pattern.category;
    el('detail-desc').textContent     = pattern.description;
    el('detail-count').textContent    = `${pattern.questions.length} preguntas`;

    const score = Quiz.getPatternScore(pattern.id, pattern.questions.length);
    const pct   = Math.round(score * 100);
    el('detail-progress-fill').style.width  = `${pct}%`;
    el('detail-progress-label').textContent = `${pct}% completado`;

    // Question preview list
    const list = el('questions-list');
    list.innerHTML = '';
    const entry = Quiz.getPatternProgress(pattern.id);

    pattern.questions.forEach((q, i) => {
      const answered = entry && q.id in entry.answers;
      const correct  = answered && entry.answers[q.id];

      const item = document.createElement('div');
      item.className = 'question-item';
      item.innerHTML = `
        <span class="q-status ${answered ? (correct ? 'q-status--correct' : 'q-status--wrong') : 'q-status--pending'}">
          ${answered ? (correct ? '✓' : '✗') : '○'}
        </span>
        <span class="q-num">Pregunta ${i + 1}</span>
        <span class="q-type-badge">${typeLabel(q.type)}</span>
      `;
      list.appendChild(item);
    });

    el('btn-start-quiz').onclick = () => onStart(pattern);
    el('btn-back-home').onclick  = onBack;

    // Reset pattern button
    const resetBtn = el('btn-reset-pattern');
    if (resetBtn) {
      resetBtn.onclick = () => {
        Quiz.resetPatternProgress(pattern.id);
        renderPatternDetail(pattern, onStart, onBack);
      };
    }
  }

  function typeLabel(type) {
    const map = {
      multiple_choice: 'Opción múltiple',
      true_false:      'Verdadero / Falso',
      short_answer:    'Respuesta corta',
    };
    return map[type] || type;
  }

  // ── Quiz view ─────────────────────────────────────────────────────────────
  function renderQuizHeader(pattern, current, total) {
    el('quiz-pattern-name').textContent = pattern.name;
    el('quiz-progress-text').textContent = `${current} / ${total}`;
    const pct = Math.round(((current - 1) / total) * 100);
    el('quiz-progress-fill').style.width = `${pct}%`;
  }

  function renderQuestion(question, questionNum, total) {
    el('question-type-label').textContent = typeLabel(question.type);
    el('question-text').textContent       = question.question;

    const answerArea = el('answer-area');
    answerArea.innerHTML = '';

    hide('feedback-box');

    switch (question.type) {
      case 'multiple_choice':
        renderMultipleChoice(question, answerArea);
        break;
      case 'true_false':
        renderTrueFalse(answerArea);
        break;
      case 'short_answer':
        renderShortAnswer(question, answerArea);
        break;
    }

    el('quiz-progress-text').textContent = `${questionNum} / ${total}`;
    const pct = Math.round(((questionNum - 1) / total) * 100);
    el('quiz-progress-fill').style.width = `${pct}%`;
  }

  function renderMultipleChoice(question, container) {
    const group = document.createElement('div');
    group.className = 'options-group';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', 'Opciones de respuesta');

    question.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className   = 'option-btn';
      btn.dataset.idx = i;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.textContent = opt;
      btn.addEventListener('click', () => handleOptionSelect(btn, group));
      group.appendChild(btn);
    });

    container.appendChild(group);
    renderSubmitRow(container, () => {
      const selected = group.querySelector('.option-btn.selected');
      return selected ? parseInt(selected.dataset.idx, 10) : null;
    });
  }

  function renderTrueFalse(container) {
    const group = document.createElement('div');
    group.className = 'tf-group';

    ['true', 'false'].forEach(val => {
      const btn = document.createElement('button');
      btn.className    = 'tf-btn';
      btn.dataset.val  = val;
      btn.textContent  = val === 'true' ? '✓ Verdadero' : '✗ Falso';
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        group.querySelectorAll('.tf-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      });
      group.appendChild(btn);
    });

    container.appendChild(group);
    renderSubmitRow(container, () => {
      const sel = group.querySelector('.tf-btn.selected');
      return sel ? sel.dataset.val === 'true' : null;
    });
  }

  function renderShortAnswer(question, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'short-answer-wrapper';

    const input = document.createElement('input');
    input.type        = 'text';
    input.id          = 'short-input';
    input.className   = 'short-input';
    input.placeholder = 'Escribe tu respuesta…';
    input.setAttribute('aria-label', 'Respuesta corta');
    input.setAttribute('autocomplete', 'off');

    const hintBtn = document.createElement('button');
    hintBtn.className   = 'hint-btn';
    hintBtn.textContent = '💡 Ver pista';
    hintBtn.setAttribute('aria-expanded', 'false');

    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box hidden';
    hintBox.textContent = question.hint || '';

    hintBtn.addEventListener('click', () => {
      const visible = !hintBox.classList.contains('hidden');
      hintBox.classList.toggle('hidden', visible);
      hintBtn.setAttribute('aria-expanded', String(!visible));
      hintBtn.textContent = visible ? '💡 Ver pista' : '🙈 Ocultar pista';
    });

    wrapper.appendChild(input);
    wrapper.appendChild(hintBtn);
    wrapper.appendChild(hintBox);
    container.appendChild(wrapper);

    renderSubmitRow(container, () => {
      const val = input.value.trim();
      return val || null;
    });

    // Submit on Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const submitBtn = container.querySelector('.btn-submit');
        submitBtn?.click();
      }
    });

    input.focus();
  }

  function renderSubmitRow(container, getAnswer) {
    const row = document.createElement('div');
    row.className = 'submit-row';

    const btn = document.createElement('button');
    btn.className   = 'btn btn-submit btn--primary';
    btn.textContent = 'Responder';
    btn.addEventListener('click', () => {
      const answer = getAnswer();
      if (answer === null || answer === undefined || answer === '') {
        shakeElement(btn);
        return;
      }
      App.handleAnswer(answer);
    });

    row.appendChild(btn);
    container.appendChild(row);
  }

  function handleOptionSelect(btn, group) {
    group.querySelectorAll('.option-btn').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-checked', 'true');
  }

  function shakeElement(element) {
    element.classList.remove('shake');
    void element.offsetWidth; // Force reflow to restart CSS animation
    element.classList.add('shake');
    element.addEventListener('animationend', () => element.classList.remove('shake'), { once: true });
  }

  // ── Feedback ──────────────────────────────────────────────────────────────
  function renderFeedback(isCorrect, correctAnswer, explanation, isLast, onNext) {
    const box = el('feedback-box');
    box.className = `feedback-box ${isCorrect ? 'feedback--correct' : 'feedback--wrong'}`;

    box.innerHTML = `
      <div class="feedback-header">
        <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
        <span class="feedback-verdict">${isCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
      </div>
      ${!isCorrect ? `<p class="feedback-correct-answer">Respuesta correcta: <strong>${correctAnswer}</strong></p>` : ''}
      <p class="feedback-explanation">${mdLite(explanation)}</p>
      <button class="btn btn--primary feedback-next-btn" id="btn-next">
        ${isLast ? '🏁 Ver resultados' : 'Siguiente →'}
      </button>
    `;

    show('feedback-box');
    // Disable answer inputs
    el('answer-area').querySelectorAll('button, input').forEach(b => (b.disabled = true));

    el('btn-next').addEventListener('click', onNext);
  }

  // ── Results view ──────────────────────────────────────────────────────────
  function renderResults(pattern, score, total, onRetry, onHome) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    let emoji = '😕';
    if (pct >= 80) emoji = '🎉';
    else if (pct >= 50) emoji = '👍';

    el('results-emoji').textContent      = emoji;
    el('results-score').textContent      = `${score} / ${total}`;
    el('results-pct').textContent        = `${pct}%`;
    el('results-pattern-name').textContent = pattern.name;

    const msg = el('results-message');
    if (pct === 100) {
      msg.textContent = '¡Perfecto! Dominas este patrón.';
    } else if (pct >= 80) {
      msg.textContent = '¡Muy bien! Casi lo dominas.';
    } else if (pct >= 50) {
      msg.textContent = 'Buen intento. Sigue practicando.';
    } else {
      msg.textContent = 'Necesitas repasar este patrón un poco más.';
    }

    el('btn-retry').onclick = onRetry;
    el('btn-go-home').onclick = onHome;
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    showView,
    renderHome,
    renderPatternDetail,
    renderQuizHeader,
    renderQuestion,
    renderFeedback,
    renderResults,
    typeLabel,
    show,
    hide,
    el,
  };
})();
