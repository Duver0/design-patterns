# Builder Pattern Questions Draft (40)

## MCQ (15)

1. ¿Cuál es el propósito principal del patrón Builder?
   - a) Garantizar que una clase tenga una única instancia.
   - b) Separar la construcción de un objeto complejo de su representación.
   - c) Definir una familia de algoritmos intercambiables en tiempo de ejecución.
   - d) Permitir que objetos de diferentes jerarquías interactúen sin conocerse.
   Respuesta: 1 (b). Separar construcción de representación.

2. ¿Cuál de los siguientes PARTICIPANTES es responsable de controlar el ORDEN de construcción?
   - a) ConcreteBuilder
   - b) Product
   - c) Director
   - d) AbstractBuilder
   Respuesta: 2 (c). El Director dirige el proceso de construcción.

3. ¿Qué problema resuelve el patrón Builder en comparación con el "Telescoping Constructor"?
   - a) La falta de herencia en lenguajes modernos.
   - b) El exceso de memoria al instanciar objetos pequeños.
   - c) La explosión de constructores con múltiples combinaciones de parámetros opcionales.
   - d) La imposibilidad de clonar objetos en tiempo de ejecución.
   Respuesta: 2 (c). Resuelve la explosión de constructores y mejora la legibilidad.

4. ¿Cuál es la principal diferencia entre Builder y Abstract Factory?
   - a) Builder crea objetos complejos paso a paso; Abstract Factory los crea de una sola vez.
   - b) Builder solo crea interfaces; Abstract Factory crea clases concretas.
   - c) Builder es un patrón estructural; Abstract Factory es creacional.
   - d) Builder no permite la inmutabilidad de los objetos resultantes.
   Respuesta: 0 (a). Proceso paso a paso vs. creación inmediata.

5. En el patrón Builder, ¿quién suele mantener la instancia final del producto durante su construcción?
   - a) El Director
   - b) El Cliente
   - c) El ConcreteBuilder
   - d) La clase Product estática
   Respuesta: 2 (c). El ConcreteBuilder mantiene la instancia del Product y la devuelve al final.

6. ¿Qué técnica permite encadenar llamadas a métodos en un Builder (ej. `builder.addWheels().addEngine().build()`)?
   - a) Inyección de Dependencias
   - b) Fluent Interface (Interfaz Fluida)
   - c) Polimorfismo Ad-hoc
   - d) Lazy Initialization
   Respuesta: 1 (b). La Interfaz Fluida permite el encadenamiento devolviendo `this`.

7. ¿Cuándo es RECOMENDABLE usar el patrón Builder?
   - a) Cuando el proceso de creación de un objeto requiere muchos parámetros opcionales.
   - b) Cuando el objeto se puede crear con un solo `new` sin configuraciones adicionales.
   - c) Cuando solo necesitamos una única instancia global del objeto.
   - d) Cuando queremos desacoplar un objeto de sus observadores.
   Respuesta: 0 (a). Ideal para objetos con múltiples configuraciones u opcionales.

8. ¿Qué ventaja ofrece el Builder respecto a la Inmutabilidad?
   - a) No ofrece ninguna ventaja para objetos inmutables.
   - b) Permite configurar todos los campos antes de "congelar" el estado en el método `build()`.
   - c) Obliga a que todos los campos sean públicos (public).
   - d) Los objetos Builder son intrínsecamente inmutables por definición.
   Respuesta: 1 (b). Permite construir el objeto paso a paso y devolver un Product final cuyos campos son inmutables (final).

9. Si necesito generar un documento en diferentes formatos (PDF, HTML, RTF) con la misma lógica de estructura, ¿quién representaría la lógica de estructura?
   - a) El ConcreteBuilder
   - b) El Director
   - c) El Product
   - d) El Formatter
   Respuesta: 1 (b). El Director conoce la estructura (ej: título, cuerpo, pie) y usa el Builder para generar el formato concreto.

10. ¿Por qué el patrón Builder facilita el cumplimiento del Principio de Responsabilidad Única (SRP)?
    - a) Porque el objeto Product ahora se encarga de autoconstruirse.
    - b) Porque separa la lógica de ensamblaje (Director) de la lógica de creación de componentes (Builder).
    - c) Porque el Cliente ya no necesita conocer la interfaz del Producto.
    - d) Porque elimina la necesidad de usar interfaces.
    Respuesta: 1 (b). Separa el "cómo" construir del "qué" pasos seguir.

11. ¿Cuál es la función del método `getResult()` (o `build()`) en el patrón Builder?
    - a) Iniciar el proceso de construcción en el Director.
    - b) Retornar el producto final construido al cliente o director.
    - c) Limpiar todos los campos del Builder para una nueva construcción.
    - d) Validar que el Director haya seguido el orden correcto.
    Respuesta: 1 (b). Retornar el objeto complejo finalizado.

12. En una implementación típica de Builder en Java, la clase Builder suele ser:
    - a) Una interfaz externa obligatoria.
    - b) Una clase interna estática (static inner class) del Producto.
    - c) Un Singleton global.
    - d) Una subclase de la interfaz Director.
    Respuesta: 1 (b). Es un patrón común en Java usar una clase interna estática.

13. ¿Qué sucede si el proceso de construcción de dos productos requiere pasos totalmente diferentes?
    - a) Se debe usar el mismo Director.
    - b) Se deben definir diferentes interfaces Builder.
    - c) El patrón Builder no es aplicable en este escenario.
    - d) Se debe forzar a que ambos productos hereden de la misma clase base.
    Respuesta: 1 (b). Si las interfaces de construcción difieren radicalmente, se necesitan Builder distintos.

