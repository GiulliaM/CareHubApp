import db from "../config/db.js";
export const criarUsuario = (usuario, cb) => {
  const sql = "INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)";
  const values = [usuario.nome, usuario.email, usuario.senha_hash, usuario.tipo];
  db.query(sql, values, cb);
};
export const buscarPorEmail = (email, cb) => {
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], cb);
};
export const buscarPorId = (id, cb) => {
  db.query("SELECT usuario_id, nome, email, tipo, created_at FROM usuarios WHERE usuario_id = ?", [id], cb);
};
