// back-end/src/controllers/tarefaController.ts
import { Request, Response } from 'express';
import { Tarefa, ITarefaCreate, ITarefaUpdate } from '../models/Tarefa';

export const criarTarefa = async (req: Request, res: Response) => {
  try {
    const payload: ITarefaCreate = req.body;
    // Validação básica
    if (!payload.fk_paciente_id || !payload.titulo || !payload.repete_ate) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando (fk_paciente_id, titulo, repete_ate)' });
    }
    const id = await Tarefa.criar(payload);
    return res.status(201).json({ id });
  } catch (e: any) {
    console.error('Erro em criarTarefa:', e);
    return res.status(500).json({ message: e.message || 'Erro ao criar tarefa' });
  }
};

export const listarTarefasPorData = async (req: Request, res: Response) => {
  try {
    // Parâmetros obrigatórios para filtrar por usuário e dia
    const pacienteId = Number(req.params.pacienteId);
    const date = String(req.params.date); // Formato esperado: 'YYYY-MM-DD'
    
    if (isNaN(pacienteId) || !date) {
        return res.status(400).json({ message: 'ID do paciente ou data inválida.' });
    }
    
    const tarefas = await Tarefa.buscarPorData(pacienteId, date);
    return res.json(tarefas);
  } catch (e: any) {
    console.error('Erro em listarTarefasPorData:', e);
    return res.status(500).json({ message: e.message || 'Erro ao buscar tarefas por data' });
  }
};

export const marcarTarefaConcluida = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID da tarefa inválido.' });
    }
    const ok = await Tarefa.marcarConcluida(id);
    if (!ok) {
        // Pode ser 404 (não encontrada) ou 200 (já estava concluída)
        return res.status(404).json({ message: 'Tarefa não encontrada ou já concluída' });
    }
    return res.json({ success: true, message: 'Tarefa marcada como concluída.' });
  } catch (e: any) {
    console.error('Erro em marcarTarefaConcluida:', e);
    return res.status(500).json({ message: e.message || 'Erro ao marcar tarefa como concluída' });
  }
};

// Outros controladores de CRUD/Utilidades
export const buscarTarefa = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };
export const atualizarTarefa = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };
export const deletarTarefa = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };
export const listarTarefasPorPaciente = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };
export const proximoMedicamento = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };
export const proximaConsulta = async (req: Request, res: Response) => { /* ... */ return res.status(501).json({ message: 'Não implementado' }); };