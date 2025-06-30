const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');
require('dotenv').config();

const cookieSecret = process.env.COOKIE_SECRET || undefined;

const usersRoutes = require('./src/routes/users.routes.js');

const perfilesRoutes = require('./src/routes/perfiles.routes.js');
const menuOpcionesRoutes = require('./src/routes/menuOpciones.routes.js');
const perfilesMenuRoutes = require('./src/routes/perfilesMenu.routes.js');
const imagenesRoutes = require('./src/routes/image.routes.js');
const menuRoutes = require('./src/routes/menu.routes.js');
const documentosRouter = require('./src/routes/documentos.routes.js');
const utilsRoutes = require('./src/routes/testEmail.routes.js');

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigins.split(',').map(origin => origin.trim()),
    credentials: true
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(cookieSecret));

// Rutas API
app.use('/api/users', usersRoutes);
app.use('/api/perfiles', perfilesRoutes);
app.use('/api/menu-opciones', menuOpcionesRoutes);
app.use('/api/perfiles-menu', perfilesMenuRoutes);
app.use('/api/images', imagenesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/documentos', documentosRouter);
app.use('/api/utils', utilsRoutes);

const setupSwagger = require('./src/swagger.js');
setupSwagger(app);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Un error inesperado ha ocurrido en el servidor.'
  });
});

module.exports = app;
