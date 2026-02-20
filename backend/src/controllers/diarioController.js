import {
  criarRegistro as criarRegistroModel,
  inserirItens,
  listarRegistrosPorUsuario,
  listarRegistrosPorPaciente,
  deletarRegistro,
} from "../models/diarioModel.js";
import { pacientePertenceAoUsuario } from "../models/pacienteModel.js";

export const criarRegistro = (req, res) => {
  const r = req.body;
  r.usuario_id = req.user.usuario_id;
  const itens = r.itens;
  delete r.itens;

  if (!r.paciente_id) {
    return res.status(400).json({ message: "paciente_id obrigatorio" });
  }

  pacientePertenceAoUsuario(r.paciente_id, r.usuario_id, (err, pertence) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!pertence) return res.status(403).json({ message: "Acesso negado a este paciente" });

    criarRegistroModel(r, (err2, rres) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const registroId = rres.insertId;
      if (itens && itens.length > 0) {
        inserirItens(registroId, itens, (err3) => {
          if (err3) console.error("Erro ao inserir itens do diario:", err3);
          res.status(201).json({ registro_id: registroId });
        });
      } else {
        res.status(201).json({ registro_id: registroId });
      }
    });
  });
};

export const buscarRegistros = (req, res) => {
  const { paciente_id } = req.query;

  if (paciente_id) {
    pacientePertenceAoUsuario(paciente_id, req.user.usuario_id, (err, pertence) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      listarRegistrosPorPaciente(paciente_id, (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(results || []);
      });
    });
  } else {
    listarRegistrosPorUsuario(req.user.usuario_id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results || []);
    });
  }
};

export const excluirRegistro = (req, res) => {
  const id = req.params.id;
  const usuarioId = req.user.usuario_id;

  deletarRegistro(id, usuarioId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro nao encontrado ou acesso negado" });
    }
    res.json({ message: "Registro excluido" });
  });
};
