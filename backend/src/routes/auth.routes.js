const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    try {
      const { email, password, nombre } = req.body;

      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (email, password, nombre)
        VALUES (?, ?, ?)
      `;

      await pool.query(query, [email, hashedPassword, nombre]);

      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const [users] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = users[0];
      const validPass = await bcrypt.compare(password, user.password);

      if (!validPass) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // 🔥 Incluimos el rol dentro del token
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol }, // <-- asegúrate de usar el nombre correcto del campo
        process.env.JWT_SECRET || 'mi_super_secreto',
        { expiresIn: '2h' }
      );

      res.json({ message: 'Acceso permitido', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  return router; // 🔥 importante: devolver el router
};
