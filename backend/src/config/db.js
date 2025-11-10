import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
connection.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
  } else {
    console.log("✅ Conectado ao banco", process.env.DB_NAME, "com usuário", process.env.DB_USER);
  }
});
export default connection;
