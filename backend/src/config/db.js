import mysql from "mysql2";

// Nota: as variáveis de ambiente (DB_HOST, etc.) são carregadas pelo server.js
// através do dotenv ANTES de importar este módulo (import dinâmico).
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err.message);
  } else {
    console.log("Pool MySQL conectado:", process.env.DB_NAME);
    conn.release();
  }
});

export default pool;
