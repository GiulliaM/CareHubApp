import { criarConvite, getConviteAtivoPorPaciente, aceitarConvite as aceitarConviteModel, listarPacientesDoCuidador } from "../models/vinculoModel.js";
import { pacientePertenceAoUsuario, buscarPacientePorId } from "../models/pacienteModel.js";

/**
 * POST /api/vinculos/gerar-convite
 * Body: { paciente_id }
 * Acesso: apenas dono do paciente (familiar). Gera código 6 dígitos válido por 24h.
 */
export const gerarConvite = (req, res) => {
  const pacienteId = req.body?.paciente_id;
  const usuarioId = req.user.usuario_id;

  if (!pacienteId) return res.status(400).json({ message: "paciente_id é obrigatório" });

  pacientePertenceAoUsuario(pacienteId, usuarioId, (err, pode) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pode) return res.status(403).json({ message: "Acesso negado a este paciente" });

    criarConvite(pacienteId, usuarioId, (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(result);
    });
  });
};

/**
 * GET /api/vinculos/convite/:paciente_id
 * Retorna o convite ativo do paciente (código e expira_em), se existir.
 * Acesso: dono do paciente.
 */
export const buscarConvite = (req, res) => {
  const pacienteId = req.params.paciente_id;
  const usuarioId = req.user.usuario_id;

  pacientePertenceAoUsuario(pacienteId, usuarioId, (err, pode) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pode) return res.status(403).json({ message: "Acesso negado" });

    getConviteAtivoPorPaciente(pacienteId, (err2, convite) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(convite || {});
    });
  });
};

/**
 * POST /api/vinculos/aceitar
 * Body: { codigo }
 * Acesso: apenas tipo cuidador. Aceita o convite e cria vínculo.
 */
export const aceitarConvite = (req, res) => {
  const codigo = req.body?.codigo;
  const cuidadorId = req.user.usuario_id;

  if (!codigo) return res.status(400).json({ message: "Código é obrigatório" });

  aceitarConviteModel(codigo, cuidadorId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.error) return res.status(400).json({ message: result.error });

    buscarPacientePorId(result.paciente_id, (err2, rows) => {
      if (err2 || !rows?.length) return res.json({ message: "Vínculo criado", paciente_id: result.paciente_id });
      res.json({ message: "Vínculo criado com sucesso", paciente: rows[0] });
    });
  });
};

/**
 * GET /api/vinculos/meus-pacientes
 * Lista pacientes vinculados ao cuidador logado.
 * Acesso: apenas tipo cuidador.
 */
export const buscarMeusPacientes = (req, res) => {
  listarPacientesDoCuidador(req.user.usuario_id, (err, list) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(list || []);
  });
};
