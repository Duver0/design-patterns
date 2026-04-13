# Cobertura de Aprendizaje: Patrón Prototype

## Conceptos Clave
- Cloneable / Prototype (Interfaz/Clase Abstracta)
- ConcretePrototype (Implementación del método clone)
- Client (Inicia la clonación)
- Deep Copy vs Shallow Copy (Copia profunda vs superficial)
- Serialización como mecanismo de clonación
- Prototype Registry (Manager de prototipos)
- Ventajas: Costo de instanciación, evitar sub-clases de factoría.
- Escenarios: NPCs en juegos, configuraciones, objetos DOM.
- Diferencia con Copy Constructor.

---

## 15 MCQ (Opción Múltiple)

1. ¿Cuál es la intención principal del patrón Prototype?
   - A) Definir una interfaz para crear un objeto, pero dejar que las subclases decidan qué clase instanciar.
   - B) Especificar los tipos de objetos a crear mediante una instancia prototípica y crear nuevos objetos copiando este prototipo.
   - C) Garantizar que una clase tenga solo una instancia y proporcionar un punto de acceso global.
   - D) Separar la construcción de un objeto complejo de su representación.
   - Respuesta: B. Intención definida por el GoF.

2. ¿Qué participante es responsable de declarar la interfaz para clonarse a sí mismo?
   - A) Client
   - B) ConcretePrototype
   - C) Prototype
   - D) PrototypeManager
   - Respuesta: C. El Prototype define la interfaz (ej. método clone()).

3. En el contexto de Prototype, ¿qué ocurre en una "Shallow Copy" (Copia Superficial)?
   - A) Se crea un duplicado exacto e independiente de todos los objetos referenciados.
   - B) Solo se copian los valores de los tipos primitivos; las referencias a objetos siguen apuntando a las mismas instancias que el original.
   - C) El objeto se clona bit a bit, incluyendo la memoria recursiva.
   - D) Se lanza una excepción si el objeto tiene campos privados.
   - Respuesta: B. Las referencias se comparten.

4. ¿Cuándo es especialmente útil el patrón Prototype en lugar de Factory Method?
   - A) Cuando las clases a instanciar se especifican en tiempo de ejecución.
   - B) Cuando solo necesitamos una única instancia en toda la aplicación.
   - C) Cuando queremos ocultar la complejidad de la creación detrás de un método estático.
   - D) Cuando la jerarquía de productos es paralela a la jerarquía de creadores.
   - Respuesta: A. Prototype permite cargar prototipos dinámicamente.

5. ¿Qué ventaja ofrece el uso de un "Prototype Registry" o Manager?
   - A) Permite que el cliente cree objetos sin conocer sus clases concretas, buscando por una clave (ej. string).
   - B) Asegura que no se clonen más de 10 objetos a la vez.
   - C) fuerza a que todos los objetos sean inmutables.
   - D) Elimina la necesidad de usar interfaces.
   - Respuesta: A. Actúa como un catálogo de objetos "semilla".

6. ¿Cuál es una desventaja común al implementar Prototype?
   - A) Aumenta drásticamente el número de clases en el sistema.
   - B) Implementar la clonación puede ser difícil si los objetos tienen referencias circulares o no soportan copia profunda.
   - C) El cliente se vuelve dependiente de las clases concretas.
   - D) No permite la inicialización de atributos después de la copia.
   - Respuesta: B. Las referencias circulares son un reto clásico en Deep Copy.

7. Si un objeto tiene una lista de otros objetos y realizamos una "Deep Copy", ¿qué sucede con esa lista?
   - A) La lista se vacía en el nuevo objeto.
   - B) El nuevo objeto apunta a la misma lista que el original.
   - C) Se crea una nueva lista y se clonan individualmente cada uno de los objetos contenidos en ella.
   - D) El lenguaje de programación detecta el error y detiene la ejecución.
   - Respuesta: C. Deep Copy es recursiva.

8. En el desarrollo de videojuegos, ¿por qué se usaría Prototype para generar enemigos?
   - A) Porque todos los enemigos deben compartir la misma posición de memoria.
   - B) Para evitar el costo de cargar recursos pesados (texturas, scripts) cada vez que nace uno nuevo, clonando un "molde" ya cargado.
   - C) Para que todos mueran al mismo tiempo si el prototipo es destruido.
   - D) Solo por convención, no hay beneficio técnico.
   - Respuesta: B. Eficiencia en instanciación compleja.

9. ¿Cómo se relaciona Prototype con el patrón Abstract Factory?
   - A) No tienen ninguna relación.
   - B) Abstract Factory puede almacenar un conjunto de prototipos para clonar y devolver, en lugar de crear clases concretas.
   - C) Prototype es una versión simplificada de Abstract Factory que no usa interfaces.
   - D) Son mutantes entre sí y no pueden coexistir.
   - Respuesta: B. Una factoría puede usar prototipos internamente.

10. ¿Qué lenguaje de programación utiliza el concepto de Prototype como su modelo base de herencia?
    - A) Java
    - B) C++
    - C) JavaScript
    - D) C#
    - Respuesta: C. JS es un lenguaje basado en prototipos (pero el patrón GoF es una implementación específica sobre este concepto).

