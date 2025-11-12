const db = require("../config/db");
const medicamentoModel = require("../models/medicamentoModel");

// Listar medicamentos
exports.getMedicamentos = (req, res) => {
  const { paciente_id } = req.query;
  const query = paciente_id
    ? "SELECT * FROM medicamentos WHERE paciente_id = ?"
    : "SELECT * FROM medicamentos";

  db.query(query, paciente_id ? [paciente_id] : [], (err, results) => {
    if (err) {
      console.error("Erro ao buscar medicamentos:", err);
      return res.status(500).json({ error: "Erro ao buscar medicamentos" });
    }
    res.status(200).json(results);
  });
};

// Criar medicamento
exports.createMedicamento = (req, res) => {
  medicamentoModel.criarMedicamento(req.body, (err, result) => {
    if (err) {
      console.error("Erro ao criar medicamento:", err);
      return res.status(500).json({ error: "Erro ao criar medicamento" });
    }
    res.status(201).json({ message: "Medicamento cadastrado com sucesso!" });
  });
};

// Atualizar medicamento (PATCH)
exports.patchMedicamento = (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  medicamentoModel.atualizarMedicamento(id, dados, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar medicamento:", err);
      return res.status(500).json({ error: "Erro ao atualizar medicamento" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }
    res.status(200).json({ message: "Medicamento atualizado com sucesso!" });
  });
};

// Excluir medicamento
exports.deleteMedicamento = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM medicamentos WHERE medicamento_id = ?", [id], (err, result) => {
    if (err) {
      console.error("Erro ao excluir medicamento:", err);
      return res.status(500).json({ error: "Erro ao excluir medicamento" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Medicamento não encontrado" });
    }

    res.status(200).json({ message: "Medicamento excluído com sucesso!" });
  });
};
