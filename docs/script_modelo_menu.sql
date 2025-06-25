
-- Crear tabla de usuarios
CREATE TABLE usuario (
    usuario_id NUMERIC(18, 0) IDENTITY(1,1) NOT NULL PRIMARY KEY,
    username NVARCHAR(20) NOT NULL UNIQUE,
    nombre NVARCHAR(50) NOT NULL,
    rut NVARCHAR(20) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    activo BIT NOT NULL,
    email NVARCHAR(100),
    imagen_id INT,
    fecha_creacion DATETIME NOT NULL DEFAULT (GETDATE()),
    ultimo_acceso DATETIME,
    ip_ultimo_acceso NVARCHAR(50),
    celular NVARCHAR(20),
    perfil_id INT NULL
);

-- Crear tabla de perfiles
CREATE TABLE perfiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX)
);

-- Crear tabla de opciones de menú
CREATE TABLE menu_opciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    ruta NVARCHAR(200),
    icono NVARCHAR(100),
    orden INT NOT NULL DEFAULT 0,
    es_separador BIT NOT NULL DEFAULT 0,
    visible BIT NOT NULL DEFAULT 1,
    padre_id INT NULL,
    FOREIGN KEY (padre_id) REFERENCES menu_opciones(id)
);

-- Crear tabla de asociación perfil - opciones de menú
CREATE TABLE perfiles_menu_opciones (
    perfil_id INT NOT NULL,
    menu_opcion_id INT NOT NULL,
    permitido BIT NOT NULL DEFAULT 1,
    PRIMARY KEY (perfil_id, menu_opcion_id),
    FOREIGN KEY (perfil_id) REFERENCES perfiles(id),
    FOREIGN KEY (menu_opcion_id) REFERENCES menu_opciones(id)
);

-- Clave foránea de usuario hacia perfiles
ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_perfil FOREIGN KEY (perfil_id) REFERENCES perfiles(id);
