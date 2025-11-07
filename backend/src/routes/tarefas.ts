import { Router } from 'express';
import * as TarefaCtrl from '../controllers/tarefaController'

const router = Router();

// CRUD
router.post('/tarefas', TarefaCtrl.criarTarefa);
router.get('/tarefas/:id', TarefaCtrl.buscarTarefa);
router.put('/tarefas/:id', TarefaCtrl.atualizarTarefa);
router.delete('/tarefas/:id', TarefaCtrl.deletarTarefa);

// Paciente-scoped
router.get('/paciente/:pacienteId/tarefas', TarefaCtrl.listarTarefasPorPaciente);
router.get('/paciente/:pacienteId/tarefas/date/:date', TarefaCtrl.listarTarefasPorData);

// Ações utilitárias
router.post('/tarefas/:id/complete', TarefaCtrl.marcarTarefaConcluida);
router.get('/paciente/:pacienteId/next-medicamento', TarefaCtrl.proximoMedicamento);
router.get('/paciente/:pacienteId/next-consulta', TarefaCtrl.proximaConsulta);

export default router;