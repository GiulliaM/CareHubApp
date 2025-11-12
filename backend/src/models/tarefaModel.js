import db from "../config/db.js";

const Tarefa = {
  getAll: (paciente_id, callback) => {
    const query = "SELECT * FROM tarefas WHERE paciente_id = ?";
    db.query(query, [paciente_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results || []);
    });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM tarefas WHERE tarefa_id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  create: (tarefa, callback) => {
    const query = `
      INSERT INTO tarefas (titulo, detalhes, data, hora, dias_repeticao, responsavel_id, paciente_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      tarefa.titulo,
      tarefa.detalhes,
      tarefa.data,
      tarefa.hora,
      tarefa.dias_repeticao || "",
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
