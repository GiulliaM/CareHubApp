// back-end/src/routes/medicamentoRoutes.ts
import { Router } from 'express';
import { criarMedicamento, buscarMedicamentosPorPaciente } from '../controllers/medicamentoController';
import { middlewareAutenticacao } from './autenticacao'; // Assumindo o caminho correto

const router = Router();

// Rota protegida para criar um novo medicamento
// POST /api/medicamentos
router.post('/', middlewareAutenticacao, criarMedicamento);

// Rota protegida para buscar todos os medicamentos de um paciente
// GET /api/medicamentos/:pacienteId
router.get('/:pacienteId', middlewareAutenticacao, buscarMedicamentosPorPaciente);

export default router;