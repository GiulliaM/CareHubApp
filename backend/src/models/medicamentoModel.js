import db from "../config/db.js";
export const criarMedicamento = (med, callback) => {
  const sql = `INSERT INTO medicamentos (nome, dosagem, intervalo_horas, horarios, inicio, duracao_days, uso_continuo, paciente_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    med.nome || null,
    med.dosagem || null,
    med.intervalo_horas || null,
    med.horarios || null,
    med.inicio || null,
    med.duracao_days || null,
    med.uso_continuo ? 1 : 0,
    med.paciente_id || null
  ];
  db.query(sql, values, callback);
};
export const listarMedicamentos = (callback) => {
  db.query("SELECT * FROM medicamentos ORDER BY created_at DESC", callback);
};
export const buscarMedicamentoPorId = (id, callback) => {
  db.query("SELECT * FROM medicamentos WHERE medicamento_id = ?", [id], callback);
};
export const atualizarMedicamento = (id, med, callback) => {
  const sql = `UPDATE medicamentos
               SET nome=?, dosagem=?, intervalo_horas=?, horarios=?, inicio=?, duracao_days=?, uso_continuo=?, paciente_id=?
               WHERE medicamento_id=?`;
  const values = [
    med.nome || null,
    med.dosagem || null,
    med.intervalo_horas || null,
    med.horarios || null,
    med.inicio || null,
    med.duracao_days || null,
    med.uso_continuo ? 1 : 0,
    med.paciente_id || null,
    id
  ];
  db.query(sql, values, callback);
};
export const deletarMedicamento = (id, callback) => {
  db.query("DELETE FROM medicamentos WHERE medicamento_id = ?", [id], callback);
};
