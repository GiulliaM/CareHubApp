import db from "../config/db.js";

const COLUNAS_PERMITIDAS = ["nome", "email", "tipo", "telefone"];

export const atualizarUsuario = (id, changes, cb) => {
  const allowed = Object.keys(changes).filter((k) => COLUNAS_PERMITIDAS.includes(k));
  if (allowed.length === 0) return cb(null, { affectedRows: 0 });
  const fields = allowed.map((k) => `${k} = ?`).join(", ");
  const values = allowed.map((k) => changes[k]);
  values.push(id);
  const sql = `UPDATE usuarios SET ${fields} WHERE usuario_id = ?`;
  db.query(sql, values, cb);
};
export const criarUsuario = (usuario, cb) => {
  const sql = "INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)";
  const values = [usuario.nome, usuario.email, usuario.senha_hash, usuario.tipo];
  db.query(sql, values, cb);
};
export const buscarPorEmail = (email, cb) => {
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], cb);
};
export const buscarPorId = (id, cb) => {
  db.query("SELECT usuario_id, nome, email, tipo, telefone, created_at FROM usuarios WHERE usuario_id = ?", [id], cb);
};
