import db from "../config/db.js";
export const criarRegistro = (r, cb) => {
  const sql = "INSERT INTO diario_registros (data, hora, atividades, comentario, paciente_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [r.data || null, r.hora || null, r.atividades || null, r.comentario || null, r.paciente_id || null, r.usuario_id || null];
  db.query(sql, values, cb);
};
export const listarRegistrosPorUsuario = (usuarioId, cb) => {
  db.query("SELECT d.* FROM diario_registros d JOIN pacientes p ON d.paciente_id = p.paciente_id WHERE p.fk_usuario_id = ? ORDER BY d.data DESC, d.hora DESC", [usuarioId], cb);
};
export const deletarRegistro = (id, cb) => {
  db.query("DELETE FROM diario_registros WHERE registro_id = ?", [id], cb);
};
