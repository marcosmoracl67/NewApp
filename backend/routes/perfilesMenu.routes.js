/**
 * @swagger
 * tags:
 *   name: Permisos por Perfil
 *   description: Asociación entre perfiles y opciones de menú
 */

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken.js");
const controller = require("../controllers/perfilesMenu.controller.js");

/**
 * @swagger
 * /api/perfiles-menu/{perfilId}:
 *   get:
 *     summary: Obtener opciones de menú permitidas para un perfil
 *     tags: [Permisos por Perfil]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: perfilId
 *         in: path
 *         required: true
 *         description: ID del perfil
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opciones asociadas al perfil
 */
router.get("/:perfilId", verifyToken, controller.obtenerMenusDePerfil);

/**
 * @swagger
 * /api/menu-opciones/{menuOpcionId}/perfiles:
 *   post:
 *     summary: Asignar perfiles a una opción de menú
 *     tags: [MenuOpciones]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: menuOpcionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la opción de menú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfiles:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               perfiles: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Perfiles asignados correctamente al menú.
 *       400:
 *         description: El campo perfiles debe ser un array.
 *       500:
 *         description: Error interno al asignar perfiles.
 */
router.post("/:menuOpcionId/perfiles", verifyToken, controller.asignarPerfilesAMenu);

/**
 * @swagger
 * /api/perfiles-menu/{perfilId}/{menuOpcionId}:
 *   post:
 *     summary: Asignar una opción de menú a un perfil
 *     tags: [Permisos por Perfil]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: perfilId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuOpcionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Asociación creada correctamente
 *       409:
 *         description: La asociación ya existe
 *       500:
 *         description: Error al crear la asociación
 */
router.post("/:perfilId/:menuOpcionId", verifyToken, controller.agregarAsociacion);

/**
 * @swagger
 * /api/perfiles-menu/{perfilId}/{menuOpcionId}:
 *   delete:
 *     summary: Eliminar asociación de una opción de menú con un perfil
 *     tags: [Permisos por Perfil]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: perfilId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuOpcionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asociación eliminada
 */
router.delete("/:perfilId/:menuOpcionId", verifyToken, controller.eliminarAsociacion);

/**
 * @swagger
 * /api/menu-opciones/{id}/perfiles:
 *   get:
 *     summary: Obtener perfiles asociados a una opción de menú
 *     tags: [MenuOpciones]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la opción de menú
 *     responses:
 *       200:
 *         description: Lista de perfiles asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *       500:
 *         description: Error al obtener perfiles.
 */
router.get("/:id/perfiles", verifyToken, controller.obtenerPerfilesDeMenu);

module.exports = router;