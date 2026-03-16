import { usuarioPodeEditarPaciente, buscarPorPacienteId, salvarOuAtualizar } from "../models/historicoMedicoModel.js";

/**
 * GET /api/pacientes/:id/historico-medico
 * Retorna o histórico médico do paciente.
 * Acesso: dono do paciente (familiar) ou cuidador vinculado (status Ativo).
 * Inclui ultima_alteracao_nome e ultima_alteracao_em.
 */
export const buscarHistorico = (req, res) => {
  const pacienteId = req.params.id;
  const usuarioId = req.user.usuario_id;

  usuarioPodeEditarPaciente(pacienteId, usuarioId, (err, pode) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pode) return res.status(403).json({ message: "Você não tem permissão para acessar este paciente" });

    buscarPorPacienteId(pacienteId, (err2, historico) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(historico || {});
    });
  });
};

/**
 * PATCH /api/pacientes/:id/historico-medico
 * Cria ou atualiza o histórico médico. Registra quem alterou e quando.
 * Acesso: dono do paciente ou cuidador vinculado (Ativo).
 */
export const atualizarHistorico = (req, res) => {
  const pacienteId = req.params.id;
  const usuarioId = req.user.usuario_id;
  const data = req.body || {};

  usuarioPodeEditarPaciente(pacienteId, usuarioId, (err, pode) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pode) return res.status(403).json({ message: "Você não tem permissão para editar este paciente" });

    salvarOuAtualizar(pacienteId, usuarioId, data, (err2, historico) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(historico);
    });
  });
};
