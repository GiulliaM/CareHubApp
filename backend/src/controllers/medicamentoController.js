import {
  criarMedicamento,
  listarMedicamentos,
  buscarMedicamentoPorId,
  atualizarMedicamento,
  deletarMedicamento,
} from "../models/medicamentoModel.js";
export const getMedicamentos = (req, res) => {
  listarMedicamentos((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const getMedicamentoById = (req, res) => {
  const id = req.params.id;
  buscarMedicamentoPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Medicamento não encontrado" });
    res.json(results[0]);
  });
};
export const postMedicamento = (req, res) => {
  const novo = req.body;
  criarMedicamento(novo, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Medicamento criado", medicamento_id: results.insertId });
  });
};
export const putMedicamento = (req, res) => {
  const id = req.params.id;
  const atual = req.body;
  atualizarMedicamento(id, atual, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Medicamento atualizado" });
  });
};
export const deleteMedicamento = (req, res) => {
  const id = req.params.id;
  deletarMedicamento(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Medicamento excluído" });
  });
};
