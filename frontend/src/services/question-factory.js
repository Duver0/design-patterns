import { MultipleChoiceStrategy, TrueFalseStrategy, ShortAnswerStrategy } from '../domain/question.js';

/**
 * Factory Method Pattern for creating question strategies
 * 
 * Requisito: La creación de preguntas NO debe hacerse manualmente en el código.
 * Debe centralizarse en una factory.
 */
export class QuestionFactory {
  static create(type) {
    switch (type) {
      case 'mcq':
      case 'multiple_choice':
        return new MultipleChoiceStrategy();
      case 'true_false':
        return new TrueFalseStrategy();
      case 'short':
      case 'short_answer':
        return new ShortAnswerStrategy();
      default:
        throw new Error(`Strategy for question type '${type}' not found.`);
    }
  }
}
