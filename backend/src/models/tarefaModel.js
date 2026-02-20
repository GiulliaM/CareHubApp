import db from "../config/db.js";

const SEL = `
  tarefa_id, titulo, detalhes,
  DATE_FORMAT(data, '%Y-%m-%d') as data, hora,
  concluida, hora_conclusao, dias_repeticao,
  grupo_repeticao, paciente_id, criado_por, created_at
`;

const Tarefa = {
  buscarTodos: (paciente_id, callback) => {
    db.query(`SELECT ${SEL} FROM tarefas WHERE paciente_id = ? ORDER BY hora ASC`, [paciente_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results || []);
    });
  },

  buscarPorId: (id, callback) => {
    db.query(`SELECT ${SEL} FROM tarefas WHERE tarefa_id = ?`, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  criar: (tarefa, callback) => {
    const sql = `
      INSERT INTO tarefas (titulo, detalhes, data, hora, dias_repeticao, concluida, grupo_repeticao, paciente_id, criado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      tarefa.titulo,
      tarefa.detalhes || null,
      tarefa.data,
      tarefa.hora || null,
      tarefa.dias_repeticao || "",
      tarefa.concluida !== undefined ? tarefa.concluida : 0,
      tarefa.grupo_repeticao || null,
      tarefa.paciente_id,
      tarefa.criado_por || null,
    ];
    db.query(sql, values, (err, results) => {
      if (err) return callback(err);
      callback(null, { tarefa_id: results.insertId, ...tarefa });
    });
  },

  atualizar: (id, tarefa, callback) => {
    const sql = `
      UPDATE tarefas
      SET titulo = ?, detalhes = ?, data = ?, hora = ?, dias_repeticao = ?, concluida = ?,
          hora_conclusao = ?
      WHERE tarefa_id = ?
    `;
    const values = [
      tarefa.titulo,
      tarefa.detalhes || null,
      tarefa.data,
      tarefa.hora || null,
      tarefa.dias_repeticao || "",
      tarefa.concluida ? 1 : 0,
      tarefa.concluida ? (tarefa.hora_conclusao || new Date().toISOString().slice(0, 19).replace("T", " ")) : null,
      id,
    ];
    db.query(sql, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  alternarConcluida: (id, concluida, callback) => {
    const horaConclusao = concluida
      ? new Date().toISOString().slice(0, 19).replace("T", " ")
      : null;
    db.query(
      "UPDATE tarefas SET concluida = ?, hora_conclusao = ? WHERE tarefa_id = ?",
      [concluida ? 1 : 0, horaConclusao, id],
      callback
    );
  },

  excluir: (id, callback) => {
    db.query("DELETE FROM tarefas WHERE tarefa_id = ?", [id], callback);
  },
};

export default Tarefa;
