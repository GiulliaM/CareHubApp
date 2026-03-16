import db from "../config/db.js";

/**
 * Busca perfil do cuidador pelo usuario_id (um para um).
 */
export const buscarPorUsuarioId = (usuarioId, cb) => {
  const sql = `
    SELECT p.*, u.nome
    FROM perfil_cuidadores p
    JOIN usuarios u ON u.usuario_id = p.usuario_id
    WHERE p.usuario_id = ?
  `;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return cb(err);
    const row = results && results[0];
    if (row && row.especialidades && typeof row.especialidades === "string") {
      try {
        row.especialidades = JSON.parse(row.especialidades);
      } catch {
        row.especialidades = [];
      }
    }
    cb(null, row || null);
  });
};

const COLUNAS_PERFIL = [
  "bio",
  "especialidades",
  "preco_hora",
  "cidade",
  "bairro",
  "foto_url",
  "telefone",
  "disponivel_busca",
];

/**
 * Cria ou atualiza perfil do cuidador (upsert).
 * Só permite colunas da whitelist.
 */
export const salvarOuAtualizarPerfil = (usuarioId, data, cb) => {
  const allowed = {};
  COLUNAS_PERFIL.forEach((col) => {
    if (data[col] !== undefined) allowed[col] = data[col];
  });
  if (Object.keys(allowed).length === 0) {
    return buscarPorUsuarioId(usuarioId, cb);
  }
  if (allowed.especialidades && Array.isArray(allowed.especialidades)) {
    allowed.especialidades = JSON.stringify(allowed.especialidades);
  }
  if (allowed.disponivel_busca !== undefined) {
    allowed.disponivel_busca = allowed.disponivel_busca ? 1 : 0;
  }

  buscarPorUsuarioId(usuarioId, (err, existing) => {
    if (err) return cb(err);
    const keys = Object.keys(allowed);
    const values = keys.map((k) => allowed[k]);

    if (existing) {
      const setClause = keys.map((k) => `${k} = ?`).join(", ");
      const sql = `UPDATE perfil_cuidadores SET ${setClause} WHERE usuario_id = ?`;
      db.query(sql, [...values, usuarioId], (err2, result) => {
        if (err2) return cb(err2);
        buscarPorUsuarioId(usuarioId, cb);
      });
    } else {
      const cols = ["usuario_id", ...keys];
      const placeholders = ["?", ...keys.map(() => "?")];
      const sql = `INSERT INTO perfil_cuidadores (${cols.join(", ")}) VALUES (${placeholders.join(", ")})`;
      db.query(sql, [usuarioId, ...values], (err2, result) => {
        if (err2) return cb(err2);
        buscarPorUsuarioId(usuarioId, cb);
      });
    }
  });
};

/**
 * Busca cuidadores para o marketplace (apenas disponíveis).
 * Filtros: especialidade (uma tag contida no JSON), cidade, bairro.
 */
export const listarParaBusca = (filtros, cb) => {
  let sql = `
    SELECT p.id, p.usuario_id, p.bio, p.especialidades, p.preco_hora, p.cidade, p.bairro, p.foto_url, p.telefone, u.nome
    FROM perfil_cuidadores p
    JOIN usuarios u ON u.usuario_id = p.usuario_id
    WHERE p.disponivel_busca = 1
  `;
  const params = [];

  if (filtros.especialidade && filtros.especialidade.trim()) {
    sql += " AND p.especialidades LIKE ?";
    params.push("%" + filtros.especialidade.trim() + "%");
  }
  if (filtros.cidade && filtros.cidade.trim()) {
    sql += " AND LOWER(TRIM(p.cidade)) = LOWER(TRIM(?))";
    params.push(filtros.cidade.trim());
  }
  if (filtros.bairro && filtros.bairro.trim()) {
    sql += " AND LOWER(TRIM(p.bairro)) LIKE LOWER(?)";
    params.push("%" + filtros.bairro.trim() + "%");
  }

  sql += " ORDER BY u.nome ASC";

  db.query(sql, params, (err, results) => {
    if (err) return cb(err);
    const list = (results || []).map((row) => {
      if (row.especialidades && typeof row.especialidades === "string") {
        try {
          row.especialidades = JSON.parse(row.especialidades);
        } catch {
          row.especialidades = [];
        }
      }
      return row;
    });
    cb(null, list);
  });
};
