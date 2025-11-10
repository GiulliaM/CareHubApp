import {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  deletarTarefa,
} from "../models/tarefaModel.js";
export const getTarefas = (req, res) => {
  listarTarefas((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const getTarefaById = (req, res) => {
  const id = req.params.id;
  buscarTarefaPorId(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(results[0]);
  });
};
export const postTarefa = (req, res) => {
  const novaTarefa = req.body;
  criarTarefa(novaTarefa, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tarefa criada com sucesso", tarefa_id: results.insertId });
  });
};
export const putTarefa = (req, res) => {
  const id = req.params.id;
  const tarefaAtualizada = req.body;
  atualizarTarefa(id, tarefaAtualizada, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tarefa atualizada com sucesso" });
  });
};
export const deleteTarefa = (req, res) => {
  const id = req.params.id;
  deletarTarefa(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tarefa excluída com sucesso" });
  });
};
