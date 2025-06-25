<<<<<<< HEAD
# README.md

Aplicación React creada con Vite.

El menú de la barra lateral se obtiene dinámicamente desde el backend. Al iniciar sesión o recargar la página, `AuthContext` consulta el endpoint `GET http://localhost:3000/api/menu` y almacena las opciones recibidas para renderizarlas en `Sidebar`.

Para ejecutar el proyecto en modo desarrollo:

```bash
npm install
npm run dev
```
