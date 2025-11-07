import { Request, Response } from 'express';
import { Tarefa } from '../models/Tarefa';

export const criarTarefa = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const id = await Tarefa.criar(payload);
    return res.status(201).json({ id });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao criar tarefa' });
  }
};

export const buscarTarefa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const tarefa = await Tarefa.buscarPorId(id);
    if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });
    return res.json(tarefa);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao buscar tarefa' });
  }
};

export const listarTarefasPorPaciente = async (req: Request, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 50);
    const tarefas = await Tarefa.listarPorPaciente(pacienteId, page, pageSize);
    return res.json(tarefas);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao listar tarefas' });
  }
};

export const atualizarTarefa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ok = await Tarefa.atualizar(id, req.body);
    if (!ok) return res.status(404).json({ message: 'Tarefa não encontrada ou sem alterações' });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao atualizar tarefa' });
  }
};

export const deletarTarefa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ok = await Tarefa.deletar(id);
    if (!ok) return res.status(404).json({ message: 'Tarefa não encontrada' });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao deletar tarefa' });
  }
};

export const marcarTarefaConcluida = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ok = await Tarefa.marcarConcluida(id);
    if (!ok) return res.status(404).json({ message: 'Tarefa não encontrada' });
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao marcar tarefa' });
  }
};

export const listarTarefasPorData = async (req: Request, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const date = String(req.params.date); // espera 'YYYY-MM-DD'
    const tarefas = await Tarefa.buscarPorData(pacienteId, date);
    return res.json(tarefas);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao buscar tarefas por data' });
  }
};

export const proximoMedicamento = async (req: Request, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const tarefa = await Tarefa.buscarProximoMedicamento(pacienteId);
    return res.json(tarefa);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao buscar próximo medicamento' });
  }
};

export const proximaConsulta = async (req: Request, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const tarefa = await Tarefa.buscarProximaConsulta(pacienteId);
    return res.json(tarefa);
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Erro ao buscar próxima consulta' });
  }
};