require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'videojuegos_xbox360',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL exitosamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
  }
})();


// Aquí debes registrar las rutas de autenticación
const authRoutes = require('./src/routes/auth.routes')(pool);
app.use('/api/auth', authRoutes);

// ====== RUTAS API ======

// GET - Obtener todos los videojuegos
app.get('/api/videojuegos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videojuegos ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener videojuegos:', error);
    res.status(500).json({ error: 'Error al obtener los videojuegos' });
  }
});

// GET - Obtener un videojuego por ID
app.get('/api/videojuegos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videojuegos WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener videojuego:', error);
    res.status(500).json({ error: 'Error al obtener el videojuego' });
  }
});

// POST - Crear nuevo videojuego
app.post('/api/videojuegos', async (req, res) => {
  try {
    const { nombre, genero, anio, desarrollador, calificacion, imagen_url } = req.body;
    
    // Validación básica
    if (!nombre || !genero || !anio || !desarrollador || calificacion === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const query = `
      INSERT INTO videojuegos (nombre, genero, anio, desarrollador, calificacion, imagen_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      nombre, 
      genero, 
      anio, 
      desarrollador, 
      calificacion, 
      imagen_url || null
    ]);
    
    // Obtener el videojuego recién creado
    const [newGame] = await pool.query('SELECT * FROM videojuegos WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newGame[0]);
  } catch (error) {
    console.error('Error al crear videojuego:', error);
    res.status(500).json({ error: 'Error al crear el videojuego' });
  }
});

// PUT - Actualizar videojuego
app.put('/api/videojuegos/:id', async (req, res) => {
  try {
    const { nombre, genero, anio, desarrollador, calificacion, imagen_url } = req.body;
    const { id } = req.params;
    
    // Validación básica
    if (!nombre || !genero || !anio || !desarrollador || calificacion === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

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
      id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    
    // Obtener el videojuego actualizado
    const [updatedGame] = await pool.query('SELECT * FROM videojuegos WHERE id = ?', [id]);
    
    res.json(updatedGame[0]);
  } catch (error) {
    console.error('Error al actualizar videojuego:', error);
    res.status(500).json({ error: 'Error al actualizar el videojuego' });
  }
});

// DELETE - Eliminar videojuego
app.delete('/api/videojuegos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM videojuegos WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    
    res.json({ message: 'Videojuego eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar videojuego:', error);
    res.status(500).json({ error: 'Error al eliminar el videojuego' });
  }
});

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api/videojuegos`);
});