14. Un SQL Query Builder es un ejemplo de este patrón porque:
    - a) Ejecuta la consulta inmediatamente.
    - b) Permite añadir cláusulas (SELECT, WHERE, JOIN) paso a paso antes de generar el string final.
    - c) Garantiza que solo haya una conexión a la base de datos.
    - d) Traduce automáticamente excepciones de SQL a excepciones de dominio.
    Respuesta: 1 (b). Construcción incremental de una estructura compleja (el query).

15. ¿Cuál es una DESVENTAJA potencial del patrón Builder?
    - a) El código se vuelve más simple y corto.
    - b) Requiere crear una clase Builder adicional por cada producto complejo, aumentando el número de líneas.
    - c) Impide el uso de herencia en los productos.
    - d) El cliente tiene demasiado control sobre los detalles internos del producto.
    Respuesta: 1 (b). "Overhead" de código al tener que mantener la clase Builder.


## True/False (15)

16. El Director es un participante obligatorio en todas las implementaciones modernas del patrón Builder.
    Respuesta: False (Falso). En muchas implementaciones fluidas modernas, el Cliente actúa como Director.

17. El patrón Builder permite que el producto final no tenga métodos 'setter', favoreciendo la inmutabilidad.
    Respuesta: True (Verdadero). El Builder recolecta los datos y el constructor del Producto los recibe todos juntos.

18. Builder es un patrón de diseño Estructural.
    Respuesta: False (Falso). Es un patrón Creacional.

19. Un ConcreteBuilder diferente puede producir un tipo de producto totalmente distinto al de otro ConcreteBuilder.
    Respuesta: True (Verdadero). Esta es la esencia de separar la construcción de la representación.

20. El método build() suele estar definido en la interfaz del Director.
    Respuesta: False (Falso). Suele estar en la interfaz del Builder o en el ConcreteBuilder.

21. El patrón Builder es útil cuando un objeto debe ser creado en un solo paso atómico sin variaciones.
    Respuesta: False (Falso). Es útil precisamente cuando la creación es compleja o tiene variaciones.

22. El uso de "Interfaces Fluidas" (return this) es una característica original del libro de GoF para el Builder.
    Respuesta: False (Falso). Fue popularizada más tarde, aunque encaja muy bien con el patrón.

23. ElBuilder abstrae los detalles de cómo se ensamblan las partes del producto.
    Respuesta: True (Verdadero). El Cliente o Director solo ven la interfaz de alto nivel del Builder.

24. En el patrón Builder, el producto resultante no suele compartir una interfaz común con otros productos de otros builders.
    Respuesta: True (Verdadero). A diferencia de Abstract Factory, los productos pueden ser muy heterogéneos.

25. El patrón Builder ayuda a evitar constructores con demasiados parámetros (constructor antipattern).
    Respuesta: True (Verdadero). Mejora la legibilidad y previene errores al asignar valores.

26. El Director conoce los detalles internos del producto que se está construyendo.
    Respuesta: False (Falso). Solo conoce la interfaz del Builder.

27. Es posible reutilizar el mismo Builder para crear varios productos en secuencia, si se limpia su estado interno.
    Respuesta: True (Verdadero). Algunos diseños incluyen un método `reset()`.

28. El patrón Builder se utiliza a menudo para implementar el patrón de diseño "Step-wise construction".
    Respuesta: True (Verdadero). Permite construir partes del objeto en diferentes momentos.

29. Si los productos son simples y su creación no tiene variaciones, aplicar Builder podría ser un caso de "Overengineering".
    Respuesta: True (Verdadero). No todos los objetos necesitan un Builder.

30. El Product de un Builder siempre debe tener una clase base abstracta.
    Respuesta: False (Falso). El Product puede ser cualquier clase concreta, no requiere jerarquía.


## Short Answer (10)

31. ¿Qué nombre recibe la clase que coordina los pasos de construcción en el patrón clásico de GoF?
    Respuesta: ["director"]. Pista: Dirige el proceso.

32. ¿Qué técnica de diseño se utiliza para permitir llamadas como .setA().setB().build()?
    Respuesta: ["interfaz fluida", "fluent interface", "fluent"]. Pista: Fluye como el lenguaje natural.

33. ¿A qué categoría de patrones pertenece el Builder?
    Respuesta: ["creacional", "creacionales"]. Pista: Se encarga de la creación de objetos.

34. ¿Qué objeto complejo es el resultado final del proceso de construcción?
    Respuesta: ["producto", "product"]. Pista: Es lo que el Builder fabrica.

35. ¿Cuál es el problema de tener demasiados constructores con distintos parámetros?
    Respuesta: ["constructor telescopico", "telescoping constructor"]. Pista: Nombres que se expanden como un telescopio.

36. En Java, ¿qué palabra clave se usa a menudo para que un objeto Product no pueda ser modificado tras su construcción vía Builder?
    Respuesta: ["final"]. Pista: Indica que algo es definitivo.

37. ¿Qué participante del patrón implementa los pasos específicos de construcción?
    Respuesta: ["concretebuilder", "builder concreto"]. Pista: Es la versión real y específica del constructor.

38. Completa la frase: El Builder construye el objeto paso a _____.
    Respuesta: ["paso"]. Pista: No es de golpe.

39. ¿Qué patrón creacional se diferencia del Builder en que crea familias de objetos relacionados de una sola vez?
    Respuesta: ["abstract factory"]. Pista: Fábrica de fábricas.

40. Si el Builder devuelve un 'Automóvil' y otro Builder devuelve un 'Manual de Usuario', ¿qué participante define la secuencia 'AñadirMotor()', 'AñadirAsientos()'?
    Respuesta: ["director"]. Pista: El orquestador de la secuencia.
