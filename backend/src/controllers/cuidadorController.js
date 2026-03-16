import { buscarPorUsuarioId, salvarOuAtualizarPerfil, listarParaBusca } from "../models/cuidadorModel.js";

/**
 * GET /api/cuidador/perfil
 * Retorna o perfil do cuidador logado (apenas tipo cuidador).
 */
export const buscarMeuPerfil = (req, res) => {
  if (req.user.tipo !== "cuidador") {
    return res.status(403).json({ message: "Acesso restrito a cuidadores" });
  }
  const usuarioId = req.user.usuario_id;
  buscarPorUsuarioId(usuarioId, (err, perfil) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!perfil) {
      return res.status(200).json(null);
    }
    res.json(perfil);
  });
};

/**
 * POST /api/cuidador/perfil
 * Cria ou atualiza o perfil do cuidador logado (apenas tipo cuidador).
 * Body: bio, especialidades (array), preco_hora, cidade, bairro, foto_url, telefone, disponivel_busca (boolean).
 */
export const salvarMeuPerfil = (req, res) => {
  if (req.user.tipo !== "cuidador") {
    return res.status(403).json({ message: "Acesso restrito a cuidadores" });
  }
  const usuarioId = req.user.usuario_id;
  const data = req.body || {};
  salvarOuAtualizarPerfil(usuarioId, data, (err, perfil) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(perfil);
  });
};

/**
 * GET /api/cuidadores/busca
 * Lista cuidadores disponíveis para a busca (marketplace).
 * Query: especialidade, cidade, bairro (opcionais).
 * Acesso: apenas usuários do tipo "familiar".
 */
export const buscarCuidadoresRota = (req, res) => {
  if (req.user.tipo !== "familiar") {
    return res.status(403).json({ message: "Acesso restrito a familiares" });
  }
  const filtros = {
    especialidade: req.query.especialidade,
    cidade: req.query.cidade,
    bairro: req.query.bairro,
  };
  listarParaBusca(filtros, (err, list) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(list || []);
  });
};
