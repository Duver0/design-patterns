---
name: generate-mcq
description: Genera preguntas de opción múltiple (Multiple Choice Questions) de alta calidad sobre patrones de diseño.
---

# Generate MCQ

Esta skill se encarga de crear preguntas de tipo `mcq` para el quiz de patrones de diseño.

## When to Use

Usa esta skill cuando necesites generar preguntas de selección múltiple con opciones y una única respuesta correcta.

## Instructions

1. **Definir Concepto**: Elige un concepto específico del patrón (ej: propósito, estructura, aplicabilidad).
2. **Generar Pregunta**: Crea un enunciado claro y conciso.
3. **Crear Opción Correcta**: Escribe la respuesta técnicamente exacta.
4. **Generar Distractores**: Crea 3 distractores plausibles que representen errores comunes de comprensión.
5. **Escribir Explicación**: Detalla por qué la respuesta es correcta y aclara los malentendidos de los distractores.

## Output Format

```json
{
  "type": "mcq",
  "question": "string",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "answer": 0,
  "explanation": "string"
}
```

