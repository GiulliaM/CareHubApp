
import db from "../config/db.js";

export const atualizarPaciente = (id, changes, cb) => {
  const fields = Object.keys(changes).map(k => `${k} = ?`).join(', ');
  const values = Object.keys(changes).map(k => changes[k]);
  values.push(id);
  const sql = `UPDATE pacientes SET ${fields} WHERE paciente_id = ?`;
  db.query(sql, values, cb);
};

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

// Métodos extras conforme manual
export const buscarPerfilPorId = (id, cb) => {
  const sql = `SELECT paciente_id as id, nome as nome_paciente, data_nascimento, informacoes_medicas, foto_url, nome_cuidador_ativo FROM pacientes WHERE paciente_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

export const buscarPrimeiroPacientePorUsuario = (usuarioId, cb) => {
  const sql = `SELECT * FROM pacientes WHERE fk_usuario_id = ? LIMIT 1`;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

export const atualizar = (id, changes, cb) => {
  atualizarPaciente(id, changes, cb);
};
