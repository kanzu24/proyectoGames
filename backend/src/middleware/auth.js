const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'mi_super_secreto';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = decoded; // Datos del usuario
    next();
  });
}

module.exports = verifyToken;
