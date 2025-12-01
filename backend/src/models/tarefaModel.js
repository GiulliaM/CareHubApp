import db from "../config/db.js";

const Tarefa = {
    // Buscar o próximo medicamento para um paciente
    buscarProximoMedicamento: (paciente_id, callback) => {
      const query = `SELECT * FROM medicamentos WHERE paciente_id = ? AND horario > NOW() ORDER BY horario ASC LIMIT 1`;
      db.query(query, [paciente_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      });
    },

    // Buscar a próxima consulta para um paciente
    buscarProximaConsulta: (paciente_id, callback) => {
      const query = `SELECT * FROM consultas WHERE paciente_id = ? AND data > NOW() ORDER BY data ASC LIMIT 1`;
      db.query(query, [paciente_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      });
    },

    // Buscar todas as tarefas de um paciente
    buscarTodasPorPaciente: (paciente_id, callback) => {
      const query = `SELECT * FROM tarefas WHERE paciente_id = ?`;
      db.query(query, [paciente_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results || []);
      });
    },
  getAll: (paciente_id, callback) => {
    const query = "SELECT tarefa_id, titulo, detalhes, DATE_FORMAT(data, '%Y-%m-%d') as data, hora, concluida, dias_repeticao, responsavel_id, paciente_id, created_at FROM tarefas WHERE paciente_id = ?";
    db.query(query, [paciente_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results || []);
    });
  },

  getById: (id, callback) => {
    const query = "SELECT tarefa_id, titulo, detalhes, DATE_FORMAT(data, '%Y-%m-%d') as data, hora, concluida, dias_repeticao, responsavel_id, paciente_id, created_at FROM tarefas WHERE tarefa_id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  create: (tarefa, callback) => {
    const query = `
      INSERT INTO tarefas (titulo, detalhes, data, hora, dias_repeticao, concluida, responsavel_id, paciente_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      tarefa.titulo,
      tarefa.detalhes,
      tarefa.data,
      tarefa.hora,
      tarefa.dias_repeticao || "",
      tarefa.concluida !== undefined ? tarefa.concluida : 0, // ✅ Define como 0 por padrão
      tarefa.responsavel_id || null,
      tarefa.paciente_id,
    ];
    db.query(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { tarefa_id: results.insertId, ...tarefa });
    });
  },

  update: (id, tarefa, callback) => {
    const query = `
      UPDATE tarefas
      SET titulo = ?, detalhes = ?, data = ?, hora = ?, dias_repeticao = ?, concluida = ?
      WHERE tarefa_id = ?
    `;
    const values = [
      tarefa.titulo,
      tarefa.detalhes,
      tarefa.data,
      tarefa.hora,
      tarefa.dias_repeticao || "",
      tarefa.concluida ? 1 : 0,
      id,
    ];
    db.query(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM tarefas WHERE tarefa_id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};

export default Tarefa;
