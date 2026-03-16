import {
  listarPacientesDoUsuario,
  listarMembrosDoGrupo,
  usuarioNoGrupo,
  adicionarMembro,
  removerMembro,
} from "../models/grupoCuidadoModel.js";

/**
 * GET /api/grupo/meus-pacientes
 * Lista pacientes vinculados ao usuario logado.
 */
export const getMeusPacientes = (req, res) => {
  listarPacientesDoUsuario(req.user.usuario_id, (err, list) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(list || []);
  });
};

/**
 * GET /api/grupo/membros/:paciente_id
 * Lista membros do grupo de cuidado de um paciente.
 */
export const getMembros = (req, res) => {
  const pacienteId = req.params.paciente_id;
  const usuarioId = req.user.usuario_id;

  usuarioNoGrupo(usuarioId, pacienteId, (err, pertence) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pertence) return res.status(403).json({ message: "Voce nao faz parte do grupo de cuidado deste paciente." });

    listarMembrosDoGrupo(pacienteId, (err2, membros) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(membros || []);
    });
  });
};

/**
 * POST /api/grupo/vincular
 * Body: { paciente_id, usuario_id_novo?, papel? }
 * Adiciona membro ao grupo. Apenas membros do grupo podem adicionar.
 */
export const postVincular = (req, res) => {
  const { paciente_id, usuario_id_novo, papel } = req.body;
  const solicitanteId = req.user.usuario_id;

  if (!paciente_id) return res.status(400).json({ message: "paciente_id obrigatorio" });

  const novoUsuarioId = usuario_id_novo || solicitanteId;

  usuarioNoGrupo(solicitanteId, paciente_id, (err, pertence) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pertence && novoUsuarioId !== solicitanteId) {
      return res.status(403).json({ message: "Apenas membros do grupo podem adicionar outros." });
    }

    adicionarMembro(novoUsuarioId, paciente_id, papel || req.user.tipo, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.error) return res.status(400).json({ message: result.error });
      res.status(201).json({ message: "Membro adicionado ao grupo de cuidado.", ...result });
    });
  });
};

/**
 * DELETE /api/grupo/desvincular
 * Body: { paciente_id, usuario_id_alvo? }
 */
export const deleteDesvincular = (req, res) => {
  const { paciente_id, usuario_id_alvo } = req.body;
  const solicitanteId = req.user.usuario_id;
  const alvoId = usuario_id_alvo || solicitanteId;

  if (!paciente_id) return res.status(400).json({ message: "paciente_id obrigatorio" });

  removerMembro(alvoId, paciente_id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Membro desvinculado do grupo de cuidado." });
  });
};
