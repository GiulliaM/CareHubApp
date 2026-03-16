import db from "../config/db.js";

function gerarCodigo6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Cria um convite de vínculo para o paciente (código 6 dígitos, válido 24h).
 * Invalida convites anteriores não usados do mesmo paciente.
 */
export const criarConvite = (pacienteId, usuarioId, cb) => {
  const codigo = gerarCodigo6();
  const expiraEm = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  db.query(
    "UPDATE convites_vinculo SET usado = 1 WHERE paciente_id = ? AND usado = 0",
    [pacienteId],
    (err) => {
      if (err) return cb(err);
      db.query(
        "INSERT INTO convites_vinculo (paciente_id, criado_por, codigo, expira_em) VALUES (?, ?, ?, ?)",
        [pacienteId, usuarioId, codigo, expiraEm],
        (err2, result) => {
          if (err2) return cb(err2);
          cb(null, { codigo, expira_em: expiraEm, id: result.insertId });
        }
      );
    }
  );
};

/**
 * Retorna o convite ativo (não usado, não expirado) do paciente, se existir.
 */
export const getConviteAtivoPorPaciente = (pacienteId, cb) => {
  const sql = `
    SELECT codigo, expira_em, created_at
    FROM convites_vinculo
    WHERE paciente_id = ? AND usado = 0 AND expira_em > NOW()
    ORDER BY created_at DESC LIMIT 1
  `;
  db.query(sql, [pacienteId], (err, results) => {
    if (err) return cb(err);
    cb(null, results && results[0] ? results[0] : null);
  });
};

/**
 * Aceita o convite: busca por código, valida (não usado, não expirado), cria vínculo, marca convite como usado.
 */
export const aceitarConvite = (codigo, cuidadorId, cb) => {
  const codigoLimpo = String(codigo).trim().replace(/\D/g, "").slice(0, 6);
  if (codigoLimpo.length !== 6) return cb(null, { error: "Código inválido" });

  const sql = `
    SELECT id, paciente_id FROM convites_vinculo
    WHERE codigo = ? AND usado = 0 AND expira_em > NOW()
    LIMIT 1
  `;
  db.query(sql, [codigoLimpo], (err, results) => {
    if (err) return cb(err);
    if (!results || results.length === 0) {
      return cb(null, { error: "Código inválido ou expirado" });
    }
    const convite = results[0];

    db.query(
      "INSERT INTO grupo_cuidado (usuario_id, paciente_id, papel, status) VALUES (?, ?, 'cuidador', 'Ativo') ON DUPLICATE KEY UPDATE status = 'Ativo', papel = 'cuidador'",
      [cuidadorId, convite.paciente_id],
      (err2) => {
        if (err2) return cb(err2);
        db.query("UPDATE convites_vinculo SET usado = 1 WHERE id = ?", [convite.id], (err3) => {
          if (err3) return cb(err3);
          cb(null, { paciente_id: convite.paciente_id });
        });
      }
    );
  });
};

/**
 * Lista pacientes vinculados ao cuidador (status Ativo).
 */
export const listarPacientesDoCuidador = (cuidadorId, cb) => {
  const sql = `
    SELECT p.paciente_id, p.nome, p.idade, p.genero, gc.data_vinculo
    FROM grupo_cuidado gc
    JOIN pacientes p ON p.paciente_id = gc.paciente_id
    WHERE gc.usuario_id = ? AND gc.status = 'Ativo'
    ORDER BY gc.data_vinculo DESC
  `;
  db.query(sql, [cuidadorId], (err, results) => {
    if (err) return cb(err);
    cb(null, results || []);
  });
};
