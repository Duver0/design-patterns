# Learning Designer: Builder Pattern Coverage

## Goal
Generate 40 high-quality questions for the Builder design pattern, ensuring pedagogical rigor and technical accuracy.

## Coverage Areas
1. **Definición e Intención**: Propósito de separar la construcción de la representación compleja.
2. **Participantes**:
   - `Builder`: Interfaz abstracta para crear partes de un objeto `Product`.
   - `ConcreteBuilder`: Implementación que construye y ensambla partes.
   - `Director`: Construye un objeto usando la interfaz `Builder`.
   - `Product`: El objeto complejo resultante.
3. **Ventajas**:
   - Separación de responsabilidades (SRP).
   - Control fino sobre el proceso de construcción.
   - Soporte para diferentes representaciones del producto.
   - Inmutabilidad (especialmente en Java/C# con Fluent Interface).
4. **Escenarios Reales**:
   - SQL Query Builders.
   - Document Generators (HTML/PDF/RTF).
   - Configuración de objetos complejos (ej. Coche, Menú de comida).
5. **Comparativa**:
   - Builder vs. Telescoping Constructor.
   - Builder vs. Abstract Factory (Builder construye paso a paso, Abstract Factory de una vez).

## Question Distribution
- 15 MCQ (Multiple Choice)
- 15 True/False
- 10 Short Answer (with hints)

## Difficulty Levels
- Basic: Definition, Intent, Participants.
- Intermediate: Advantages, Scenarios, Differences.
- Advanced: Immutability, Fluent Interface, Complex Director scenarios.
