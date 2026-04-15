/**
 * question-factory.js
 * Creates normalized question instances from raw JSON data.
 */

const QuestionFactory = (() => {
  class BaseQuestion {
    constructor(data) {
      Object.assign(this, data);
    }

    getExpectedAnswer() {
      return this.answer ?? this.correct;
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
      return selected === Number(this.getExpectedAnswer());
    }

    getCorrectAnswer() {
      const answerIndex = Number(this.getExpectedAnswer());
      return Array.isArray(this.options) ? this.options[answerIndex] : '';
    }
  }

  class TrueFalseQuestion extends BaseQuestion {
    validate(userAnswer) {
      const normalized = typeof userAnswer === 'boolean'
        ? userAnswer
        : String(userAnswer).toLowerCase() === 'true';

      const expected = this.getExpectedAnswer();
      const expectedBoolean = typeof expected === 'boolean'
        ? expected
        : String(expected).trim().toLowerCase() === 'true';

      return normalized === expectedBoolean;
    }

    getCorrectAnswer() {
      const expected = this.getExpectedAnswer();
      const expectedBoolean = typeof expected === 'boolean'
        ? expected
        : String(expected).trim().toLowerCase() === 'true';
      return expectedBoolean ? 'Verdadero' : 'Falso';
    }
  }

  class ShortAnswerQuestion extends BaseQuestion {
    validate(userAnswer) {
      if (userAnswer === null || userAnswer === undefined) return false;
      const value = String(userAnswer).trim().toLowerCase();

      const expected = this.getExpectedAnswer();
      const acceptedAnswers = Array.isArray(expected)
        ? expected
        : [expected];

      return acceptedAnswers
        .filter(answer => answer !== undefined && answer !== null)
        .map(answer => String(answer).trim().toLowerCase())
        .includes(value);
    }

    getCorrectAnswer() {
      const expected = this.getExpectedAnswer();
      const answers = Array.isArray(expected) ? expected : [expected];
      return answers[0] || '';
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
