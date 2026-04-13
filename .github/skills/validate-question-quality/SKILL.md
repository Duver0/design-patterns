---
name: validate-question-quality
description: Valida la calidad pedagógica y técnica de las preguntas sobre patrones de diseño mediante un checklist estricto.
---

# Validate Question Quality

Garantiza que el contenido educativo cumpla los estándares técnicos y didácticos.

## When to Use

Invocada por revisores después de la fase de generación de contenido.

## Instructions

1. **Chequeo de Claridad**: ¿La pregunta es comprensible sin necesidad de leerla dos veces?
2. **Chequeo Técnico**: ¿La respuesta y la explicación son técnicamente exactas?
3. **No Ambigüedad**: ¿Hay una única respuesta posible?
4. **Valor Didáctico**: ¿Evalúa un concepto central del patrón en lugar de terminología trivial?
5. **Rechazo Inmediato**: Califica con desaprobación las preguntas superficiales o aquellas que incluyan "Ninguna de las anteriores".

## Result

- Emitir veredicto: `APROBADO` o `RECHAZADO`.
- Incluir feedback detallado justificando el rechazo si procede.
