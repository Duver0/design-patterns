import { MultipleChoiceStrategy, TrueFalseStrategy, ShortAnswerStrategy } from '../domain/question.js';

/**
 * Factory Method Pattern for creating question strategies
 * 
 * Requisito: La creación de preguntas NO debe hacerse manualmente en el código.
 * Debe centralizarse en una factory.
 */
export class QuestionFactory {
  static strategyRegistry = {
    mcq: MultipleChoiceStrategy,
    multiple_choice: MultipleChoiceStrategy,
    true_false: TrueFalseStrategy,
    short: ShortAnswerStrategy,
    short_answer: ShortAnswerStrategy,
  };

  static create(type) {
    const normalizedType = String(type || '').toLowerCase();
    const StrategyCtor = this.strategyRegistry[normalizedType];

    if (!StrategyCtor) {
      throw new Error(`Strategy for question type '${type}' not found.`);
    }

    return new StrategyCtor();
  }
}
