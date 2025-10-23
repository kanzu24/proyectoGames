require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database'); // 👈 conexión a MySQL

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== RUTAS ======
const authRoutes = require('./src/routes/auth.routes')(pool);
const videojuegosRoutes = require('./src/routes/videojuegos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/videojuegos', videojuegosRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
