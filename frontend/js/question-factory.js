/**
 * question-factory.js
 * Creates normalized question instances from raw JSON data.
 */

const QuestionFactory = (() => {
  class BaseQuestion {
    constructor(data) {
      Object.assign(this, data);
    }

    validate() {
      return false;
    }

    getCorrectAnswer() {
      return '';
    }
  }

  class MultipleChoiceQuestion extends BaseQuestion {
    validate(userAnswer) {
      const selected = Number(userAnswer);
      return selected === Number(this.correct);
    }

    getCorrectAnswer() {
      return Array.isArray(this.options) ? this.options[this.correct] : '';
    }
  }

  class TrueFalseQuestion extends BaseQuestion {
    validate(userAnswer) {
      const normalized = typeof userAnswer === 'boolean'
        ? userAnswer
        : String(userAnswer).toLowerCase() === 'true';
      return normalized === Boolean(this.correct);
    }

    getCorrectAnswer() {
      return this.correct ? 'Verdadero' : 'Falso';
    }
  }

  class ShortAnswerQuestion extends BaseQuestion {
    validate(userAnswer) {
      const value = String(userAnswer).trim().toLowerCase();
      const accepted = Array.isArray(this.correct)
        ? this.correct
        : [this.correct];
      return accepted
        .filter(answer => answer !== undefined && answer !== null)
        .map(answer => String(answer).trim().toLowerCase())
        .includes(value);
    }

    getCorrectAnswer() {
      return Array.isArray(this.correct) ? (this.correct[0] || '') : String(this.correct || '');
    }
  }

  const TYPE_ALIASES = {
    mcq: 'multiple_choice',
    multiple_choice: 'multiple_choice',
    true_false: 'true_false',
    short: 'short_answer',
    short_answer: 'short_answer',
  };

  const CONSTRUCTORS = {
    multiple_choice: MultipleChoiceQuestion,
    true_false: TrueFalseQuestion,
    short_answer: ShortAnswerQuestion,
  };

  function normalizeType(type) {
    const raw = String(type || '').toLowerCase();
    return TYPE_ALIASES[raw] || raw;
  }

  function createQuestion(questionData) {
    const normalizedType = normalizeType(questionData.type);
    const QuestionCtor = CONSTRUCTORS[normalizedType];

    if (!QuestionCtor) {
      throw new Error(`Unsupported question type '${questionData.type}'.`);
    }

    return new QuestionCtor({ ...questionData, type: normalizedType });
  }

  function createQuestions(patternData) {
    const rawQuestions = Array.isArray(patternData?.questions) ? patternData.questions : [];
    return rawQuestions.map(createQuestion);
  }

  return {
    createQuestion,
    createQuestions,
    normalizeType,
  };
})();

window.QuestionFactory = QuestionFactory;
