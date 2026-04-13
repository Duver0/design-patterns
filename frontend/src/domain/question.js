/**
 * Strategy Pattern Interface for questions
 */
export class QuestionStrategy {
  render(question) {
    throw new Error("Method 'render()' must be implemented.");
  }

  validate(answer, correctAnswer) {
    throw new Error("Method 'validate()' must be implemented.");
  }

  getFeedback(isCorrect, explanation) {
    return isCorrect 
      ? `Correcto! ${explanation}`
      : `Incorrecto. ${explanation}`;
  }
}

/**
 * Multiple Choice Strategy
 */
export class MultipleChoiceStrategy extends QuestionStrategy {
  render(question) {
    const container = document.createElement('div');
    container.className = 'mcq-question';
    
    const questionText = document.createElement('p');
    questionText.textContent = question.question;
    container.appendChild(questionText);

    const optionsList = document.createElement('ul');
    question.options.forEach((option, index) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.className = 'option-btn';
      btn.dataset.index = index;
      li.appendChild(btn);
      optionsList.appendChild(li);
    });
    container.appendChild(optionsList);
    
    return container;
  }

  validate(selectedIndex, correctIndex) {
    return parseInt(selectedIndex) === parseInt(correctIndex);
  }
}

/**
 * True/False Strategy
 */
export class TrueFalseStrategy extends QuestionStrategy {
  render(question) {
    const container = document.createElement('div');
    container.className = 'tf-question';
    
    const questionText = document.createElement('p');
    questionText.textContent = question.question;
    container.appendChild(questionText);

    ['True', 'False'].forEach(val => {
      const btn = document.createElement('button');
      btn.textContent = val;
      btn.className = 'tf-btn';
      btn.dataset.value = val.toLowerCase();
      container.appendChild(btn);
    });
    
    return container;
  }

  validate(selectedValue, correctAnswer) {
    return selectedValue === String(correctAnswer);
  }
}

/**
 * Short Answer Strategy
 */
export class ShortAnswerStrategy extends QuestionStrategy {
  render(question) {
    const container = document.createElement('div');
    container.className = 'short-question';
    
    const questionText = document.createElement('p');
    questionText.textContent = question.question;
    container.appendChild(questionText);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = question.hint || 'Escribe tu respuesta...';
    input.className = 'short-input';
    container.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Validar';
    btn.className = 'validate-short-btn';
    container.appendChild(btn);
    
    return container;
  }

  validate(userInput, correctAnswers) {
    const normalized = userInput.trim().toLowerCase();
    return Array.isArray(correctAnswers) 
      ? correctAnswers.map(a => a.toLowerCase()).includes(normalized)
      : correctAnswers.toLowerCase() === normalized;
  }
}
