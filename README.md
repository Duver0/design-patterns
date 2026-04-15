# Design Patterns Quiz – Aprendizaje Interactivo 🧩

Plataforma estática de aprendizaje para dominar los patrones de diseño (GoF) mediante un sistema de quiz con retroalimentación inmediata.

## 🏗️ Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (ES Modules).
- **Herramientas de Build:** [Vite](https://vitejs.dev/) para empaquetado y desarrollo.
- **Arquitectura:**
  - **Strategy Pattern:** Implementado para desacoplar el renderizado y validación de diferentes tipos de preguntas (MCQ, True/False, Short Answer).
  - **Factory Method:** Centraliza la creación de las estrategias de preguntas.
  - **Singleton:** El `SessionState` mantiene el estado global del quiz activo de forma única.
- **Datos:** Bancos de 40 preguntas por patrón almacenados en archivos JSON independientes.
- **Despliegue:** Arquitectura 100% estática, compatible con GitHub Pages.

## 🚀 Cómo ejecutar el proyecto localmente

0. **Instalar Bun (si aún no lo tienes):**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

1. **Instalar dependencias:**
   ```bash
   bun install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   bun run dev
   ```

3. **Ver en el navegador:**
   La terminal mostrará una URL (usualmente `http://localhost:5173`).

## 📦 Construcción y Despliegue

### Generar archivos para producción
```bash
bun run build
```
Este comando genera una carpeta `dist/` en la raíz con todos los archivos estáticos necesarios.

### Despliegue en GitHub Pages
El proyecto está optimizado para ser desplegado como un sitio estático:
1. Asegúrate de que el comando `bun run build` haya generado la carpeta `dist`.
2. Sube el contenido de `dist` a la rama de despliegue (`gh-pages` o `main` dependiendo de tu configuración).
3. En la configuración de GitHub Pages, apunta a la raíz de la rama/carpeta donde subiste los archivos.

## 🏭 Patrones Creacionales

Banco de preguntas creacionales en formato JSON, consumido por el motor del quiz.

| Patrón | Preguntas | Estado |
|---|---:|---|
| Abstract Factory | 40 | Completo |
| Builder | 40 | Completo |
| Factory Method | 40 | Completo |
| Prototype | 40 | Completo |
| Singleton | 40 | Completo |

## 🧱 Patrones Estructurales

Banco de preguntas estructurales en formato JSON, consumido por el motor del quiz.

| Patrón | Preguntas | Estado |
|---|---:|---|
| Adapter | 40 | Completo |
| Bridge | 40 | Completo |
| Composite | 40 | Completo |
| Decorator | 40 | Completo |
| Facade | 40 | Completo |
| Flyweight | 40 | Completo |
| Proxy | 40 | Completo |

## 🎯 Patrones Comportamentales

Banco de preguntas comportamentales en formato JSON, consumido por el motor del quiz.

| Patrón | Preguntas | Estado |
|---|---:|---|
| Chain of Responsibility | 40 | Completo |
| Command | 40 | Completo |
| Iterator | 40 | Completo |
| Mediator | 40 | Completo |
| Memento | 40 | Completo |
| Observer | 40 | Completo |
| State | 40 | Completo |
| Strategy | 40 | Completo |
| Template Method | 40 | Completo |
| Visitor | 40 | Completo |

**Completitud global del banco actual:** Creacionales, Estructurales y Comportamentales están completos (40 preguntas por patrón).

## 📈 Estructura del Proyecto

- `frontend/`: Código fuente, estilos y estructuras base.
   - `src/app/`: Punto de entrada y orquestación general de la aplicación.
   - `src/domain/`: Interfaces y estrategias de negocio (Strategy Pattern).
   - `src/services/`: Lógica de creación (Factory), aleatorización y estado (Singleton).
   - `src/data/patterns/`: Bancos de preguntas en formato JSON.
   - `src/ui/components/`: Componentes de interfaz reutilizables.
   - `src/ui/views/`: Vistas del flujo del quiz.
- `dist/`: Generado automáticamente tras el build para despliegue.

