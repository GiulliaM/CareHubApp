import { atualizarPaciente } from "../models/pacienteModel.js";
export const patchPaciente = (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  atualizarPaciente(id, changes, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Paciente atualizado" });
  });
};
import { criarPaciente, listarPacientesPorUsuario, buscarPacientePorId } from "../models/pacienteModel.js";
export const postPaciente = (req, res) => {
  const p = req.body;
  p.fk_usuario_id = req.user.usuario_id;
  criarPaciente(p, (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ paciente_id: r.insertId });
  });
};
export const getPacientes = (req, res) => {
  listarPacientesPorUsuario(req.user.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const getPacienteById = (req, res) => {
  const id = req.params.id;
  buscarPacientePorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Paciente não encontrado" });
    res.json(results[0]);
  });
};
