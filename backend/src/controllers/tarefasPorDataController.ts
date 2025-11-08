// back-end/src/controllers/tarefasPorDataController.ts (Novo arquivo)
import { Request, Response } from 'express';
// @ts-ignore
import { Paciente } from '../models/Paciente';
// @ts-ignore
import { Tarefa } from '../models/Tarefa'; 
import { AuthRequest } from '../authMiddleware';

/**
 * (C) CONTROLLER: Busca todas as tarefas (recorrentes e únicas) que são válidas para uma data específica.
 * GET /api/paciente/:pacienteId/tarefas/date/:dataISO
 */
export const buscarTarefasPorData = async (req: AuthRequest, res: Response) => {
  const { pacienteId, dataISO } = req.params;
  const idNum = parseInt(pacienteId, 10);
  const usuarioId = req.usuario.id;

  if (isNaN(idNum) || !usuarioId || !dataISO) {
    return res.status(400).json({ message: "Dados de requisição inválidos." });
  }

  try {
    // 1. (SEGURANÇA) Verificar se o usuário tem acesso
    const temAcesso = await Paciente.usuarioTemAcesso(usuarioId, idNum);
    if (!temAcesso) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    // 2. Buscar tarefas por data (incluindo a lógica de recorrência)
    // ⚠️ CHAMA O NOVO MÉTODO IMPLEMENTADO ABAIXO NO MODELO Tarefa.ts
    const tarefas = await Tarefa.buscarTarefasAtivasPorData(idNum, dataISO);

    res.status(200).json(tarefas);

  } catch (error: any) {
    console.error("Erro ao buscar tarefas por data:", error);
    res.status(500).json({ message: 'Erro ao buscar tarefas.', error: error?.message });
  }
};