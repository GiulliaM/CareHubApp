import {
  criarPaciente as criarPacienteModel,
  listarPacientesPorUsuario,
  buscarPacientePorId as buscarPacientePorIdModel,
  atualizarPaciente,
  pacientePertenceAoUsuario,
} from "../models/pacienteModel.js";

export const atualizarPacienteRota = (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const usuarioId = req.user?.usuario_id;

  buscarPacientePorIdModel(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Paciente nao encontrado" });

    pacientePertenceAoUsuario(id, usuarioId, (err2, pode) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (!pode) return res.status(403).json({ message: "Acesso negado a este paciente" });

      atualizarPaciente(id, changes, (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ message: "Paciente atualizado" });
      });
    });
  });
};

export const criarPaciente = (req, res) => {
  const p = req.body;
  p.criado_por = req.user.usuario_id;

  criarPacienteModel(p, (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ paciente_id: r.insertId });
  });
};

export const buscarPacientes = (req, res) => {
  listarPacientesPorUsuario(req.user.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
};

export const buscarPacientePorId = (req, res) => {
  const id = req.params.id;
  const usuarioId = req.user?.usuario_id;

  buscarPacientePorIdModel(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Paciente nao encontrado" });

    const paciente = results[0];
    pacientePertenceAoUsuario(id, usuarioId, (err2, pode) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (!pode) return res.status(403).json({ message: "Acesso negado a este paciente" });
      res.json(paciente);
    });
  });
};
