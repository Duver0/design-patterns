---
name: generate-short-answer
description: Genera preguntas de respuesta corta (Short Answer) sobre patrones de diseño.
---

# Generate Short Answer

Skill para preguntas que requieren que el usuario escriba la respuesta exacta (1-2 palabras).

## When to Use

Uso para evaluar el recuerdo de terminología específica (ej: "Product", "Subject", "Leaf").

## Instructions

1. **Elegir Término Clave**: Identifica una palabra técnica central en el patrón.
2. **Generar Pregunta Restringida**: Formula el enunciado de modo que la respuesta correcta sea corta e inequívoca.
3. **Ofrecer Pista (Hint)**: Incluye un pequeño recordatorio sin dar la palabra final.
4. **Incluir Alternativas**: Al generar la respuesta, considera sinónimos o traducciones comunes como válidas.

## Output Format

```json
{
  "type": "short",
  "question": "string",
  "answer": ["res1", "res2"],
  "hint": "string",
  "explanation": "string"
}
```