11. ¿Qué problema resuelve el patrón Prototype al "omitir sub-clases de factoría"?
    - A) Evita tener un "Creator" específico para cada "Product" concreto.
    - B) Permite que el código sea más rápido al compilar.
    - C) Reduce la memoria RAM al no cargar clases.
    - D) Hace que el garbage collector trabaje menos.
    - Respuesta: A. Evita la explosión de clases paralelas.

12. ¿Cuál es el rol del "Client" en este patrón?
    - A) Definir el método clone().
    - B) Solicitar a un prototipo que se clone a sí mismo para obtener una nueva instancia.
    - C) Gestionar la memoria del sistema.
    - D) Elegir qué algoritmo de ordenación usar.
    - Respuesta: B. El cliente usa el prototipo.

13. ¿Qué suele ser necesario si la clase ConcretePrototype hereda de otra clase con muchos atributos?
    - A) Llamar a "super.clone()" (o equivalente) para asegurar que los campos de la superclase se copien correctamente.
    - B) Borrar todos los atributos de la superclase para que no pesen.
    - C) Cambiar la visibilidad de los atributos de la superclase a "public".
    - D) No se puede clonar si hay herencia.
    - Respuesta: A. Propagación de la clonación en la jerarquía.

14. Si usamos Serialización para implementar Prototype, ¿cuál es el beneficio principal?
    - A) Es el método más rápido en términos de CPU.
    - B) Maneja automáticamente grafos de objetos complejos y referencias circulares mediante Deep Copy.
    - C) No requiere que la clase sea Serializable.
    - D) Solo funciona para tipos primitivos.
    - Respuesta: B. Es una técnica robusta para Deep Copy (aunque lenta).

15. ¿Qué diferencia principal hay entre Prototype y un Constructor de Copia (Copy Constructor)?
    - A) Prototype no usa la palabra clave "new".
    - B) El constructor de copia requiere conocer la clase exacta en tiempo de compilación, mientras que Prototype permite clonar objetos polimórficamente.
    - C) No hay diferencia, son sinónimos exactos.
    - D) El constructor de copia es más seguro para hilos (thread-safe).
    - Respuesta: B. El polimorfismo es la clave de Prototype.

---

## 15 Verdadero/Falso

1. El patrón Prototype pertenece a la categoría de patrones Estructurales. (Falso)
2. El método "clone()" suele ser el corazón de la interfaz Prototype. (Verdadero)
3. En una Shallow Copy, si el objeto original cambia un campo primitivo (como un int), el clon también cambia automáticamente. (Falso)
4. Prototype es ideal cuando el sistema debe ser independiente de cómo se crean sus productos. (Verdadero)
5. Un "Prototype Registry" devuelve siempre la misma instancia original sin copiarla. (Falso)
6. La clonación puede ser más eficiente que la instanciación con "new" si el constructor realiza operaciones costosas (ej. DB, I/O). (Verdadero)
7. Para implementar Prototype en Java, es obligatorio implementar la interfaz Java "Cloneable" y sobrescribir "clone()". (Verdadero/Falso - Es la forma estándar, aunque hay alternativas). -> Pongamos: "La interfaz Cloneable en Java es un ejemplo de este patrón." (Verdadero)
8. El patrón Prototype permite añadir o eliminar productos en tiempo de ejecución registrando nuevas instancias. (Verdadero)
9. Una Deep Copy garantiza que el clon y el original no compartan ninguna referencia a sub-objetos mutables. (Verdadero)
10. El uso de Prototype siempre reduce el consumo de memoria del sistema. (Falso)
11. Un ConcretePrototype debe implementar la operación de clonación. (Verdadero)
12. Prototype requiere que el cliente conozca todas las subclases concretas de los objetos que crea. (Falso)
13. El patrón Prototype puede verse como un reemplazo dinámico de la herencia de clases por composición de objetos. (Verdadero)
14. Si un objeto es inmutable (como un String en Java), no hay diferencia práctica entre Shallow Copy y Deep Copy. (Verdadero)
15. El patrón Prototype es menos flexible que Factory Method porque requiere que los objetos ya existan antes de ser copiados. (Falso - Es flexible de otra forma).

---

## 10 Respuesta Corta

1. ¿Cómo se llama el proceso de copiar solo las referencias a objetos en lugar de los objetos mismos? (Copia Superficial / Shallow Copy)
2. ¿Qué interfaz o clase abstracta suelen implementar los objetos que pueden duplicarse? (Prototype / Cloneable)
3. Si el costo de inicialización de un objeto es muy alto, ¿qué patrón es recomendable? (Prototype)
4. ¿Qué nombre recibe el componente que almacena y cataloga los prototipos disponibles? (Registry / Manager / Registro)
5. ¿Qué tipo de copia crea duplicados completos e independientes de toda la jerarquía de objetos? (Copia Profunda / Deep Copy)
6. ¿Cuál es el participante que solicita una copia del prototipo? (Client / Cliente)
7. Nombre del método estándar utilizado en muchos lenguajes para este patrón. (clone / clonar)
8. Categoría del patrón Prototype según el GoF. (Creacional)
9. Técnica que permite guardar el estado de un objeto en un flujo de bytes y reconstruirlo como Deep Copy. (Serialización)
10. Una de las mayores ventajas es evitar la jerarquía paralela de... (Factorías / Creators)
