import db from "../config/db.js";
import medicamentoModel from "../models/medicamentoModel.js";

// Listar medicamentos de um paciente
export const getMedicamentos = (req, res) => {
  const { paciente_id } = req.params;

  if (!paciente_id) {
    return res.status(400).json({ error: "ID do paciente não fornecido" });
  }

  const query = "SELECT * FROM medicamentos WHERE paciente_id = ?";

  db.query(query, [paciente_id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar medicamentos:", err);
      return res.status(500).json({ error: "Erro ao buscar medicamentos" });
    }

    // Processar e formatar campos do banco SEM new Date()
    const medicamentos = results.map((med) => {
      // Tratar datas como strings puras
      if (med.inicio) {
        med.inicio = med.inicio instanceof Date
          ? med.inicio.toISOString().substring(0, 10)
          : String(med.inicio).substring(0, 10);
      }

      if (med.data_fim) {
        med.data_fim = med.data_fim instanceof Date
          ? med.data_fim.toISOString().substring(0, 10)
          : String(med.data_fim).substring(0, 10);
      }

      // Converter horários (JSON → array)
      if (med.horarios) {
        try {
          med.horarios = JSON.parse(med.horarios);
        } catch {
          if (typeof med.horarios === "string") {
            med.horarios = med.horarios.split(",").map((h) => h.trim());
          } else {
            med.horarios = [];
          }
        }
      }

      return med;
    });

    res.status(200).json(medicamentos);
  });
};

// 🔹 Criar medicamento
export const createMedicamento = (req, res) => {
  medicamentoModel.criarMedicamento(req.body, (err, result) => {
    if (err) {
      console.error("Erro ao criar medicamento:", err);
      return res.status(500).json({ error: "Erro ao criar medicamento" });
    }

    res.status(201).json({
      message: "Medicamento cadastrado com sucesso!",
      medicamento_id: result.insertId ?? null,
    });
  });
};

// Atualizar medicamento (PATCH)
export const patchMedicamento = (req, res) => {
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
export const deleteMedicamento = (req, res) => {
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
