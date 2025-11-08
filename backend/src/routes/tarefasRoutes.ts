// back-end/src/routes/tarefasDataRoutes.ts (Novo arquivo)
import { Router } from 'express';
import { buscarTarefasPorData } from '../controllers/tarefasPorDataController';
import { middlewareAutenticacao } from './autenticacao'; // Assumindo o caminho correto

const router = Router();

// Rota customizada para buscar tarefas ativas em uma data específica
// GET /api/paciente/:pacienteId/tarefas/date/:dataISO
router.get('/:pacienteId/tarefas/date/:dataISO', middlewareAutenticacao, buscarTarefasPorData);

export default router;