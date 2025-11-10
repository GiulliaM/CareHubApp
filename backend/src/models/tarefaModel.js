import db from "../config/db.js";
export const criarTarefa = (tarefa, cb) => {
  const sql = "INSERT INTO tarefas (titulo, detalhes, data, hora, dias_repeticao, responsavel_id, paciente_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [tarefa.titulo, tarefa.detalhes || null, tarefa.data || null, tarefa.hora || null, tarefa.dias_repeticao || null, tarefa.responsavel_id || null, tarefa.paciente_id || null];
  db.query(sql, values, cb);
};
export const listarTarefasPorUsuario = (usuarioId, cb) => {
  db.query("SELECT t.* FROM tarefas t JOIN pacientes p ON t.paciente_id = p.paciente_id WHERE p.fk_usuario_id = ? ORDER BY t.created_at DESC", [usuarioId], cb);
};
export const deletarTarefa = (id, cb) => {
  db.query("DELETE FROM tarefas WHERE tarefa_id = ?", [id], cb);
};
