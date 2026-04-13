/**
 * question-service.js
 * Data loading and random selection for quiz sessions.
 */

const QuestionService = (() => {
  async function loadPatternData(patternId) {
    const res = await fetch(`./src/data/patterns/${patternId}.json`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} loading pattern ${patternId}`);
    }

    const data = await res.json();
    return {
      ...data,
      questions: Array.isArray(data.questions) ? data.questions : [],
    };
  }

  async function loadQuestions(patternId) {
    const data = await loadPatternData(patternId);
    return data.questions;
  }

  function pickRandomQuestions(questions, limit = 10) {
    if (!Array.isArray(questions) || questions.length === 0) return [];

    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, Math.min(limit, shuffled.length));
  }

  async function loadSessionQuestions(patternId, limit = 10) {
    const questions = await loadQuestions(patternId);
    return pickRandomQuestions(questions, limit);
  }

  return {
    loadPatternData,
    loadQuestions,
    loadSessionQuestions,
    pickRandomQuestions,
  };
})();

window.QuestionService = QuestionService;
