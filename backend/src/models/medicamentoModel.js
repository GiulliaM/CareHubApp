import db from "../config/db.js";

export const criarMedicamento = (data, callback) => {
  const {
    nome,
    dosagem,
    horarios, // Array de strings: ["08:00", "16:00", "00:00"]
    concluido,
    inicio,
    duracao_days,
    uso_continuo,
    paciente_id,
    tipo_agendamento, // 'manual' ou 'intervalo'
    intervalo_horas, // 4, 6, 8 ou 12
    data_fim, // null se uso_continuo = 1
    dias_semana, // "0,1,2,3,4,5,6" ou null
  } = data;

  // Converte array de horários para JSON ou string separada por vírgula
  const horariosStr = Array.isArray(horarios) 
    ? JSON.stringify(horarios) 
    : horarios;

  const sql = `
    INSERT INTO medicamentos 
    (nome, dosagem, horarios, concluido, inicio, duracao_days, uso_continuo, paciente_id,
     tipo_agendamento, intervalo_horas, data_fim, dias_semana)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nome, 
      dosagem, 
      horariosStr, 
      concluido, 
      inicio, 
      duracao_days, 
      uso_continuo, 
      paciente_id,
      tipo_agendamento || 'manual',
      intervalo_horas,
      data_fim,
      dias_semana,
    ],
    callback
  );
};

export const atualizarMedicamento = (id, data, callback) => {
  const keys = Object.keys(data);
  if (keys.length === 0) return callback(null, { affectedRows: 0 });

  // Se estiver atualizando horários e for array, converte para JSON
  if (data.horarios && Array.isArray(data.horarios)) {
    data.horarios = JSON.stringify(data.horarios);
  }

  const fields = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => data[key]);

  const sql = `UPDATE medicamentos SET ${fields} WHERE medicamento_id = ? LIMIT 1`;
  db.query(sql, [...values, id], callback);
};

export default {
  criarMedicamento,
  atualizarMedicamento
};
