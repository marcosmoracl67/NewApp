# 🧾 Documentación Técnica - Backend Menú Jerárquico

## 📌 Objetivo

Desarrollar un sistema de **menú dinámico y jerárquico**, que muestre al usuario únicamente las opciones permitidas según su perfil, siguiendo buenas prácticas de seguridad, escalabilidad y mantenibilidad.

## 🔐 Seguridad

- **Autenticación**: Login con `JWT`, almacenado en cookie `token`.
- **Middleware**: Todas las rutas protegidas utilizan `verifyToken`.
- **Token** incluye `perfil_id`, utilizado para construir el menú dinámico.

## ⚙️ Variables de Entorno

Revisa `env.example` para conocer todas las variables necesarias. Las principales son:
- `PORT`: puerto del servidor
- `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE`: conexión a SQL Server
- `JWT_SECRET` y `COOKIE_SECRET`: claves para tokens y cookies
- `EMAIL_USER`, `EMAIL_PASS`: credenciales para envío de correos
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: datos para SMS
- `CORS_ORIGINS`: dominios permitidos


## 🧱 Estructura y Endpoints

### Usuarios (`/api/users`)
#### Endpoints
- `GET /` – Listar usuarios
- `GET /:id` – Obtener usuario por ID
- `POST /` – Crear usuario
- `PUT /:id` – Actualizar usuario
- `DELETE /:id` – Eliminar usuario
- `POST /login` – Iniciar sesión
- `POST /logout` – Cerrar sesión
- `GET /me` – Perfil autenticado
- `PUT /:id/password` – Cambiar contraseña
- `POST /password-reset/request` – Solicitar recuperación
- `POST /password-reset/verify` – Verificar código
- `POST /password-reset/confirm` – Confirmar nueva contraseña
- `POST /test-email` – Enviar correo de prueba

El flujo de recuperación envía un código por correo o SMS y se confirma con `/password-reset/confirm`.

#### Tabla: `usuario`
| Campo               | Tipo              | Restricciones                 |
|---------------------|-------------------|-------------------------------|
| usuario_id          | NUMERIC(18,0)     | PK, Identity                  |
| username            | NVARCHAR(20)      | NOT NULL, UNIQUE              |
| nombre              | NVARCHAR(50)      | NOT NULL                      |
| rut                 | NVARCHAR(20)      | NOT NULL, UNIQUE              |
| password            | NVARCHAR(255)     | NOT NULL                      |
| activo              | BIT               | NOT NULL                      |
| email               | NVARCHAR(100)     |                               |
| imagen_id           | INT               | FK opcional                   |
| fecha_creacion      | DATETIME          | DEFAULT (GETDATE())           |
| ultimo_acceso       | DATETIME          |                               |
| ip_ultimo_acceso    | NVARCHAR(50)      |                               |
| celular             | NVARCHAR(20)      |                               |
| perfil_id           | INT               | FK a `perfiles.id`            |


### Perfiles (`/api/perfiles`)
#### Endpoints
- `GET /` – Listar perfiles
- `POST /` – Crear perfil
- `PUT /:id` – Actualizar perfil
- `DELETE /:id` – Eliminar perfil

#### Tabla: `perfiles`
| Campo       | Tipo           | Restricciones  |
|-------------|----------------|----------------|
| id          | INT            | PK, Identity   |
| nombre      | NVARCHAR(100)  | NOT NULL       |
| descripcion | NVARCHAR(MAX)  |                |


### Opciones de Menú (`/api/menu-opciones`)
#### Endpoints
- `GET /` – Listar opciones de menú
- `POST /` – Crear opción
- `PUT /:id` – Actualizar opción
- `DELETE /:id` – Eliminar opción
- `POST /:menuOpcionId/perfiles` – Asignar perfiles a una opción
- `GET /:id/perfiles` – Obtiene los perfiles asociados a una opción de menú específica

#### Tabla: `menu_opciones`
| Campo        | Tipo           | Restricciones                  |
|--------------|----------------|--------------------------------|
| id           | INT            | PK, Identity                   |
| nombre       | NVARCHAR(100)  | NOT NULL                       |
| ruta         | NVARCHAR(200)  |                                |
| icono        | NVARCHAR(100)  |                                |
| orden        | INT            | DEFAULT 0                      |
| es_separador | BIT            | DEFAULT 0                      |
| visible      | BIT            | DEFAULT 1                      |
| padre_id     | INT            | FK a `menu_opciones.id`, NULL  |

### Permisos por Perfil (`/api/perfiles-menu`)
#### Endpoints
- `GET /:perfilId` – Obtiene la lista de opciones de menú asignadas al perfil indicado
- `GET /menu-opciones/:menuOpcionId/perfiles` – Devuelve los perfiles asignados a la opción indicada.
- `POST /:perfilId/:menuOpcionId` – Asignar UNA opción de menú a un perfil
- `POST /menu-opciones/:menuOpcionId/perfiles` – Asignar VARIOS perfiles a una opción de menú (perfiles en un arreglo)
- `DELETE /:perfilId/:menuOpcionId` – Eliminar asignación

#### Tabla: `perfiles_menu_opciones`
| Campo           | Tipo   | Restricciones                 |
|-----------------|--------|-------------------------------|
| perfil_id       | INT    | PK, FK a `perfiles.id`        |
| menu_opcion_id  | INT    | PK, FK a `menu_opciones.id`   |
| permitido       | BIT    | DEFAULT 1                     |

### Menú Jerárquico (`/api/menu`)
- `GET /` – Retorna el menú jerárquico visible según el perfil autenticado


### Imágenes (`/api/images`)
- `GET /` – Listar
- `GET /:id` – Obtener
- `POST /` – Subir imagen (`multipart/form-data`)
- `DELETE /:id` – Eliminar

> Tabla `imagenes` no especificada aún en el script original.

### Documentos (`/api/documentos`)
- `GET /` – Listar
- `GET /:id` – Obtener
- `POST /` – Subir documento (`multipart/form-data`)
- `DELETE /:id` – Eliminar

> Tabla `documentos` no especificada aún en el script original.

### Utilidades (`/api/utils`)
- `POST /test-email` – Enviar correo de prueba

## 📄 Documentación Swagger

- URL: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Autenticación: botón **Authorize**, usando el token JWT almacenado en la cookie `token`

### Esquemas definidos (`components.schemas`)
- `Usuario`
- `Perfil`
- `MenuOpcion`
- `PermisoPerfil`

## 🧠 Máximas del Proyecto

- ✅ Modularidad: código separado en rutas, controladores y middlewares
- ✅ Centralización: menú gestionado desde base de datos
- ✅ Seguridad: endpoints protegidos con middleware y cookies JWT
- ✅ Hashing de contraseñas con `argon2`
- ✅ Subida de archivos con `multer`
- ✅ Notificaciones vía correo (Nodemailer) y SMS (Twilio)
- ✅ Documentación viva: Swagger actualizado por anotaciones en rutas

## 🧪 Instrucciones de Prueba

1. Ejecutar `npm run dev`
2. Autenticarse con `POST /api/users/login`
3. Acceder a [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
4. Autorizar con el token JWT en la cookie
5. Probar los endpoints directamente desde Swagger UI
