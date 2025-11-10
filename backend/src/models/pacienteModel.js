import db from "../config/db.js";
export const criarPaciente = (paciente, cb) => {
  const sql = "INSERT INTO pacientes (nome, idade, genero, observacoes, fk_usuario_id) VALUES (?, ?, ?, ?, ?)";
  const values = [paciente.nome, paciente.idade || null, paciente.genero || null, paciente.observacoes || null, paciente.fk_usuario_id || null];
  db.query(sql, values, cb);
};
export const listarPacientesPorUsuario = (usuarioId, cb) => {
  db.query("SELECT * FROM pacientes WHERE fk_usuario_id = ?", [usuarioId], cb);
};
export const buscarPacientePorId = (id, cb) => {
  db.query("SELECT * FROM pacientes WHERE paciente_id = ?", [id], cb);
};
