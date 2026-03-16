import db from "../config/db.js";

/**
 * Verifica se o usuario pode editar o paciente via grupo_cuidado.
 */
export const usuarioPodeEditarPaciente = (pacienteId, usuarioId, cb) => {
  db.query(
    "SELECT 1 FROM grupo_cuidado WHERE paciente_id = ? AND usuario_id = ? AND status = 'Ativo'",
    [pacienteId, usuarioId],
    (err, results) => {
      if (err) return cb(err);
      cb(null, results && results.length > 0);
    }
  );
};

/**
 * Busca histórico médico do paciente com nome de quem fez a última alteração.
 */
export const buscarPorPacienteId = (pacienteId, cb) => {
  const sql = `
    SELECT h.*, u.nome AS ultima_alteracao_nome
    FROM historico_medico h
    LEFT JOIN usuarios u ON u.usuario_id = h.ultima_alteracao_por
    WHERE h.paciente_id = ?
  `;
  db.query(sql, [pacienteId], (err, results) => {
    if (err) return cb(err);
    let row = results && results[0];
    if (row && row.contatos_emergencia && typeof row.contatos_emergencia === "string") {
      try {
        row.contatos_emergencia = JSON.parse(row.contatos_emergencia);
      } catch {
        row.contatos_emergencia = [];
      }
    }
    cb(null, row || null);
  });
};

const COLUNAS = [
  "condicoes_cronicas",
  "alergias",
  "historico_cirurgico",
  "tipo_sanguineo",
  "plano_saude_nome",
  "plano_saude_numero",
  "contatos_emergencia",
  "medico_responsavel",
  "telefone_medico",
  "capacidade_funcional",
  "observacoes_gerais",
];

/**
 * Cria ou atualiza histórico médico. Atualiza ultima_alteracao_por e ultima_alteracao_em.
 */
export const salvarOuAtualizar = (pacienteId, usuarioId, data, cb) => {
  const allowed = {};
  COLUNAS.forEach((col) => {
    if (data[col] !== undefined) allowed[col] = data[col];
  });
  if (allowed.contatos_emergencia && Array.isArray(allowed.contatos_emergencia)) {
    allowed.contatos_emergencia = JSON.stringify(allowed.contatos_emergencia);
  }

  buscarPorPacienteId(pacienteId, (err, existing) => {
    if (err) return cb(err);
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    allowed.ultima_alteracao_por = usuarioId;
    allowed.ultima_alteracao_em = now;

    if (existing) {
      const keys = Object.keys(allowed);
      const setClause = keys.map((k) => `${k} = ?`).join(", ");
      const values = keys.map((k) => allowed[k]);
      values.push(pacienteId);
      const sql = `UPDATE historico_medico SET ${setClause} WHERE paciente_id = ?`;
      db.query(sql, values, (err2) => {
        if (err2) return cb(err2);
        buscarPorPacienteId(pacienteId, cb);
      });
    } else {
      const cols = ["paciente_id", ...Object.keys(allowed)];
      const placeholders = cols.map(() => "?").join(", ");
      const values = [pacienteId, ...Object.values(allowed)];
      const sql = `INSERT INTO historico_medico (${cols.join(", ")}) VALUES (${placeholders})`;
      db.query(sql, values, (err2) => {
        if (err2) return cb(err2);
        buscarPorPacienteId(pacienteId, cb);
      });
    }
  });
};
