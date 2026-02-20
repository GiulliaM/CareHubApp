import db from "../config/db.js";
import medicamentoModel from "../models/medicamentoModel.js";
import { pacientePertenceAoUsuario } from "../models/pacienteModel.js";

export const buscarMedicamentos = (req, res) => {
  const { paciente_id } = req.params;
  const usuarioId = req.user.usuario_id;

  if (!paciente_id) {
    return res.status(400).json({ error: "ID do paciente nao fornecido" });
  }

  pacientePertenceAoUsuario(paciente_id, usuarioId, (err, pertence) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar permissao" });
    if (!pertence) return res.status(403).json({ message: "Acesso negado a este paciente" });

    db.query("SELECT * FROM medicamentos WHERE paciente_id = ? ORDER BY horarios ASC", [paciente_id], (err2, results) => {
      if (err2) return res.status(500).json({ error: "Erro ao buscar medicamentos" });

      const medicamentos = (results || []).map((med) => {
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
        if (med.horarios) {
          try { med.horarios = JSON.parse(med.horarios); }
          catch { med.horarios = typeof med.horarios === "string" ? med.horarios.split(",").map(h => h.trim()) : []; }
        }
        return med;
      });

      res.status(200).json(medicamentos);
    });
  });
};

export const buscarMedicamentoPorId = (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.usuario_id;

  db.query("SELECT * FROM medicamentos WHERE medicamento_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar medicamento" });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });

    const med = rows[0];
    pacientePertenceAoUsuario(med.paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ error: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      if (med.horarios) {
        try { med.horarios = JSON.parse(med.horarios); }
        catch { med.horarios = typeof med.horarios === "string" ? med.horarios.split(",").map(h => h.trim()) : []; }
      }
      if (med.inicio) med.inicio = String(med.inicio).substring(0, 10);
      if (med.data_fim) med.data_fim = String(med.data_fim).substring(0, 10);

      res.json(med);
    });
  });
};

export const criarMedicamentoRota = (req, res) => {
  const pacienteId = req.body?.paciente_id;
  const usuarioId = req.user.usuario_id;
  if (!pacienteId) {
    return res.status(400).json({ error: "paciente_id e obrigatorio" });
  }
  pacientePertenceAoUsuario(pacienteId, usuarioId, (err, pertence) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar permissao" });
    if (!pertence) return res.status(403).json({ message: "Acesso negado a este paciente" });

    medicamentoModel.criarMedicamento(req.body, (err2, result) => {
      if (err2) {
        console.error("Erro ao criar medicamento:", err2);
        return res.status(500).json({ error: "Erro ao criar medicamento" });
      }
      res.status(201).json({
        message: "Medicamento cadastrado com sucesso!",
        medicamento_id: result.insertId ?? null,
      });
    });
  });
};

export const atualizarMedicamentoRota = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  const usuarioId = req.user.usuario_id;
  const { atualizar_grupo } = req.query;

  db.query("SELECT * FROM medicamentos WHERE medicamento_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar medicamento" });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });

    pacientePertenceAoUsuario(rows[0].paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ error: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      if (atualizar_grupo === "true" && rows[0].grupo_repeticao) {
        medicamentoModel.atualizarGrupo(rows[0].grupo_repeticao, parseInt(id), dados, (err3, result) => {
          if (err3) return res.status(500).json({ error: "Erro ao atualizar grupo" });
          res.json({ message: `${result.affectedRows} medicamentos atualizados.` });
        });
      } else {
        medicamentoModel.atualizarMedicamento(id, dados, (err3, result) => {
          if (err3) return res.status(500).json({ error: "Erro ao atualizar medicamento" });
          if (result.affectedRows === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });
          res.json({ message: "Medicamento atualizado com sucesso!" });
        });
      }
    });
  });
};

export const alternarMedicamentoConcluido = (req, res) => {
  const { id } = req.params;
  const { concluido } = req.body;
  const usuarioId = req.user.usuario_id;

  db.query("SELECT paciente_id FROM medicamentos WHERE medicamento_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar medicamento" });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });

    pacientePertenceAoUsuario(rows[0].paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ error: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      medicamentoModel.alternarMedicamento(id, concluido, (err3) => {
        if (err3) return res.status(500).json({ error: "Erro ao atualizar medicamento" });
        res.json({ message: concluido ? "Medicamento marcado como tomado" : "Medicamento desmarcado" });
      });
    });
  });
};

export const excluirMedicamento = (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.usuario_id;

  db.query("SELECT paciente_id FROM medicamentos WHERE medicamento_id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir medicamento" });
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });

    pacientePertenceAoUsuario(rows[0].paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ error: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      db.query("DELETE FROM medicamentos WHERE medicamento_id = ?", [id], (err3, result) => {
        if (err3) return res.status(500).json({ error: "Erro ao excluir medicamento" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Medicamento nao encontrado" });
        res.json({ message: "Medicamento excluido com sucesso!" });
      });
    });
  });
};
