import sessionState from '../services/state-service.js';
import { QuestionFactory } from '../services/question-factory.js';
import { QuestionService } from '../services/question-service.js';
import { RandomizerService } from '../services/randomizer-service.js';

/**
 * App Orchestrator
 * 
 * Requisito: Flujo de ejecución esperado:
 * 1. Usuario selecciona patrón.
 * 2. Question Service carga JSON.
 * 3. Randomizer Service selecciona 10 preguntas aleatorias.
 * 4. Factory crea instancias de preguntas.
 * 5. Strategy renderiza y valida cada pregunta.
 * 6. Feedback inmediato.
 * 7. Estado se guarda en Singleton.
 */
export class AppOrchestrator {
  constructor() {
    this.session = sessionState;
    this.container = document.getElementById('quiz-container');
    this.feedbackContainer = document.getElementById('feedback-container');
    this.progressContainer = document.getElementById('progress-container');
  }

  async init() {
     console.log("AppOrchestrator init...");
  }

  /**
   * Starts a new session with a design pattern's ID.
   * 
   * @param {string} patternId 
   */
  async startQuiz(patternId) {
    try {
      this.session.resetProgress();
      
      const patternData = await QuestionService.getQuestionSet(patternId);
      
      // Selección de 10 preguntas aleatorias del banco de 40
      const selectedQuestions = RandomizerService.getRandomQuestions(patternData.questions, 10);
      
      this.session.setPattern(patternData);
      this.session.setQuestions(selectedQuestions);
      
      this.renderCurrentQuestion();
      this.updateProgress();

      console.log(`Quiz starting for ${patternData.name}. 
                   Total questions in session (random subset): ${selectedQuestions.length} de ${patternData.questions.length}`);
    } catch (error) {
       console.error("Failed to start quiz:", error);
       alert("No se pudo iniciar el quiz. Por favor intenta de nuevo.");
    }
  }

  renderCurrentQuestion() {
    const question = this.session.getCurrentQuestion();
    if (!question) {
        this.renderEndSession();
        return;
    }

    const strategy = QuestionFactory.create(question.type);
    const renderedUI = strategy.render(question);

    this.container.innerHTML = '';
    this.container.appendChild(renderedUI);
    this.feedbackContainer.innerHTML = '';

    // Attach validation listeners depending on strategy
    this.attachValidationListeners(question, strategy);
  }

  attachValidationListeners(question, strategy) {
    const strategyName = strategy.constructor.name;
    
    // Simple direct handling per strategy for immediate feedback flow
    if (strategyName === 'MultipleChoiceStrategy' || strategyName === 'TrueFalseStrategy') {
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.onclick = () => {
                const answer = btn.dataset.index || btn.dataset.value;
                this.handleAnswerSubmission(answer, question, strategy);
            };
        });
    } else if (strategyName === 'ShortAnswerStrategy') {
        const validateBtn = this.container.querySelector('.validate-short-btn');
        const input = this.container.querySelector('.short-input');
        
        validateBtn.onclick = () => {
            if (input.value.trim() !== "") {
                this.handleAnswerSubmission(input.value, question, strategy);
            }
        };
    }
  }

  handleAnswerSubmission(answer, question, strategy) {
    const isCorrect = strategy.validate(answer, question.correct || question.answer);
    
    if (isCorrect) {
       this.session.incrementScore();
    }

    const feedback = strategy.getFeedback(isCorrect, question.explanation);
    this.showFeedback(feedback, isCorrect);
  }

  showFeedback(message, isCorrect) {
    this.feedbackContainer.innerHTML = `<p class="${isCorrect ? 'correct' : 'incorrect'}">${message}</p>`;
    
    // Wait for user to go to the next question
    const nextBtn = document.createElement('button');
    nextBtn.textContent = "Continuar";
    nextBtn.className = "next-btn";
    
    nextBtn.onclick = () => {
       const hasMore = this.session.nextQuestion();
       if (hasMore) {
          this.renderCurrentQuestion();
          this.updateProgress();
       } else {
          this.renderEndSession();
       }
    };

    this.feedbackContainer.appendChild(nextBtn);
  }

  updateProgress() {
    const stats = this.session.getSessionStats();
    if (this.progressContainer) {
       this.progressContainer.innerHTML = `Pregunta ${stats.currentIndex + 1} de ${stats.total} | Score: ${stats.score}`;
    }
  }

  renderEndSession() {
    const stats = this.session.getSessionStats();
    this.container.innerHTML = `
        <div class="results">
            <h2>Resultados del Quiz: ${stats.pattern.name}</h2>
            <p>Puntuación Final: ${stats.score} de ${stats.total}</p>
            <p>Porcentaje: ${((stats.score/stats.total)*100).toFixed(2)}%</p>
            <button onclick="window.location.reload()">Regresar al Inicio</button>
        </div>
    `;
    this.feedbackContainer.innerHTML = '';
    this.progressContainer.innerHTML = '';
  }
}
