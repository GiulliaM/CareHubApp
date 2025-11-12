const db = require("../config/db");

exports.criarMedicamento = (data, callback) => {
  const {
    nome,
    dosagem,
    horarios,
    concluido,
    inicio,
    duracao_days,
    uso_continuo,
    paciente_id,
  } = data;

  const sql = `
    INSERT INTO medicamentos 
    (nome, dosagem, horarios, concluido, inicio, duracao_days, uso_continuo, paciente_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nome, dosagem, horarios, concluido, inicio, duracao_days, uso_continuo, paciente_id],
    callback
  );
};

exports.atualizarMedicamento = (id, data, callback) => {
  const keys = Object.keys(data);
  if (keys.length === 0) return callback(null, { affectedRows: 0 });

  const fields = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => data[key]);

  const sql = `UPDATE medicamentos SET ${fields} WHERE medicamento_id = ? LIMIT 1`;
  db.query(sql, [...values, id], callback);
};
