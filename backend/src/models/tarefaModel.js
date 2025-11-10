import db from "../config/db.js";
export const criarTarefa = (tarefa, callback) => {
  const sql = `INSERT INTO tarefas (titulo, detalhes, data, hora, dias_repeticao, responsavel_id, paciente_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    tarefa.titulo || null,
    tarefa.detalhes || null,
    tarefa.data || null,
    tarefa.hora || null,
    tarefa.dias_repeticao || null,
    tarefa.responsavel_id || null,
    tarefa.paciente_id || null,
  ];
  db.query(sql, values, callback);
};
export const listarTarefas = (callback) => {
  db.query("SELECT * FROM tarefas ORDER BY created_at DESC", callback);
};
export const buscarTarefaPorId = (id, callback) => {
  db.query("SELECT * FROM tarefas WHERE tarefa_id = ?", [id], callback);
};
export const atualizarTarefa = (id, tarefa, callback) => {
  const sql = `UPDATE tarefas 
               SET titulo=?, detalhes=?, data=?, hora=?, dias_repeticao=?, responsavel_id=?, paciente_id=?
               WHERE tarefa_id=?`;
  const values = [
    tarefa.titulo || null,
    tarefa.detalhes || null,
    tarefa.data || null,
    tarefa.hora || null,
    tarefa.dias_repeticao || null,
    tarefa.responsavel_id || null,
    tarefa.paciente_id || null,
    id,
  ];
  db.query(sql, values, callback);
};
export const deletarTarefa = (id, callback) => {
  db.query("DELETE FROM tarefas WHERE tarefa_id = ?", [id], callback);
};
