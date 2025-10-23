const pool = require('../../config/database');

// 🟢 Obtener todos los videojuegos
const listarVideojuegos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videojuegos ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al listar videojuegos:', error);
    res.status(500).json({ error: 'Error al listar los videojuegos' });
  }
};

// 🟢 Agregar videojuego (solo usuarios logueados)
const agregarVideojuego = async (req, res) => {
  try {
    const { nombre, genero, anio, desarrollador, calificacion, imagen_url } = req.body;

    if (!nombre || !genero || !anio || !desarrollador) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const query = `
      INSERT INTO videojuegos (nombre, genero, anio, desarrollador, calificacion, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [nombre, genero, anio, desarrollador, calificacion || null, imagen_url || null]);

    res.status(201).json({ message: 'Videojuego agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar videojuego:', error);
    res.status(500).json({ error: 'Error al agregar el videojuego' });
  }
};

// 🟡 Editar videojuego (solo usuarios logueados)
const editarVideojuego = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, genero, anio, desarrollador, calificacion, imagen_url } = req.body;

    const query = `
      UPDATE videojuegos
      SET nombre = ?, genero = ?, anio = ?, desarrollador = ?, calificacion = ?, imagen_url = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [
      nombre,
      genero,
      anio,
      desarrollador,
      calificacion,
      imagen_url || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    res.json({ message: 'Videojuego actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar videojuego:', error);
    res.status(500).json({ error: 'Error al editar el videojuego' });
  }
};

// 🔴 Eliminar videojuego (solo ADMIN)
const eliminarVideojuego = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar videojuegos' });
    }

    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM videojuegos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }

    res.json({ message: 'Videojuego eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar videojuego:', error);
    res.status(500).json({ error: 'Error al eliminar el videojuego' });
  }
};

module.exports = {
  listarVideojuegos,
  agregarVideojuego,
  editarVideojuego,
  eliminarVideojuego,
};
