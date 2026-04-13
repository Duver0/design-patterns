/**
 * app.js
 * Main application controller: routing, data loading, wiring Quiz ↔ UI.
 */

const App = (() => {
  let patterns = [];
  let activePattern = null;

  // ── Boot ──────────────────────────────────────────────────────────────────
  async function init() {
    try {
      const res = await fetch('data/patterns.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      patterns = await res.json();
    } catch (err) {
      document.body.innerHTML = `
        <div style="padding:2rem;text-align:center;color:#e74c3c;">
          <h2>Error al cargar los datos</h2>
          <p>${err.message}</p>
          <p>Asegúrate de servir la aplicación desde un servidor (no file://).</p>
        </div>`;
      return;
    }

    navigateHome();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function navigateHome() {
    activePattern = null;
    Quiz.endSession();
    UI.renderHome(patterns, navigateToPattern, handleResetAll);
    UI.showView('view-home');
  }

  function navigateToPattern(pattern) {
    activePattern = pattern;
    UI.renderPatternDetail(pattern, startQuiz, navigateHome);
    UI.showView('view-pattern');
  }

  function startQuiz(pattern) {
    activePattern = pattern;
    Quiz.startSession(pattern);

    const total = pattern.questions.length;
    UI.renderQuizHeader(pattern, 1, total);
    UI.renderQuestion(Quiz.getCurrentQuestion(), 1, total);
    UI.showView('view-quiz');
  }

  function navigateResults() {
    const s = Quiz.session;
    if (!s) { navigateHome(); return; }

    UI.renderResults(
      s.pattern,
      s.score,
      s.questions.length,
      () => startQuiz(activePattern),
      navigateHome,
    );
    UI.showView('view-results');
  }

  // ── Answer handling ───────────────────────────────────────────────────────
  function handleAnswer(userAnswer) {
    const question = Quiz.getCurrentQuestion();
    if (!question) return;

    const { correct, correctAnswer } = Quiz.validateAnswer(question, userAnswer);
    const isLast = !Quiz.hasNextQuestion();
    const total  = Quiz.session.questions.length;
    const currentNum = Quiz.session.currentIndex + 1;

    UI.renderFeedback(correct, correctAnswer, question.explanation, isLast, () => {
      if (isLast) {
        navigateResults();
      } else {
        Quiz.advanceQuestion();
        const nextNum = Quiz.session.currentIndex + 1;
        UI.renderQuestion(Quiz.getCurrentQuestion(), nextNum, total);
        UI.hide('feedback-box');
      }
    });
  }

  // ── Reset handlers ────────────────────────────────────────────────────────
  function handleResetAll() {
    if (confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
      Quiz.resetAllProgress();
      navigateHome();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return { init, handleAnswer, navigateHome };
})();

document.addEventListener('DOMContentLoaded', App.init);
