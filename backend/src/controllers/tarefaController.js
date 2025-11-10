import { criarTarefa, listarTarefasPorUsuario, deletarTarefa } from "../models/tarefaModel.js";
export const postTarefa = (req, res) => {
  const t = req.body;
  t.responsavel_id = req.user.usuario_id;
  criarTarefa(t, (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ tarefa_id: r.insertId });
  });
};
export const getTarefas = (req, res) => {
  listarTarefasPorUsuario(req.user.usuario_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
export const deleteTarefa = (req, res) => {
  const id = req.params.id;
  deletarTarefa(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tarefa excluída" });
  });
};
