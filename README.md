<<<<<<< HEAD
# README.md

El menú de la barra lateral se obtiene dinámicamente desde el backend. Al iniciar sesión o recargar la página, `AuthContext` consulta el endpoint `/api/menu` y almacena las opciones recibidas para renderizarlas en `Sidebar`.

# Copia este archivo a `.env` y ajusta según tu entorno
VITE_API_BASE_URL=http://localhost:3000

## Configuración

Crea un archivo `.env` con la siguiente variable para indicar la URL base del backend:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Modo desarrollo

```bash
npm install
npm run dev
```