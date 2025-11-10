import db from "../config/db.js";
export const criarRegistro = (reg, callback) => {
  const sql = `INSERT INTO diario_registros (data, hora, atividades, comentario, paciente_id, usuario_id)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    reg.data || null,
    reg.hora || null,
    reg.atividades || null,
    reg.comentario || null,
    reg.paciente_id || null,
    reg.usuario_id || null
  ];
  db.query(sql, values, callback);
};
export const listarRegistros = (callback) => {
  db.query("SELECT * FROM diario_registros ORDER BY data DESC, hora DESC", callback);
};
export const buscarRegistroPorId = (id, callback) => {
  db.query("SELECT * FROM diario_registros WHERE registro_id = ?", [id], callback);
};
export const deletarRegistro = (id, callback) => {
  db.query("DELETE FROM diario_registros WHERE registro_id = ?", [id], callback);
};
