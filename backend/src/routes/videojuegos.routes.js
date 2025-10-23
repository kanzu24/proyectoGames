const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const {
  listarVideojuegos,
  agregarVideojuego,
  editarVideojuego,
  eliminarVideojuego
} = require('../controllers/videojuegos.controller');

// 🔓 Ruta pública
router.get('/listar', listarVideojuegos);

// 🔒 Rutas protegidas
router.post('/agregar', verifyToken, agregarVideojuego);
router.put('/editar/:id', verifyToken, editarVideojuego);
router.delete('/eliminar/:id', verifyToken, eliminarVideojuego);

module.exports = router;
