---
name: generate-true-false
description: Genera preguntas de Verdadero/Falso sobre patrones de diseño.
---

# Generate True/False

Esta skill genera afirmaciones evaluables para el quiz.

## When to Use

Uso principal para evaluar la comprensión de principios, ventajas o restricciones de un patrón de diseño.

## Instructions

1. **Seleccionar Afirmación**: Crea una declaración técnica sobre el patrón (ej: "Singleton garantiza una sola instancia").
2. **Evitar Ambigüedades**: Asegúrate de que no haya interpretaciones subjetivas; la respuesta debe ser indiscutiblemente True o False.
3. **Validar Valor Pedagógico**: Evita preguntas triviales que solo evalúan nombres; prefiere aquellas que evalúan consecuencias del uso del patrón.
4. **Redactar Explicación**: Proporciona contexto adicional sobre por qué es verdadero o falso, citando el principio de diseño si aplica.

## Output Format

```json
{
  "type": "true_false",
  "question": "string",
  "answer": true,
  "explanation": "string"
}
```

