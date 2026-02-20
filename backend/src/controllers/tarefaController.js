import Tarefa from "../models/tarefaModel.js";
import { pacientePertenceAoUsuario } from "../models/pacienteModel.js";
import {
  listarResponsaveisTarefa,
  setResponsaveisTarefa,
} from "../models/grupoCuidadoModel.js";

export const buscarTarefas = (req, res) => {
  const { paciente_id } = req.query;
  const usuarioId = req.user?.usuario_id;

  if (!paciente_id) {
    return res.status(400).json({ message: "ID do paciente e obrigatorio" });
  }

  pacientePertenceAoUsuario(paciente_id, usuarioId, (err, pertence) => {
    if (err) return res.status(500).json({ message: "Erro ao verificar permissao" });
    if (!pertence) return res.status(403).json({ message: "Acesso negado a este paciente" });

    Tarefa.buscarTodos(paciente_id, (err2, results) => {
      if (err2) return res.status(500).json({ message: "Erro ao buscar tarefas" });
      res.json(Array.isArray(results) ? results : []);
    });
  });
};

export const buscarTarefaPorId = (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user?.usuario_id;

  Tarefa.buscarPorId(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar tarefa" });
    if (!result) return res.status(404).json({ message: "Tarefa nao encontrada" });

    pacientePertenceAoUsuario(result.paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ message: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      listarResponsaveisTarefa(id, (err3, responsaveis) => {
        if (err3) return res.status(500).json({ message: "Erro ao listar responsaveis" });
        res.json({ ...result, responsaveis: responsaveis || [] });
      });
    });
  });
};

export const criarTarefa = (req, res) => {
  const tarefa = req.body;
  const usuarioId = req.user?.usuario_id;
  const responsavelIds = tarefa.responsavel_ids;

  if (!tarefa.titulo || !tarefa.paciente_id) {
    return res.status(400).json({ message: "Campos obrigatorios ausentes" });
  }

  tarefa.criado_por = usuarioId;

  pacientePertenceAoUsuario(tarefa.paciente_id, usuarioId, (err, pertence) => {
    if (err) return res.status(500).json({ message: "Erro ao verificar permissao" });
    if (!pertence) return res.status(403).json({ message: "Acesso negado a este paciente" });

    Tarefa.criar(tarefa, (err2, result) => {
      if (err2) return res.status(500).json({ message: "Erro ao criar tarefa" });

      const ids = responsavelIds && responsavelIds.length > 0
        ? responsavelIds
        : [usuarioId];

      setResponsaveisTarefa(result.tarefa_id, ids, (err3) => {
        if (err3) console.error("Erro ao setar responsaveis:", err3);
        res.status(201).json(result);
      });
    });
  });
};

export const atualizarTarefa = (req, res) => {
  const { id } = req.params;
  const tarefa = req.body;
  const usuarioId = req.user?.usuario_id;
  const responsavelIds = tarefa.responsavel_ids;

  Tarefa.buscarPorId(id, (err, existing) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar tarefa" });
    if (!existing) return res.status(404).json({ message: "Tarefa nao encontrada" });

    pacientePertenceAoUsuario(existing.paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ message: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      Tarefa.atualizar(id, { ...existing, ...tarefa }, (err3) => {
        if (err3) return res.status(500).json({ message: "Erro ao atualizar tarefa" });

        if (responsavelIds) {
          setResponsaveisTarefa(id, responsavelIds, () => {});
        }

        res.json({ message: "Tarefa atualizada com sucesso" });
      });
    });
  });
};

export const alternarTarefa = (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body;
  const usuarioId = req.user?.usuario_id;

  Tarefa.buscarPorId(id, (err, existing) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar tarefa" });
    if (!existing) return res.status(404).json({ message: "Tarefa nao encontrada" });

    pacientePertenceAoUsuario(existing.paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ message: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      Tarefa.alternarConcluida(id, concluida, (err3) => {
        if (err3) return res.status(500).json({ message: "Erro ao atualizar tarefa" });
        res.json({ message: concluida ? "Tarefa concluida" : "Tarefa reaberta" });
      });
    });
  });
};

export const excluirTarefa = (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user?.usuario_id;

  Tarefa.buscarPorId(id, (err, existing) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar tarefa" });
    if (!existing) return res.status(404).json({ message: "Tarefa nao encontrada" });

    pacientePertenceAoUsuario(existing.paciente_id, usuarioId, (err2, pertence) => {
      if (err2) return res.status(500).json({ message: "Erro ao verificar permissao" });
      if (!pertence) return res.status(403).json({ message: "Acesso negado" });

      Tarefa.excluir(id, (err3) => {
        if (err3) return res.status(500).json({ message: "Erro ao deletar tarefa" });
        res.json({ message: "Tarefa removida com sucesso" });
      });
    });
  });
};
