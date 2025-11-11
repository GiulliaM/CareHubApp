import { criarMedicamento, listarMedicamentosPorUsuario, deletarMedicamento, atualizarMedicamento } from "../models/medicamentoModel.js";
export const postMedicamento = (req, res) => {
  const m = req.body;
  criarMedicamento(m, (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ medicamento_id: r.insertId });
  });
};
export const getMedicamentos = (req, res) => {
  listarMedicamentosPorUsuario(req.user.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const deleteMedicamento = (req, res) => {
  const id = req.params.id;
  deletarMedicamento(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Medicamento excluído" });
  });
};

export const patchMedicamento = (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  atualizarMedicamento(id, changes, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Medicamento atualizado' });
  });
};
