
require('dotenv').config();

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

module.exports = pool;