# Factory Method Questions Draft

## Phase 1: Learning Designer - Scope Definition
- **Creator (Base Class/Interface):** Declara el método de fábrica y puede contener lógica que usa el producto.
- **ConcreteCreator:** Sobrescribe el método de fábrica para devolver una instancia de un producto concreto.
- **Product (Interface):** Interfaz común para todos los objetos que el método de fábrica crea.
- **ConcreteProduct:** Implementaciones específicas de la interfaz Product.
- **Decoupling:** El Creator no necesita saber la clase exacta del producto que está creando.
- **Polymorphism:** Uso de subclases para alterar el tipo de objeto retornado.
- **Open/Closed Principle:** Capacidad de introducir nuevos tipos de productos sin cambiar el código del Creator.
- **Single Responsibility Principle:** Mover el código de creación a un lugar específico.

---

## Phase 2: Content Generation (40 Questions)

### Multiple Choice Questions (15)

1. **id: factory_q1**
   - **Question:** ¿Cuál es la intención principal del patrón Factory Method?
   - **Options:**
     - "Definir una familia de algoritmos intercambiables."
     - "Proporcionar una interfaz para crear objetos en una superclase, permitiendo a las subclases alterar el tipo de objetos que se crearán."
     - "Garantizar que una clase tenga una única instancia en toda la aplicación."
     - "Evitar el uso de herencia en la creación de objetos complejos."
   - **Answer:** 1
   - **Explanation:** Factory Method delega la responsabilidad de instanciación a las subclases, permitiendo que el código base trabaje con abstracciones.

(Etc. para las 40 preguntas... Realizaré el mapeo directo a JSON en el siguiente paso para mayor eficiencia)
