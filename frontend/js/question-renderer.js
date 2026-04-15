/**
 * question-renderer.js
 * Rendering strategies selected by question type.
 */

const QuestionRenderer = (() => {
  const TYPE_ALIASES = {
    mcq: 'multiple_choice',
    multiple_choice: 'multiple_choice',
    true_false: 'true_false',
    short: 'short_answer',
    short_answer: 'short_answer',
  };

  function normalizeType(type) {
    const raw = String(type || '').toLowerCase();
    return TYPE_ALIASES[raw] || raw;
  }

  function renderMultipleChoice(question, container) {
    const group = document.createElement('div');
    group.className = 'options-group';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', 'Opciones de respuesta');

    (question.options || []).forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.idx = String(index);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.textContent = option;
      btn.addEventListener('click', () => {
        group.querySelectorAll('.option-btn').forEach(node => {
          node.classList.remove('selected');
          node.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
      });
      group.appendChild(btn);
    });

    container.appendChild(group);

    return () => {
      const selected = group.querySelector('.option-btn.selected');
      return selected ? Number(selected.dataset.idx) : null;
    };
  }

  function renderTrueFalse(_question, container) {
    const group = document.createElement('div');
    group.className = 'tf-group';

    ['true', 'false'].forEach(value => {
      const btn = document.createElement('button');
      btn.className = 'tf-btn';
      btn.dataset.val = value;
      btn.textContent = value === 'true' ? '✓ Verdadero' : '✗ Falso';
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        group.querySelectorAll('.tf-btn').forEach(node => {
          node.classList.remove('selected');
          node.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      });
      group.appendChild(btn);
    });

    container.appendChild(group);

    return () => {
      const selected = group.querySelector('.tf-btn.selected');
      return selected ? selected.dataset.val === 'true' : null;
    };
  }

  function renderShortAnswer(question, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'short-answer-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'short-input';
    input.className = 'short-input';
    input.placeholder = 'Escribe tu respuesta...';
    input.setAttribute('aria-label', 'Respuesta corta');
    input.setAttribute('autocomplete', 'off');

    const hintBtn = document.createElement('button');
    hintBtn.className = 'hint-btn';
    hintBtn.textContent = '💡 Ver pista';
    hintBtn.setAttribute('aria-expanded', 'false');

    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box hidden';
    hintBox.textContent = question.hint || '';

    hintBtn.addEventListener('click', () => {
      const visible = !hintBox.classList.contains('hidden');
      hintBox.classList.toggle('hidden', visible);
      hintBtn.setAttribute('aria-expanded', String(!visible));
      hintBtn.textContent = visible ? '💡 Ver pista' : '🙈 Ocultar pista';
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
          App.handleAnswer(value);
        }
      }
    });

    wrapper.appendChild(input);
    wrapper.appendChild(hintBtn);
    wrapper.appendChild(hintBox);
    container.appendChild(wrapper);

    input.focus();

    return () => {
      const value = input.value.trim();
      return value || null;
    };
  }

  const STRATEGIES = {
    multiple_choice: {
      label: 'Opción múltiple',
      render: renderMultipleChoice,
    },
    true_false: {
      label: 'Verdadero / Falso',
      render: renderTrueFalse,
    },
    short_answer: {
      label: 'Respuesta corta',
      render: renderShortAnswer,
    },
  };

  function getStrategy(type) {
    const strategy = STRATEGIES[normalizeType(type)];
    if (!strategy) {
      throw new Error(`No renderer strategy found for '${type}'.`);
    }
    return strategy;
  }

  function render(question, container) {
    const strategy = getStrategy(question.type);
    return strategy.render(question, container);
  }

  function getLabel(type) {
    try {
      return getStrategy(type).label;
    } catch {
      return String(type || 'Desconocido');
    }
  }

  return {
    render,
    getLabel,
    normalizeType,
  };
})();

window.QuestionRenderer = QuestionRenderer;
