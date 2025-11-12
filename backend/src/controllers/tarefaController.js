import Tarefa from "../models/tarefaModel.js";

export const getTarefas = (req, res) => {
  const { paciente_id } = req.query;

  if (!paciente_id) {
    return res.status(400).json({ message: "ID do paciente é obrigatório" });
  }

  Tarefa.getAll(paciente_id, (err, results) => {
    if (err) {
      console.error("Erro ao buscar tarefas:", err);
      return res.status(500).json({ message: "Erro ao buscar tarefas" });
    }

    // ✅ Retorna sempre um array (mesmo vazio)
    res.json(Array.isArray(results) ? results : []);
  });
};

export const getTarefaById = (req, res) => {
  const { id } = req.params;

  Tarefa.getById(id, (err, result) => {
    if (err) {
      console.error("Erro ao buscar tarefa:", err);
      return res.status(500).json({ message: "Erro ao buscar tarefa" });
    }
    if (!result) return res.status(404).json({ message: "Tarefa não encontrada" });
    res.json(result);
  });
};

export const createTarefa = (req, res) => {
  const tarefa = req.body;

  if (!tarefa.titulo || !tarefa.paciente_id) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  Tarefa.create(tarefa, (err, result) => {
    if (err) {
      console.error("Erro ao criar tarefa:", err);
      return res.status(500).json({ message: "Erro ao criar tarefa" });
    }
    res.status(201).json(result);
  });
};

export const updateTarefa = (req, res) => {
  const { id } = req.params;
  const tarefa = req.body;

  Tarefa.update(id, tarefa, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ message: "Erro ao atualizar tarefa" });
    }
    res.json({ message: "Tarefa atualizada com sucesso" });
  });
};

export const deleteTarefa = (req, res) => {
  const { id } = req.params;

  Tarefa.delete(id, (err, result) => {
    if (err) {
      console.error("Erro ao deletar tarefa:", err);
      return res.status(500).json({ message: "Erro ao deletar tarefa" });
    }
    res.json({ message: "Tarefa removida com sucesso" });
  });
};
