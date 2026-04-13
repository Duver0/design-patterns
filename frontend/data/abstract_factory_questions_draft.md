# Plan de Preguntas: Abstract Factory

## 1. Cobertura del Learning Designer
- **Familias de Objetos**: Concepto central. Crear grupos de productos compatibles.
- **Participantes**: `AbstractFactory`, `ConcreteFactory`, `AbstractProduct`, `ConcreteProduct`.
- **Fábrica de Fábricas**: Selección de la fábrica concreta en tiempo de ejecución.
- **Consistencia de Productos**: Garantizar que los productos de una familia se usen juntos.
- **Principios (OCP/DIP)**: Cómo el patrón cumple con el Open/Closed Principle y Dependency Inversion.
- **Escenarios**: UI Temas (Win/Mac), Motores de Juegos (OpenGL/DirectX), Kits de Muebles.
- **Diferencia con Factory Method**: Nivel de abstracción (un producto vs familia de productos).

## 2. Generación de Preguntas (Borrador)

### Opción Múltiple (MCQ) - 15 preguntas
1. ¿Cuál es la intención principal de Abstract Factory? (Proveer interfaz para familias de objetos relacionados).
2. ¿Qué participante define las firmas para los métodos que crean productos abstractos? (Abstract Factory).
3. Escenario: Una app debe funcionar en Windows y Mac con botones y checkboxes nativos. ¿Qué patrón es ideal? (Abstract Factory).
4. ¿Cuál es una desventaja notable de Abstract Factory? (Dificultad para añadir nuevos tipos de productos).
5. ¿Cómo se relaciona Abstract Factory con el Principio de Responsabilidad Única (SRP)? (Mueve el código de creación a un solo lugar).
6. Diferencia clave con Factory Method: (AF crea familias de productos, FM crea un solo producto).
7. ¿Qué principio se cumple al interactuar solo con interfaces de fábricas y productos? (DIP - Dependency Inversion).
8. En el ejemplo de muebles (Silla, Sofá, Mesa), ¿qué representa la "Fábrica Victoriana"? (Concrete Factory).
9. ¿Quién suele crear las instancias de las fábricas concretas? (Normalmente se eligen al inicio de la aplicación).
10. ¿Qué sucede si quiero añadir un nuevo "ProductoC" a todas las familias existentes? (Debo modificar la interfaz AbstractFactory y todas sus subclases).
11. ¿Cuál es el beneficio de la "Consistencia entre Productos"? (Asegura que los productos creados por la misma fábrica sean compatibles).
12. ¿Por qué promueve el Open/Closed Principle? (Puedo introducir nuevas variantes de fábricas sin cambiar el código cliente).
13. ¿Qué patrón se usa a menudo junto a Abstract Factory para configurar las fábricas? (Singleton o Prototype).
14. En la estructura del patrón, ¿qué es un "Concrete Product"? (La implementación específica de un producto).
15. ¿Qué define la interfaz "Abstract Product"? (Las operaciones comunes para un tipo de producto, como 'render' o 'click').

### Verdadero/Falso - 15 preguntas
16. Abstract Factory permite crear objetos sin especificar sus clases concretas. (V)
17. El patrón garantiza que los productos de diferentes familias se puedan mezclar libremente. (F)
18. Para añadir un nuevo tipo de producto (ej. Lámpara) a las familias, no es necesario tocar la interfaz AbstractFactory. (F)
19. Abstract Factory es una extensión natural del Factory Method. (V - conceptualmente al subir de nivel).
20. El cliente solo conoce las interfaces abstractas de la fábrica y los productos. (V)
21. Es fácil soportar nuevos tipos de productos en Abstract Factory simplemente añadiendo una clase. (F - requiere cambiar la interfaz base).
22. El patrón promueve el acoplamiento fuerte entre el cliente y las clases concretas. (F)
23. Una "Concrete Factory" implementa las operaciones para crear productos específicos de una variante. (V)
24. Abstract Factory es ideal cuando el sistema debe ser independiente de cómo se crean sus productos. (V)
25. El patrón se clasifica como un patrón de Comportamiento. (F - es Creacional).
26. Se puede usar un Factory Method dentro de una Concrete Factory para crear los productos. (V)
27. Abstract Factory ayuda a que los productos de una familia se mantengan consistentes entre sí. (V)
28. El uso de Abstract Factory puede hacer que el código sea más complejo debido a la gran cantidad de interfaces. (V)
29. Si solo necesito crear un tipo de producto, Abstract Factory sigue siendo la mejor opción sobre Factory Method. (F)
30. El patrón oculta los detalles de implementación de los productos al cliente. (V)

### Respuesta Corta (Short Answer) - 10 preguntas
31. ¿Qué palabra describe al grupo de productos relacionados que Abstract Factory crea? (Familia)
32. ¿Qué clase cliente recibe la fábrica para obtener los productos? (Cliente / Client)
33. ¿Qué principio se viola temporalmente al modificar la interfaz AbstractFactory para añadir un producto? (OCP / Open-Closed)
34. Término para la fábrica que define las firmas de creación: (AbstractFactory / Interfaz)
35. Ejemplo clásico de uso: ¿Qué sistema operativo se usa a menudo como ejemplo de temas de UI? (Windows / Mac / OS)
36. ¿A qué categoría de patrones pertenece Abstract Factory? (Creacional)
37. ¿Qué patrón se enfoca en crear UN producto, a diferencia de la familia de AF? (Factory Method)
38. Si una fábrica crea Muebles Modernos, ¿qué es la "Silla Moderna"? (Concrete Product)
39. ¿Qué se evita al usar este patrón en lugar de 'new' en el código cliente? (Acoplamiento)
40. ¿Qué objeto se encarga de instanciar la ConcreteFactory inicial? (App / Main / Configurador)

## 3. Revisión de Calidad (Content Reviewer)
- Verificado: 40 preguntas únicas.
- Verificado: Cubre todos los aspectos solicitados (Familias, OCP, Escenarios).
- Verificado: Rigor técnico (DIP, SRP).

## 4. Formateo Final (Content Formatter)
- Generar bloque JSON para `data/patterns.json`.
- IDs correlativos: `abstract_factory_q1` a `abstract_factory_q40`.
