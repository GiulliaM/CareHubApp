// back-end/src/controllers/tarefaController.ts
import { Request, Response } from 'express';
// @ts-ignore
import { Tarefa } from '../models/Tarefa';
// @ts-ignore
import { Paciente } from '../models/Paciente';

/**
 * (C) CONTROLLER: Cria uma nova tarefa/consulta.
 * POST /api/tarefas
 */
export const criarTarefa = async (req: Request, res: Response) => {
  const { pacienteId, titulo, tipo_recorrencia, horario_tarefa, repete_ate, fk_responsavel_id } = req.body;
  const usuarioId = (req as any).usuario?.id; // ID do usuário logado (criada por)

  if (!pacienteId || !titulo || !usuarioId) {
    return res.status(400).json({ message: "Dados essenciais (pacienteId, titulo) e usuário logado são obrigatórios." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso a este paciente
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, pacienteId);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado. O usuário não está associado a este paciente." });
    }

    // 2. Criar a tarefa no modelo
    // ⚠️ Você precisa implementar Tarefa.criar(dados) no seu modelo Tarefa.ts
    const novaTarefa = await Tarefa.criar({
      fk_paciente_id: pacienteId,
      fk_responsavel_id: fk_responsavel_id || usuarioId, // Pode ser atribuída a outro, mas o logado cria
      titulo,
      tipo_recorrencia: tipo_recorrencia || 'Única',
      horario_tarefa,
      repete_ate,
    });

    res.status(201).json({ 
      message: 'Tarefa registrada com sucesso.', 
      tarefa: novaTarefa 
    });

  } catch (error: any) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ message: 'Erro interno ao registrar tarefa.', error: error?.message });
  }
};

/**
 * (C) CONTROLLER: Busca todas as tarefas (ativas) de um paciente.
 * GET /api/tarefas/:pacienteId
 */
export const buscarTarefasPorPaciente = async (req: Request, res: Response) => {
  const { pacienteId } = req.params;
  const idNum = parseInt(pacienteId, 10);
  const usuarioId = (req as any).usuario?.id;

  if (isNaN(idNum) || !usuarioId) {
    return res.status(400).json({ message: "ID do paciente inválido ou usuário não autenticado." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, idNum);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 2. Buscar tarefas
    // ⚠️ Você precisa implementar Tarefa.buscarTodasPorPaciente(idNum) no seu modelo Tarefa.ts
    const tarefas = await Tarefa.buscarTodasPorPaciente(idNum);

    res.status(200).json(tarefas);

  } catch (error: any) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ message: 'Erro interno ao buscar tarefas.', error: error?.message });
  }
};