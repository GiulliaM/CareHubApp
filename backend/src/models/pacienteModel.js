import db from "../config/db.js";

const COLUNAS_PERMITIDAS = [
  "nome", "idade", "genero", "observacoes", "data_nascimento",
  "informacoes_medicas", "foto_url", "nome_cuidador_ativo",
];

export const atualizarPaciente = (id, changes, cb) => {
  const allowed = Object.keys(changes).filter((k) => COLUNAS_PERMITIDAS.includes(k));
  if (allowed.length === 0) return cb(null, { affectedRows: 0 });
  const fields = allowed.map((k) => `${k} = ?`).join(", ");
  const values = allowed.map((k) => changes[k]);
  values.push(id);
  const sql = `UPDATE pacientes SET ${fields} WHERE paciente_id = ?`;
  db.query(sql, values, cb);
};

export const criarPaciente = (paciente, cb) => {
  const sql = "INSERT INTO pacientes (nome, idade, genero, observacoes, criado_por) VALUES (?, ?, ?, ?, ?)";
  const values = [
    paciente.nome,
    paciente.idade || null,
    paciente.genero || null,
    paciente.observacoes || null,
    paciente.criado_por || null,
  ];
  db.query(sql, values, (err, result) => {
    if (err) return cb(err);
    const pacienteId = result.insertId;

    if (!paciente.criado_por) return cb(null, result);

    db.query(
      "INSERT INTO grupo_cuidado (usuario_id, paciente_id, papel, status) VALUES (?, ?, 'dono', 'Ativo')",
      [paciente.criado_por, pacienteId],
      (err2) => {
        if (err2) return cb(err2);
        cb(null, result);
      }
    );
  });
};

/**
 * Lista pacientes via grupo_cuidado (substitui fk_usuario_id).
 */
export const listarPacientesPorUsuario = (usuarioId, cb) => {
  const sql = `
    SELECT p.*, gc.papel, gc.status as vinculo_status
    FROM pacientes p
    JOIN grupo_cuidado gc ON gc.paciente_id = p.paciente_id
    WHERE gc.usuario_id = ? AND gc.status = 'Ativo'
    ORDER BY gc.data_vinculo ASC
  `;
  db.query(sql, [usuarioId], cb);
};

export const buscarPacientePorId = (id, cb) => {
  db.query("SELECT * FROM pacientes WHERE paciente_id = ?", [id], cb);
};

export const buscarPerfilPorId = (id, cb) => {
  const sql = `SELECT paciente_id as id, nome as nome_paciente, data_nascimento, informacoes_medicas, foto_url, nome_cuidador_ativo FROM pacientes WHERE paciente_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

export const buscarPrimeiroPacientePorUsuario = (usuarioId, cb) => {
  const sql = `
    SELECT p.* FROM pacientes p
    JOIN grupo_cuidado gc ON gc.paciente_id = p.paciente_id
    WHERE gc.usuario_id = ? AND gc.status = 'Ativo'
    ORDER BY gc.data_vinculo ASC LIMIT 1
  `;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

/**
 * Verifica se o usuario faz parte do grupo de cuidado do paciente.
 * Substitui a checagem antiga por fk_usuario_id.
 */
export const pacientePertenceAoUsuario = (pacienteId, usuarioId, cb) => {
  db.query(
    "SELECT 1 FROM grupo_cuidado WHERE paciente_id = ? AND usuario_id = ? AND status = 'Ativo'",
    [pacienteId, usuarioId],
    (err, results) => {
      if (err) return cb(err);
      cb(null, results && results.length > 0);
    }
  );
};

export const atualizar = (id, changes, cb) => {
  atualizarPaciente(id, changes, cb);
};
