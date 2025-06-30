const { getConnection, sql } = require("../database/connection.js");

const obtenerMenusDePerfil = async (req, res) => {
   const perfilId = req.params.perfilId;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("perfilId", sql.Int, perfilId)
      .query(`
        SELECT mo.id, mo.nombre, mo.ruta, mo.icono, mo.padre_id, mo.visible, mo.orden
        FROM perfiles_menu_opciones pmo
        JOIN menu_opciones mo ON pmo.menu_opcion_id = mo.id
        WHERE pmo.perfil_id = @perfilId
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener menús del perfil:", error);
    res.status(500).json({ error: "Error al obtener menús del perfil." });
  }
}

const asignarPerfilesAMenu = async (req, res) => {
  const menuOpcionId = req.params.menuOpcionId;
  const nuevosPerfiles = req.body.perfiles || [];

  if (!Array.isArray(nuevosPerfiles)) {
    return res.status(400).json({ error: "El campo 'perfiles' debe ser un array de IDs." });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("menuOpcionId", sql.Int, menuOpcionId)
      .query("SELECT perfil_id FROM perfiles_menu_opciones WHERE menu_opcion_id = @menuOpcionId");
    
    const perfilesActuales = result.recordset.map(row => row.perfil_id);

    // Determinar perfiles a agregar y eliminar
    const aAgregar = nuevosPerfiles.filter(id => !perfilesActuales.includes(id));
    const aEliminar = perfilesActuales.filter(id => !nuevosPerfiles.includes(id));

    // Agregar nuevos
    for (const perfilId of aAgregar) {
      await pool.request()
        .input("perfilId", sql.Int, perfilId)
        .input("menuOpcionId", sql.Int, menuOpcionId)
        .query(`INSERT INTO perfiles_menu_opciones (perfil_id, menu_opcion_id, permitido)
                VALUES (@perfilId, @menuOpcionId, 1)`);
    }

    // Eliminar los removidos
    for (const perfilId of aEliminar) {
      await pool.request()
        .input("perfilId", sql.Int, perfilId)
        .input("menuOpcionId", sql.Int, menuOpcionId)
        .query(`DELETE FROM perfiles_menu_opciones
                 WHERE perfil_id = @perfilId AND menu_opcion_id = @menuOpcionId`);
    }

    res.json({
      mensaje: "Perfiles asignados correctamente al menú.",
      insertados: aAgregar.length,
      eliminados: aEliminar.length
    });

  } catch (error) {
    console.error("Error al asignar perfiles:", error);
    res.status(500).json({ error: "Error al asignar perfiles al menú." });
  }
};

const obtenerPerfilesDeMenu = async (req, res) => {
  const menuOpcionId = req.params.id;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("menuOpcionId", sql.Int, menuOpcionId)
      .query(`
        SELECT p.id, p.nombre, p.descripcion
        FROM perfiles_menu_opciones pm
        JOIN perfiles p ON pm.perfil_id = p.id
        WHERE pm.menu_opcion_id = @menuOpcionId
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener perfiles del menú:", error);
    res.status(500).json({ error: "Error al obtener perfiles del menú." });
  }
};

const eliminarAsociacion = async (req, res) => {
  const { perfilId, menuOpcionId } = req.params;

  try {
    const pool = await getConnection();
    await pool.request()
      .input("perfilId", sql.Int, perfilId)
      .input("menuOpcionId", sql.Int, menuOpcionId)
      .query(
        "DELETE FROM perfiles_menu_opciones WHERE perfil_id = @perfilId AND menu_opcion_id = @menuOpcionId"
      );

    res.json({ mensaje: "Asociación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la asociación:", error);
    res.status(500).json({ error: "Error al eliminar la asociación." });
  }
};

const agregarAsociacion = async (req, res) => {
  const { perfilId, menuOpcionId } = req.params;

  try {
    const pool = await getConnection();
    await pool.request()
      .input("perfilId", sql.Int, perfilId)
      .input("menuOpcionId", sql.Int, menuOpcionId)
      .query(
        `INSERT INTO perfiles_menu_opciones (perfil_id, menu_opcion_id, permitido)
         VALUES (@perfilId, @menuOpcionId, 1)`
      );

    res.status(201).json({ mensaje: "Asociación creada correctamente" });
  } catch (error) {
    if (error.number === 2627) {
      return res.status(409).json({ error: "La asociación ya existe." });
    }
    console.error("Error al crear la asociación:", error);
    res.status(500).json({ error: "Error al crear la asociación." });
  }
};

module.exports = {
    obtenerMenusDePerfil,
    asignarPerfilesAMenu,
    eliminarAsociacion,
    obtenerPerfilesDeMenu,
    agregarAsociacion,
};
