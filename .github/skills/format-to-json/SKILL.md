---
name: format-to-json
description: Convierte contenido validado a la estructura JSON estándar del proyecto.
---

# Format to JSON

Asegura que el bloque JSON generado cumpla estrictamente con la estructura interna de la aplicación.

## When to Use

Activa tras la validación de calidad para preparar el contenido para su persistencia en el archivo `data/patterns.json`.

## Instructions

1. **Definir IDs**: Crea un ID de patrón (ej: `singleton`) y IDs correlativos para preguntas (`singleton_q1`).
2. **Asignar Nombres**: Describe el nombre del patrón y su descripción corta.
3. **Mapear Campos**: Traslada `type`, `question`, `options`, `answer`, `hint` y `explanation` respetando los tipos de datos exactos.
4. **Validar Tipos**:
   - `mcq` -> `correct` es numérico.
   - `true_false` -> `correct` es booleano.
   - `short` -> `correct` es un array de strings.
5. **Categorizar**: Usa la categoría determinada inicialmente (Creacional, Estructural, Comportamiento).

## Output Template

```json
{
  "id": "singleton",
  "name": "Singleton",
  "category": "Creacional",
  "description": "Explicación...",
  "questions": [
    {
      "id": "singleton_q1",
      "type": "multiple_choice",
      "question": "...",
      "options": [],
      "correct": 0,
      "explanation": "..."
    }
  ]
}
```

