/**
 * Singleton Pattern for managing global session state
 * 
 * Requisito: Estado global de la sesión (progreso, preguntas actuales)
 * Máximo 1–2 instancias singleton en todo el proyecto
 */
class SessionState {
  constructor() {
    if (!SessionState.instance) {
      this.resetProgress();
      SessionState.instance = this;
    }
    return SessionState.instance;
  }

  resetProgress() {
    this.currentPattern = null;
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.isSessionActive = false;
  }

  setPattern(pattern) {
    this.currentPattern = pattern;
  }

  setQuestions(questions) {
    this.currentQuestions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.isSessionActive = true;
  }

  incrementScore() {
    this.score++;
  }

  nextQuestion() {
    if (this.currentIndex < this.currentQuestions.length - 1) {
      this.currentIndex++;
      return true;
    }
    this.isSessionActive = false;
    return false;
  }

  getCurrentQuestion() {
    return this.currentQuestions[this.currentIndex] || null;
  }

  getSessionStats() {
    return {
      pattern: this.currentPattern,
      score: this.score,
      total: this.currentQuestions.length,
      currentIndex: this.currentIndex,
      progress: ((this.currentIndex + 1) / this.currentQuestions.length) * 100
    };
  }
}

const sessionState = new SessionState();

export default sessionState;
