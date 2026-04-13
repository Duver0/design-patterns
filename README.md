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

## 🚀 Cómo ejecutar el proyecto localmente

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

## 📈 Estructura del Proyecto

- `frontend/`: Código fuente, estilos y estructuras base.
  - `src/domain/`: Interfaces y estrategias de negocio (Strategy Pattern).
  - `src/services/`: Lógica de creación (Factory), aleatorización y estado (Singleton).
  - `src/data/patterns/`: Bancos de preguntas en formato JSON.
- `dist/`: Generado automáticamente tras el build para despliegue.

