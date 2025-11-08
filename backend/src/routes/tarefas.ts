// back-end/src/routes/tarefas.ts
import { Router } from 'express';
import * as TarefaCtrl from '../controllers/tarefaController'

const router = Router();

// CRUD e Ações
router.post('/tarefas', TarefaCtrl.criarTarefa); // POST /api/tarefas (Criação)
router.post('/tarefas/:id/complete', TarefaCtrl.marcarTarefaConcluida); // POST /api/tarefas/:id/complete

// Listagem de tarefas para um paciente em uma data específica
// GET /api/paciente/1/tarefas/date/2025-12-25
router.get('/paciente/:pacienteId/tarefas/date/:date', TarefaCtrl.listarTarefasPorData);

// Rotas de CRUD/Utilidades não implementadas no controller para brevidade
router.get('/tarefas/:id', TarefaCtrl.buscarTarefa);
router.put('/tarefas/:id', TarefaCtrl.atualizarTarefa);
router.delete('/tarefas/:id', TarefaCtrl.deletarTarefa);
router.get('/paciente/:pacienteId/tarefas', TarefaCtrl.listarTarefasPorPaciente);
router.get('/paciente/:pacienteId/next-medicamento', TarefaCtrl.proximoMedicamento);
router.get('/paciente/:pacienteId/next-consulta', TarefaCtrl.proximaConsulta);

export default router;