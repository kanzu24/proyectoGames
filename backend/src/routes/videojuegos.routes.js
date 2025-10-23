const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  agregarVideojuego,
  editarVideojuego,
  eliminarVideojuego,
  listarVideojuegos
} = require('../controllers/videojuegos.controller');

// ✅ Todos los logueados pueden agregar
router.post('/agregar', verifyToken, agregarVideojuego);

// ✅ Solo ADMIN puede editar o eliminar
router.put('/editar/:id', verifyToken, verifyAdmin, editarVideojuego);
router.delete('/eliminar/:id', verifyToken, verifyAdmin, eliminarVideojuego);

// ✅ Pública
router.get('/listar', listarVideojuegos);

module.exports = router;
