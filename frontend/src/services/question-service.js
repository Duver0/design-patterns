import { RandomizerService } from './randomizer-service.js';

/**
 * Question Service
 * 
 * Requisito: Question Service carga JSON.
 * Los datos deben provenir de archivos JSON locales.
 */
export class QuestionService {
  /**
   * Fetches JSON of a specific design pattern from a given path.
   * 
   * @param {string} patternPath 
   * @returns {Promise<Object>} 
   */
  static async loadPattern(patternPath) {
    try {
      const response = await fetch(patternPath);
      if (!response.ok) {
        throw new Error(`Failed to load pattern JSON: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading pattern:`, error);
      throw error;
    }
  }

  /**
   * Loads a full pattern and gets a randomized sub-selection of 10 questions.
   * 
   * @param {string} patternId 
   * @returns {Promise<Array>} 
   */
  static async getQuestionSet(patternId) {
    // patternId could be something like 'singleton' or 'factory_method'
    const patternPath = `./src/data/patterns/${patternId}.json`;
    const patternData = await this.loadPattern(patternPath);

    // Shuffle and pick 10
    const randomizedQuestions = RandomizerService.getRandomQuestions(patternData.questions, 10);
    
    return {
      id: patternData.id,
      name: patternData.name,
      category: patternData.category,
      questions: randomizedQuestions
    };
  }

  /**
   * Loads the general list of all patterns (optional metadata)
   */
  static async listPatterns() {
    try {
      const response = await fetch('./src/data/patterns.json');
      const data = await response.json();
      return data;
    } catch (error) {
        console.error('Error listing patterns:', error);
        return [];
    }
  }
}
