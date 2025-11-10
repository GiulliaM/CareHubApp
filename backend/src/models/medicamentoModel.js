import db from "../config/db.js";
export const criarMedicamento = (m, cb) => {
  const sql = "INSERT INTO medicamentos (nome, dosagem, horarios, inicio, duracao_days, uso_continuo, paciente_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [m.nome, m.dosagem || null, m.horarios || null, m.inicio || null, m.duracao_days || null, m.uso_continuo ? 1 : 0, m.paciente_id || null];
  db.query(sql, values, cb);
};
export const listarMedicamentosPorUsuario = (usuarioId, cb) => {
  db.query("SELECT m.* FROM medicamentos m JOIN pacientes p ON m.paciente_id = p.paciente_id WHERE p.fk_usuario_id = ? ORDER BY m.created_at DESC", [usuarioId], cb);
};
export const deletarMedicamento = (id, cb) => {
  db.query("DELETE FROM medicamentos WHERE medicamento_id = ?", [id], cb);
};
