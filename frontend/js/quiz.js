/**
 * quiz.js
 * Quiz state management, answer validation, and progress tracking.
 */

const Quiz = (() => {
  // ── State ─────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'quiz_progress';
  const LEGACY_STORAGE_KEY = 'dp_progress';
  const SESSION_QUESTION_COUNT = 10;

  /** @type {Record<string, { bestScore: number, completed: boolean }>} */
  let progress = {};

  /** @type {{ totalCorrect: number, totalIncorrect: number }} */
  let stats = {
    totalCorrect: 0,
    totalIncorrect: 0,
  };

  function createInitialSessionState() {
    return {
      currentPattern: null,
      questions: [],
      currentQuestionIndex: 0,
      quizStarted: false,
      quizFailed: false,
      score: 0,
    };
  }

  let session = createInitialSessionState();

  // ── Persistence ───────────────────────────────────────────────────────────
  function clampScore(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.min(SESSION_QUESTION_COUNT, Math.floor(numeric)));
  }

  function clampCounter(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.floor(numeric));
  }

  function normalizeStats(rawStats) {
    if (!rawStats || typeof rawStats !== 'object' || Array.isArray(rawStats)) {
      return { totalCorrect: 0, totalIncorrect: 0 };
    }

    const totalCorrect = clampCounter(
      rawStats.totalCorrect ?? rawStats.totalCorrectAnswers,
    );
    const totalIncorrect = clampCounter(
      rawStats.totalIncorrect ?? rawStats.totalIncorrectAnswers,
    );

    return { totalCorrect, totalIncorrect };
  }

  function normalizeProgressObject(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

    return Object.entries(raw).reduce((acc, [patternId, entry]) => {
      if (typeof patternId !== 'string' || !patternId.trim()) return acc;

      const bestScore = clampScore(entry?.bestScore ?? entry?.bestStreak);
      const completed = Boolean(entry?.completed) || bestScore >= SESSION_QUESTION_COUNT;

      acc[patternId] = {
        bestScore: completed ? SESSION_QUESTION_COUNT : bestScore,
        completed,
      };
      return acc;
    }, {});
  }

  function fromLegacyArray(legacyArray) {
    if (!Array.isArray(legacyArray)) return {};

    return legacyArray.reduce((acc, item) => {
      if (!item || typeof item.patternId !== 'string' || !item.patternId.trim()) return acc;

      const fromBestScore = clampScore(item.bestScore ?? item.bestStreak);
      const fromAnswers = item.answers && typeof item.answers === 'object'
        ? clampScore(Object.values(item.answers).filter(Boolean).length)
        : 0;

      const bestScore = Math.max(fromBestScore, fromAnswers);
      const completed = Boolean(item.completed) || bestScore >= SESSION_QUESTION_COUNT;

      acc[item.patternId] = {
        bestScore: completed ? SESSION_QUESTION_COUNT : bestScore,
        completed,
      };
      return acc;
    }, {});
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, stats }));
    } catch {
      // localStorage unavailable – silently ignore
    }
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          progress = fromLegacyArray(parsed);
          stats = normalizeStats(null);
        } else if (parsed && typeof parsed === 'object') {
          if (parsed.progress || parsed.stats) {
            progress = normalizeProgressObject(parsed.progress);
            stats = normalizeStats(parsed.stats);
          } else {
            // Backward compatibility with older object-only shape.
            progress = normalizeProgressObject(parsed);
            stats = normalizeStats(null);
          }
        }
        return;
      }

      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        const legacyParsed = JSON.parse(legacy);
        progress = Array.isArray(legacyParsed)
          ? fromLegacyArray(legacyParsed)
          : normalizeProgressObject(legacyParsed);
        stats = normalizeStats(null);
        saveState();
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return;
      }

      progress = {};
      stats = normalizeStats(null);
    } catch {
      progress = {};
      stats = normalizeStats(null);
    }
  }

  function getOrCreatePatternProgress(patternId) {
    if (!progress[patternId]) {
      progress[patternId] = { bestScore: 0, completed: false };
    }
    return progress[patternId];
  }

  function persistBestAttempt(patternId, score) {
    if (!patternId) return;

    const safeScore = clampScore(score);
    const existing = progress[patternId];
    if (!existing && safeScore === 0) {
      return;
    }

    const entry = getOrCreatePatternProgress(patternId);
    const nextBest = Math.max(entry.bestScore, safeScore);
    const completed = entry.completed || nextBest >= SESSION_QUESTION_COUNT;

    // High score model: never overwrite with lower values.
    if (nextBest === entry.bestScore && completed === entry.completed) {
      return;
    }

    entry.bestScore = completed ? SESSION_QUESTION_COUNT : nextBest;
    entry.completed = completed;
  }

  // ── Session management ────────────────────────────────────────────────────
  function startSession(pattern, questions) {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    session = {
      currentPattern: pattern,
      questions: [...safeQuestions],
      currentQuestionIndex: 0,
      quizStarted: true,
      quizFailed: false,
      score: 0,
    };
    return session;
  }

  function getCurrentQuestion() {
    if (!session.quizStarted || session.quizFailed) return null;
    return session.questions[session.currentQuestionIndex] || null;
  }

  function hasNextQuestion() {
    if (!session.quizStarted || session.quizFailed) return false;
    return session.currentQuestionIndex < session.questions.length - 1;
  }

  function advanceQuestion() {
    if (hasNextQuestion()) {
      session.currentQuestionIndex += 1;
    }
  }

  function failSession() {
    session = createInitialSessionState();
  }

  function endSession() {
    session = createInitialSessionState();
  }

  // ── Answer validation ─────────────────────────────────────────────────────
  /**
   * Validate a user answer against the question.
   * @param {object} question
   * @param {string|number|boolean} userAnswer
   * @returns {{ correct: boolean, correctAnswer: string }}
   */
  function validateAnswer(question, userAnswer) {
    if (!session.quizStarted || session.quizFailed) {
      return { correct: false, correctAnswer: '' };
    }

    const correct = Boolean(question?.validate?.(userAnswer));
    const correctAnswer = typeof question?.getCorrectAnswer === 'function'
      ? question.getCorrectAnswer()
      : '';

    // Persist answer in session & global progress
    if (correct) {
      session.score += 1;
      stats.totalCorrect += 1;
      persistBestAttempt(session.currentPattern?.id, session.score);
    } else {
      stats.totalIncorrect += 1;
      persistBestAttempt(session.currentPattern?.id, session.score);
      session.quizFailed = true;
      session.quizStarted = false;
    }

    saveState();

    return { correct, correctAnswer };
  }

  // ── Progress queries ──────────────────────────────────────────────────────
  function getPatternProgress(patternId) {
    const entry = progress[patternId];
    if (!entry) return null;

    return {
      patternId,
      bestScore: entry.bestScore,
      completed: entry.completed,
    };
  }

  /**
   * Returns a 0-1 ratio of the best historical streak for a pattern.
   */
  function getPatternScore(patternId) {
    const entry = getPatternProgress(patternId);
    if (!entry) return 0;
    return entry.bestScore / SESSION_QUESTION_COUNT;
  }

  function resetPatternProgress(patternId) {
    if (!Object.prototype.hasOwnProperty.call(progress, patternId)) return;
    delete progress[patternId];
    saveState();
  }

  function resetAllProgress() {
    progress = {};
    // The accumulated tracking metrics remain by design.
    saveState();
  }

  function getGlobalStats(patterns) {
    const safePatterns = Array.isArray(patterns) ? patterns : [];

    let bestScoreTotal = 0;
    let completedPatterns = 0;

    safePatterns.forEach(pattern => {
      const entry = getPatternProgress(pattern.id);
      if (entry) {
        bestScoreTotal += entry.bestScore;
        if (entry.completed) completedPatterns += 1;
      }
    });

    const bestScorePossible = safePatterns.length * SESSION_QUESTION_COUNT;
    const totalAnswers = stats.totalCorrect + stats.totalIncorrect;
    const accuracy = totalAnswers > 0
      ? Math.round((stats.totalCorrect / totalAnswers) * 100)
      : 0;

    return {
      totalPatterns: safePatterns.length,
      completedPatterns,
      bestScoreTotal,
      bestScorePossible,
      bestScorePercent: bestScorePossible > 0
        ? Math.round((bestScoreTotal / bestScorePossible) * 100)
        : 0,
      totalCorrectAnswers: stats.totalCorrect,
      totalIncorrectAnswers: stats.totalIncorrect,
      totalAnswers,
      accuracy,
    };
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  loadState();

  return {
    startSession,
    getCurrentQuestion,
    hasNextQuestion,
    advanceQuestion,
    failSession,
    endSession,
    validateAnswer,
    getPatternProgress,
    getPatternScore,
    getTargetScore() {
      return SESSION_QUESTION_COUNT;
    },
    resetPatternProgress,
    resetAllProgress,
    getGlobalStats,
    get session() {
      const isInactive = !session.quizStarted && !session.quizFailed && session.questions.length === 0;
      if (isInactive) return null;

      return {
        pattern: session.currentPattern,
        questions: session.questions,
        currentIndex: session.currentQuestionIndex,
        currentQuestionIndex: session.currentQuestionIndex,
        quizStarted: session.quizStarted,
        quizFailed: session.quizFailed,
        score: session.score,
      };
    },
  };
})();
