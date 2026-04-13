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

  function renderPatternSelector(patterns, onPatternClick, onResetAll) {
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
        <span class="stat-value">${stats.totalCorrectAnswers}</span>
        <span class="stat-label">Correctas acumuladas</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.totalIncorrectAnswers}</span>
        <span class="stat-label">Incorrectas acumuladas</span>
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
        const score = Quiz.getPatternScore(pattern.id);
        const pct   = Math.round(score * 100);
        const targetScore = Quiz.getTargetScore();
        const entry = Quiz.getPatternProgress(pattern.id);
        const bestScore = entry ? entry.bestScore : 0;
        const progressLabel = entry?.completed
          ? `Completado: ${targetScore}/${targetScore}`
          : `Mejor puntaje: ${bestScore}/${targetScore}`;

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
          <span class="progress-label">${progressLabel}</span>
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

  function renderHome(patterns, onPatternClick, onResetAll) {
    renderPatternSelector(patterns, onPatternClick, onResetAll);
  }

  // ── Pattern detail view ───────────────────────────────────────────────────
  function renderPatternDetail(pattern, onStart, onBack) {
    const targetScore = Quiz.getTargetScore();

    el('detail-name').textContent     = pattern.name;
    el('detail-category').textContent = pattern.category;
    el('detail-desc').textContent     = pattern.description;
    el('detail-count').textContent    = `${targetScore} preguntas por sesión`;

    const score = Quiz.getPatternScore(pattern.id);
    const pct   = Math.round(score * 100);
    const entry = Quiz.getPatternProgress(pattern.id);
    const bestScore = entry ? entry.bestScore : 0;

    el('detail-progress-fill').style.width  = `${pct}%`;
    el('detail-progress-label').textContent = entry?.completed
      ? `Completado: ${targetScore}/${targetScore} (100%)`
      : `Mejor intento: ${bestScore}/${targetScore} (${pct}%)`;

    const startBtn = el('btn-start-quiz');
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = '▶ Iniciar cuestionario';
      startBtn.onclick = () => onStart(pattern);
    }
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
    return QuestionRenderer.getLabel(type);
  }

  // ── Quiz view ─────────────────────────────────────────────────────────────
  function renderQuizHeader(pattern, currentAnswered, total) {
    const safeAnswered = Math.max(0, Math.min(total, Number(currentAnswered) || 0));
    el('quiz-pattern-name').textContent = pattern.name;
    el('quiz-progress-text').textContent = `${safeAnswered} / ${total} respondidas`;
    const pct = total > 0 ? Math.round((safeAnswered / total) * 100) : 0;
    el('quiz-progress-fill').style.width = `${pct}%`;
  }

  function renderQuestion(question, currentAnswered, total) {
    const safeAnswered = Math.max(0, Math.min(total, Number(currentAnswered) || 0));
    el('question-type-label').textContent = typeLabel(question.type);
    el('question-text').textContent       = question.question;

    const answerArea = el('answer-area');
    answerArea.innerHTML = '';

    hide('feedback-box');

    const getAnswer = QuestionRenderer.render(question, answerArea);
    renderSubmitRow(answerArea, getAnswer);

    el('quiz-progress-text').textContent = `${safeAnswered} / ${total} respondidas`;
    const pct = total > 0 ? Math.round((safeAnswered / total) * 100) : 0;
    el('quiz-progress-fill').style.width = `${pct}%`;
  }

  function renderQuizView(pattern, question, currentAnswered, total) {
    renderQuizHeader(pattern, currentAnswered, total);
    renderQuestion(question, currentAnswered, total);
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
    renderPatternSelector,
    renderHome,
    renderPatternDetail,
    renderQuizView,
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
