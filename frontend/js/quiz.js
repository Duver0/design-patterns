/**
 * quiz.js
 * Quiz state management, answer validation, and progress tracking.
 */

const Quiz = (() => {
  // ── State ─────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'dp_progress';

  /** @type {{ patternId: string, answers: Record<string, boolean>, completed: boolean }[]} */
  let progress = [];

  /** @type {{ pattern: object, questions: object[], currentIndex: number, score: number } | null} */
  let session = null;

  // ── Persistence ───────────────────────────────────────────────────────────
  function loadProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      progress = stored ? JSON.parse(stored) : [];
    } catch {
      progress = [];
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // localStorage unavailable – silently ignore
    }
  }

  function getOrCreatePatternProgress(patternId) {
    let entry = progress.find(p => p.patternId === patternId);
    if (!entry) {
      entry = { patternId, answers: {}, completed: false };
      progress.push(entry);
    }
    return entry;
  }

  // ── Session management ────────────────────────────────────────────────────
  function startSession(pattern) {
    session = {
      pattern,
      questions: [...pattern.questions],
      currentIndex: 0,
      score: 0,
    };
    return session;
  }

  function getCurrentQuestion() {
    if (!session) return null;
    return session.questions[session.currentIndex] || null;
  }

  function hasNextQuestion() {
    if (!session) return false;
    return session.currentIndex < session.questions.length - 1;
  }

  function advanceQuestion() {
    if (session && hasNextQuestion()) {
      session.currentIndex += 1;
    }
  }

  function endSession() {
    session = null;
  }

  // ── Answer validation ─────────────────────────────────────────────────────
  /**
   * Validate a user answer against the question.
   * @param {object} question
   * @param {string|number|boolean} userAnswer
   * @returns {{ correct: boolean, correctAnswer: string }}
   */
  function validateAnswer(question, userAnswer) {
    let correct = false;
    let correctAnswer = '';

    switch (question.type) {
      case 'multiple_choice': {
        const idx = typeof userAnswer === 'number' ? userAnswer : parseInt(userAnswer, 10);
        correct = idx === question.correct;
        correctAnswer = question.options[question.correct];
        break;
      }

      case 'true_false': {
        const normalized = typeof userAnswer === 'boolean'
          ? userAnswer
          : userAnswer === 'true';
        correct = normalized === question.correct;
        correctAnswer = question.correct ? 'Verdadero' : 'Falso';
        break;
      }

      case 'short_answer': {
        const trimmed = String(userAnswer).trim().toLowerCase();
        correct = question.correct.some(ans => ans.toLowerCase() === trimmed);
        correctAnswer = question.correct[0];
        break;
      }

      default:
        break;
    }

    // Persist answer in session & global progress
    if (session) {
      if (correct) session.score += 1;

      const patternProgress = getOrCreatePatternProgress(session.pattern.id);
      patternProgress.answers[question.id] = correct;

      const allAnswered = session.questions.every(
        q => q.id in patternProgress.answers,
      );
      if (allAnswered) {
        patternProgress.completed = true;
      }

      saveProgress();
    }

    return { correct, correctAnswer };
  }

  // ── Progress queries ──────────────────────────────────────────────────────
  function getPatternProgress(patternId) {
    return progress.find(p => p.patternId === patternId) || null;
  }

  /**
   * Returns a 0-1 ratio of correct answers for a pattern.
   */
  function getPatternScore(patternId, totalQuestions) {
    const entry = getPatternProgress(patternId);
    if (!entry || totalQuestions === 0) return 0;
    const correct = Object.values(entry.answers).filter(Boolean).length;
    return correct / totalQuestions;
  }

  function resetPatternProgress(patternId) {
    progress = progress.filter(p => p.patternId !== patternId);
    saveProgress();
  }

  function resetAllProgress() {
    progress = [];
    saveProgress();
  }

  function getGlobalStats(patterns) {
    let totalQ = 0;
    let correctQ = 0;
    let completedPatterns = 0;

    patterns.forEach(pattern => {
      totalQ += pattern.questions.length;
      const entry = getPatternProgress(pattern.id);
      if (entry) {
        correctQ += Object.values(entry.answers).filter(Boolean).length;
        if (entry.completed) completedPatterns += 1;
      }
    });

    return {
      totalPatterns: patterns.length,
      completedPatterns,
      totalQuestions: totalQ,
      correctAnswers: correctQ,
      accuracy: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
    };
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  loadProgress();

  return {
    startSession,
    getCurrentQuestion,
    hasNextQuestion,
    advanceQuestion,
    endSession,
    validateAnswer,
    getPatternProgress,
    getPatternScore,
    resetPatternProgress,
    resetAllProgress,
    getGlobalStats,
    get session() { return session; },
  };
})();
