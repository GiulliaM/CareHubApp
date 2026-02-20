import db from "../config/db.js";

export const criarRegistro = (r, cb) => {
  const sql = "INSERT INTO diario_registros (data, hora, paciente_id, usuario_id, comentario) VALUES (?, ?, ?, ?, ?)";
  const values = [r.data || null, r.hora || null, r.paciente_id || null, r.usuario_id || null, r.comentario || null];
  db.query(sql, values, cb);
};

export const inserirItens = (registroId, itens, cb) => {
  if (!itens || itens.length === 0) return cb(null);
  const values = itens.map((item) => [registroId, item.categoria, item.codigo, item.valor || null]);
  db.query(
    "INSERT INTO diario_itens (registro_id, categoria, codigo, valor) VALUES ?",
    [values],
    cb
  );
};

export const listarRegistrosPorPaciente = (pacienteId, cb) => {
  const sql = `
    SELECT d.*, u.nome as autor_nome
    FROM diario_registros d
    LEFT JOIN usuarios u ON u.usuario_id = d.usuario_id
    WHERE d.paciente_id = ?
    ORDER BY d.data DESC, d.hora DESC
  `;
  db.query(sql, [pacienteId], (err, registros) => {
    if (err) return cb(err);
    if (!registros || registros.length === 0) return cb(null, []);

    const ids = registros.map((r) => r.registro_id);
    db.query(
      "SELECT * FROM diario_itens WHERE registro_id IN (?)",
      [ids],
      (err2, itens) => {
        if (err2) return cb(err2);
        const itensMap = {};
        (itens || []).forEach((item) => {
          if (!itensMap[item.registro_id]) itensMap[item.registro_id] = [];
          itensMap[item.registro_id].push(item);
        });
        const result = registros.map((r) => ({
          ...r,
          itens: itensMap[r.registro_id] || [],
        }));
        cb(null, result);
      }
    );
  });
};

/**
 * Listar registros de todos os pacientes do usuario (via grupo_cuidado).
 */
export const listarRegistrosPorUsuario = (usuarioId, cb) => {
  const sql = `
    SELECT d.*, u.nome as autor_nome
    FROM diario_registros d
    LEFT JOIN usuarios u ON u.usuario_id = d.usuario_id
    JOIN grupo_cuidado gc ON gc.paciente_id = d.paciente_id
    WHERE gc.usuario_id = ? AND gc.status = 'Ativo'
    ORDER BY d.data DESC, d.hora DESC
  `;
  db.query(sql, [usuarioId], (err, registros) => {
    if (err) return cb(err);
    if (!registros || registros.length === 0) return cb(null, []);

    const ids = registros.map((r) => r.registro_id);
    db.query("SELECT * FROM diario_itens WHERE registro_id IN (?)", [ids], (err2, itens) => {
      if (err2) return cb(err2);
      const itensMap = {};
      (itens || []).forEach((item) => {
        if (!itensMap[item.registro_id]) itensMap[item.registro_id] = [];
        itensMap[item.registro_id].push(item);
      });
      const result = registros.map((r) => ({ ...r, itens: itensMap[r.registro_id] || [] }));
      cb(null, result);
    });
  });
};

export const deletarRegistro = (id, usuarioId, cb) => {
  db.query(
    "DELETE FROM diario_registros WHERE registro_id = ? AND usuario_id = ?",
    [id, usuarioId],
    cb
  );
};
