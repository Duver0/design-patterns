/**
 * Randomizer Service
 * 
 * Se encarga de mezclar las preguntas disponibles y seleccionar un subconjunto.
 */
export class RandomizerService {
  /**
   * Obtiene un número aleatorio de preguntas de un conjunto.
   * 
   * @param {Array} questions 
   * @param {number} limit 
   * @returns {Array}
   */
  static getRandomQuestions(questions, limit = 10) {
    if (!questions || questions.length === 0) return [];
    
    // Algoritmo de Fisher-Yates para barajar
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, limit);
  }
}
